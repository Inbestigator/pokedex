import { searchTypes } from "./pages/search";

interface DataState {
  type: "p";
  id: number;
}

interface ListState {
  type: "l";
  offset: number;
}

interface SearchState {
  type: "s";
  query: string;
  searchType: (typeof searchTypes)[number];
}

export type State<T extends "p" | "l" | "s" = "p" | "l" | "s"> = T extends "p"
  ? DataState
  : T extends "l"
  ? ListState
  : SearchState;

export type History = State[];

/**
 * Stateful patterns
 *
 * Create, encode, decode states into dynamic id patterns
 */
export function ps<T extends string | TemplateStringsArray, S extends boolean = false>(
  ...args: [pattern: T, ...values: ("" | History | unknown)[]] | [T, S?]
): T extends TemplateStringsArray ? string : S extends true ? State : History {
  if (Array.isArray(args[0])) {
    const [pattern, ...values] = args;
    let result = "";

    for (let i = 0; i < pattern.length; ++i) {
      result += pattern[i];
      if (i < values.length) {
        const value = values[i] as "" | History;
        if (typeof value === "object") {
          if (Array.isArray(value)) {
            result += encodeHistory(value);
          } else {
            result += encodeState(value);
          }
        } else if ((typeof value === "string" && value.endsWith(":")) || value === "") {
          result += `:${value.slice(0, -1) || "prev"}((:?(p|l|s)[0-9a-zA-Z\\s]+)+)`;
        } else {
          result += values[i];
        }
      }
    }

    return result as ReturnType<typeof ps<T, S>>;
  } else if (typeof args[0] === "string") {
    return (args[1] === true ? decodeState : decodeHistory)(args[0]) as ReturnType<typeof ps<T, S>>;
  }
  throw new Error("Invalid pattern state", { cause: args });
}

function encodeHistory(history: History): string {
  return history.slice(-13).map(encodeState).join(":");
}

function encodeState(state: State): string {
  switch (state.type) {
    case "p":
      return `p${state.id.toString(36)}`;
    case "l":
      return `l${state.offset.toString(36)}`;
    case "s":
      return `s${state.searchType === "pokemon" ? 1 : 0}${state.query}`;
  }
}

function decodeHistory(encoded: string): History {
  const decoded = encoded.split(":").map(decodeState);
  return decoded.length ? decoded : [{ type: "l", offset: 0 }];
}

function decodeState(encoded: string): State {
  const [type, ...hex] = encoded.split("");
  const num = parseInt(hex.join(""), 36);

  switch (type) {
    case "p":
      return { type, id: num };
    case "l":
      return { type, offset: num };
    case "s":
      const [searchType, ...query] = hex;
      return {
        type,
        query: query.join(""),
        searchType: Number(searchType) ? "pokemon" : "species",
      };
  }

  throw new Error(`Invalid state type: ${type}`);
}
