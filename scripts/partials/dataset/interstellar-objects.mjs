import { writeFile } from 'node:fs/promises';

import { INTERSTELLAR_OBJECTS } from '../../../packages/constants/dist/bodies/interstellar-objects.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const header =
  '| id | name | designation | type | category | parent | orbit.a | orbit.e | orbit.q | orbit.i | orbit.w | orbit.om | orbit.angle | orbit.retrograde | orbit.periapsisTime | orbit.excessSpeed | rotation.period | rotation.tumbling | display.color | display.size | radius |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = INTERSTELLAR_OBJECTS.map(
  (object) =>
    `| ${object.id} | ${object.name} | ${object.designation} | ${object.type} | ${object.category} | ${object.parent} | ${m(object.orbit.a)} | ${object.orbit.e} | ${m(object.orbit.q)} | ${object.orbit.i} | ${object.orbit.w} | ${object.orbit.om} | ${object.orbit.angle} | ${object.orbit.retrograde ? 'yes' : ''} | ${object.orbit.periapsisTime.toISOString()} | ${m(object.orbit.excessSpeed)} | ${m(object.rotation?.period)} | ${object.rotation?.tumbling ? 'yes' : ''} | ${object.display?.color ?? ''} | ${object.display?.size ?? ''} | ${m(object.radius)} |`
).join('\n');
const out = `## Full list of interstellar objects in the dataset

Every interstellar object seen so far, as of 2026.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/interstellar-objects.md', out, 'utf8');
console.log('Wrote docs/partials/interstellar-objects.md');
