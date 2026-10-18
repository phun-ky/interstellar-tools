import { writeFile } from 'node:fs/promises';

import { MOONS } from '../../../packages/constants/dist/bodies/moons.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const header =
  '| id | name | category | parent | orbit.a | orbit.e | orbit.period | orbit.angle | radius | display.color |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = MOONS.map(
  (moon) =>
    `| ${moon.id} | ${moon.name} | ${moon.category} | ${moon.parent} | ${m(moon.orbit.a)} | ${moon.orbit.e} | ${m(moon.orbit.period)} | ${moon.orbit.angle} | ${m(moon.radius)} | ${moon.display?.color ?? ''} |`
).join('\n');
const out = `## Full list of moons in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/moons.md', out, 'utf8');
console.log('Wrote docs/partials/moons.md');
