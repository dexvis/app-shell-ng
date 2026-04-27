# DexVis Shell

[![npm](https://img.shields.io/npm/v/@dexvis/shell.svg)](https://www.npmjs.com/package/@dexvis/shell)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Reusable Angular shell layout. The library is published as [`@dexvis/shell`](https://www.npmjs.com/package/@dexvis/shell).

**Live demo:** [https://dexvis.github.io/app-shell-ng/](https://dexvis.github.io/app-shell-ng/)

## Structure

```
projects/
├── app-shell/    ← library (published as @dexvis/shell)
└── shell-ng/     ← demo app (deployed to GitHub Pages)
```

## Develop

```bash
npm ci
npx ng build app-shell --watch     # terminal 1
npx ng serve shell-ng              # terminal 2
```

Open [http://localhost:4200](http://localhost:4200).

## Build

```bash
npx ng build app-shell --configuration production
npx ng build shell-ng --configuration production
```

## Publish

```bash
cd projects/app-shell
npm version patch                            # or minor / major
cd ../..
npx ng build app-shell --configuration production
cd dist/dexvis/shell
npm publish
cd ../../..
git push --follow-tags
```

## Library docs

See [`projects/app-shell/README.md`](./projects/app-shell/README.md).

## License

MIT
