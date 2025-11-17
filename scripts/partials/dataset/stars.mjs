import { writeFile } from 'node:fs/promises';

import { STARS } from '../../../packages/constants/dist/bodies/stars.js';

const header =
  '| name   | type     | category | system.name  | system.type      | radius | color      | x | y | z | a | e     | angle              | period |\n' +
  '| ------ | -------- | -------- | ------------ | ---------------- | ----------- | ---------- | ------ | ------ | ------------------ | ------ | ------------------ | ------------ | ----------- |\n';
const rows = STARS.map((star) => {
  const {
    name,
    type,
    category,
    system,
    radius,
    color,
    x,
    y,
    z,
    a,
    e,
    angle,
    period
  } = star;

  return `| ${name} | ${type} | ${category} | ${system.name} | ${system.type} | ${radius.value} ${radius.unit} | ${color} | ${x.value} ${x.unit} | ${y.value} ${y.unit} | ${z.value} ${z.unit} | ${a.value} ${a.unit} | ${e} | ${angle} | ${period.value} ${period.unit} |`;
}).join('\n');
const out = `## Full list of stars in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/stars.md', out, 'utf8');
console.log('Wrote docs/partials/stars.md');
