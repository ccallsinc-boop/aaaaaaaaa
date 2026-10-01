import fifa14 from "@/assets/games/fifa14.webp";
import fifa16 from "@/assets/games/fifa16.webp";
import fifa17 from "@/assets/games/fifa17.webp";
import fifa18 from "@/assets/games/fifa18.webp";
import fifa19 from "@/assets/games/fifa19.webp";
import fifa20 from "@/assets/games/fifa20.webp";
import fifa21 from "@/assets/games/fifa21.webp";
import gow from "@/assets/games/gow.webp";
import deadpool from "@/assets/games/deadpool.webp";
import residentEvilBanner from "@/assets/banners/resident-evil.png";
import redDeadBanner from "@/assets/banners/red-dead.png";
import assassinsCreedBanner from "@/assets/banners/assassins-creed.jpg";
import { CATALOG } from "@/data/catalog";

export type Game = {
  name: string;
  cover: string;
  tag: string;
  price: number;
};

export const GAMES: Game[] = [
  { name: "FIFA 14", cover: fifa14, tag: "Futebol", price: 20 },
  { name: "FIFA 16", cover: fifa16, tag: "Futebol", price: 20 },
  { name: "FIFA 17", cover: fifa17, tag: "Futebol", price: 20 },
  { name: "FIFA 18", cover: fifa18, tag: "Futebol", price: 20 },
  { name: "FIFA 19", cover: fifa19, tag: "Futebol", price: 20 },
  { name: "FIFA 20", cover: fifa20, tag: "Futebol", price: 20 },
  { name: "FIFA 21", cover: fifa21, tag: "Futebol", price: 20 },
  { name: "God of War Ragnarök", cover: gow, tag: "Ação / Aventura", price: 20 },
  { name: "Deadpool Game", cover: deadpool, tag: "Ação / Beat'em up", price: 20 },
];

export type Saga = {
  name: string;
  banner: string;
  tag: string;
  titles: string[];
  price: number;
};

export const SAGAS: Saga[] = [
  {
    name: "Saga Resident Evil",
    banner: residentEvilBanner,
    tag: "Survival Horror",
    titles: [
      "Resident Evil",
      "Resident Evil 2",
      "Resident Evil 3",
      "Resident Evil 4",
      "Resident Evil 5",
      "Resident Evil 6",
      "Resident Evil 7",
      "Resident Evil Village",
    ],
    price: 20,
  },
  {
    name: "Saga Assassin's Creed",
    banner: assassinsCreedBanner,
    tag: "Ação / Stealth histórico",
    titles: [
      "Assassin's Creed",
      "Assassin's Creed II",
      "Brotherhood",
      "Revelations",
      "Assassin's Creed III",
      "Black Flag",
      "Rogue",
      "Unity",
      "Syndicate",
      "Origins",
      "Odyssey",
      "Valhalla",
      "Mirage",
    ],
    price: 20,
  },
  {
    name: "Saga Red Dead Redemption",
    banner: redDeadBanner,
    tag: "Ação / Faroeste",
    titles: ["Red Dead Redemption", "Red Dead Redemption 2"],
    price: 20,
  },
];

export const SAGA_TITLES = SAGAS.flatMap((s) => s.titles);
export const TOTAL_GAMES = CATALOG.length;

// Price, anchor, discount, checkout URL and currency formatting moved to
// src/lib/markets.ts and src/lib/checkout.ts, so there is one BRL base price
// converted per market instead of four hardcoded numbers that disagreed.
