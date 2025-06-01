import {
  ActionRow,
  TextInput,
  type MessageComponentInteraction,
} from "dressed";
import { ps } from "../../state";
import SearchPage, { searchTypes } from "../../pages/search";
import { ComponentType, MessageFlags } from "discord-api-types/v10";

export const pattern = ps`search-${""}{-:type(${searchTypes.join("|")})::query}`;

export default async function search(
  interaction: MessageComponentInteraction,
  args: { prev: string } & (
    | { type: (typeof searchTypes)[number]; query: string }
    | { type: undefined; query: undefined }
  ),
) {
  const prev = ps(args.prev);

  if (
    args.type === "set" &&
    interaction.data.component_type === ComponentType.StringSelect
  ) {
    return interaction.update({
      flags: MessageFlags.IsComponentsV2,
      components: [
        await SearchPage(
          prev,
          interaction.data.values[0] as typeof args.type,
          args.query,
        ),
      ],
    });
  }

  return interaction.showModal({
    title: "Search",
    custom_id: ps`search-${prev}-${args.type ?? "pokemon"}`,
    components: [
      ActionRow(
        TextInput({
          custom_id: "query",
          label: "Query",
          required: true,
          value: args.query,
        }),
      ),
    ],
  });
}
