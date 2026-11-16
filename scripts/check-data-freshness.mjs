// Checks the bundled data that goes stale on its own and prints what needs
// refreshing, one problem per line. Exits 1 when there is something to do.
//
// - LEAP_SECONDS in packages/constants/src/date.ts against the IERS table
// - the end of the probe ephemerides in packages/tracking/src/probes/probes-data.ts
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const IERS_LEAP_SECONDS_URL =
  'https://hpiers.obspm.fr/iers/bul/bulc/Leap_Second.dat';

// Regenerating the probe ephemerides takes a release, so warn this far ahead
export const PROBE_WINDOW_WARNING_DAYS = 90;

const DAY_MS = 86_400_000;
const DATE_TS = new URL('../packages/constants/src/date.ts', import.meta.url);
const PROBES_DATA_TS = new URL(
  '../packages/tracking/src/probes/probes-data.ts',
  import.meta.url
);

// The last row of IERS' Leap_Second.dat: `MJD day month year TAI-UTC`
export const lastIersLeapSecond = (text) => {
  const rows = text
    .split('\n')
    .filter((line) => !line.startsWith('#'))
    .map((line) => line.trim().split(/\s+/))
    .filter((cols) => cols.length === 5);
  const last = rows.at(-1);

  if (!last) throw new Error('No leap second rows in the IERS file');

  const [, day, month, year, taiMinusUtc] = last;

  return {
    date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    taiMinusUtc: Number(taiMinusUtc)
  };
};

// The last `['YYYY-MM-DD', n]` row of LEAP_SECONDS
export const lastTableLeapSecond = (source) => {
  const rows = [...source.matchAll(/\['(\d{4}-\d{2}-\d{2})', (\d+)\]/g)];
  const last = rows.at(-1);

  if (!last) throw new Error('No LEAP_SECONDS rows in date.ts');

  return { date: last[1], taiMinusUtc: Number(last[2]) };
};

// The first probe to run out of samples ends the window, so the minimum over
// probes of each probe's last epoch
export const probeWindowEnd = (source) => {
  const probes = source.split(/^ {2}'[a-z0-9-]+': \[$/m).slice(1);

  if (probes.length === 0) throw new Error('No probes in probes-data.ts');

  return new Date(
    Math.min(
      ...probes.map((probe) =>
        Math.max(...[...probe.matchAll(/\[\s*(\d{13}),/g)].map((m) => +m[1]))
      )
    )
  );
};

export const findProblems = ({ iers, table, windowEnd, now }) => {
  const problems = [];

  if (iers.date !== table.date || iers.taiMinusUtc !== table.taiMinusUtc) {
    problems.push(
      `LEAP_SECONDS ends at ${table.date} (${table.taiMinusUtc} s), but IERS lists ${iers.date} (${iers.taiMinusUtc} s). Add the row to packages/constants/src/date.ts and release constants. Source: ${IERS_LEAP_SECONDS_URL}`
    );
  }

  const daysLeft = Math.floor((windowEnd - now) / DAY_MS);

  if (daysLeft < PROBE_WINDOW_WARNING_DAYS) {
    problems.push(
      `The probe ephemerides end on ${windowEnd.toISOString().slice(0, 10)}, ${daysLeft} days from now. Regenerate packages/tracking/src/probes/probes-data.ts from JPL Horizons and release tracking.`
    );
  }

  return problems;
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const response = await fetch(IERS_LEAP_SECONDS_URL, {
    signal: AbortSignal.timeout(30_000)
  });

  if (!response.ok) {
    throw new Error(`${IERS_LEAP_SECONDS_URL}: HTTP ${response.status}`);
  }

  const problems = findProblems({
    iers: lastIersLeapSecond(await response.text()),
    table: lastTableLeapSecond(readFileSync(DATE_TS, 'utf8')),
    windowEnd: probeWindowEnd(readFileSync(PROBES_DATA_TS, 'utf8')),
    now: new Date()
  });

  for (const problem of problems) console.log(`- ${problem}`);

  if (problems.length > 0) process.exit(1);

  console.error('The bundled data is current.');
}
