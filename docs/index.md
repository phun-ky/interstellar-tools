---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Interstellar Tools'
  text: 'Engineering the next spacefaring stack'
  tagline:
    'TypeScript monorepo for open, reliable building blocks in orbital mechanics
    and space software. Equations, constants, time utilities, and strong types
    for simulation, visualization, mission tooling, and teaching.'
  image:
    src: './logo/logo.svg'
    alt: 'Hero Image Description'
  actions:
    - theme: brand
      text: Get started
      link: /guide/introduction/
    - theme: alt
      text: View on GitHub
      link: https://github.com/phun-ky/interstellar-tools

features:
  - title: types
    details:
      Shared TypeScript primitives (e.g., Vector3DTupleType, result interfaces);
      zero-dependency, TS-first.
  - title: equations
    details:
      Core orbital mechanics & gravity (vis-viva, Kepler period, circular/escape
      speeds, specific energy/angular momentum, peri/apoapsis, Newtonian
      gravity) with SI units, validation, and KaTeX docs.
  - title: constants
    details:
      SI-first physical & astronomical constants; single source of truth for
      calculations.
  - title: temporal
    details:
      Time/epoch utilities for space software (WIP); consistent units and
      well-typed APIs.
---
