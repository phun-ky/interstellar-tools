import { writeFile } from 'node:fs/promises';

import { GALAXIES } from '../../../packages/constants/dist/bodies/galaxies.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const header =
  '| id | name | type | diameter | distance | blackHole.name | blackHole.mass | blackHole.radius | blackHole.x | blackHole.y |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = GALAXIES.map(
  (galaxy) =>
    `| ${galaxy.id} | ${galaxy.name} | ${galaxy.type} | ${m(galaxy.diameter)} | ${m(galaxy.distance)} | ${galaxy.blackHole.name} | ${galaxy.blackHole.mass} | ${m(galaxy.blackHole.radius)} | ${m(galaxy.blackHole.x)} | ${m(galaxy.blackHole.y)} |`
).join('\n');
const out = `## Full list of galaxies in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/galaxies.md', out, 'utf8');
console.log('Wrote docs/partials/galaxies.md');
