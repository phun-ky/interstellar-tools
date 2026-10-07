import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const [name, version] = process.argv.slice(2);

for (const dir of readdirSync('../../packages')) {
  const file = `../../packages/${dir}/package.json`;
  const pkg = JSON.parse(readFileSync(file, 'utf8'));

  if (pkg.dependencies?.[name]) {
    pkg.dependencies[name] = `^${version}`;
    writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
  }
}
