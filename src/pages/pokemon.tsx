import { ActionRow, Button, MediaGallery, MediaGalleryItem, TextDisplay } from "@dressed/react";
import { convert, format, namedToData, pokedex, urlToId } from "../client";
import { ps, type History, type State } from "../state";
import DexPage from "./dex";
import { pokemonImage } from "../images";
import type { ChainLink, EvolutionChain, Pokemon } from "pokenode-ts";

function DataDisplay({
  history,
  prev,
  pokemon,
  evolutionChain,
  abilities,
  longestAbility,
  types,
  isLoading,
}: {
  history: History;
  prev?: History[number];
  pokemon: Pokemon;
  evolutionChain?: EvolutionChain;
  abilities: string[];
  longestAbility: number;
  types: string[];
  isLoading?: boolean;
}) {
  return (
    <DexPage
      inputs={[
        [
          <Button
            custom_id={ps`page-${history.slice(0, -1)}-${prev}`}
            emoji={{ name: "↩️" }}
            style="Secondary"
          />,
        ],
      ]}
      isLoading={isLoading}
    >
      <MediaGallery>
        <MediaGalleryItem media={pokemonImage(pokemon.id, "large")} />
      </MediaGallery>
      ## {format(pokemon.name)}
      <TextDisplay>### Information</TextDisplay>
      {`\`\`\`ansi
[1;2m[0;2m[1;2mHeight:  Weight:[0m[0m
${convert(pokemon.height, "dm", "ft")
  .toFixed(2)
  .split(".", 2)
  .map((n, i) => `${n}${"'".repeat(i + 1)}`)
  .join(" ")}  ${convert(pokemon.weight, "hg", "lb").toFixed(1)} lbs

[1;2m[0;2m[1;2m${"Abilities:".padEnd(longestAbility + 2)}  Type:[0m[0m
${abilities
  .map((a, i) => `• ${a.padEnd(longestAbility)}  ${i === 0 ? types.join(", ") : ""}`)
  .join("\n")}
\`\`\``}
      {evolutionChain && evolutionChain.chain.evolves_to.length > 0 && (
        <>
          <TextDisplay>### Evolutions</TextDisplay>
          <EvolveChain root={evolutionChain.chain} history={history} />
        </>
      )}
    </DexPage>
  );
}

export async function* PokemonPage({
  history,
  ...state
}: State<"p"> & {
  history: History;
}) {
  const pokemon = await pokedex.pokemon.getPokemonById(state.id);

  let prev = history.at(-2);

  if (prev?.type === "p" && prev.id === state.id) {
    prev = history.at(-3);
    history.pop();
  }

  const abilities = pokemon.abilities
    .filter((a) => !a.is_hidden)
    .map((a) => namedToData(a.ability).formattedName);
  const longestAbility = Math.max(8, ...abilities.map((a) => a.length));
  const types = pokemon.types.map((t) => namedToData(t.type).formattedName);

  yield <DataDisplay {...{ abilities, history, longestAbility, pokemon, types, prev }} isLoading />;

  const species = await pokedex.pokemon.getPokemonSpeciesById(urlToId(pokemon.species.url));
  const evolutionChain = await pokedex.evolution.getEvolutionChainById(
    urlToId(species.evolution_chain.url)
  );

  yield (
    <DataDisplay
      {...{ abilities, history, longestAbility, pokemon, types, evolutionChain, prev }}
    />
  );
}

function flattenEvolutionChain(link: ChainLink): ChainLink[] {
  const result: ChainLink[] = [];
  const queue: ChainLink[] = [link];

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);
    queue.push(...current.evolves_to);
  }

  return result;
}

function EvolveChain({ root, history }: { root: ChainLink; history: History }) {
  const flatChain = flattenEvolutionChain(root);
  const curr = history.at(-1) as State<"p">;

  return chunk(flatChain, 5).map((group, i) => (
    <ActionRow key={i}>
      {group.map((link) => {
        const { id } = namedToData(link.species);
        return (
          <Button
            key={link.species.name}
            disabled={curr.id === id}
            custom_id={ps`page-${history}-${{ type: "p", id }}`}
            label={format(link.species.name)}
            style="Secondary"
          />
        );
      })}
    </ActionRow>
  ));
}

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
