import createHandler from "@dressed/next";
// @ts-ignore
import { commands, components, events } from "../.dressed/index.mjs";

export const POST = createHandler(commands, components, events);
