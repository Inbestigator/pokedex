import { type ModalSubmitInteraction } from "dressed";
import { ps } from "../../state";
import { MessageFlags } from "discord-api-types/v10";
import SearchPage, { searchTypes } from "../../pages/search";

export const pattern = ps`search-${""}-:type(${searchTypes.join("|")})`;

export default async function search(
  interaction: ModalSubmitInteraction,
  args: { prev: string; type: (typeof searchTypes)[number] },
) {
  const prev = ps(args.prev);
  const query = interaction.getField("query", true);

  await interaction.deferUpdate();

  await interaction.editReply({
    flags: MessageFlags.IsComponentsV2,
    components: [await SearchPage(prev, args.type, query)],
  });
}
