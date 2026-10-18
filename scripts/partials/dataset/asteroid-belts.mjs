import { writeFile } from 'node:fs/promises';

import { ASTEROID_BELTS } from '../../../packages/constants/dist/bodies/asteroid-belts.js';

const header =
  '| id | name | parent | innerRadius | outerRadius | display.color | display.opacity | display.density |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = ASTEROID_BELTS.map(
  (belt) =>
    `| ${belt.id} | ${belt.name} | ${belt.parent} | ${belt.innerRadius} | ${belt.outerRadius} | ${belt.display?.color ?? ''} | ${belt.display?.opacity ?? ''} | ${belt.display?.density ?? ''} |`
).join('\n');
const out = `## Full list of asteroid belts in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/asteroid-belts.md', out, 'utf8');
console.log('Wrote docs/partials/asteroid-belts.md');
