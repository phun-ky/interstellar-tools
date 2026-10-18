import { writeFile } from 'node:fs/promises';

import { STARS } from '../../../packages/constants/dist/bodies/stars.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const header =
  '| id | name | type | category | parent | orbit.a | orbit.e | orbit.period | orbit.angle | mass (M☉) | radius | display.color | x | y | z |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = STARS.map(
  (star) =>
    `| ${star.id} | ${star.name} | ${star.type} | ${star.category} | ${star.parent ?? ''} | ${m(star.orbit?.a)} | ${star.orbit?.e ?? ''} | ${m(star.orbit?.period)} | ${star.orbit?.angle ?? ''} | ${star.mass ?? ''} | ${m(star.radius)} | ${star.display?.color ?? ''} | ${m(star.x)} | ${m(star.y)} | ${m(star.z)} |`
).join('\n');
const out = `## Full list of stars in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/stars.md', out, 'utf8');
console.log('Wrote docs/partials/stars.md');
