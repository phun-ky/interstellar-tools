import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import {
  higher,
  incrementFor,
  levelFromCommits,
  levelOf,
  plan,
  releaseAsIn
} from '../release-plan.mjs';

const commit = (subject, body = '') => ({ subject, body });
const entry = (name, version, extra = {}) => ({
  name,
  pkg: { name: `@interstellar-tools/${name}`, version, dependencies: {} },
  level: null,
  reasons: [],
  releaseAs: null,
  ...extra
});

describe('levelOf', () => {
  test('a breaking change is minor below 1.0', () => {
    assert.equal(
      levelOf(commit('feat!: 🎸 Change the API'), '0.61.1'),
      'minor'
    );
    assert.equal(
      levelOf(commit('fix: 🐛 Rename', 'BREAKING CHANGE: renamed'), '0.2.2'),
      'minor'
    );
  });

  test('a breaking change is major from 1.0 on', () => {
    assert.equal(levelOf(commit('feat!: 🎸 Change the API'), '1.0.0'), 'major');
    assert.equal(levelOf(commit('refactor!: 💡 Rename'), '2.3.4'), 'major');
    assert.equal(
      levelOf(commit('fix: 🐛 Rename', 'BREAKING-CHANGE: renamed'), '1.4.0'),
      'major'
    );
  });

  test('feat is minor and fix, perf and revert are patch, at any version', () => {
    for (const version of ['0.61.1', '1.0.0']) {
      assert.equal(levelOf(commit('feat: 🎸 Add'), version), 'minor');
      assert.equal(levelOf(commit('fix(mcp): 🐛 Fix'), version), 'patch');
      assert.equal(levelOf(commit('perf: Faster'), version), 'patch');
      assert.equal(levelOf(commit('revert: Undo'), version), 'patch');
    }
  });

  test('other commits are not released', () => {
    for (const subject of [
      'docs: ✏️ Fix',
      'chore: 🤖 Bump',
      'ci: 🎡 Pin',
      'not conventional'
    ]) {
      assert.equal(levelOf(commit(subject), '1.0.0'), null, subject);
    }
  });

  test('a breaking change in a non-releasable type is still released', () => {
    assert.equal(levelOf(commit('docs!: Remove a page'), '1.0.0'), 'major');
  });
});

describe('levelFromCommits', () => {
  test('takes the highest level and counts the ignored commits', () => {
    const result = levelFromCommits(
      [
        commit('fix: 🐛 One'),
        commit('docs: ✏️ Two'),
        commit('feat!: 🎸 Three'),
        commit('feat: 🎸 Four')
      ],
      '1.2.0'
    );

    assert.equal(result.level, 'major');
    assert.equal(result.ignored, 1);
    assert.deepEqual(result.reasons, [
      'patch: fix: 🐛 One',
      'major: feat!: 🎸 Three',
      'minor: feat: 🎸 Four'
    ]);
  });

  test('is null when nothing is releasable', () => {
    assert.equal(
      levelFromCommits([commit('docs: ✏️ Only docs')], '1.0.0').level,
      null
    );
  });
});

describe('higher', () => {
  test('orders patch < minor < major, and null below all', () => {
    assert.equal(higher('patch', 'minor'), 'minor');
    assert.equal(higher('major', 'minor'), 'major');
    assert.equal(higher(null, 'patch'), 'patch');
    assert.equal(higher('patch', null), 'patch');
  });
});

describe('releaseAsIn', () => {
  test('finds the version for a named package, with or without the scope', () => {
    const body = 'Release-As: types@1.0.0, @interstellar-tools/constants@1.0.0';

    assert.equal(releaseAsIn(body, 'types'), '1.0.0');
    assert.equal(releaseAsIn(body, 'constants'), '1.0.0');
    assert.equal(releaseAsIn(body, 'mcp'), null);
  });

  test('reads several footers, case-insensitively', () => {
    const body = 'Some text\n\nrelease-as: types@1.0.0\nRelease-As: mcp@0.3.0';

    assert.equal(releaseAsIn(body, 'types'), '1.0.0');
    assert.equal(releaseAsIn(body, 'mcp'), '0.3.0');
  });

  test('refuses a bare version, so nothing is released as 1.0 by accident', () => {
    assert.throws(
      () => releaseAsIn('Release-As: 1.0.0', 'types'),
      /doesn't name a package/
    );
  });

  test('refuses an invalid version', () => {
    assert.throws(
      () => releaseAsIn('Release-As: types@one', 'types'),
      /isn't a valid version/
    );
  });

  test('ignores a body without the footer', () => {
    assert.equal(releaseAsIn('feat: 🎸 Add\n\nNo footer here', 'types'), null);
  });
});

describe('plan', () => {
  test('bumps by level', () => {
    const entries = [
      entry('types', '0.61.1', { level: 'minor' }),
      entry('mcp', '1.0.0', { level: 'major' })
    ];

    const next = plan(entries);

    assert.equal(next.get('@interstellar-tools/types'), '0.62.0');
    assert.equal(next.get('@interstellar-tools/mcp'), '2.0.0');
  });

  test('releases the Release-As version, and lets dependents follow it', () => {
    const types = entry('types', '0.61.1', { releaseAs: '1.0.0' });
    const constants = entry('constants', '0.61.2');

    constants.pkg.dependencies = { '@interstellar-tools/types': '^0.61.1' };

    const next = plan([types, constants]);

    assert.equal(next.get('@interstellar-tools/types'), '1.0.0');
    assert.equal(constants.level, 'patch');
    assert.equal(next.get('@interstellar-tools/constants'), '0.61.3');
    assert.deepEqual(types.reasons, ['release-as: 1.0.0']);
    assert.equal(incrementFor(types), '1.0.0');
    assert.equal(incrementFor(constants), 'patch');
  });

  test('refuses a Release-As version no higher than the current one', () => {
    assert.throws(
      () => plan([entry('types', '1.0.0', { releaseAs: '1.0.0' })]),
      /isn't higher/
    );
  });

  test('leaves packages with nothing to release alone', () => {
    const quiet = entry('temporal', '0.60.3');
    const next = plan([quiet]);

    assert.equal(next.has('@interstellar-tools/temporal'), false);
    assert.equal(incrementFor(quiet), null);
  });
});
