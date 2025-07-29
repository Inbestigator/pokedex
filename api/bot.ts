import createHandler from "@dressed/next";
// @ts-ignore
import { commands, components, events, config } from "../.dressed";

export const POST = createHandler(commands, components, events, config);
