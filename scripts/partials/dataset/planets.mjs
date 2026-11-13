import { writeFile } from 'node:fs/promises';

import { PLANETS } from '../../../packages/constants/dist/bodies/planets.js';

const m = (measure) => (measure ? `${measure.value} ${measure.unit}` : '');
const frame = (orbit) =>
  orbit?.frame
    ? orbit.frame.pole
      ? `${orbit.frame.plane} (pole ${orbit.frame.pole.rightAscension}°, ${orbit.frame.pole.declination}°)`
      : orbit.frame.plane
    : '';
const header =
  '| id | name | type | category | parent | orbit.a | orbit.e | orbit.period | orbit.retrograde | orbit.angle | orbit.i | orbit.w | orbit.om | orbit.frame | rotation.period | rotation.retrograde | rotation.obliquity | rotation.iau | radius | mu (m³/s²) | display.color | x | y | z |\n' +
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n';
const rows = PLANETS.map(
  (planet) =>
    `| ${planet.id} | ${planet.name} | ${planet.type} | ${planet.category} | ${planet.parent ?? ''} | ${m(planet.orbit?.a)} | ${planet.orbit?.e ?? ''} | ${m(planet.orbit?.period)} | ${planet.orbit?.retrograde ? 'yes' : ''} | ${planet.orbit?.angle ?? ''} | ${planet.orbit?.i ?? ''} | ${planet.orbit?.w ?? ''} | ${planet.orbit?.om ?? ''} | ${frame(planet.orbit)} | ${m(planet.rotation?.period)} | ${planet.rotation?.retrograde ? 'yes' : ''} | ${planet.rotation?.obliquity ?? ''} | ${planet.rotation?.iau ? `${planet.rotation.iau.pole} (${planet.rotation.iau.rightAscension}°, ${planet.rotation.iau.declination}°)` : ''} | ${m(planet.radius)} | ${planet.mu?.toExponential() ?? ''} | ${planet.display?.color ?? ''} | ${m(planet.x)} | ${m(planet.y)} | ${m(planet.z)} |`
).join('\n');
const out = `## Full list of planets in the dataset

This list is not an exhaustive list, and addition/changes will be added over time.

<div class="ph table-overflow">

${header}${rows}

</div>
`;

await writeFile('docs/partials/planets.md', out, 'utf8');
console.log('Wrote docs/partials/planets.md');
