# Development

::: info

Want to contribute? Please read the
[CONTRIBUTING.md](https://github.com/phun-ky/interstellar-tools/blob/main/CONTRIBUTING.md)
and
[CODE_OF_CONDUCT.md](https://github.com/phun-ky/interstellar-tools/blob/main/CODE_OF_CONDUCT.md).

:::

## Requirements

- [Node.js](https://nodejs.org/) 24.15 or newer, and npm 11.5.1 or newer (see
  `engines` in `package.json`)
- [Git](https://git-scm.com/)

Everything else, including TypeScript, the test runner and the docs tooling, is
installed from `package-lock.json`.

## Install

To develop **Interstellar Tools**, fork it, and then in the project root:

```shell
npm ci
```

## Build

```shell
npm run build
```

## Test the code

```shell
npm test     # every package's test suite
npm run test:ci # the same, with coverage reports, as CI runs it
```

Tests use Node's built-in test runner, and live next to the code in each
package's `__tests__` folders. The Checks workflow runs them, with coverage, on
every push to `main` and every pull request, after the build, lint, type-check
and docs check; a pull request can't be merged until they pass. Tests are
required for new functionality and for bug fixes, as described in
[Contributing code](https://github.com/phun-ky/interstellar-tools/blob/main/CONTRIBUTING.md#tests).

## Lint and type-check

Both need a build first, since packages import each other through their `dist`
output.

```shell
npm run lint
npm run typecheck # type-checks sources and tests (the build excludes tests)
npm run docs:check # runs TypeDoc without writing docs; warnings fail it
```

Each package has two TypeScript configs:

- `tsconfig.build.json` compiles the published `dist` (tests excluded), used by
  `npm run build`.
- `tsconfig.json` covers sources and tests with Node types and emits nothing.
  Editors pick it up, and `npm run typecheck` uses it.

### Links from the security metadata

`.bestpractices.json` (answers for the
[OpenSSF Best Practices badge](https://www.bestpractices.dev/projects/15627))
and `security-insights.yml` link to files, docs pages and headings in this
repository. `npm run check:bestpractices` checks that they all exist, and runs
in CI. If you move or rename one of them, update the link in those files.

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
`package.json`, `README.md` and `LICENSE`):

| Commit type                                      | Below 1.0 | From 1.0 on |
| ------------------------------------------------ | --------- | ----------- |
| breaking (`feat!:`, `fix!:`, `BREAKING CHANGE:`) | minor     | major       |
| `feat`                                           | minor     | minor       |
| `fix`, `perf`, `revert`                          | patch     | patch       |
| anything else (`chore`, `docs`, `ci`, `test`, …) | none      | none        |

A package is also released as a patch when a package it depends on gets a
version outside its `^` range.

To release an exact version instead, such as the first 1.0, add a `Release-As`
footer naming each package to any commit since their last release, for example
an empty one:

```shell
git commit --allow-empty -m "chore: 🤖 Release 1.0" \
  -m "Release-As: types@1.0.0, constants@1.0.0, equations@1.0.0"
```

The footer must name the packages, so a version is never set for all of them by
accident, and the version must be higher than the current one.

To see what would be released, without releasing anything:

```shell
npm run release:dry-run
```

The decisions live in `scripts/release-plan.mjs`, tested by
`npm run test:scripts`, and `scripts/release.mjs` gathers the commits and runs
the releases; `release-it` does the version bump, changelog, tag, npm publish
and GitHub release for each package. After each bump,
`scripts/sync-lockfile.mjs` updates `package-lock.json`, so every release commit
includes a matching lockfile. `release-it` handles one package at a time, so it
can't skip a package with nothing to release or bump dependents on its own. The
script fills that gap.

## Clean code

Code follows the project's [ESLint](https://eslint.org/) configuration
(`eslint-config-phun-ky`, which includes [Prettier](https://prettier.io/)
formatting) and TypeScript in strict mode. Contributions must pass
`npm run lint` and `npm run typecheck`; both run in CI on every pull request.
See
[Contributing code](https://github.com/phun-ky/interstellar-tools/blob/main/CONTRIBUTING.md#contributing-code)
for the tests policy.
