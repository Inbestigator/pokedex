import mons from "../mons.json";
import species from "../species.json";
import Fuse from "fuse.js";

const fuse = {
  pokemon: new Fuse(mons, {
    keys: ["name"],
    threshold: 0.4,
    distance: 100,
  }),
  species: new Fuse(species, {
    keys: ["name"],
    threshold: 0.4,
    distance: 100,
  }),
};

export const search = (query: string, type: keyof typeof fuse) =>
  fuse[type].search(query, { limit: 5 });
