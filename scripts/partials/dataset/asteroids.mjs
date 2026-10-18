import { writeFile } from 'node:fs/promises';

import { ASTEROIDS } from '../../../packages/constants/dist/bodies/asteroids.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const header =
  '| id | name | type | category | spectralType | parent | orbit.a | orbit.e | orbit.i | orbit.w | orbit.om | orbit.angle | orbit.period | orbit.q | radius | display.color | display.size |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = ASTEROIDS.map(
  (asteroid) =>
    `| ${asteroid.id} | ${asteroid.name} | ${asteroid.type} | ${asteroid.category} | ${asteroid.spectralType} | ${asteroid.parent} | ${m(asteroid.orbit.a)} | ${asteroid.orbit.e} | ${asteroid.orbit.i} | ${asteroid.orbit.w} | ${asteroid.orbit.om} | ${asteroid.orbit.angle} | ${m(asteroid.orbit.period)} | ${asteroid.orbit.q} | ${m(asteroid.radius)} | ${asteroid.display?.color ?? ''} | ${asteroid.display?.size ?? ''} |`
).join('\n');
const out = `## Full list of asteroids in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/asteroids.md', out, 'utf8');
console.log('Wrote docs/partials/asteroids.md');
