import { handleRequest } from "dressed/server";
import build from "dressed/build";
import { watch } from "node:fs";
import config from "./dressed.config";

const endpoint = "/bot";
const server = Bun.serve({ routes: { [endpoint]: () => new Response(null) } });

async function reload() {
  const { commands, components, events } = await build();
  const cacheBuster = `?t=${Date.now()}`;

  server.reload({
    routes: {
      [endpoint]: async (req) => {
        return handleRequest(
          req,
          await Promise.all(
            commands.map(async (c) => ({
              ...c,
              exports: await import(`./${c.path}${cacheBuster}`),
            }))
          ),
          await Promise.all(
            components.map(async (c) => ({
              ...c,
              exports: await import(`./${c.path}${cacheBuster}`),
            }))
          ),
          await Promise.all(
            events.map(async (e) => ({
              ...e,
              exports: await import(`./${e.path}${cacheBuster}`),
            }))
          ),
          config
        );
      },
    },
    port: 3000,
  });
  console.info("Bot listening at", new URL(endpoint, server.url).href);
}

reload();

const watcher = watch("./src", { recursive: true }, reload);

process.on("SIGINT", async () => {
  watcher.close();
  if (server) {
    await server.stop();
  }
  process.exit(0);
});
