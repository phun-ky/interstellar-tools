# About Interstellar Tools

> Engineering the next spacefaring stack

**TypeScript monorepo for open, reliable building blocks in orbital mechanics
and space software.** Equations, constants, time utilities, and strong types for
simulation, visualization, mission tooling, and teaching.

[[toc]]

![Image of stars](/images/jonny-gios-bxDJ12Kv9Rk-unsplash.jpg)

## Status

> **Project status:** Early alpha

- API surface: changing between minor versions.
- Validation: unit tests in place; not yet cross-validated against flight-grade
  references.
- Runtime targets: Node 20+, modern browsers with ESM bundlers (Vite, Webpack,
  etc.).

## Why this exists

We're entering a new era where space is becoming a mainstream software domain:
conference programs increasingly feature space + IT topics, and teams across
science, education, and industry need trustworthy, well-typed primitives.
**@interstellar-tools** is an open-source, TypeScript-first toolkit created to
accelerate that shift: precise functions, clear docs, and strong types that make
orbital and mission software easier to build and easier to verify.

## Packages

| Package                         | Description                                       | Status |
| ------------------------------- | ------------------------------------------------- | ------ |
| `@interstellar-tools/constants` | Physical & astronomical constants in SI units.    | Alpha  |
| `@interstellar-tools/equations` | Orbital mechanics & dynamics utilities.           | Alpha  |
| `@interstellar-tools/temporal`  | Time/epoch helpers for space applications.        | WIP    |
| `@interstellar-tools/types`     | Shared TypeScript types (vectors, results, etc.). | Alpha  |

### Details

- **@interstellar-tools/constants** Authoritative physical and astronomical
  constants in SI units for consistent calculations.

- **@interstellar-tools/equations** Curated, well-tested orbital mechanics and
  dynamics formulas (e.g., Newtonian gravity, vis-viva, Kepler's 3rd law,
  escape/circular speeds, specific energy, specific angular momentum,
  peri/apoapsis radii).

::: warning **Validation status**

Equations are unit-tested against internal reference values, but have not yet
been systematically cross-validated against operational flight software or
high-fidelity ephemerides. Treat this as a learning and prototyping toolkit, not
as mission-critical software (yet).

:::

- **@interstellar-tools/temporal** Time and epoch utilities for space
  applications (e.g., building blocks toward Julian dates, conversions, and
  ephemeris-friendly time handling).

- **@interstellar-tools/types** Shared TypeScript types (e.g., 3D tuples,
  equation result interfaces) used across the monorepo to keep APIs predictable
  and safe.

## Who is this for?

- Engineers building **space-related web or Node tools** (simulators,
  visualizers, mission dashboards).
- Educators who want **typed, reusable examples** of orbital mechanics in
  TypeScript.
- Hackers and students exploring **orbital mechanics through code**.

Not a good fit (for now) if you need:

- Flight-certified or safety-critical software.
- High-fidelity N-body or perturbation modeling.

## Design principles

- **Correctness first.** Equations are implemented with explicit units, domain
  checks, and guardrails for common numerical pitfalls.
- **TS-first ergonomics.** Strong, reusable types; tuple-based vectors;
  predictable return shapes.
- **SI everywhere.** All APIs are documented and validated assuming SI units by
  default.
- **Readable math.** JSDoc uses KaTeX for exact definitions and invariants right
  where you need them.
- **No surprises.** Prefer simple, auditable implementations over cleverness;
  bias toward dependency-light code.

## Vision & scope

The long-term vision is an open, trustworthy foundation for:

- **Simulation & guidance**: two-body dynamics building blocks and beyond.
- **Visualization & mapping**: ephemeris-friendly primitives and safe
  transforms.
- **Education**: approachable formulas with clear units, references, and
  examples.
- **Interoperability**: shared types/constants across packages and apps.

Initial focus is on **core equations, constants, and types** with clear
documentation and tests, then growing into **time systems, frames/transforms**,
and higher-level **propagation & solving** utilities.

## Governance & values

This project aims to be:

- **Open**: free to use, adapt, and extend under MIT.
- **Inclusive**: welcoming to newcomers and experts alike.
- **Practical**: focused on real-world reliability and clarity over spectacle.

## A note from the author

> I built @interstellar-tools to help catalyse the space+software wave I'm
> seeing in our industry-by doing the thing I do best: shipping precise,
> well-documented building blocks. If that resonates with you, I'd love your
> feedback and contributions.
>
> <footer class="ph">
>
> _&mdash; Alexander Vassbotn Røyne-Helgesen_
>
> </footer>

## Contributing

Contributions are very welcome-issues, ideas, bug reports, docs fixes, and new
equations/utilities.

- Read the
  [**CONTRIBUTING.md**](https://github.com/phun-ky/interstellar-tools/blob/main/CONTRIBUTING.md)
  and
  [**CODE_OF_CONDUCT.md**](https://github.com/phun-ky/interstellar-tools/blob/main/CODE_OF_CONDUCT.md)
  before opening a PR.
- Please use conventional commit messages (the repo embraces SemVer and
  contributor-friendly workflows).

## License

This project is licensed under the MIT License - see the
[LICENSE](https://github.com/phun-ky/interstellar-tools/blob/main/LICENSE) file
for details.

## Sponsor me

I'm an Open Source evangelist, creating stuff that does not exist yet to help
get rid of secondary activities and to enhance systems already in place, be it
documentation, tools or web sites.

The sponsorship is an unique opportunity to alleviate more hours for me to
maintain my projects, create new ones and contribute to the large community
we're all part of :)

[Support me on GitHub Sponsors](https://github.com/sponsors/phun-ky).

p.s. **Ukraine is still under brutal Russian invasion. A lot of Ukrainian people
are hurt, without shelter and need help**. You can help in various ways, for
instance, directly helping refugees, spreading awareness, putting pressure on
your local government or companies. You can also support Ukraine by donating
e.g. to [Red Cross](https://www.icrc.org/en/donate/ukraine),
[Ukraine humanitarian organisation](https://savelife.in.ua/en/donate-en/#donate-army-card-weekly)
or
[donate Ambulances for Ukraine](https://www.gofundme.com/f/help-to-save-the-lives-of-civilians-in-a-war-zone).
