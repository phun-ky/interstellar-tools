// Releases only the packages that have something to release, in dependency order.
//
// A package is released when, since its last tag, a commit touching what it
// publishes (src without tests, package.json, README.md) is:
//   - feat, or a breaking change (`type!:` / `BREAKING CHANGE:`) → minor (pre-1.0)
//   - fix, perf or revert                                        → patch
// or when a sibling it depends on gets a version outside its `^` range → patch.
// Anything else (chore, docs, ci, test, style, refactor, dependency bumps) is
// not released.
//
// Usage: node scripts/release.mjs [--dry-run]
import semver from 'semver';

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PACKAGES = ['types', 'constants', 'temporal', 'equations']; // dependency order
const SCOPE = '@interstellar-tools';
const PUBLISHED_PATHS = [
  'src',
  ':(exclude)src/**/__tests__/**',
  'package.json',
  'README.md'
];
const RANK = { patch: 1, minor: 2 };
const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = new URL('../', import.meta.url);
const git = (args, cwd) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const run = (args, cwd = ROOT) =>
  execFileSync('npm', args, { cwd, stdio: 'inherit' });
const higher = (a, b) => ((RANK[a] ?? 0) >= (RANK[b] ?? 0) ? a : b);
// Release level for one conventional commit, or null if it isn't releasable
const levelOf = ({ subject, body }) => {
  const match = /^(\w+)(?:\([^)]*\))?(!)?:/.exec(subject);

  if (!match) return null;

  const [, type, bang] = match;

  if (bang || /^BREAKING[ -]CHANGE:/m.test(body)) return 'minor';

  if (type === 'feat') return 'minor';

  if (['fix', 'perf', 'revert'].includes(type)) return 'patch';

  return null;
};
const ownLevel = (name, cwd) => {
  let tag;

  try {
    tag = git(
      ['describe', '--tags', '--abbrev=0', `--match=${SCOPE}/${name}@*`],
      cwd
    );
  } catch {
    return { level: 'minor', reasons: ['no previous release tag'] };
  }

  const log = git(
    ['log', `${tag}..HEAD`, '--format=%s%x1f%b%x1e', '--', ...PUBLISHED_PATHS],
    cwd
  );
  const commits = log
    .split('\x1e')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [subject, body = ''] = entry.split('\x1f');

      return { subject, body };
    });

  let level = null;

  const reasons = [];

  for (const commit of commits) {
    const commitLevel = levelOf(commit);

    if (commitLevel) {
      level = higher(level, commitLevel);
      reasons.push(`${commitLevel}: ${commit.subject}`);
    }
  }

  return { level, reasons, tag, ignored: commits.length - reasons.length };
};

// Without full history and tags, every package would look like it has never
// been released and get a minor release, so refuse to guess
let isShallow;

try {
  isShallow = git(['rev-parse', '--is-shallow-repository'], ROOT) === 'true';
} catch {
  throw new Error('release.mjs must run inside the git repository.');
}

if (isShallow) {
  throw new Error(
    'The repository is a shallow clone. Release needs full history and tags (actions/checkout with fetch-depth: 0).'
  );
}

const packages = PACKAGES.map((name) => {
  const cwd = new URL(`packages/${name}/`, ROOT);
  const pkg = JSON.parse(readFileSync(new URL('package.json', cwd), 'utf8'));

  return { name, cwd, pkg, ...ownLevel(name, cwd) };
});

if (!packages.some(({ level }) => level)) {
  console.log('Nothing to release: no feat, fix, perf, revert or breaking');
  console.log('commits touch published files since the last release tags.');
  process.exit(0);
}

// Decide in dependency order, so a sibling's new version is known before its
// dependents are checked against it
const next = new Map();

for (const entry of packages) {
  for (const [dependency, range] of Object.entries(
    entry.pkg.dependencies ?? {}
  )) {
    const version = next.get(dependency);

    if (version && !semver.satisfies(version, range)) {
      entry.level = higher(entry.level, 'patch');
      entry.reasons.push(`patch: ${dependency}@${version} is outside ${range}`);
    }
  }

  if (entry.level) {
    next.set(entry.pkg.name, semver.inc(entry.pkg.version, entry.level));
  }
}

for (const { pkg, level, reasons, ignored, tag } of packages) {
  const since = tag ? ` since ${tag}` : '';

  if (level) {
    console.log(
      `\n▶ ${pkg.name} ${pkg.version} → ${next.get(pkg.name)} (${level})${since}`
    );
  } else {
    console.log(`\n▷ ${pkg.name} ${pkg.version}: nothing to release${since}`);
  }

  for (const reason of reasons) console.log(`    ${reason}`);

  if (ignored) console.log(`    (${ignored} other commit(s) not released)`);
}

if (DRY_RUN) process.exit(0);

run(['run', 'build']);
run(['run', 'docs:gen']);
git(['add', '.'], ROOT);

for (const { name, level } of packages) {
  if (!level) continue;

  run([
    'run',
    'release',
    '-w',
    `packages/${name}`,
    '--',
    '--ci',
    '--increment',
    level
  ]);
}
