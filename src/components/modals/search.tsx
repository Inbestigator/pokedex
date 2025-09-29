import type { ModalSubmitInteraction } from "@dressed/react";
import SearchPage, { searchTypes } from "../../pages/search";

export default async function search(interaction: ModalSubmitInteraction) {
  await interaction.deferUpdate();
  const query = interaction.getField("query", true).textInput();
  const type = interaction
    .getField("type", true)
    .stringSelect()[0]! as (typeof searchTypes)[number];
  const res = SearchPage({ type, query });
  for await (const view of res) {
    await interaction.editReply(view);
  }
}
