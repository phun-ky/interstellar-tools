// Renders the release banners for a major release into docs/public/images, in
// the Mission Control style of the other images there: four formats (banner,
// og, square, portrait), each at 1x and 2x.
//
// Usage: node scripts/banners/render.mjs <release>   e.g. 1.0
// The content is in scripts/banners/<release>.mjs. Rendering uses a local
// Chrome or Chromium (CHROME=/path/to/chrome to choose one) and the IBM Plex
// fonts installed through Fontsource, so nothing is fetched from the network.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const OUT = join(ROOT, 'docs/public/images');
const CHROME = process.env.CHROME ?? 'google-chrome';
const FORMATS = [
  { suffix: '', width: 1200, height: 600, layout: 'wide' },
  { suffix: '-og', width: 1200, height: 630, layout: 'wide' },
  { suffix: '-square', width: 1080, height: 1080, layout: 'tall' },
  { suffix: '-portrait', width: 1080, height: 1350, layout: 'tall' }
];
const SCALES = [1, 2];
const release = process.argv[2];

if (!release) {
  console.error('Usage: node scripts/banners/render.mjs <release>, e.g. 1.0');
  process.exit(1);
}

const { default: content } = await import(
  pathToFileURL(join(ROOT, `scripts/banners/${release}.mjs`)).href
);
const escape = (text) =>
  String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const font = (file) =>
  pathToFileURL(join(ROOT, 'node_modules/@fontsource', file)).href;
const title = content.title
  .map((part) =>
    typeof part === 'string'
      ? escape(part)
      : `<span class="accent">${escape(part.accent)}</span>`
  )
  .join(' ');
const panels = content.panels
  .map(
    (panel, index) => `
    <section class="panel panel-${index}${panel.mono ? ' mono-rows' : ''}">
      <header><span>${escape(panel.label)}</span><b>${escape(panel.status)}</b></header>
      ${panel.rows
        .map(
          (row) =>
            `<div class="row"><span>${escape(row.text)}</span>${
              row.chip
                ? `<i class="chip">${escape(row.chip)}</i>`
                : row.value
                  ? `<em>${escape(row.value)}</em>`
                  : ''
            }</div>`
        )
        .join('')}
    </section>`
  )
  .join('');
const page = (layout) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: Plex; font-weight: 400; src: url(${font('ibm-plex-sans-condensed/files/ibm-plex-sans-condensed-latin-400-normal.woff2')}); }
@font-face { font-family: Plex; font-weight: 700; src: url(${font('ibm-plex-sans-condensed/files/ibm-plex-sans-condensed-latin-700-normal.woff2')}); }
@font-face { font-family: PlexMono; font-weight: 500; src: url(${font('ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')}); }
@font-face { font-family: PlexMono; font-weight: 600; src: url(${font('ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2')}); }
:root { --bg: #0b1016; --bg-2: #0f1720; --line: rgba(71, 184, 190, 0.22); --text: #dfe9ee;
  --muted: #8ea2ad; --teal: #47b8be; --amber: #ffb547; --green: #6be3a1; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 100%; height: 100%; }
body { position: relative; overflow: hidden; color: var(--text); font-family: Plex, sans-serif;
  background:
    radial-gradient(circle at 100% 100%, rgba(71, 184, 190, 0.16), transparent 42%),
    radial-gradient(circle at 92% 0%, rgba(255, 181, 71, 0.07), transparent 38%),
    linear-gradient(rgba(71, 184, 190, 0.07) 1px, transparent 1px) 0 0 / 40px 40px,
    linear-gradient(90deg, rgba(71, 184, 190, 0.07) 1px, transparent 1px) 0 0 / 40px 40px,
    var(--bg); }
.pill { position: absolute; display: inline-flex; align-items: center; gap: 14px;
  padding: 14px 26px; border: 1px solid var(--line); border-radius: 999px;
  background: rgba(15, 23, 32, 0.8); font: 600 17px PlexMono, monospace;
  letter-spacing: 0.2em; text-transform: uppercase; }
.pill::before { content: ''; width: 9px; height: 9px; border-radius: 50%;
  background: var(--green); box-shadow: 0 0 10px var(--green); }
.kicker { position: absolute; color: var(--amber); font: 600 19px PlexMono, monospace;
  letter-spacing: 0.24em; text-transform: uppercase; }
h1 { position: absolute; font-weight: 700; line-height: 0.98; text-transform: uppercase;
  letter-spacing: -0.01em; }
.accent { color: var(--teal); }
p { position: absolute; color: var(--muted); line-height: 1.55; }
.panel { position: absolute; padding: 26px 30px 14px; border: 1px solid var(--line);
  background: rgba(15, 23, 32, 0.94); box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45); }
