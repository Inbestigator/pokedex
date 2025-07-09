import { pokedex } from "./src/client";
import { writeFileSync } from "node:fs";

const { results: pokemons } = await pokedex.pokemon.listPokemons(0, 100000);
const { results: species } = await pokedex.pokemon.listPokemonSpecies(0, 100000);

writeFileSync("mons.json", JSON.stringify(pokemons.map((p) => p.name)));
writeFileSync("species.json", JSON.stringify(species.map((p) => p.name)));
