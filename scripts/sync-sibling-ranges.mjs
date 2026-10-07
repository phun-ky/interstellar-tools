import semver from 'semver';

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const [name, version] = process.argv.slice(2);

for (const dir of readdirSync('../../packages')) {
  const file = `../../packages/${dir}/package.json`;
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  const range = pkg.dependencies?.[name];

  // Only move ranges the new version falls outside of (e.g. a minor in 0.x),
  // so patch releases don't force dependents to release too
  if (range && !semver.satisfies(version, range)) {
    pkg.dependencies[name] = `^${version}`;
    writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
  }
}
