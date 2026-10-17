import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { after, before, describe, test } from 'node:test';

import { createServer } from '../index.js';

const MU_EARTH = 3.986004418e14; // m³/s²
const R_EARTH = 6_378_137; // m
const approx = (actual: number, expected: number, tol: number) =>
  assert.ok(
    Math.abs(actual - expected) <= tol,
    `expected ${expected} ± ${tol}, got ${actual}`
  );

let client: Client;

const call = async (name: string, args: Record<string, unknown>) => {
  const res = await client.callTool({ name, arguments: args });

  return res as {
    isError?: boolean;
    structuredContent?: Record<string, any>;
    content: { type: string; text?: string }[];
  };
};

before(async () => {
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();

  client = new Client({ name: 'test', version: '0.0.0' });
  await Promise.all([
    createServer().connect(serverTransport),
    client.connect(clientTransport)
  ]);
});

after(async () => {
  await client.close();
});

describe('server info', () => {
  test('reports the package version', () => {
    const { version } = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8')
    );

    assert.equal(client.getServerVersion()?.version, version);
    assert.equal(client.getServerVersion()?.name, 'interstellar-tools');
  });
});

describe('tool listing', () => {
  test('lists the curated tools only', async () => {
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();

    assert.deepEqual(names, [
      'circular_speed',
      'convert_anomaly',
      'convert_time',
      'escape_speed',
      'find_body',
      'gravitational_parameter',
      'hohmann_transfer',
      'kepler_period',
      'peri_apoapsis_radii',
      'plane_change_delta_v',
      'rocket_delta_v',
      'solve_kepler',
      'sphere_of_influence_radius',
      'vis_viva_speed'
    ]);
  });

  test('every tool is annotated read-only and closed-world', async () => {
    const { tools } = await client.listTools();

    for (const tool of tools) {
      assert.equal(tool.annotations?.readOnlyHint, true, tool.name);
      assert.equal(tool.annotations?.openWorldHint, false, tool.name);
    }
  });
});

describe('orbit tools', () => {
  test('circular_speed at LEO', async () => {
    const res = await call('circular_speed', {
      r_m: R_EARTH + 400e3,
      mu_m3_s2: MU_EARTH
    });

    approx(res.structuredContent!.v_m_s, 7668.6, 0.5);
  });

  test('kepler_period of GEO is one sidereal day', async () => {
    const res = await call('kepler_period', {
      a_m: 42_164_000,
      mu_m3_s2: MU_EARTH
    });

    approx(res.structuredContent!.T_s, 86_164, 5);
    approx(res.structuredContent!.T_d, 0.99727, 1e-4);
  });

  test('peri_apoapsis_radii for an ellipse', async () => {
    const res = await call('peri_apoapsis_radii', { a_m: 10_000e3, e: 0.1 });

    assert.deepEqual(res.structuredContent, { rp_m: 9_000e3, ra_m: 11_000e3 });
  });

  test('library errors surface as tool errors', async () => {
    const res = await call('peri_apoapsis_radii', { a_m: 10_000e3, e: 1.5 });

    assert.equal(res.isError, true);
    assert.match(res.content[0]!.text!, /eccentricity/);
  });

  test('schema rejects negative radius', async () => {
    const res = await call('circular_speed', { r_m: -1, mu_m3_s2: MU_EARTH });

    assert.equal(res.isError, true);
  });
});

