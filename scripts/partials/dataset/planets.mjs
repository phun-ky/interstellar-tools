import { writeFile } from 'node:fs/promises';

import { PLANETS } from '../../../packages/constants/dist/bodies/planets.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const header =
  '| id | name | type | category | parent | orbit.a | orbit.e | orbit.period | orbit.angle | radius | display.color | x | y | z |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = PLANETS.map(
  (planet) =>
    `| ${planet.id} | ${planet.name} | ${planet.type} | ${planet.category} | ${planet.parent ?? ''} | ${m(planet.orbit?.a)} | ${planet.orbit?.e ?? ''} | ${m(planet.orbit?.period)} | ${planet.orbit?.angle ?? ''} | ${m(planet.radius)} | ${planet.display?.color ?? ''} | ${m(planet.x)} | ${m(planet.y)} | ${m(planet.z)} |`
).join('\n');
const out = `## Full list of planets in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/planets.md', out, 'utf8');
console.log('Wrote docs/partials/planets.md');
