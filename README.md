# Pokédex

This is a fairly advanced bot made using [Dressed](https://dressed.vercel.app). Users can list Pokémon, see info about a specific Pokémon, or search species/individuals.

It features a state/history system built into the buttons, so your data is persisted.

This project is also a test of a more "React-like" system, so views are componentized and stored in `src/pages`

> I'm working on a possible addon lib, likely `@dressed/react` or `@dressed/jsx`, which will probably be used here if completed.

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

You can try editing a page by modifying `src/pages/list.ts`.

## Deploying

When you're ready, this bot is intended to be deployed on [Vercel](https://vercel.com)

You can check out
[the GitHub repository](https://github.com/inbestigator/dressed) - your feedback
and contributions are welcome!
