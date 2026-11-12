export interface Specialist {
  id: string;
  hash: string;
  name: string;
  slug: string;
  designation: string;
  rating: number;
  reviewCount: number;
  image: string;
  badge: string;
  bio: string;
  isTargetItem?: boolean;
}

export const specialistsData: Specialist[] = [
  {
    id: "item1",
    hash: "item1",
    name: "Eleanor Vance",
    slug: "eleanor-vance",
    designation: "Senior Aromatherapist",
    rating: 4.9,
    reviewCount: 94,
    image: "/assets/images/team/team-1-1.jpg",
    badge: "FEATURED",
    bio: "Pioneering botanical micro-infusions and deep sensory aromatics to relieve stress and awaken vitality.",
  },
  {
    id: "item2",
    hash: "item2",
    name: "Mike Hardson",
    slug: "mike-hardson",
    designation: "Lead Hydro-Therapist",
    rating: 5.0,
    reviewCount: 142,
    image: "/assets/images/team/team-1-2.jpg",
    badge: "FEATURED",
    bio: "Certified European master practitioner in thermal spring rituals, targeted hydro-jet therapy, and sports recovery.",
    isTargetItem: true,
  },
  {
    id: "item3",
    hash: "item3",
    name: "Jessica Rose",
    slug: "jessica-rose",
    designation: "Holistic Aesthetician",
    rating: 4.95,
    reviewCount: 118,
    image: "/assets/images/team/team-1-3.jpg",
    badge: "FEATURED",
    bio: "Specializing in organic enzymatic peels, botanical facial sculpting, and cellular lymph drainage.",
  },
  {
    id: "item4",
    hash: "item4",
    name: "David Miller",
    slug: "david-miller",
    designation: "Thermal & Stone Specialist",
    rating: 4.9,
    reviewCount: 86,
    image: "/assets/images/team/team-1-4.jpg",
    badge: "FEATURED",
    bio: "Harnessing basalt lava stones and Himalayan salt compression to relieve deep myofascial tension.",
  },
];
