import { patchInteraction } from "@dressed/react";
import type { ServerConfig } from "dressed/server";

const config: ServerConfig = {
  build: { extensions: ["tsx", "ts"] },
  middleware: {
    commands: (i) => [patchInteraction(i)],
    components: (i, a) => [patchInteraction(i), a],
  },
};

export default config;
