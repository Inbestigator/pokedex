import { CommandOption, type CommandAutocompleteInteraction, type CommandConfig } from "dressed";
import { PokemonList } from "../pages/list";
import type { CommandInteraction } from "@dressed/react";
import { search } from "../search";
import { format, pokedex } from "../client";
import { PokemonPage } from "../pages/pokemon";

export const config: CommandConfig = {
  description: "Displays information about Pokémon.",
  options: [
    CommandOption({
      type: "Number",
      name: "pokemon",
      description: "Start on a specific pokemon page",
      autocomplete: true,
      min_value: 0,
      max_value: 1302,
    }),
  ],
};

export async function autocomplete(interaction: CommandAutocompleteInteraction) {
  const query = interaction.getOption("pokemon")?.number();
  if (!query) return interaction.sendChoices([]);
  await interaction.sendChoices(
    await Promise.all(
      search(String(query), "pokemon").map(async (name) => {
        const pokemon = await pokedex.pokemon.getPokemonByName(name.item);
        return { name: format(pokemon.name), value: pokemon.id };
      })
    )
  );
}

export default async function dex(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const id = interaction.getOption("pokemon")?.number();
  if (id) {
    const res = PokemonPage({
      id,
      type: "p",
      history: [
        { type: "l", offset: 0 },
        { type: "p", id },
      ],
    });
    for await (const view of res) {
      await interaction.editReply(view);
    }
  } else {
    const List = await PokemonList({ offset: 0, type: "l", history: [{ offset: 0, type: "l" }] });
    await interaction.editReply(List);
  }
}