describe('manoeuvre tools', () => {
  test('hohmann_transfer LEO → GEO', async () => {
    const res = await call('hohmann_transfer', {
      r1_m: 6_678_000,
      r2_m: 42_164_000,
      mu_m3_s2: MU_EARTH
    });
    const out = res.structuredContent!;

    approx(out.dv_total_m_s, 3_893, 5);
    approx(out.t_transfer_d * 24, 5.27, 0.02);
    assert.equal(out.burn1_direction, 'prograde');
    assert.equal(out.burn2_direction, 'prograde');
  });

  test('plane_change_delta_v accepts degrees', async () => {
    const res = await call('plane_change_delta_v', {
      v_m_s: 7_000,
      delta_i: { value: 60, unit: 'deg' }
    });

    approx(res.structuredContent!.dv_m_s, 7_000, 1e-6);
  });

  test('rocket_delta_v', async () => {
    const res = await call('rocket_delta_v', {
      isp_s: 300,
      m0_kg: 1000,
      mf_kg: 1000 / Math.E
    });

    approx(res.structuredContent!.dv_m_s, 300 * 9.80665, 1e-6);
  });
});

describe('anomaly tools', () => {
  test('solve_kepler satisfies M = E − e sin E', async () => {
    const M = 1.2;
    const e = 0.6;
    const res = await call('solve_kepler', {
      M: { value: M, unit: 'rad' },
      e
    });
    const E = res.structuredContent!.E.rad as number;

    approx(E - e * Math.sin(E), M, 1e-9);
  });

  for (const from of ['mean', 'eccentric', 'true'] as const) {
    for (const to of ['mean', 'eccentric', 'true'] as const) {
      test(`convert_anomaly round-trips ${from} → ${to} → ${from}`, async () => {
        const e = 0.3;
        const there = await call('convert_anomaly', {
          from,
          to,
          angle: { value: 100, unit: 'deg' },
          e
        });
        const back = await call('convert_anomaly', {
          from: to,
          to: from,
          angle: { value: there.structuredContent!.angle.rad, unit: 'rad' },
          e
        });

        approx(back.structuredContent!.angle.deg, 100, 1e-6);
      });
    }
  }
});

describe('time tools', () => {
  test('convert_time accepts aliases', async () => {
    const res = await call('convert_time', {
      value: 1,
      from: 'years',
      to: 'days'
    });

    assert.deepEqual(res.structuredContent, { value: 365.25, unit: 'd' });
  });

  test('convert_time rejects unknown units', async () => {
    const res = await call('convert_time', {
      value: 1,
      from: 'fortnights',
      to: 'd'
    });

    assert.equal(res.isError, true);
  });
});

describe('bodies', () => {
  const readJson = async (uri: string) => {
    const [content] = (await client.readResource({ uri })).contents;

    assert.ok(content && 'text' in content, `${uri} has no text content`);

    return JSON.parse(content.text) as { name: string }[];
  };

  test('lists one resource per dataset', async () => {
    const { resources } = await client.listResources();

    assert.ok(
      resources.some((r) => r.uri === 'interstellar://datasets/planets')
    );
    assert.equal(resources.length, 8);
  });

  test('reads a dataset resource', async () => {
    const planets = await readJson('interstellar://datasets/planets');

    assert.equal(planets[0].name, 'Mercury');
  });

  test('stars include Alpha Centauri, bound to its systems', async () => {
    const stars = (await readJson('interstellar://datasets/stars')) as {
      name: string;
      parent?: string;
    }[];

    assert.ok(stars.some((s) => s.name === 'Sun'));
    assert.equal(
      stars.find((s) => s.name === 'Proxima Centauri')?.parent,
      'alpha-centauri'
    );
  });

  test('find_body matches ids', async () => {
    const res = await call('find_body', { query: 'alpha-centauri-ab' });
    const { matches } = res.structuredContent!;

    assert.ok(
      matches.some(
        (m: { dataset: string; body: { id: string } }) =>
          m.dataset === 'systems' && m.body.id === 'alpha-centauri-ab'
      )
    );
  });

  test('find_body is case-insensitive', async () => {
    const res = await call('find_body', { query: 'MARS' });
    const { matches } = res.structuredContent!;

    assert.ok(
      matches.some(
        (m: { dataset: string; body: { name: string } }) =>
          m.dataset === 'planets' && m.body.name === 'Mars'
      )
    );
  });
});
