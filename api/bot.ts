import { handleRequest } from "dressed/server";
import { commands, components, config, events } from "../.dressed/index.js";

export const POST = (req: Request) => handleRequest(req, commands, components, events, config);
