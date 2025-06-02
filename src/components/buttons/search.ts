import { ActionRow, TextInput, type MessageComponentInteraction } from "dressed";
import SearchPage, { searchTypes } from "../../pages/search";
import { ComponentType, MessageFlags } from "discord-api-types/v10";

export const pattern = `search{-:type(${searchTypes.join("|")})::query}`;

export default async function search(
  interaction: MessageComponentInteraction,
  args: { prev: string } & (
    | { type: (typeof searchTypes)[number]; query: string }
    | { type: undefined; query: undefined }
  )
) {
  if (args.type === "set" && interaction.data.component_type === ComponentType.StringSelect) {
    return interaction.update({
      flags: MessageFlags.IsComponentsV2,
      components: [await SearchPage(interaction.data.values[0] as typeof args.type, args.query)],
    });
  }

  return interaction.showModal({
    title: args.query ? "Edit query" : "Search",
    custom_id: `search-${args.type ?? "species"}`,
    components: [
      ActionRow(
        TextInput({
          custom_id: "query",
          label: "Query",
          required: true,
          value: args.query,
          max_length: 32,
          min_length: 3,
        })
      ),
    ],
  });
}
