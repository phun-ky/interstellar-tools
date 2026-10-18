// Content of the release banners for 1.0. Copy this file for the next major
// (e.g. 2.0.mjs) and run: node scripts/banners/render.mjs 2.0
export default {
  slug: 'v1',
  pill: 'Release 1.0 · October 2026',
  kicker: '// Version 1.0',
  title: ['A stable API for', { accent: 'orbital mechanics' }],
  body: 'All five packages reach 1.0: one orbit tree from galaxies to moons, real J2000 data with μ for the major bodies, and no breaking changes before 2.0.',
  panels: [
    {
      label: 'Packages · npm',
      status: 'Stable',
      rows: [
        { text: 'types · constants · temporal', chip: '1.0.0' },
        { text: 'equations · mcp', chip: '1.0.0' }
      ]
    },
    {
      label: 'Orbit tree · J2000',
      status: 'Nominal',
      mono: true,
      rows: [
        { text: 'milky-way › solar-system › sun › earth' },
        { text: 'earth.mu', value: '3.986e14 m³/s²' },
        { text: '1p-halley.orbit', value: 'retrograde' }
      ]
    }
  ]
};
