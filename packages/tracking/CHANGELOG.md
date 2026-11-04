# Changelog

## 0.1.0 (2026-11-04)

The first release, published by hand so npm trusted publishing could be set up
for the package.

### Feature

* 🎸 Parse TLE and OMM orbital elements ([7aca6c0](https://github.com/phun-ky/interstellar-tools/commit/7aca6c034d0298374e9fbec783bda40dd9a6d893)), closes [#210](https://github.com/phun-ky/interstellar-tools/issues/210)
* 🎸 Propagate satellites with SGP4 and SDP4 ([614e87a](https://github.com/phun-ky/interstellar-tools/commit/614e87a1937ee3eaa15d3c445e7e5862f53ef9db)), closes [#211](https://github.com/phun-ky/interstellar-tools/issues/211)
* 🎸 Find the point under a satellite ([3d64463](https://github.com/phun-ky/interstellar-tools/commit/3d6446396ce2cb4031b091ac0b7ceca263039f73)), closes [#212](https://github.com/phun-ky/interstellar-tools/issues/212)

### Bug

* 🐛 Take propagate's time since epoch in Unix ms, not as a difference of Julian dates ([c5c5c93](https://github.com/phun-ky/interstellar-tools/commit/c5c5c936a79f3cf65d04da12b53d31631b3ce18c))
