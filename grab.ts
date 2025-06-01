import { pokedex } from "./src/client";
import { writeFileSync } from "node:fs";

const { results, ...res } = await pokedex.pokemon.listPokemonSpecies(0, 100000);

writeFileSync(
  "species.json",
  JSON.stringify(
    results.map(({ url, name }) => {
      const id = url.split("/").slice(-2)[0] ?? "0";
      return {
        id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        name,
      };
    }),
  ),
);
