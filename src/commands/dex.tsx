import { type CommandConfig } from "dressed";
import { PokemonList } from "../pages/list";
import type { CommandInteraction } from "@dressed/react";

export const config: CommandConfig = {
  description: "Displays information about Pokémon.",
};

export default async function dex(interaction: CommandInteraction) {
  const [List] = await Promise.all([
    PokemonList({ offset: 0, type: "l", history: [{ offset: 0, type: "l" }] }),
    interaction.deferReply({ ephemeral: true }),
  ]);
  await interaction.editReply(List);
}
