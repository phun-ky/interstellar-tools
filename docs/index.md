---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Interstellar Tools'
  text: 'Engineering the next spacefaring stack'
  tagline:
    'Open, tested building blocks for orbital mechanics and space software in
    TypeScript. Equations, constants, datasets and time utilities, with SI
    units, strong types and the formula behind every function. Ready for your
    code and your AI assistant.'
  image:
    src: './logo/logo.svg'
    alt: 'Interstellar Tools logo'
  actions:
    - theme: brand
      text: Get started
      link: /guide/introduction/
    - theme: alt
      text: Connect your AI assistant
      link: /guide/mcp/
    - theme: alt
      text: API reference
      link: /api/
    - theme: alt
      text: View on GitHub
      link: https://github.com/phun-ky/interstellar-tools

features:
  - icon: 🪐
    title: Orbital mechanics, ready to use
    details:
      Vis-viva, Kepler’s equation solvers that hold up as e → 1, anomaly
      conversions, Hohmann transfers, plane changes, the rocket equation, J2
      precession, Clohessy–Wiltshire relative motion and planetary cartography.
      59 functions and counting.
    link: /api/@interstellar-tools/equations/
    linkText: Browse the equations
  - icon: 📐
    title: Units you can trust
    details:
      SI in, SI out, everywhere. Inputs are validated and invalid domains fail
      loudly with actionable messages, instead of quietly returning NaN that
      surfaces three modules later.
    link: /guide/introduction/#conventions-read-me-first
    linkText: Read the conventions
  - icon: 🌌
    title: Constants and celestial datasets
    details:
      Physical and astronomical constants from a single source of truth, plus
      curated datasets of planets, moons, stars, comets, asteroids, belts,
      galaxies and systems, with units carried on every value.
    link: /api/@interstellar-tools/constants/
    linkText: Explore the data
  - icon: 🤖
    title: Built for AI assistants
    details:
      A Model Context Protocol server turns the toolkit into tools for Claude,
      ChatGPT, Mistral Le Chat, Gemini, GitHub Copilot and more, so your
      assistant calculates orbits instead of guessing at them.
    link: /guide/mcp/
    linkText: Set it up in minutes
  - icon: ⏱️
    title: Time, from attoseconds to gigayears
    details:
      Convert and normalise durations across 16 units and their aliases, the
      foundation for epochs, Julian dates and ephemeris-friendly time handling.
    link: /api/@interstellar-tools/temporal/
    linkText: See temporal
  - icon: 🧪
    title: Typed, tested, documented
    details:
      Strict TypeScript with branded radians and unit-carrying values, over 500
      unit tests, tree-shakeable ESM, and a reference where every equation is
      written out in LaTeX next to its code.
    link: /api/@interstellar-tools/types/
    linkText: See the types
---

## A taste

```ts
import { SECONDS_PER_DAY } from '@interstellar-tools/constants';
import { hohmannTransfer } from '@interstellar-tools/equations';

const MU_EARTH = 3.986004418e14; // [m³/s²]
// From a 300 km parking orbit to geostationary orbit
const { dv1, dv2, dvTotal, tTransfer } = hohmannTransfer(
  6_678e3, // r1 [m]
  42_164e3, // r2 [m]
  MU_EARTH
);

console.log(dv1.toFixed(0), dv2.toFixed(0), dvTotal.toFixed(0)); // 2426 1467 3893 [m/s]
console.log(((tTransfer / SECONDS_PER_DAY) * 24).toFixed(2)); // 5.28 [h]
```

## Or just ask

Connect the [MCP server](/guide/mcp/) once and ask in plain language:

> _“How much Δv do I need to go from a 300 km circular orbit to GEO, and how
> long does the transfer take?”_

Your assistant calls `hohmann_transfer` with explicit units, and answers with
**3.89 km/s** and **5.28 hours**, computed rather than recalled.

## Why Interstellar Tools

Space is becoming a mainstream software domain. Simulators, visualisations,
mission tools and classrooms all need the same trustworthy primitives, and too
often they are re-derived from a textbook, one unit bug at a time. Interstellar
Tools packages them once, with the maths, the tests and the types in the open.

| Package                                                                | What you get                                                   |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`@interstellar-tools/equations`](/api/@interstellar-tools/equations/) | Orbital mechanics, gravity, manoeuvres, anomalies, cartography |
| [`@interstellar-tools/constants`](/api/@interstellar-tools/constants/) | Physical constants and celestial body datasets                 |
| [`@interstellar-tools/temporal`](/api/@interstellar-tools/temporal/)   | Time unit conversion and normalisation                         |
| [`@interstellar-tools/types`](/api/@interstellar-tools/types/)         | Shared, zero-dependency TypeScript types                       |
| [`@interstellar-tools/mcp`](/guide/mcp/)                               | MCP server for AI assistants                                   |

::: info Early alpha

The API can still change between minor versions, and the equations are
unit-tested but not yet cross-validated against flight software. Use it to
learn, prototype and build, and
[tell us what you need](https://github.com/phun-ky/interstellar-tools/issues).

:::
