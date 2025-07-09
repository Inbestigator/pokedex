import type { ModalSubmitInteraction } from "@dressed/react";
import SearchPage, { searchTypes } from "../../pages/search";

export const pattern = `search-:type(${searchTypes.join("|")})`;

export default async function search(
  interaction: ModalSubmitInteraction,
  args: { type: (typeof searchTypes)[number] }
) {
  const query = interaction.getField("query", true);
  await interaction.update(<SearchPage type={args.type} query={query} />);
}
