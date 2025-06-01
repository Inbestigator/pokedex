import { MessageFlags } from "discord-api-types/v10";
import { type CommandInteraction, type CommandConfig } from "dressed";
import { PokemonList } from "../pages/list";

export const config: CommandConfig = {
  description: "Displays information about Pokémon.",
};

export default async function dex(interaction: CommandInteraction) {
  const [list] = await Promise.all([
    PokemonList({ offset: 0, type: "l" }, [{ offset: 0, type: "l" }]),
    interaction.deferReply({ ephemeral: true }),
  ]);
  await interaction.editReply({
    flags: MessageFlags.IsComponentsV2,
    components: [list],
  });
}
