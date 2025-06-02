import { type MessageComponentInteraction } from "dressed";
import { ps } from "../../state";
import { MessageFlags } from "discord-api-types/v10";
import { PokemonList } from "../../pages/list";
import PokemonPage from "../../pages/pokemon";
import SearchPage from "../../pages/search";

export const pattern = ps`page-${""}-${"state:"}`;

export default async function page(
  interaction: MessageComponentInteraction,
  args: { prev: string; state: string }
) {
  const state = ps(args.state, true);
  const prev = ps(args.prev);
  prev.push(state);
  let components = [];

  await interaction.deferUpdate();

  switch (state.type) {
    case "l":
      components.push(await PokemonList(state, prev));
      break;
    case "p":
      components.push(await PokemonPage(state, prev));
      break;
    case "s":
      components.push(SearchPage(state.searchType, state.query));
  }

  await interaction.editReply({
    flags: MessageFlags.IsComponentsV2,
    components,
  });
}
