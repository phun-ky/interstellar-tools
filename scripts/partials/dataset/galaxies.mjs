import { writeFile } from 'node:fs/promises';

import { GALAXIES } from '../../../packages/constants/dist/bodies/galaxies.js';

const header =
  '| name       | type          | diameter | distance | blackHole.name                | blackHole.mass | blackHole.radius | blackHole.x | blackHole.y |\n' +
  '| ---------- | ------------- | -------------- | -------------- | ----------------------------- | -------------- | --------------------- | ---------------- | ---------------- |\n';
const rows = GALAXIES.map((galaxy) => {
  const { name, type, diameter, distance, blackHole } = galaxy;

  return `| ${name} | ${type} | ${diameter.value} ${diameter.unit} | ${distance.value} ${distance.unit} | ${blackHole.name} | ${blackHole.mass} | ${blackHole.radius.value} ${blackHole.radius.unit} | ${blackHole.x.value} ${blackHole.x.unit} | ${blackHole.y.value} ${blackHole.y.unit} |`;
}).join('\n');
const out = `## Full list of galaxies in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/galaxies.md', out, 'utf8');
console.log('Wrote docs/partials/galaxies.md');
