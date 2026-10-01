import { CATALOG } from "@/data/catalog";

/**
 * The front offer.
 *
 * The landing used to sell "424 games" and prove it with a searchable grid of the
 * whole catalog. That grid worked against the offer: it sorted A-Z, so the first
 * screen opened with Angry Birds, Bad Piggies and ALTF4 while GTA and Elden Ring
 * sat pages below, and 195 of the 424 entries had no cover and rendered as plain
 * text tiles. Two entries even carried release version numbers in their names.
 *
 * The front now sells these twelve titles only. Everything else moved to the
 * checkout as order bumps and upsells.
 *
 * Counter Strike 2 is deliberately absent: it is free-to-play, and a free game
 * listed as a paid front product invites doubt about the rest.
 */
const FRONT_TITLES = [
  "GTA: V",
  "Red Dead Redemption 2",
  "Elden Ring",
  "God of War: Ragnarok",
  "Spider-Man: Remastered",
  "Hogwarts Legacy",
  "The Witcher 3: Wild Hunt",
  "Resident Evil 4",
  "Forza Horizon 5",
  "The Elder Scrolls: Skyrim",
  "Tekken 8",
  "GTA: San Andreas",
] as const;

export type FrontGame = {
  name: string;
  img: string;
  /** Steam-style covers are 2:3; a few assets are wide headers instead. */
  wide: boolean;
};

/**
 * Resolved against the catalog so a renamed entry fails loudly here instead of
 * silently dropping a card and leaving the count wrong.
 */
export const FRONT_GAMES: FrontGame[] = FRONT_TITLES.map((name) => {
  const game = CATALOG.find((entry) => entry.name === name);
  if (!game?.img) {
    throw new Error(
      `front-offer: "${name}" is missing from the catalog or has no cover. ` +
        `Fix the title or add an image before shipping.`,
    );
  }
  return { name: game.name, img: game.img, wide: game.wide === true };
});

export const FRONT_GAMES_COUNT = FRONT_GAMES.length;
