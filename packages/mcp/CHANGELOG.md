# Changelog

## [0.2.4](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Fmcp%400.2.3...%40interstellar-tools%2Fmcp%400.2.4) (2026-10-18)

## [0.2.3](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Fmcp%400.2.2...%40interstellar-tools%2Fmcp%400.2.3) (2026-10-18)

## [0.2.2](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Fmcp%400.2.1...%40interstellar-tools%2Fmcp%400.2.2) (2026-10-18)

### Documentation

* ✏️ Adopt the Developer Certificate of Origin ([44b4416](https://github.com/phun-ky/interstellar-tools/commit/44b44169efe1b77b6cc612e2b2bf0465a5c3e99c))

### Bug

* 🐛 Include the licence in every published package ([9b4a5fb](https://github.com/phun-ky/interstellar-tools/commit/9b4a5fb09b377159a87b675be57b5b89c3b12e6f))

## [0.2.1](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Fmcp%400.2.0...%40interstellar-tools%2Fmcp%400.2.1) (2026-10-17)

### Bug

* 🐛 Protect the MCP HTTP server against DNS rebinding ([02de055](https://github.com/phun-ky/interstellar-tools/commit/02de0555d64ded15098cd8428ac360d443d3db63))

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
