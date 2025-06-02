import { type ModalSubmitInteraction } from "dressed";
import { MessageFlags } from "discord-api-types/v10";
import SearchPage, { searchTypes } from "../../pages/search";

export const pattern = `search-:type(${searchTypes.join("|")})`;

export default async function search(
  interaction: ModalSubmitInteraction,
  args: { type: (typeof searchTypes)[number] }
) {
  const query = interaction.getField("query", true);

  await interaction.update({
    flags: MessageFlags.IsComponentsV2,
    components: [SearchPage(args.type, query)],
  });
}
