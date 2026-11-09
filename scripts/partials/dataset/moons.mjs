import { writeFile } from 'node:fs/promises';

import { MOONS } from '../../../packages/constants/dist/bodies/moons.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const frame = (orbit) =>
  orbit?.frame
    ? orbit.frame.pole
      ? `${orbit.frame.plane} (pole ${orbit.frame.pole.rightAscension}°, ${orbit.frame.pole.declination}°)`
      : orbit.frame.plane
    : '';
const header =
  '| id | name | category | parent | orbit.a | orbit.e | orbit.period | orbit.retrograde | orbit.angle | orbit.i | orbit.w | orbit.om | orbit.frame | rotation.period | rotation.retrograde | rotation.synchronous | radius | mu (m³/s²) | display.color |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = MOONS.map(
  (moon) =>
    `| ${moon.id} | ${moon.name} | ${moon.category} | ${moon.parent} | ${m(moon.orbit.a)} | ${moon.orbit.e} | ${m(moon.orbit.period)} | ${moon.orbit?.retrograde ? 'yes' : ''} | ${moon.orbit.angle} | ${moon.orbit.i ?? ''} | ${moon.orbit.w ?? ''} | ${moon.orbit.om ?? ''} | ${frame(moon.orbit)} | ${m(moon.rotation?.period)} | ${moon.rotation?.retrograde ? 'yes' : ''} | ${moon.rotation?.synchronous ? 'yes' : ''} | ${m(moon.radius)} | ${moon.mu?.toExponential() ?? ''} | ${moon.display?.color ?? ''} |`
).join('\n');
const out = `## Full list of moons in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/moons.md', out, 'utf8');
console.log('Wrote docs/partials/moons.md');
