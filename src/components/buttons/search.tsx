import { Label, type MessageComponentInteraction, SelectMenu, SelectMenuOption, TextInput } from "@dressed/react";
import { searchTypes } from "../../pages/search";

export const pattern = `search{-:type(${searchTypes.join("|")})::query}`;

export default async function search(
  interaction: MessageComponentInteraction,
  args: { prev: string } & (
    | { type: (typeof searchTypes)[number]; query: string }
    | { type: undefined; query: undefined }
  ),
) {
  return interaction.showModal(
    <>
      <Label label="Query">
        <TextInput custom_id="query" value={args.query} max_length={32} min_length={3} required />
      </Label>
      <Label label="Type">
        <SelectMenu type="String" custom_id="type">
          {searchTypes.map((t) => (
            <SelectMenuOption
              key={t}
              default={t === (args.type ?? "species")}
              label={t[0]?.toUpperCase() + t.slice(1)}
              value={t}
            />
          ))}
        </SelectMenu>
      </Label>
    </>,
    {
      title: args.query ? "Edit search" : "Search",
      custom_id: "search",
    },
  );
}
