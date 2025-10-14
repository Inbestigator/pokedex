import build, { parseCommands, parseComponents, parseEvents } from "dressed/build";
import { createServer } from "dressed/server";
import config from "./dressed.config.ts";

await build(config, {
  bundle: async (entry, outdir) => {
    await Bun.build({
      entrypoints: [entry],
      outdir,
      naming: `[dir]/[name].mjs`,
      minify: true,
      target: "bun",
      packages: "external",
    });
  },
});

const { commands, components, events } = await import("./.dressed/tmp/entries.ts");

createServer(parseCommands(commands), parseComponents(components), parseEvents(events), config);
