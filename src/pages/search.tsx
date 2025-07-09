import { Button, SelectMenu, SelectMenuOption } from "@dressed/react";
import { ps, type History, type State } from "../state";
import DexPage from "./dex";
import { capitalize, format, pokedex } from "../client";
import { search } from "../search";
import { SectionList, type Option } from "./list";
import { pokemonImage } from "../images";

export const searchTypes = ["set", "pokemon", "species"] as const;

export function SearchDisplay({ state, options }: { state: State<"s">; options: Option[] }) {
  return (
    <DexPage
      hideSearchButton
      inputs={[
        [
          <SelectMenu
            custom_id={ps`type-search-set:${state.query}`}
            type="String"
            placeholder="Select a type"
          >
            {searchTypes.slice(1).map((t) => (
              <SelectMenuOption
                key={t}
                label={capitalize(t)}
                value={t}
                default={t === state.searchType}
              />
            ))}
          </SelectMenu>,
        ],
        [
          <Button
            custom_id={ps`search-${state.searchType}:${state.query}`}
            emoji={{ name: "🔍" }}
            label="Edit query"
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

export default async function* SearchPage({
  query,
  type,
}: {
  type: (typeof searchTypes)[number];
  query: string;
}) {
  if (type === "set") type = "species";

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
