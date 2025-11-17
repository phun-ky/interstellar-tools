import { writeFile } from 'node:fs/promises';

import { COMETS } from '../../../packages/constants/dist/bodies/comets.js';

const header =
  '| name                            | type               | category             | system | a | e       | i      | w      | om    | angle    | period | q     | color   | size | radius |\n' +
  '| ------------------------------- | ------------------ | -------------------- | ------ | ------ | ------- | ------ | ------ | ----- | -------- | ----------- | ----- | ------- | ---- |  ----------- |\n';
const rows = COMETS.map((comet) => {
  const {
    name,
    type,
    category,
    system,
    a,
    e,
    i,
    w,
    om,
    angle,
    period,
    q,
    color,
    size,
    radius
  } = comet;

  return `| ${name} | ${type} | ${category} | ${system} | ${a.value} ${a.unit} | ${e} | ${i} | ${w} | ${om} | ${angle} | ${period.value} ${period.unit} | ${q} | ${color} | ${size} | ${radius.value} ${radius.unit} |`;
}).join('\n');
const out = `## Full list of comets in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/comets.md', out, 'utf8');
console.log('Wrote docs/partials/comets.md');
