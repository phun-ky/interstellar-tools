// Content of the release banners for 2.0. Copy this file for the next major
// (e.g. 3.0.mjs) and run: node scripts/banners/render.mjs 3.0
export default {
  slug: 'v2',
  pill: 'Release 2.0 · November 2026',
  kicker: '// Version 2.0',
  title: ['Galaxies at their', { accent: 'real distances' }],
  body: 'types and constants reach 2.0: the galaxies move a million times closer, to their Cepheid distances, a black hole is only where one is detected, and MeasureInterface is gone.',
  panels: [
    {
      label: 'Packages · npm',
      status: 'Major',
      rows: [
        { text: 'types · constants', chip: '2.0.0' },
        { text: 'the five others', chip: 'patch' }
      ]
    },
    {
      label: 'Galaxies · from the Sun',
      status: 'Corrected',
      mono: true,
      rows: [
        { text: 'andromeda.distance', value: '761 kpc' },
        { text: 'triangulum.distance', value: '840 kpc' },
        { text: 'triangulum.blackHole', value: 'none' }
      ]
    }
  ]
};
