import type { CommandInteraction } from "@dressed/react";
import { type CommandAutocompleteInteraction, type CommandConfig, CommandOption } from "dressed";
import { format, pokedex } from "../client";
import { PokemonList } from "../pages/list";
import { PokemonPage } from "../pages/pokemon";
import { search } from "../search";

export const config = {
  description: "Displays information about Pokémon.",
  options: [
    CommandOption({
      type: "Integer",
      name: "pokemon",
      description: "Start on a specific pokemon page",
      autocomplete: true,
      min_value: 0,
      max_value: 1302,
    }),
  ],
} satisfies CommandConfig;

export async function autocomplete(interaction: CommandAutocompleteInteraction) {
  const query = interaction.getOption("pokemon")?.integer();
  if (!query) return interaction.sendChoices([]);
  await interaction.sendChoices(
    await Promise.all(
      search(String(query), "species").map(async (name) => {
        const pokemon = await pokedex.pokemon.getPokemonSpeciesByName(name.item);
        return { name: format(pokemon.name), value: pokemon.id };
      }),
    ),
  );
}

export default async function dexCommand(interaction: CommandInteraction<typeof config>) {
  await interaction.deferReply({ ephemeral: true });
  const id = interaction.getOption("pokemon")?.integer();
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
