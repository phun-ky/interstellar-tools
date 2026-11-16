// Check what npm would publish: pack every package, check each tarball holds
// the files its package.json points at, its LICENSE and README, and no tests,
// lint it with publint and @arethetypeswrong/cli, then install the tarballs
// together in an empty project, check every source map resolves, import each
// package, run a calculation across them, and run every bin. Run after
// `npm run build`.
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PACKAGES_DIR = join(ROOT, 'packages');
const BIN = join(ROOT, 'node_modules', '.bin');
// Holds only types, so its JavaScript exports nothing
const TYPES_ONLY = new Set(['@interstellar-tools/types']);
/** Run a linter; return its output if it fails. */
const lint = (command, args, cwd) => {
  try {
    execFileSync(join(BIN, command), args, {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe'
    });

    return undefined;
  } catch (error) {
    return `${error.stdout ?? ''}${error.stderr ?? ''}`.trim();
  }
};
/** Every .map file under dir. */
const mapsIn = (dir) =>
  readdirSync(dir, { recursive: true })
    .filter((file) => file.endsWith('.map'))
    .map((file) => join(dir, file));
const npm = (args, cwd) =>
  execFileSync('npm', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  });
/** Every file path a package.json points at, without the leading ./ */
const entryPoints = (pkg) => {
  const paths = [];
  const collect = (value) => {
    if (typeof value === 'string') paths.push(value);
    else if (value && typeof value === 'object')
      Object.values(value).forEach(collect);
  };

  collect(pkg.exports);
  collect(pkg.main);
  collect(pkg.types);
  collect(pkg.bin);

  return paths.map((path) => path.replace(/^\.\//, ''));
};
const work = mkdtempSync(join(tmpdir(), 'interstellar-tools-pack-'));
const problems = [];
const tarballs = [];
const names = [];
const bins = [];

try {
  for (const dir of readdirSync(PACKAGES_DIR)) {
    const cwd = join(PACKAGES_DIR, dir);
    const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
    const output = JSON.parse(
      npm(['pack', '--json', '--pack-destination', work], cwd)
    );
    // An array in npm 11, an object keyed by package name in a workspace in npm 12
    const packed = Array.isArray(output) ? output[0] : Object.values(output)[0];
    const files = new Set(packed.files.map((file) => file.path));

    // npm adds LICENSE and README.md on its own, if the package has them
    for (const path of [
      ...entryPoints(pkg),
      'LICENSE',
      'README.md',
      'CHANGELOG.md'
    ]) {
      if (!files.has(path))
        problems.push(`${pkg.name}: ${path} is not in the tarball`);
    }

    for (const path of files) {
      if (/(^|\/)__tests__\/|\.tsbuildinfo$/.test(path)) {
        problems.push(`${pkg.name}: ${path} should not be published`);
      }
    }

    const tarball = join(work, packed.filename);
    // ESM only on purpose, so CommonJS callers needing import() is expected
    const types = lint('attw', [tarball, '--profile', 'esm-only'], cwd);
    const publint = lint('publint', ['--strict'], cwd);

    if (types) problems.push(`${pkg.name}: @arethetypeswrong/cli:\n${types}`);

    if (publint) problems.push(`${pkg.name}: publint:\n${publint}`);

    tarballs.push(tarball);
    names.push(pkg.name);
    bins.push(...Object.keys(pkg.bin ?? {}));
    console.log(
      `${pkg.name}@${pkg.version}: ${files.size} files, ${packed.size} bytes`
    );
  }

  if (problems.length === 0) {
    const app = join(work, 'app');

    mkdirSync(app);
    writeFileSync(
      join(app, 'package.json'),
      '{ "name": "app", "private": true, "type": "module" }\n'
    );
    // Registry dependencies (the MCP SDK, zod) come from npm's cache after npm ci
    npm(
      [
        'install',
        '--no-audit',
        '--no-fund',
        '--ignore-scripts',
        '--prefer-offline',
        ...tarballs
      ],
      app
    );

    // Every source map must point at files that were published with it
    for (const name of names) {
      const installed = join(app, 'node_modules', name);

      for (const map of mapsIn(installed)) {
        for (const source of JSON.parse(readFileSync(map, 'utf8')).sources) {
          if (!existsSync(join(dirname(map), source))) {
            problems.push(
              `${name}: ${relative(installed, map)} points at ${source}, which isn't published`
            );
          }
        }
      }
    }

    // Import every package, and run a calculation through equations
    const smoke = `
      const names = ${JSON.stringify(names)};
      const typesOnly = ${JSON.stringify([...TYPES_ONLY])};
      for (const name of names) {
        const exported = Object.keys(await import(name));
        if (exported.length === 0 && !typesOnly.includes(name))
          throw new Error(name + ' exports nothing');
        console.log(name + ': ' + exported.length + ' exports');
      }
      const { escapeSpeed } = await import('@interstellar-tools/equations');
      const v = escapeSpeed(6.371e6, 3.986004418e14);
      if (Math.abs(v - 11186) > 1) throw new Error('escapeSpeed gave ' + v);
      console.log('equations ran: escape speed at Earth = ' + Math.round(v) + ' m/s');
    `;

    try {
      execFileSync('node', ['--input-type=module', '-e', smoke], {
        cwd: app,
        stdio: 'inherit'
      });
    } catch {
      problems.push('the installed tarballs could not be imported or run');
    }

    for (const bin of bins) {
      try {
        const help = execFileSync(
          join(app, 'node_modules', '.bin', bin),
          ['--help'],
          { cwd: app, encoding: 'utf8', timeout: 30_000 }
        );

        if (!help.includes(`Usage: ${bin}`))
          problems.push(`${bin} --help printed no usage line`);
        else console.log(`${bin} --help ran`);
      } catch (error) {
        problems.push(`${bin} --help failed: ${error.message}`);
      }
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (problems.length > 0) {
  console.error('\nThe packages would not publish correctly:\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error(
    '\nCheck "files" in package.json, and run npm run build first.'
  );
  process.exit(1);
}

console.log(`\nAll ${names.length} packages pack, install and import.`);
