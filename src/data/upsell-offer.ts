import { CATALOG } from "@/data/catalog";
import { FRONT_GAMES } from "@/data/front-offer";

/**
 * What the upsell actually adds: everything in the library that the front offer
 * does not already include.
 *
 * Derived from the catalog rather than hardcoded, so the count on the page can
 * never drift from what is really being sold.
 */
const FRONT_NAMES = new Set(FRONT_GAMES.map((game) => game.name));

export const UPSELL_GAMES = CATALOG.filter((game) => !FRONT_NAMES.has(game.name));

export const UPSELL_GAMES_COUNT = UPSELL_GAMES.length;

export const TOTAL_LIBRARY_COUNT = CATALOG.length;

/**
 * Covers shown as a wall of proof. Picked by name so the grid is made of titles
 * people recognise, and filtered by having real art so no placeholder tiles land
 * on the page that is asking for more money.
 */
const HIGHLIGHT_NAMES = [
  "Cyberpunk 2077",
  "Dark Souls 3",
  "Far Cry 5",
  "Fallout 4",
  "Batman: Arkham Knight",
  "Assassin's Creed 4: Black Flag",
  "Need for Speed: Heat",
  "Dying Light",
  "ARK: Survival Evolved",
  "Subnautica",
  "Project Zomboid",
  "Left 4 Dead 2",
  "Portal 2",
  "Stardew Valley",
  "Hollow Knight",
  "Terraria",
  "Euro Truck Simulator 2",
  "Cuphead",
  "Dead Cells",
  "Phasmophobia",
];

export const UPSELL_HIGHLIGHTS = HIGHLIGHT_NAMES.map((name) =>
  UPSELL_GAMES.find((game) => game.name === name),
).filter((game): game is NonNullable<typeof game> => !!game?.img);
