// @ts-ignore
import { commands, components, events, config } from "../.dressed/index.js";
import { handleRequest } from "dressed/server";

export const POST = (req: Request) => handleRequest(req, commands, components, events, config);
