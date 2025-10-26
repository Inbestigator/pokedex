import { Button } from "@dressed/react";
import { format, pokedex } from "../client";
import { pokemonImage } from "../images";
import { search } from "../search";
import { ps, type State } from "../state";
import DexPage from "./dex";
import { type Option, SectionList } from "./list";

export const searchTypes = ["pokemon", "species"] as const;

export function SearchDisplay({ state, options }: { state: State<"s">; options: Option[] }) {
  return (
    <DexPage
      hideSearchButton
      inputs={[
        [
          <Button
            key="edit-search"
            custom_id={ps`search-${state.searchType}-${state.query}`}
            emoji={{ name: "🔍" }}
            label="Edit search"
            style="Secondary"
          />,
        ],
      ]}
    >
      ## Results for '{state.query}'
      <SectionList history={[state]} options={options} />
    </DexPage>
  );
}

export default async function* SearchPage({ query, type }: { type: (typeof searchTypes)[number]; query: string }) {
  const names = search(query, type);
  const options: Option[] = [];
  yield <SearchDisplay options={options} state={{ type: "s", query, searchType: type }} />;
  for (const name of names) {
    const pokemon = await pokedex.pokemon.getPokemonByName(name.item);
    options.push({
      id: pokemon.id,
      name: format(pokemon.name),
      image: pokemonImage(pokemon.id, "small"),
    });
    yield <SearchDisplay options={options} state={{ type: "s", query, searchType: type }} />;
  }
}
