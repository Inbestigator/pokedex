import type { ModalSubmitInteraction } from "@dressed/react";
import SearchPage, { searchTypes } from "../../pages/search";

export const pattern = `search-:type(${searchTypes.join("|")})`;

export default async function search(
  interaction: ModalSubmitInteraction,
  args: { type: (typeof searchTypes)[number] }
) {
  await interaction.deferUpdate();
  const query = interaction.getField("query", true);
  const res = SearchPage({
    type: args.type,
    query,
  });
  for await (const view of res) {
    await interaction.editReply(view);
  }
}
