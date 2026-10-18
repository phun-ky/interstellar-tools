// Print a bestpractices.dev link that proposes the answers in
// .bestpractices.json whose status differs from what's saved on the site.
// Open it, review the highlighted fields, and save: nothing is written until
// you do. Saved justifications are kept unless you pass --justifications.
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
const params = new URLSearchParams();
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

  params.set(key, value);
  params.set(`${name}_justification`, justification);
  changed.push(`${name}: ${saved[key] ?? '?'} → ${value}`);
}

const note =
  reworded > 0
    ? `\n${reworded} more answers match but are worded differently; pass --justifications to propose that wording too.`
    : '';

if (changed.length === 0) {
  console.log(`Project ${PROJECT} already matches .bestpractices.json.${note}`);
  process.exit(0);
}

// Proposals only fill blank fields unless forced. Force the statuses that
// differ (their justifications follow), so they show as changes to review
params.set(
  'overrides',
  changed.map((line) => `${line.split(':')[0]}_status`).join(',')
);

console.log(`${changed.length} answers differ from the saved project:\n`);
for (const line of changed) console.log(`  ${line}`);
console.log(
  `\nReview and save them here:\n\nhttps://www.bestpractices.dev/en/projects/${PROJECT}/${values.level}/edit?${params}\n${note}`
);
