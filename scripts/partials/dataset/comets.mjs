import { writeFile } from 'node:fs/promises';

import { COMETS } from '../../../packages/constants/dist/bodies/comets.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const header =
  '| id | name | type | category | parent | orbit.a | orbit.e | orbit.i | orbit.w | orbit.om | orbit.angle | orbit.period | orbit.retrograde | orbit.q | display.color | display.size | radius |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = COMETS.map(
  (comet) =>
    `| ${comet.id} | ${comet.name} | ${comet.type} | ${comet.category} | ${comet.parent} | ${m(comet.orbit.a)} | ${comet.orbit.e} | ${comet.orbit.i} | ${comet.orbit.w} | ${comet.orbit.om} | ${comet.orbit.angle} | ${m(comet.orbit.period)} | ${comet.orbit?.retrograde ? 'yes' : ''} | ${m(comet.orbit.q)} | ${comet.display?.color ?? ''} | ${comet.display?.size ?? ''} | ${m(comet.radius)} |`
).join('\n');
const out = `## Full list of comets in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/comets.md', out, 'utf8');
console.log('Wrote docs/partials/comets.md');
