import { Button, MediaGallery, MediaGalleryItem, TextDisplay, Section } from "dressed";
import { namedToData, pokedex } from "../client";
import { ps, type History, type State } from "../state";
import DexPage from "./dex";
import { pokemonImage } from "../images";
import type { APIUnfurledMediaItem } from "discord-api-types/v10";

interface Option {
  image: string | APIUnfurledMediaItem;
  id: number;
  name: string;
}

export async function PokemonList(state: State<"l">, history: History) {
  const pokemon = await pokedex.pokemon.listPokemons(state.offset, 5);
  const options = pokemon.results.map((r) => {
    const { id, formattedName } = namedToData(r);
    return {
      id,
      image: pokemonImage(id, "small"),
      name: formattedName,
    };
  });
  const sections = SectionList(options, history);

  return DexPage({
    children: [TextDisplay("## Pokedex"), ...sections],
    inputs: [
      [
        Button({
          custom_id: ps`page-${history}-${{ type: state.type, offset: state.offset - 5 }}`,
          emoji: { name: "⬅️" },
          style: "Secondary",
          disabled: !pokemon.previous,
        }),
        Button({
          custom_id: ps`page-${history}-${{ type: state.type, offset: state.offset + 5 }}`,
          emoji: { name: "➡️" },
          style: "Secondary",
          disabled: !pokemon.next,
        }),
      ],
    ],
  });
}

export function SectionList(options: Option[], history: History) {
  return options
    .map(({ id, image, name }) => [
      MediaGallery(MediaGalleryItem(image)),
      Section(
        [`### ${name}`],
        Button({
          custom_id: ps`page-${history}-${{ type: "p", id }}`,
          label: "Info",
          style: "Secondary",
        })
      ),
    ])
    .flat();
}
