import { watch } from "node:fs";
import type { Server } from "node:http";
import { $ } from "bun";
import { createServer } from "dressed/server";

let currentServer: Server | undefined;

async function close() {
  await new Promise((r) => currentServer!.close(() => r({})));
  currentServer = undefined;
}

async function reload() {
  if (currentServer) await close();

  try {
    console.time("Build");
    await $`bun run --bun dressed build`.quiet();
    console.time("Build");

    const { commands, components, events, config } = await import(
      `./.dressed/index.mjs?t=${Date.now()}`
    );

    if (currentServer) {
      await close();
    }

    currentServer = createServer(commands, components, events, config);
  } catch {}
}

reload();

const watcher = watch("./src", { recursive: true }, reload);

process.on("SIGINT", async () => {
  watcher.close();
  if (currentServer) currentServer.close();
  process.exit(0);
});
