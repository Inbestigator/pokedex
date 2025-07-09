import { ActionRow, TextInput, type MessageComponentInteraction } from "@dressed/react";
import SearchPage, { searchTypes } from "../../pages/search";
import { ComponentType } from "discord-api-types/v10";

export const pattern = `search{-:type(${searchTypes.join("|")})::query}`;

export default async function search(
  interaction: MessageComponentInteraction,
  args: { prev: string } & (
    | { type: (typeof searchTypes)[number]; query: string }
    | { type: undefined; query: undefined }
  )
) {
  if (args.type === "set" && interaction.data.component_type === ComponentType.StringSelect) {
    return interaction.update(
      <SearchPage type={interaction.data.values[0] as typeof args.type} query={args.query} />
    );
  }

  return interaction.showModal(
    <ActionRow>
      <TextInput
        custom_id="query"
        label="Query"
        required
        value={args.query}
        max_length={32}
        min_length={3}
      />
    </ActionRow>,
    {
      title: args.query ? "Edit query" : "Search",
      custom_id: `search-${args.type ?? "species"}`,
    }
  );
}
