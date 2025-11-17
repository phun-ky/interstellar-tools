import { writeFile } from 'node:fs/promises';

import { SYSTEMS } from '../../../packages/constants/dist/bodies/systems.js';

const header =
  '| name      | stars             | distance |\n' +
  '| --------- | -------------------- | ------- |\n';
const rows = SYSTEMS.map((system) => {
  const { name, stars, distance } = system;

  return `| ${name} | <ul class="ph">${stars.map((star) => `<li class="ph">${star}</li>`).join('')}</ul> | ${distance}`;
}).join('\n');
const out = `## Full list of systems in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/systems.md', out, 'utf8');
console.log('Wrote docs/partials/systems.md');
