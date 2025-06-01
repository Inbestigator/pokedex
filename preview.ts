import {
  createServer,
  setupCommands,
  setupComponents,
  setupEvents,
} from "dressed/server";
import build from "dressed/build";
import { watch } from "node:fs";

let server: ReturnType<typeof createServer>;

async function callback() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  const { commands, components, events, config } = await build({
    endpoint: "/bot",
    port: 3000,
  });
  const cacheBuster = `?t=${Date.now()}`;

  server = createServer(
    setupCommands(
      commands.map((c) => ({
        ...c,
        run: async (...p) =>
          (await import(`./${c.path}${cacheBuster}`)).default(...p),
      })),
    ),
    setupComponents(
      components.map((c) => ({
        ...c,
        run: async (...p) =>
          (await import(`./${c.path}${cacheBuster}`)).default(...p),
      })),
    ),
    setupEvents(
      events.map((e) => ({
        ...e,
        run: async (...p) =>
          (await import(`./${e.path}${cacheBuster}`)).default(...p),
      })),
    ),
    config,
  );
}

callback();

const watcher = watch("./src", { recursive: true }, callback);

process.on("SIGINT", async () => {
  watcher.close();
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  process.exit(0);
});
