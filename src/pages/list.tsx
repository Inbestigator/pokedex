import { Button, MediaGallery, MediaGalleryItem, TextDisplay, Section } from "@dressed/react";
import { namedToData, pokedex } from "../client";
import { ps, type History, type State } from "../state";
import DexPage from "./dex";
import { pokemonImage } from "../images";
import type { APIUnfurledMediaItem } from "discord-api-types/v10";
import { Fragment } from "react";

interface Option {
  image: string | APIUnfurledMediaItem;
  id: number;
  name: string;
}

export async function PokemonList({ history, ...state }: State<"l"> & { history: History }) {
  const pokemon = await pokedex.pokemon.listPokemons(state.offset, 5);
  const options = pokemon.results.map((r) => {
    const { id, formattedName } = namedToData(r);
    return {
      id,
      image: pokemonImage(id, "small"),
      name: formattedName,
    };
  });

  return (
    <DexPage
      inputs={[
        [
          <Button
            custom_id={ps`page-${history}-${{ type: state.type, offset: state.offset - 5 }}`}
            emoji={{ name: "⬅️" }}
            style="Secondary"
            disabled={!pokemon.previous}
          />,
          <Button
            custom_id={ps`page-${history}-${{ type: state.type, offset: state.offset + 5 }}`}
            emoji={{ name: "➡️" }}
            style="Secondary"
            disabled={!pokemon.next}
          />,
        ],
      ]}
    >
      ## Pokedex
      <SectionList options={options} history={history} />
    </DexPage>
  );
}

export function SectionList({ history, options }: { options: Option[]; history: History }) {
  return options.map(({ id, image, name }) => (
    <Fragment key={name}>
      <MediaGallery>
        <MediaGalleryItem media={image} />
      </MediaGallery>
      <Section
        accessory={
          <Button
            custom_id={ps`page-${history}-${{ type: "p", id }}`}
            label="Info"
            style="Secondary"
          />
        }
      >
        <TextDisplay>### {name}</TextDisplay>
      </Section>
    </Fragment>
  ));
}
