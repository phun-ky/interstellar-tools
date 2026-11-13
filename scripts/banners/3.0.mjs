// Content of the release banners for 3.0. Copy this file for the next major
// (e.g. 4.0.mjs) and run: node scripts/banners/render.mjs 4.0
export default {
  slug: 'v3',
  pill: 'Release 3.0 · November 2026',
  kicker: '// Version 3.0',
  title: ['Load only', { accent: 'what you show' }],
  body: 'What is measured about the bodies is exported apart from them, so an app loads only the groups it imports. Masses and excess speeds carry their units, and every package needs Node 22.12.',
  panels: [
    {
      label: 'Packages · npm',
      status: 'Major',
      rows: [
        { text: 'types · constants', chip: '3.0.0' },
        { text: 'the five others', chip: 'major' }
      ]
    },
    {
      label: 'Bundled alone · gzip',
      status: 'Smaller',
      mono: true,
      rows: [
        { text: 'STARS', value: '2.0 kB' },
        { text: 'STAR_PARAMETERS', value: '2.6 kB' },
        { text: 'star.mass', value: '{ value, unit }' }
      ]
    }
  ]
};
