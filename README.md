# Pokédex

This is a fairly advanced bot made using [Dressed](https://dressed.vercel.app). Users can list Pokémon, see info about a specific Pokémon, or search species/individuals.

It features a state/history system built into the buttons, so your data is persisted.

This project is also an example of using `@dressed/react` to construct messages.

## Commands

- `/dex`: Enter the flow

## Setup

1. Clone the project:

   ```sh
   git clone https://github.com/inbestigator/pokedex
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Register the command:

   ```sh
   bun register
   ```

4. Download data lists:
   ```sh
   bun grab.ts
   ```

## Getting Started

First, run the development bot:

```sh
bun dev
```

In order to obtain a public url to use as the interactions endpoint for Discord,
you need to forward a port, personally, I use VSCode's public port forward
system

If you aren't using VSCode, Cloudflared is a good cli option.

```sh
bunx cloudflared tunnel --url=localhost:3000
```

You can try editing a page by modifying `src/pages/list.tsx`.

## Deploying

When you're ready, you can try to deploying the bot. See [the deploying guides](https://dressed.js.org/docs/guide/deploying) for more information.

You can check out
[the GitHub repository](https://github.com/inbestigator/dressed) - your feedback
and contributions are welcome!
