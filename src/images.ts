import type { APIUnfurledMediaItem } from "discord-api-types/v10";

export const resizedImage = (url: string, width: number, height?: number): APIUnfurledMediaItem => ({
  url: `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}${height ? `&h=${height}` : ""}`,
  width,
  height: height ?? width,
});

export const pokemonImage = (id: number, size: "small" | "medium" | "large") =>
  resizedImage(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    size === "large" ? 196 : size === "medium" ? 128 : 96,
  );
