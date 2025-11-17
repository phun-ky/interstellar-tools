import { writeFile } from 'node:fs/promises';

import { MOONS } from '../../../packages/constants/dist/bodies/moons.js';

const header =
  '| name      | category             | system  | a  | e        | period | radius | color   | angle |\n' +
  '| --------- | -------------------- | ------- | -------- | -------- | ------------ | ----------- | ------- | ----- |\n';
const rows = MOONS.map((moon) => {
  const { name, category, system, a, e, period, radius, color, angle } = moon;

  return `| ${name} | ${category} | ${system} | ${a.value} ${a.unit}  | ${e} | ${period.value} ${period.unit} |  ${radius.value} ${radius.unit} | ${color} | ${angle} |`;
}).join('\n');
const out = `## Full list of moons in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/moons.md', out, 'utf8');
console.log('Wrote docs/partials/moons.md');
