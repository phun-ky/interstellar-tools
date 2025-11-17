import { writeFile } from 'node:fs/promises';

import { ASTEROIDS } from '../../../packages/constants/dist/bodies/asteroids.js';

const header =
  '| name       | type                | category       | spectralType | system | a | e     | i    | w     | om    | angle    | period | q     | radius | color   | size |\n' +
  '| ---------- | ------------------- | -------------- | ------------ | ------ | ------- | ----- | ---- | ----- | ----- | -------- | ----------- | -----  | ----------- | ------- | ---- |\n';
const rows = ASTEROIDS.map((asteroid) => {
  const {
    name,
    type,
    category,
    spectralType,
    system,
    a,
    e,
    i,
    w,
    om,
    angle,
    period,
    q,
    radius,
    color,
    size
  } = asteroid;

  return `| ${name} | ${type} | ${category} | ${spectralType} | ${system} | ${a.value} ${a.unit}  | ${e} | ${i} | ${w} | ${om} | ${angle} | ${period.value} ${period.unit} | ${q} | ${radius.value} ${radius.unit} | ${color} | ${size} |`;
}).join('\n');
const out = `## Full list of asteroids in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/asteroids.md', out, 'utf8');
console.log('Wrote docs/partials/asteroids.md');
