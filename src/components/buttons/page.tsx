import type { Params } from "@dressed/matcher";
import { ps } from "../../state";
import { PokemonList } from "../../pages/list";
import { PokemonPage } from "../../pages/pokemon";
import SearchPage from "../../pages/search";
import type { MessageComponentInteraction } from "@dressed/react";

export const pattern = ps`page-${""}-${"state:"}`;

export default async function page(
  interaction: MessageComponentInteraction,
  args: Params<"page-:prev-:state">
) {
  await interaction.deferUpdate();
  const state = ps(args.state, true);
  const history = ps(args.prev);
  history.push(state);
  if (state.type !== "l") {
    const res =
      state.type === "p"
        ? PokemonPage({ ...state, history })
        : SearchPage({ type: state.searchType, query: state.query });
    for await (const view of res) {
      await interaction.editReply(view);
    }
    return;
  }
  await interaction.editReply(await PokemonList({ ...state, history }));
}
