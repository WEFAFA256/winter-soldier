export interface Companion {
  name: string;
  title: string;
  specialty: string;
  availability: "available" | "in-session";
  image: string;
  description: string;
}

/* Fallback cards used only when the content store has no `escorts` key.
   Admin edits are persisted to Cloudinary raw site-content.json and read by
   /escorts at runtime; these defaults are never the durable source. */
export const DEFAULT_COMPANIONS: Companion[] = [
  {
    name: "Sophia",
    title: "Elite Companion",
    specialty: "Fine Dining & Corporate Events",
    availability: "available",
    image: "https://res.cloudinary.com/njzctr4m/image/upload/v1784667206/serenity_gallery/u7wll8tto5yxjt4ptcbl.jpg",
    description: "Sophisticated, articulate, and effortlessly elegant — Sophia brings grace and warmth to any occasion.",
  },
  {
    name: "Valentina",
    title: "Premium Companion",
    specialty: "Social Events & Private Dinners",
    availability: "in-session",
    image: "https://res.cloudinary.com/njzctr4m/image/upload/v1784667142/serenity_gallery/afxgagluqzhsoe03mqk9.jpg",
    description: "Charming and refined, Valentina adapts seamlessly to any social setting with poise and intelligence.",
  },
  {
    name: "Isabelle",
    title: "Luxury Companion",
    specialty: "Travel & Leisure Companionship",
    availability: "available",
    image: "https://res.cloudinary.com/njzctr4m/image/upload/v1784667087/serenity_gallery/cnl0pcncguetzsg6ms5v.jpg",
    description: "Adventurous yet refined, Isabelle is the perfect travel companion for unforgettable journeys.",
  },
  {
    name: "Aurora",
    title: "Elite Companion",
    specialty: "VIP Experiences & Gala Events",
    availability: "available",
    image: "https://res.cloudinary.com/njzctr4m/image/upload/v1784667018/serenity_gallery/kxvbybo5fbghkfomnavv.jpg",
    description: "Aurora brings an air of mystique and allure to every encounter — magnetic, cultured, and unforgettable.",
  },
];
