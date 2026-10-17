# Changelog

## [0.2.0](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Fmcp%400.1.2...%40interstellar-tools%2Fmcp%400.2.0) (2026-10-17)

### ⚠ BREAKING CHANGES

* `system` is replaced by `parent` (an id), and `a`, `e`,
  `period`, `angle` (plus `i`, `w`, `om`, `q` on comets and asteroids) move into
  `orbit`. `StarSystemInterface` is removed; `SystemInterface` becomes a
  barycenter node with `id`, `kind`, `parent`, `orbit` and `distance` (now a
  DistanceInterface) instead of `stars`. Stars lose `system` and constellation
  names, and gain optional `mass` (M☉). Asteroids and comets use their official
  designations as ids, e.g. `4-vesta` and `1p-halley`. `meanToEccentricAnomaly`
  and `computeAngle` take an orbit (`body.orbit`) instead of a body.

### Feature

* 🎸 Model orbits as a tree of parents and orbits ([3b1b62c](https://github.com/phun-ky/interstellar-tools/commit/3b1b62ca96ed79fecc3ae94f366fbaae1afab111))

## [0.1.2](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Fmcp%400.1.1...%40interstellar-tools%2Fmcp%400.1.2) (2026-10-16)

### Bug

* 🐛 Point package homepages at the documentation site ([501217b](https://github.com/phun-ky/interstellar-tools/commit/501217b57b2d87d3d6462de8d3b50c06af97edce))

## [0.1.1](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Fmcp%400.1.0...%40interstellar-tools%2Fmcp%400.1.1) (2026-10-16)

### Bug

* 🐛 Report the real package version from the MCP server ([da6715f](https://github.com/phun-ky/interstellar-tools/commit/da6715fd6d000ba7e4fac5758484788d6c51e6ae))
