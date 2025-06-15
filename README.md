## Kysely Playground

### Create a new Deno project

```bash
mkdir kysely-playground
```

```bash
deno init
```

### Run the project

```bash
deno task dev
```

## Kysely + SQLite + Deno が動かなかったのでnodeに変更

### Create a new Node.js project

```bash
pnpm init
```

```bash
pnpm install kysely better-sqlite3
```

```bash
pnpm install -D @types/better-sqlite3
```

```bash
pnpm install -D typescript ts-node
```

```bash
npx tsc --init
```

```json:tsconfig.json
{
  // ...略...
  "outdir": "./build"
  // ...略...
}
```

```json:package.json
{
  // ...略...
  "scripts": {
    "dev": "ts-node src/main.ts",
    "start": "node build/main.js",
    "build": "tsc -p ."
  }
  // ...略...
}
```
