import { writeFile } from 'node:fs/promises';

import { SYSTEMS } from '../../../packages/constants/dist/bodies/systems.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const header =
  '| id | name | kind | parent | orbit.a | orbit.e | orbit.period | orbit.angle | distance | x | y | z |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = SYSTEMS.map(
  (system) =>
    `| ${system.id} | ${system.name} | ${system.kind} | ${system.parent ?? ''} | ${m(system.orbit?.a)} | ${system.orbit?.e ?? ''} | ${m(system.orbit?.period)} | ${system.orbit?.angle ?? ''} | ${m(system.distance)} | ${m(system.x)} | ${m(system.y)} | ${m(system.z)} |`
).join('\n');
const out = `## Full list of systems in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/systems.md', out, 'utf8');
console.log('Wrote docs/partials/systems.md');
