import { Button, MediaGallery, MediaGalleryItem, TextDisplay, Section } from "dressed";
import { namedToData, pokedex } from "../client";
import { ps, type History, type State } from "../state";
import DexPage from "./dex";
import { pokemonImage } from "../images";
import type { APIUnfurledMediaItem } from "discord-api-types/v10";

export default async function ListPage({
  state,
  history,
  options,
  next,
  previous,
}: {
  state: State<"l">;
  history: History;
  options: {
    image: string | APIUnfurledMediaItem;
    id: number;
    name: string;
  }[];
  next: boolean;
  previous: boolean;
}) {
  const sections = await Promise.all(
    options.map(async ({ id, image, name }) => {
      return [
        MediaGallery(MediaGalleryItem(image)),
        Section(
          [`### ${name}`],
          Button({
            custom_id: ps`page-${history}-${{ type: state.type.replace("l", "p"), id }}`,
            label: "Info",
            style: "Secondary",
          })
        ),
      ];
    })
  );

  return DexPage({
    children: [TextDisplay("## Pokedex"), ...sections.flat()],
    inputs: [
      [
        Button({
          custom_id: ps`page-${history}-${{ type: state.type, offset: state.offset - 5 }}`,
          emoji: { name: "⬅️" },
          style: "Secondary",
          disabled: !previous,
        }),
        Button({
          custom_id: ps`page-${history}-${{ type: state.type, offset: state.offset + 5 }}`,
          emoji: { name: "➡️" },
          style: "Secondary",
          disabled: !next,
        }),
      ],
    ],
    history,
  });
}

export async function PokemonList(state: State<"l">, history: History) {
  const pokemon = await pokedex.pokemon.listPokemons(state.offset, 5);

  return ListPage({
    state,
    history,
    options: pokemon.results.map((r) => {
      const { id, capitalizedName } = namedToData(r);
      return {
        id,
        image: pokemonImage(id, "small"),
        name: capitalizedName,
      };
    }),
    next: !!pokemon.next,
    previous: !!pokemon.previous,
  });
}
