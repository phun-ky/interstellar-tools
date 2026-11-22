// Print a bestpractices.dev link that proposes the answers in
// .bestpractices.json whose status differs from what's saved on the site.
// Open it, review the highlighted fields, and save: nothing is written until
// you do. Saved justifications are kept unless you pass --justifications.
// Long proposals are split over several links, each short enough to open.
// Usage: node scripts/bestpractices-url.mjs [--level silver] [--justifications]
// Levels: passing, silver, gold (the metal series) and baseline-1, baseline-2,
// baseline-3 (OSPS Baseline, read from the official criteria list).
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const PROJECT = 15627;
const { values } = parseArgs({
  options: {
    level: { type: 'string', default: 'silver' },
    justifications: { type: 'boolean', default: false }
  }
});
const answers = JSON.parse(
  readFileSync(new URL('../.bestpractices.json', import.meta.url), 'utf8')
);
const CRITERIA =
  'https://raw.githubusercontent.com/ossf/best-practices-badge/main/criteria/baseline_criteria.yml';
/** The criteria in one Baseline level, from the official criteria list. */
const baselineCriteria = async (level) => {
  const res = await fetch(CRITERIA);

  if (!res.ok) {
    console.error(`Couldn't read the Baseline criteria: HTTP ${res.status}`);
    process.exit(1);
  }

  const names = new Set();

  let current;

  for (const line of (await res.text()).split('\n')) {
    const heading = line.match(/^(baseline-\d):/);

    if (heading) current = heading[1];
    else if (current === level) {
      const criterion = line.match(/^ {6}(osps_\w+):\s*$/);

      if (criterion) names.add(criterion[1]);
    }
  }

  return names;
};
// Fields from another level are ignored by the site, so leave them out
const inLevel = values.level.startsWith('baseline-')
  ? await baselineCriteria(values.level).then(
      (names) => (name) => names.has(name)
    )
  : (name) => !name.startsWith('osps_');
const response = await fetch(
  `https://www.bestpractices.dev/projects/${PROJECT}.json`
);

if (!response.ok) {
  console.error(`Couldn't read project ${PROJECT}: HTTP ${response.status}`);
  process.exit(1);
}

const project = await response.json();
// Baseline answers are read back under their original ids:
// osps_qa_07_01_status is returned as OSPS-QA-07.01_status
const originalId = (field) =>
  field.replace(
    /^osps_([a-z]{2})_(\d{2})_(\d{2})_/,
    (_, category, number, section) =>
      `OSPS-${category.toUpperCase()}-${number}.${section}_`
  );
const saved = new Proxy(project, {
  get: (target, field) => target[field] ?? target[originalId(String(field))]
});
const changed = [];

let reworded = 0;

for (const [key, value] of Object.entries(answers)) {
  if (!key.endsWith('_status')) continue;

  const name = key.slice(0, -'_status'.length);

  if (!inLevel(name)) continue;

  const justification = answers[`${name}_justification`];

  if (saved[key] === value) {
    if (saved[`${name}_justification`] === justification) continue;

    // Same answer, different wording: keep the saved text unless asked
    if (!values.justifications) {
      reworded++;
      continue;
    }
  }

  changed.push({
    key,
    value,
    name,
    justification,
    line: `${name}: ${saved[key] ?? '?'} → ${value}`
  });
}

const note =
  reworded > 0
    ? `\n${reworded} more answers match but are worded differently; pass --justifications to propose that wording too.`
    : '';

if (changed.length === 0) {
  console.log(`Project ${PROJECT} already matches .bestpractices.json.${note}`);
  process.exit(0);
}

const BASE = `https://www.bestpractices.dev/en/projects/${PROJECT}/${values.level}/edit?`;
// The site answers 414 URI Too Long above about 8 KB, so split into links
const MAX_URL = 8000;
const urlFor = (batch) => {
  const params = new URLSearchParams();

  for (const { key, value, name, justification } of batch) {
    params.set(key, value);
    params.set(`${name}_justification`, justification);
  }

  // Proposals only fill blank fields unless forced. Force the statuses that
  // differ (their justifications follow), so they show as changes to review
  params.set('overrides', batch.map(({ key }) => key).join(','));

  return BASE + params;
};
const urls = [];

let batch = [];

for (const entry of changed) {
  if (batch.length > 0 && urlFor([...batch, entry]).length > MAX_URL) {
    urls.push(urlFor(batch));
    batch = [];
  }

  batch.push(entry);
}

urls.push(urlFor(batch));

console.log(`${changed.length} answers differ from the saved project:\n`);
for (const { line } of changed) console.log(`  ${line}`);
console.log(
  urls.length === 1
    ? `\nReview and save them here:\n\n${urls[0]}\n${note}`
    : `\nReview and save them in ${urls.length} links, one at a time:\n\n${urls.join('\n\n')}\n${note}`
);
