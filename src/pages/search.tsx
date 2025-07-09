import { Button, SelectMenu, SelectMenuOption } from "@dressed/react";
import { ps, type History } from "../state";
import DexPage from "./dex";
import { capitalize, format } from "../client";
import { search } from "../search";
import { SectionList } from "./list";
import { pokemonImage } from "../images";

export const searchTypes = ["set", "pokemon", "species"] as const;

export default function SearchPage({
  query,
  type,
}: {
  type: (typeof searchTypes)[number];
  query: string;
}) {
  if (type === "set") type = "species";

  const results = search(query, type).map((r) => ({
    ...r.item,
    name: format(r.item.name),
    image: pokemonImage(r.item.id, "small"),
  }));
  const history: History = [{ type: "s", query, searchType: type }]; // History doesn't have a back button, and it's longer than standard, so safe to override

  return (
    <DexPage
      hideSearchButton
      inputs={[
        [
          <SelectMenu
            custom_id={ps`type-search-set:${query}`}
            type="String"
            placeholder="Select a type"
          >
            {searchTypes.slice(1).map((t) => (
              <SelectMenuOption key={t} label={capitalize(t)} value={t} default={t === type} />
            ))}
          </SelectMenu>,
        ],
        [
          <Button
            custom_id={ps`search-${type}:${query}`}
            emoji={{ name: "🔍" }}
            label="Edit query"
            style="Secondary"
          />,
        ],
      ]}
    >
      ## Results for '{query}'
      <SectionList history={history} options={results} />
    </DexPage>
  );
}
