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

## Clean code

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/) and
[Putout](https://github.com/coderaiser/putout) is used
