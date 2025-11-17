import { writeFile } from 'node:fs/promises';

import { PLANETS } from '../../../packages/constants/dist/bodies/planets.js';

const header =
  '| name    | type            | category  | system | a | e      | radius | color   | angle      | period | x | y | z |\n' +
  '| ------- | --------------- | --------- | ------ | ------ | ------ | ----------- | ------- | ---------- | ------- | ------ | ------- | ------ |\n';
const rows = PLANETS.map((planet) => {
  const {
    name,
    type,
    category,
    system,
    a,
    e,
    radius,
    color,
    angle,
    period,
    x,
    y,
    z
  } = planet;

  return `| ${name} | ${type} | ${category} | ${system} | ${a.value} ${a.unit}  | ${e} | ${radius.value} ${radius.unit} | ${color} | ${angle} | ${period.value} ${period.unit} | ${x.value} ${x.unit} | ${y.value} ${y.unit} | ${z.value} ${z.unit} |`;
}).join('\n');
const out = `## Full list of planets in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/planets.md', out, 'utf8');
console.log('Wrote docs/partials/planets.md');