.panel::before, .panel::after { content: ''; position: absolute; width: 22px; height: 22px;
  border-color: var(--teal); border-style: solid; }
.panel::before { top: -6px; left: -6px; border-width: 2px 0 0 2px; }
.panel::after { bottom: -6px; right: -6px; border-width: 0 2px 2px 0; }
.panel header { display: flex; justify-content: space-between; padding-bottom: 16px;
  border-bottom: 1px solid var(--line); font: 500 15px PlexMono, monospace;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); }
.panel header b { color: var(--amber); font-weight: 600; }
.row { display: flex; align-items: center; justify-content: space-between; gap: 18px;
  padding: 15px 0; font-size: 22px; color: #c3d3da; }
.row + .row { border-top: 1px solid rgba(71, 184, 190, 0.12); }
.mono-rows .row { font: 500 17px PlexMono, monospace; }
.row em { font: 600 17px PlexMono, monospace; font-style: normal; color: var(--text); }
.chip { display: inline-flex; align-items: center; gap: 9px; padding: 6px 12px;
  border: 1.5px solid var(--green); color: var(--green); font: 600 15px PlexMono, monospace;
  font-style: normal; letter-spacing: 0.12em; white-space: nowrap; }
.chip::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: var(--green); }
/* wide: text left, panels right */
.wide .pill { top: 64px; left: 72px; }
.wide .kicker { top: 178px; left: 72px; }
.wide h1 { top: 214px; left: 72px; width: 560px; font-size: 62px; }
.wide p { bottom: 70px; left: 72px; width: 560px; font-size: 21px; }
.wide .panel { width: 470px; }
.wide .panel-0 { top: 84px; right: 72px; transform: rotate(2deg); }
.wide .panel-1 { top: 280px; right: 96px; transform: rotate(-1.5deg); }
.og .wide .panel-1 { top: 296px; }
/* tall: text on top, panels below */
.tall .pill { top: 80px; left: 72px; }
.tall .kicker { top: 200px; left: 72px; font-size: 22px; }
.tall h1 { top: 250px; left: 72px; width: 936px; font-size: 96px; }
.tall p { top: 500px; left: 72px; width: 900px; font-size: 27px; }
.tall .panel { width: 690px; }
.tall .panel-0 { top: 690px; left: 196px; transform: rotate(1.5deg); }
.tall .panel-1 { top: 935px; left: 140px; transform: rotate(-1deg); }
.square .tall h1 { font-size: 86px; }
.square .tall p { top: 445px; }
.square .tall .row { padding: 11px 0; }
.square .tall .panel-0 { top: 585px; }
.square .tall .panel-1 { top: 805px; }
</style></head>
<body><main class="${layout}">
  <div class="pill">${escape(content.pill)}</div>
  <div class="kicker">${escape(content.kicker)}</div>
  <h1>${title}</h1>
  <p>${escape(content.body)}</p>
  ${panels}
</main></body></html>`;
const dir = mkdtempSync(join(tmpdir(), 'banners-'));

try {
  for (const { suffix, width, height, layout } of FORMATS) {
    const file = join(dir, `${suffix || 'banner'}.html`);

    writeFileSync(
      file,
      page(layout).replace('<body>', `<body class="${suffix.slice(1)}">`)
    );

    for (const scale of SCALES) {
      const name = `interstellar-tools-${content.slug}${suffix}${scale === 2 ? '@2x' : ''}.png`;

      execFileSync(
        CHROME,
        [
          '--headless=new',
          '--disable-gpu',
          '--hide-scrollbars',
          '--allow-file-access-from-files',
          `--force-device-scale-factor=${scale}`,
          `--window-size=${width},${height}`,
          `--screenshot=${join(OUT, name)}`,
          pathToFileURL(file).href
        ],
        { stdio: 'ignore' }
      );
      console.log(`Wrote docs/public/images/${name}`);
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
