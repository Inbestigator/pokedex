import { ActionRow, Button, MediaGallery, MediaGalleryItem, TextDisplay } from "dressed";
import { capitalize, convert, format, namedToData, pokedex, urlToId } from "../client";
import { ps, type History, type State } from "../state";
import DexPage from "./dex";
import { pokemonImage } from "../images";
import type { ChainLink } from "pokenode-ts";
import type { APIButtonComponent } from "discord-api-types/v10";

export default async function PokemonPage(state: State<"p">, history: History) {
  const [pokemon, species] = await Promise.all([
    pokedex.pokemon.getPokemonById(state.id),
    pokedex.pokemon.getPokemonSpeciesById(state.id),
  ]);

  const evolutionChain = await pokedex.evolution.getEvolutionChainById(
    urlToId(species.evolution_chain.url)
  );
  const evolutions = EvolveBranch(evolutionChain.chain, history).slice(0, 9);

  let prev = history.at(-2);

  if (prev?.type === "p" && prev.id === state.id) {
    prev = history.at(-3);
    history.pop();
  }

  return DexPage({
    children: [
      MediaGallery(MediaGalleryItem(pokemonImage(pokemon.id, "large"))),
      TextDisplay(`## ${capitalize(pokemon.name)}`),
      TextDisplay(`### Information`),
      TextDisplay(
        `\`\`\`ansi\n[1;2m[0;2m[1;2mHeight:[0m[0m  [1;2m[0;2m[1;2mWeight:[0m[0m\n${convert(pokemon.height, "dm", "ft")
          .toFixed(2)
          .split(".", 2)
          .map((n, i) => `${n}${"'".repeat(i + 1)}`)
          .join(" ")}  ${convert(pokemon.weight, "hg", "lb").toFixed(
          1
        )} lbs\n\n[1;2m[0;2m[1;2mAbilities:[0m[0m\n${pokemon.abilities
          .map((t) => `• ${format(t.ability.name)}`)
          .join("\n")}\n\`\`\``
      ),
      ...(evolutions.length > 1
        ? [
            TextDisplay(`### Evolutions`),
            ...chunk(evolutions, 5).map((group) => ActionRow(...group)),
          ]
        : []),
    ],
    history,
    inputs: [
      [
        Button({
          custom_id: ps`page-${history.slice(0, -1)}-${prev}`,
          emoji: { name: "↩️" },
          style: "Secondary",
        }),
      ],
    ],
  });
}

function EvolveBranch(link: ChainLink, history: History): APIButtonComponent[] {
  const { id } = namedToData(link.species);
  const sliced = (history.toReversed().slice(0, 2) as State<"p">[]).map((h) => h.id);

  return [
    Button({
      disabled: sliced.includes(id),
      custom_id: ps`page-${history}-${{ type: "p", id }}`,
      label: format(link.species.name),
      style: "Secondary",
    }),
    ...link.evolves_to.map((e) => EvolveBranch(e, history)).flat(),
  ];
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
