// Releases only the packages that have something to release, in dependency order.
//
// A package is released when, since its last tag, a commit touching what it
// publishes (src without tests, package.json, README.md, LICENSE) is:
//   - a breaking change (`type!:` / `BREAKING CHANGE:`) → major from 1.0 on,
//     minor below 1.0
//   - feat                                              → minor
//   - fix, perf or revert                               → patch
// or when a sibling it depends on gets a version outside its `^` range → patch.
// Anything else (chore, docs, ci, test, style, refactor, dependency bumps) is
// not released.
//
// A `Release-As: <package>@<version>` footer on any commit since the package's
// last tag releases that exact version instead, e.g. for the first 1.0:
//   git commit --allow-empty -m "chore: 🤖 Release 1.0" \
//     -m "Release-As: types@1.0.0, constants@1.0.0, temporal@1.0.0, equations@1.0.0, mcp@1.0.0"
// The decisions themselves are in release-plan.mjs.
//
// release-it bumps, writes the changelog, commits, tags and publishes each
// package, but doesn't push or create the GitHub release: main can move while
// a release runs, and a rejected push would leave the published versions'
// commits and tags off main. Instead, once every package is published, this
// script merges main back in (a merge, not a rebase, so the release commits
// keep the hashes their tags point at), pushes main and the new tags together,
// and then creates the GitHub releases from the changelogs.
//
// Usage: node scripts/release.mjs [--dry-run]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

import {
  changelogSection,
  incrementFor,
  levelFromCommits,
  plan,
  releaseAsIn,
  SCOPE
} from './release-plan.mjs';

const PACKAGES = ['types', 'constants', 'temporal', 'equations', 'maps', 'mcp']; // dependency order
const PUBLISHED_PATHS = [
  'src',
  ':(exclude)src/**/__tests__/**',
  'package.json',
  'README.md',
  'LICENSE'
];
const DRY_RUN = process.argv.includes('--dry-run');
const ROOT = new URL('../', import.meta.url);
const git = (args, cwd) =>
  execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const run = (args, cwd = ROOT) =>
  execFileSync('npm', args, { cwd, stdio: 'inherit' });
// Release-As footers count on any commit since the tag, not only those
// touching published files, so an empty commit can carry them
const releaseAsSince = (name, tag, cwd) =>
  git(['log', ...(tag ? [`${tag}..HEAD`] : []), '--format=%B%x1e'], cwd)
    .split('\x1e')
    .reduce((found, body) => releaseAsIn(body, name) ?? found, null);
const ownLevel = (name, version, cwd) => {
  let tag;

  try {
    tag = git(
      ['describe', '--tags', '--abbrev=0', `--match=${SCOPE}/${name}@*`],
      cwd
    );
  } catch {
    return {
      level: 'minor',
      reasons: ['no previous release tag'],
      releaseAs: releaseAsSince(name, undefined, cwd)
    };
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

  return {
    ...levelFromCommits(commits, version),
    tag,
    releaseAs: releaseAsSince(name, tag, cwd)
  };
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

  return { name, cwd, pkg, ...ownLevel(name, pkg.version, cwd) };
});

if (!packages.some((entry) => incrementFor(entry))) {
  console.log('Nothing to release: no feat, fix, perf, revert or breaking');
  console.log('commits touch published files since the last release tags,');
  console.log('and no commit has a Release-As footer.');
  process.exit(0);
}

// Decide in dependency order, so a sibling's new version is known before its
// dependents are checked against it
const next = plan(packages);

for (const entry of packages) {
  const { pkg, reasons, ignored, tag } = entry;
  const since = tag ? ` since ${tag}` : '';
  const how = entry.releaseAs ? 'release-as' : entry.level;

  if (incrementFor(entry)) {
    console.log(
      `\n▶ ${pkg.name} ${pkg.version} → ${next.get(pkg.name)} (${how})${since}`
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

const released = [];

for (const entry of packages) {
  const increment = incrementFor(entry);

  if (!increment) continue;

  run([
    'run',
    'release',
    '-w',
    `packages/${entry.name}`,
    '--',
    '--ci',
    '--increment',
    increment,
    '--no-git.push',
    '--no-git.requireUpstream',
    '--no-github.release'
  ]);

  const { version } = JSON.parse(
    readFileSync(new URL('package.json', entry.cwd), 'utf8')
  );

  released.push({
    ...entry,
    version,
    tag: `${SCOPE}/${entry.name}@${version}`
  });
}

// Push main and the new tags in one go, merging in whatever reached main while
// the packages were published.
const tags = released.map(({ tag }) => `refs/tags/${tag}`);
const names = released.map(({ tag }) => tag).join(', ');

for (let attempt = 1; ; attempt++) {
  git(['fetch', 'origin', 'main'], ROOT);

  try {
    git(['merge', '--no-edit', '--signoff', 'origin/main'], ROOT);
  } catch (error) {
    // The versions are already on npm, so keep their release commits: push the
    // tags alone, and leave the merge into main to a person
    git(['merge', '--abort'], ROOT);
    git(['push', 'origin', ...tags], ROOT);
    throw new Error(
      `Published ${names}, but merging origin/main into the release commits conflicts. The tags are pushed: merge the last one into main with a merge commit (not a squash), resolving the conflict.`,
      { cause: error }
    );
  }

  try {
    git(['push', '--atomic', 'origin', 'HEAD:main', ...tags], ROOT);
    break;
  } catch (error) {
    // Main moved again between the fetch and the push: try again, and after
    // three tries keep the release commits by pushing the tags alone
    if (attempt === 3) {
      git(['push', 'origin', ...tags], ROOT);
      throw new Error(
        `Published ${names}, but couldn't push main. The tags are pushed: merge the last one into main with a merge commit (not a squash).`,
        { cause: error }
      );
    }
  }
}

for (const { name, version, tag, cwd } of released) {
  const notes = changelogSection(
    readFileSync(new URL('CHANGELOG.md', cwd), 'utf8'),
    version
  );

  execFileSync(
    'gh',
    [
      'release',
      'create',
      tag,
      '--title',
      tag,
      '--verify-tag',
      '--notes',
      notes ?? `Released ${SCOPE}/${name} ${version}.`
    ],
    { cwd: ROOT, stdio: 'inherit' }
  );
}
