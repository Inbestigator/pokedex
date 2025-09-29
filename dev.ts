import { watch } from "node:fs";
import type { Server } from "node:http";
import { argv, exit } from "node:process";
import { $ } from "bun";
import { createServer } from "dressed/server";

let currentServer: Server | undefined;

async function close() {
  await new Promise((r) => currentServer?.close(r) ?? r(0));
  currentServer = undefined;
}

async function reload() {
  try {
    await $`bun run --bun dressed build ${argv.slice(2)}`.quiet();
    const { commands, components, events, config } = await import(
      `./.dressed/index.mjs?t=${Date.now()}`
    );
    await close();
    currentServer = createServer(commands, components, events, config);
  } catch (e) {
    console.error(e);
    await close();
  }
}

reload();

const watcher = watch("./src", { recursive: true }, reload);

process.on("SIGINT", async () => {
  watcher.close();
  await close();
  exit();
});
