# Getting Started

Welcome! **@interstellar-tools** is a TypeScript monorepo that provides precise,
well-typed building blocks for orbital mechanics and space software. This guide
helps you install the packages, understand the conventions, and make your first
calculations safely.

## Prerequisites

- **Node.js**: version 22.9.0 or higher recommended
- **TypeScript**: version 5+ recommended

## Install

Install only what you need, or all core packages:

```bash
# pick and choose
npm i @interstellar-tools/constants
npm i @interstellar-tools/equations
npm i @interstellar-tools/types
npm i @interstellar-tools/temporal
npm i @interstellar-tools/mcp

# or add the core packages at once
npm i @interstellar-tools/constants @interstellar-tools/equations @interstellar-tools/types @interstellar-tools/temporal
```

To use the toolkit from an AI assistant, you don't need to install anything: run
the MCP server with `npx` and point your assistant at it. Install
`@interstellar-tools/mcp` only to embed the server in your own application.

```bash
npx -y @interstellar-tools/mcp          # stdio, for local assistants
npx -y @interstellar-tools/mcp --http   # Streamable HTTP, for web assistants
```

See [Using the MCP server](../mcp/) for step-by-step setup.

## What you get

- **@interstellar-tools/constants** SI-first physical & astronomical constants
  (e.g., `G_SI`) with explicit units in docs.

- **@interstellar-tools/equations** Core orbital and gravity equations with
  clear error contracts, KaTeX-backed docs, and unit tests:
  - Newtonian gravity (force & acceleration)
  - Vis-viva (orbital speed), circular/escape speeds
  - Kepler's 3rd law (period)
  - Specific mechanical energy
  - Specific angular momentum (from state or elements)
  - Peri/apoapsis radii

- **@interstellar-tools/temporal** Time/epoch helpers for space applications
  (WIP, expanding).

- **@interstellar-tools/types** Shared, zero-dependency TypeScript types (e.g.,
  3-tuples for vectors, result interfaces).

- **@interstellar-tools/mcp** A Model Context Protocol server that lets AI
  assistants such as Claude, ChatGPT and Mistral Le Chat call these equations as
  tools. No install needed: see [Using the MCP server](../mcp/).

## Conventions (read me first)

- **Units**: All functions expect **SI** inputs and return **SI** outputs.
  - Length: **m**, Mass: **kg**, Time: **s**, Force: **N**, Acceleration:
    **m/s²**
  - Gravitational parameter **μ**: **m³/s²**
- **Vectors**: 3-tuples `readonly [number, number, number]`.
  - Directions follow documentation (e.g., force **on body 1 due to body 2**
    points from 1 → 2).
- **Validation**: Inputs are validated; invalid domains throw `Error` with
  actionable messages.
  - Example: `r <= 0`, negative masses, `G <= 0`, radicand < 0, etc.
- **Numerics**: Guardrails are in place (e.g., tiny negative radicands clamped
  near zero where appropriate). Prefer double precision and consistent
  constants.

## Quick orientation

- **Constants**: import once, reuse across your app.
- **Equations**: favor functions that match your known quantities (e.g.,
  **circular** speed for circular orbits, **vis-viva** for general conics).
- **μ vs G(M+m)**: In real-world usage, prefer **published μ (GM)** of central
  bodies for stability. The general `gravitationalParameter(M, m, G)` exists for
  binaries or when μ is not available.
- **Types**: adopt the shared vector and result types to get strong compile-time
  checks.

## Typical import patterns

```ts
// Constants
import { G_SI } from '@interstellar-tools/constants';
// Equations (examples)
import {
  accelerationOn1By2,
  circularSpeed,
  escapeSpeed,
  gravitationalForce,
  keplerPeriod,
  periApoapsisRadii,
  specificAngularMomentum,
  specificAngularMomentumFromElements,
  specificMechanicalEnergy,
  visVivaSpeed
} from '@interstellar-tools/equations';
// Types
import type { Vector3DTupleType } from '@interstellar-tools/types';
```

See API docs for details, invariants, and error behaviour.

## Recommended practices

- **Centralize μ** values per body (e.g., Earth, Sun) and pass them
  explicitly-avoid mixing **G** and **μ** casually.
- **Name your frames** (ECI, ECEF, heliocentric) in comments/variables where
  relevant; equations assume inertial frames unless stated.
- **Check invariants** in tests (e.g., `‖F‖ = G m1 m2 / r²`, `a = F/m`,
  `v_esc = √2 v_c`, `h = ‖r×v‖`).
- **Document units** at call sites, even in internal code-future you will thank
  you later.
- **Prefer tuples** for vectors to keep APIs lean, immutable, and DCE-friendly.

## Troubleshooting

- **Unexpected NaN/Infinity**: Verify input units and domain (e.g., `r > 0`,
  `μ ≥ 0`).
- **Sign/direction confusion**: Re-read each function's "direction" clause;
  force/accel helpers specify source→target conventions.
- **Discrepant constants**: Published μ values (GM) can vary by source/version;
  pin the dataset you rely on.
