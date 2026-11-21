export interface PricedService {
  title: string;
  price: number | string;
  [key: string]: any;
}

export const VIP_MIN_PRICE = 300000;

export function parseServicePrice(price: unknown): number {
  if (typeof price === "number") return Number.isFinite(price) ? price : NaN;
  const match = String(price ?? "").match(/\d[\d,]*/);
  if (!match) return NaN;
  return Number(match[0].replace(/,/g, ""));
}

export function formatServicePrice(price: number | string): string {
  const num = parseServicePrice(price);
  if (!Number.isNaN(num) && num > 0) return `UGX ${num.toLocaleString()}`;
  return `UGX ${price}`;
}

function compactKey(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s/g, "");
}

/* Keys are intentionally tolerant of the naming variants already present in
   the live Cloudinary catalogue (4hands / 4-hands, B2B | Nuru, body-to-body…). */
const SERVICE_PRIORITY = new Map<string, number>([
  ["swedishmassage", 0],
  ["deeptissuemassage", 1],
  ["deeptissue", 1],
  ["aromatherapy", 2],
  ["bodyscrubs", 3],
  ["bodyscrub", 3],
  ["sportsmassage", 4],
  ["signaturemassage", 5],
  ["eroticmassage", 6],
  ["eroticandbodytobody", 6],
  ["eroticbodytobody", 6],
  ["bodycarepackage", 7],
  ["b2bnurumassage", 8],
  ["b2bnuru", 8],
  ["nurub2b", 8],
  ["hotstonemassage", 9],
  ["couplesmassage", 10],
]);

const VIP_PRIORITY = new Map<string, number>();
[
  "fullservicepack",
  "4handsessentialoils",
  "fourhandsessentialoils",
  "6handsswedish",
  "sixhandsswedish",
  "tantramassage",
  "kamasutrasession",
  "4handsnurub2b",
  "fourhandsnurub2b",
  "6handserotic",
  "sixhandserotic",
  "4handsfullservice",
  "fourhandsfullservice",
  "4handstantrayoni",
  "fourhandstantrayoni",
].forEach((key, i) => {
  VIP_PRIORITY.set(key, [
    0, 1, 1, 2, 2, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8,
  ][i]);
});

type Ranked<T> = { item: T; priority?: number; price: number; index: number };

function rank<T extends PricedService>(item: T, index: number, priorityMap: Map<string, number>): Ranked<T> {
  return {
    item,
    priority: priorityMap.get(compactKey(item.title)),
    price: parseServicePrice(item.price),
    index,
  };
}

/**
 * Keeps the user's named sequence intact, then merges every other catalogue
 * item at the first position where the price no longer increases. Unlisted
 * cards are sorted by price before insertion, so the price bands stay tidy
 * without hiding any admin-created service.
 */
export function orderServices<T extends PricedService>(
  items: T[],
  mode: "services" | "vip"
): T[] {
  const map = mode === "services" ? SERVICE_PRIORITY : VIP_PRIORITY;
  const ranked = items.map((item, index) => rank(item, index, map));
  const named = ranked.filter((entry) => entry.priority !== undefined);
  const extras = ranked.filter((entry) => entry.priority === undefined);

  named.sort(
    (a, b) =>
      (a.priority ?? 0) - (b.priority ?? 0) ||
      a.price - b.price ||
      a.index - b.index
  );
  extras.sort(
    (a, b) =>
      a.price - b.price ||
      a.item.title.localeCompare(b.item.title) ||
      a.index - b.index
  );

  const result = [...named];
  for (const extra of extras) {
    const insertAt = result.findIndex((entry) => entry.price > extra.price);
    if (insertAt === -1) result.push(extra);
    else result.splice(insertAt, 0, extra);
  }
  return result.map((entry) => entry.item);
}

export function isRealServiceTitle(title: unknown): boolean {
  const key = compactKey(String(title || ""));
  return key.length > 0 && key !== "newspatreatment";
}

/**
 * The live catalogue predates the split arrays. When `vipServices` is absent,
 * derive the two pages from the old single `services` array using the 300k
 * band. Once an admin saves, both arrays are separate and price edits no
 * longer move cards between pages.
 */
export function splitServiceCatalog(data: any): {
  services: any[];
  vipServices: any[];
} {
  const all = Array.isArray(data?.services) ? data.services : [];
  if (Array.isArray(data?.vipServices)) {
    return { services: all, vipServices: data.vipServices };
  }
  return {
    services: all.filter((item: PricedService) => parseServicePrice(item?.price) < VIP_MIN_PRICE),
    vipServices: all.filter((item: PricedService) => parseServicePrice(item?.price) >= VIP_MIN_PRICE),
  };
}

export async function fetchSiteContent(): Promise<any | null> {
  const res = await fetch(`/api/content?cb=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}
