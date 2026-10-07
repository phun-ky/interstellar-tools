# Development

::: info

Want to contribute? Please read the
[CONTRIBUTING.md](https://github.com/phun-ky/interstellar-tools/blob/main/CONTRIBUTING.md)
and
[CODE_OF_CONDUCT.md](https://github.com/phun-ky/interstellar-tools/blob/main/CODE_OF_CONDUCT.md).

:::

## Install

To develop **Hybrid Compute**, fork it, and then in the project root:

```shell
npm i
```

## Build

```shell
npm run build
```

## Test the code

```shell
npm test
```

## Lint and type-check

Both need a build first, since packages import each other through their `dist`
output.

```shell
npm run lint
npm run typecheck # type-checks sources and tests (the build excludes tests)
```

Each package has two TypeScript configs:

- `tsconfig.build.json` compiles the published `dist` (tests excluded), used by
  `npm run build`.
- `tsconfig.json` covers sources and tests with Node types and emits nothing.
  Editors pick it up, and `npm run typecheck` uses it.

## Commit

To commit, we use
[semantic git commits with Commitizen](https://github.com/streamich/git-cz). So
please run this when you are ready to commit your staged files:

```shell
npm run commit
```

When you are done with your development, create a PR with the original
repository :)

## Releases

Merging a PR runs the publish workflow, which releases only the packages that
have something to release. For each package, it looks at the commits since the
package's last release tag that touch what it publishes (`src` without tests,
`package.json` and `README.md`):

| Commit type                                        | Release |
| -------------------------------------------------- | ------- |
| `feat`, or breaking (`feat!:`, `BREAKING CHANGE:`) | minor   |
| `fix`, `perf`, `revert`                            | patch   |
| anything else (`chore`, `docs`, `ci`, `test`, …)   | none    |

Breaking changes bump the minor version while the packages are below 1.0. A
package is also released as a patch when a package it depends on gets a version
outside its `^` range. To see what would be released, without releasing
anything:

```shell
npm run release:dry-run
```

The decision logic lives in `scripts/release.mjs`; `release-it` does the version
bump, changelog, tag, npm publish and GitHub release for each package. After
each bump, `scripts/sync-lockfile.mjs` updates `package-lock.json`, so every
release commit includes a matching lockfile. `release-it` handles one package at
a time, so it can't skip a package with nothing to release or bump dependents on
its own. The script fills that gap.

## Clean code

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/) and
[Putout](https://github.com/coderaiser/putout) is used
