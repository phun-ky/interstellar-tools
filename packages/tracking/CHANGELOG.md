# Changelog

## [0.6.0](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Ftracking%400.5.0...%40interstellar-tools%2Ftracking%400.6.0) (2026-11-05)

### Feature

* 🎸 Position deep-space probes from ephemerides ([d857c22](https://github.com/phun-ky/interstellar-tools/commit/d857c22d15eaed3c286f7eb9e021249bbfa7e7dc)), closes [#217](https://github.com/phun-ky/interstellar-tools/issues/217)

### Refactoring

* 💡 Avoid backtracking in the OEM keyword pattern ([5becd90](https://github.com/phun-ky/interstellar-tools/commit/5becd90fe8322dff4a22642f9999e6ae05f33b35))

## [0.5.0](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Ftracking%400.4.0...%40interstellar-tools%2Ftracking%400.5.0) (2026-11-05)

### Feature

* 🎸 Ship a snapshot of well-known satellites ([9748972](https://github.com/phun-ky/interstellar-tools/commit/9748972fe77207f46d9dfb4e87fb183f9335ffcb)), closes [#216](https://github.com/phun-ky/interstellar-tools/issues/216)

## [0.4.0](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Ftracking%400.3.1...%40interstellar-tools%2Ftracking%400.4.0) (2026-11-05)

### Feature

* 🎸 Find satellite eclipses and visible passes ([fac4ef9](https://github.com/phun-ky/interstellar-tools/commit/fac4ef91a3aa574dd94a699869172c9299c77264)), closes [#215](https://github.com/phun-ky/interstellar-tools/issues/215)

## [0.3.1](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Ftracking%400.3.0...%40interstellar-tools%2Ftracking%400.3.1) (2026-11-04)

### Bug

* 🐛 Require @interstellar-tools/types 1.9.0 in tracking ([eb47637](https://github.com/phun-ky/interstellar-tools/commit/eb47637fb6de0bc99268a50ceee126502933e24d))

## [0.3.0](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Ftracking%400.2.1...%40interstellar-tools%2Ftracking%400.3.0) (2026-11-04)

### Feature

* 🎸 Predict satellite passes over a ground observer ([ec0f31c](https://github.com/phun-ky/interstellar-tools/commit/ec0f31c327405f20e432ea13c2233e6328d6b54a)), references [#214](https://github.com/phun-ky/interstellar-tools/issues/214)

## [0.2.1](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Ftracking%400.2.0...%40interstellar-tools%2Ftracking%400.2.1) (2026-11-04)

### Bug

* 🐛 Require @interstellar-tools/types 1.8.0 in tracking ([c55609d](https://github.com/phun-ky/interstellar-tools/commit/c55609d692f030960a61b7e4b10a39fabdd24dec))

## [0.2.0](https://github.com/phun-ky/interstellar-tools/compare/%40interstellar-tools%2Ftracking%400.1.0...%40interstellar-tools%2Ftracking%400.2.0) (2026-11-04)

### Tasks

* 🤖 Release @interstellar-tools/tracking from CI ([0a60ef4](https://github.com/phun-ky/interstellar-tools/commit/0a60ef47ad256bef0b6b256a6ee074d34d6b6ce0)), closes [#207](https://github.com/phun-ky/interstellar-tools/issues/207)

### Feature

* 🎸 Find the look angles to a satellite from a ground observer ([74169c0](https://github.com/phun-ky/interstellar-tools/commit/74169c0ccfc7d2067ed03cb11a9d25af78bb1d4d)), references [#213](https://github.com/phun-ky/interstellar-tools/issues/213)

## 0.1.0 (2026-11-04)

The first release, published by hand so npm trusted publishing could be set up
for the package.

### Feature

* 🎸 Parse TLE and OMM orbital elements ([7aca6c0](https://github.com/phun-ky/interstellar-tools/commit/7aca6c034d0298374e9fbec783bda40dd9a6d893)), closes [#210](https://github.com/phun-ky/interstellar-tools/issues/210)
* 🎸 Propagate satellites with SGP4 and SDP4 ([614e87a](https://github.com/phun-ky/interstellar-tools/commit/614e87a1937ee3eaa15d3c445e7e5862f53ef9db)), closes [#211](https://github.com/phun-ky/interstellar-tools/issues/211)
* 🎸 Find the point under a satellite ([3d64463](https://github.com/phun-ky/interstellar-tools/commit/3d6446396ce2cb4031b091ac0b7ceca263039f73)), closes [#212](https://github.com/phun-ky/interstellar-tools/issues/212)

### Bug

* 🐛 Take propagate's time since epoch in Unix ms, not as a difference of Julian dates ([c5c5c93](https://github.com/phun-ky/interstellar-tools/commit/c5c5c936a79f3cf65d04da12b53d31631b3ce18c))
