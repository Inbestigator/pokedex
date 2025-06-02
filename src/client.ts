import { MainClient, type NamedAPIResource } from "pokenode-ts";

export const pokedex = new MainClient();

export function format(str: string): string {
  return capitalize(str.replaceAll("-", " "));
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const weightUnits = ["hg", "lb"] as const;
const lengthUnits = ["dm", "ft"] as const;

/** Horror */
export function convert<T extends (typeof weightUnits)[number] | (typeof lengthUnits)[number]>(
  input: number,
  from: T,
  to: T
): number {
  const weightConversion = { hg: 1, lb: 0.220462 } as Record<T, number>;
  const lengthConversion = { dm: 1, ft: 0.328084 } as Record<T, number>;

  if (
    weightUnits.includes(from as (typeof weightUnits)[number]) &&
    weightUnits.includes(to as (typeof weightUnits)[number])
  ) {
    return (input / weightConversion[from]) * weightConversion[to];
  }
  if (
    lengthUnits.includes(from as (typeof lengthUnits)[number]) &&
    lengthUnits.includes(to as (typeof lengthUnits)[number])
  ) {
    return (input / lengthConversion[from]) * lengthConversion[to];
  }

  throw new Error("Bad units");
}

export function namedToData(data: NamedAPIResource) {
  return {
    name: data.name,
    url: data.url,
    id: urlToId(data.url),
    formattedName: format(data.name),
  };
}

export function urlToId(url: string): number {
  return parseInt(url.split("/").slice(-2)[0]!);
}
