import { Button, SelectMenu, SelectMenuOption, TextDisplay } from "dressed";
import { ps, type History, type State } from "../state";
import DexPage from "./dex";
import { capitalize } from "../client";

export const searchTypes = [
  "set",
  "pokemon",
  "species",
  "move",
  "ability",
  "item",
  "type",
] as const;

export default async function SearchPage(
  history: History,
  type: (typeof searchTypes)[number],
  query: string
) {
  return DexPage({
    children: [TextDisplay(`## Results for '${query}'`)],
    history,
    hideSearchButton: true,
    inputs: [
      SelectMenu({
        custom_id: ps`type-search-${history}-set:${query}`,
        type: "String",
        placeholder: "Select a type",
        options: searchTypes.slice(1).map((t) =>
          SelectMenuOption(capitalize(t), t, {
            default: t === type,
          })
        ),
      }),
      Button({
        custom_id: ps`search-${history}-${type}:${query}`,
        emoji: { name: "🔍" },
        label: "Change query",
        style: "Secondary",
      }),
    ],
  });
}
