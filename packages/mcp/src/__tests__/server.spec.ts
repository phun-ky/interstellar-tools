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
      'body_fixed_to_geodetic',
      'circular_speed',
      'convert_anomaly',
      'convert_distance',
      'convert_time',
      'elements_to_state',
      'escape_speed',
      'find_body',
      'geodetic_to_body_fixed',
      'gravitational_parameter',
      'great_circle_distance',
      'hohmann_transfer',
      'horizon_distance',
      'hyperbolic_departure',
      'kepler_period',
      'lagrange_points',
      'look_angles',
      'peri_apoapsis_radii',
      'plane_change_delta_v',
      'probe_position',
      'project_point',
      'rocket_delta_v',
      'satellite_passes',
      'satellite_position',
      'solve_kepler',
      'solve_lambert',
      'sphere_of_influence_radius',
      'state_to_elements',
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

describe('transfer tools', () => {
  test('solve_lambert matches Curtis, Example 5.2', async () => {
    const res = await call('solve_lambert', {
      r1_m: [5_000_000, 10_000_000, 2_100_000],
      r2_m: [-14_600_000, 2_500_000, 7_000_000],
      dt_s: 3600,
      mu_m3_s2: 3.986e14
    });
    const { v1_m_s, v2_m_s, speed1_m_s } = res.structuredContent!;
    const book1 = [-5992.5, 1925.4, 3245.6];
    const book2 = [-3312.5, -4196.6, -385.29];

    for (let i = 0; i < 3; i++) {
      approx(v1_m_s[i], book1[i]!, 0.1);
      approx(v2_m_s[i], book2[i]!, 0.1);
    }

    approx(speed1_m_s, Math.hypot(...book1), 0.1);
  });

  test('solve_lambert goes the other way round with prograde: false', async () => {
    const args = {
      r1_m: [7e6, 0, 0],
      r2_m: [0, 9e6, 0],
      dt_s: 20_000,
      mu_m3_s2: MU_EARTH
    };
    const pro = (await call('solve_lambert', args)).structuredContent!;
    const retro = (await call('solve_lambert', { ...args, prograde: false }))
      .structuredContent!;

    assert.ok(pro.v1_m_s[1] > 0);
    assert.ok(retro.v1_m_s[1] < 0);
  });

  test('solve_lambert reports a 180° transfer as an error', async () => {
    const res = await call('solve_lambert', {
      r1_m: [7e6, 0, 0],
      r2_m: [-9e6, 0, 0],
      dt_s: 3600,
      mu_m3_s2: MU_EARTH
    });

    assert.equal(res.isError, true);
    assert.match(res.content[0]!.text!, /180°/);
  });

  test('hyperbolic_departure from LEO at v∞ 3 km/s', async () => {
    const rp = R_EARTH + 300e3;
    const res = await call('hyperbolic_departure', {
      v_inf_m_s: 3000,
      rp_m: rp,
      mu_m3_s2: MU_EARTH
    });
    const out = res.structuredContent!;
    const vp = Math.sqrt(3000 ** 2 + (2 * MU_EARTH) / rp);

    approx(out.vp_m_s, vp, 1e-6);
    approx(out.v_circular_m_s, Math.sqrt(MU_EARTH / rp), 1e-6);
    approx(out.dv_m_s, vp - Math.sqrt(MU_EARTH / rp), 1e-6);
    approx(out.c3_m2_s2, 9e6, 1e-6);
    approx(out.e, 1 + (rp * 3000 ** 2) / MU_EARTH, 1e-12);
  });
});

describe('state vector tools', () => {
  const elements = {
    a_m: 8_000_000,
    e: 0.1,
    i: { value: 30, unit: 'deg' },
    raan: { value: 40, unit: 'deg' },
    argp: { value: 60, unit: 'deg' },
    nu: { value: 20, unit: 'deg' },
    mu_m3_s2: MU_EARTH
  };

  test('elements_to_state and state_to_elements round-trip', async () => {
    const state = (await call('elements_to_state', elements))
      .structuredContent!;
    const back = (
      await call('state_to_elements', {
        r_m: state.r_m,
        v_m_s: state.v_m_s,
        mu_m3_s2: MU_EARTH
      })
    ).structuredContent!;

    approx(back.a_m, 8_000_000, 1e-3);
    approx(back.e, 0.1, 1e-12);

    for (const key of ['i', 'raan', 'argp', 'nu'] as const)
      approx(back[key].deg, elements[key].value, 1e-9);

    approx(back.rp_m, 7_200_000, 1e-3);
    approx(back.energy_m2_s2, -MU_EARTH / 16e6, 1e-6);
    approx(back.T_s, 2 * Math.PI * Math.sqrt(8e6 ** 3 / MU_EARTH), 1e-6);
  });

  test('state_to_elements gives no period for a hyperbola', async () => {
    const r = R_EARTH + 300e3;
    const res = await call('state_to_elements', {
      r_m: [r, 0, 0],
      v_m_s: [0, 12_000, 0],
      mu_m3_s2: MU_EARTH
    });
    const out = res.structuredContent!;

    assert.ok(out.e > 1);
    assert.ok(out.a_m < 0);
    approx(out.rp_m, r, 1e-3);
    assert.equal(out.T_s, undefined);
  });

  test('elements_to_state rejects a parabola', async () => {
    const res = await call('elements_to_state', { ...elements, e: 1 });

    assert.equal(res.isError, true);
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

describe('distance tools', () => {
  test('convert_distance turns au into metres', async () => {
    const res = await call('convert_distance', {
      value: 1,
      from: 'au',
      to: 'm'
    });

    assert.deepEqual(res.structuredContent, {
      value: 149_597_870_700,
      unit: 'm'
    });
  });

  test('convert_distance accepts aliases and returns the canonical unit', async () => {
    const res = await call('convert_distance', {
      value: 1,
      from: 'parsecs',
      to: 'light-years'
    });

    approx(res.structuredContent!.value, 3.2615637771674333, 1e-12);
    assert.equal(res.structuredContent!.unit, 'ly');
  });

  test('convert_distance rejects unknown units', async () => {
    for (const [from, to] of [
      ['miles', 'km'],
      ['km', 'toString']
    ]) {
      const res = await call('convert_distance', { value: 1, from, to });

      assert.equal(res.isError, true, `${from} → ${to}`);
    }
  });
});

const deg = (value: number) => ({ value, unit: 'deg' });

describe('geodesy tools', () => {
  test('great_circle_distance on Mars, from the landing site tutorial', async () => {
    const res = await call('great_circle_distance', {
      from_latitude: deg(18.464557),
      from_longitude: deg(77.422182),
      to_latitude: deg(18.464217),
      to_longitude: deg(77.423241),
      body: 'mars'
    });

    approx(res.structuredContent!.radius_m, 3389.5e3, 1e-6);
    assert.equal(res.structuredContent!.distance_m.toFixed(1), '62.7');
  });

  test('great_circle_distance over a quarter of a sphere', async () => {
    const res = await call('great_circle_distance', {
      from_latitude: deg(0),
      from_longitude: deg(0),
      to_latitude: deg(0),
      to_longitude: deg(90),
      radius_m: 1000
    });

    approx(res.structuredContent!.distance_m, 500 * Math.PI, 1e-9);
    approx(res.structuredContent!.central_angle.deg, 90, 1e-12);
  });

  test('takes either a body or a radius', async () => {
    const points = {
      from_latitude: deg(0),
      from_longitude: deg(0),
      to_latitude: deg(10),
      to_longitude: deg(10)
    };
    const both = await call('great_circle_distance', {
      ...points,
      body: 'earth',
      radius_m: 1000
    });
    const neither = await call('great_circle_distance', points);
    const unknown = await call('great_circle_distance', {
      ...points,
      body: 'vulcan'
    });

    assert.equal(both.isError, true);
    assert.equal(neither.isError, true);
    assert.equal(unknown.isError, true);
    assert.match(unknown.content[0]!.text!, /Unknown body: vulcan/);
  });

  test('horizon_distance for a 1.7 m observer on Earth', async () => {
    const R = 6_371_008.4;
    const res = await call('horizon_distance', {
      height_m: 1.7,
      body: 'earth'
    });

    approx(res.structuredContent!.radius_m, R, 1e-6);
    approx(
      res.structuredContent!.distance_m,
      Math.sqrt(2 * R * 1.7 + 1.7 ** 2),
      1e-6
    );
    approx(
      res.structuredContent!.surface_distance_m,
      R * Math.acos(R / (R + 1.7)),
      1e-6
    );
  });

  test('geodetic_to_body_fixed on WGS 84', async () => {
    const equator = await call('geodetic_to_body_fixed', {
      latitude: deg(0),
      longitude: deg(0),
      height_m: 0,
      body: 'wgs84'
    });
    const pole = await call('geodetic_to_body_fixed', {
      latitude: deg(90),
      longitude: deg(0),
      height_m: 100,
      body: 'wgs84'
    });
    const c = 6_378_137 * (1 - 1 / 298.257223563);

    assert.deepEqual(equator.structuredContent!.r_m, [R_EARTH, 0, 0]);
    approx(pole.structuredContent!.r_m[2], c + 100, 1e-6);
    approx(pole.structuredContent!.polar_radius_m, c, 1e-9);
  });

  test('body_fixed_to_geodetic undoes geodetic_to_body_fixed', async () => {
    const point = {
      latitude: deg(59.9139),
      longitude: deg(10.7522),
      height_m: 23
    };
    const shape = { equatorial_radius_m: 3_396_190, polar_radius_m: 3_376_200 };
    const forward = await call('geodetic_to_body_fixed', {
      ...point,
      ...shape
    });
    const back = await call('body_fixed_to_geodetic', {
      r_m: forward.structuredContent!.r_m,
      ...shape
    });

    approx(back.structuredContent!.latitude.deg, 59.9139, 1e-9);
    approx(back.structuredContent!.longitude.deg, 10.7522, 1e-9);
    approx(back.structuredContent!.height_m, 23, 1e-6);
  });

  test('rejects a triaxial moon and a prolate ellipsoid', async () => {
    const point = { latitude: deg(0), longitude: deg(0), height_m: 0 };
    const phobos = await call('geodetic_to_body_fixed', {
      ...point,
      body: 'phobos'
    });
    const prolate = await call('geodetic_to_body_fixed', {
      ...point,
      equatorial_radius_m: 1000,
      polar_radius_m: 2000
    });

    assert.equal(phobos.isError, true);
    assert.match(phobos.content[0]!.text!, /triaxial/);
    assert.equal(prolate.isError, true);
    assert.match(prolate.content[0]!.text!, /no larger/);
  });
});

describe('map tools', () => {
  test('project_point on Mercator', async () => {
    const res = await call('project_point', {
      projection: 'mercator',
      latitude: deg(0),
      longitude: deg(90),
      radius_m: 1000
    });

    approx(res.structuredContent!.x_m, 500 * Math.PI, 1e-9);
    approx(res.structuredContent!.y_m, 0, 1e-9);
  });

  test('project_point on equirectangular with a standard parallel', async () => {
    const res = await call('project_point', {
      projection: 'equirectangular',
      latitude: deg(30),
      longitude: deg(90),
      radius_m: 1000,
      standard_parallel: deg(60)
    });

    approx(res.structuredContent!.x_m, 250 * Math.PI, 1e-9);
    approx(res.structuredContent!.y_m, (1000 * Math.PI) / 6, 1e-9);
  });

  test('project_point on a polar stereographic map', async () => {
    const res = await call('project_point', {
      projection: 'stereographic',
      latitude: deg(90),
      longitude: deg(0),
      body: 'moon',
      center_latitude: deg(90)
    });

    approx(res.structuredContent!.x_m, 0, 1e-6);
    approx(res.structuredContent!.y_m, 0, 1e-6);
    approx(res.structuredContent!.radius_m, 1737.4e3, 1e-6);
  });

  test('project_point rejects options a projection lacks', async () => {
    const point = { latitude: deg(10), longitude: deg(10), radius_m: 1000 };
    const centred = await call('project_point', {
      ...point,
      projection: 'mercator',
      center_latitude: deg(45)
    });
    const parallel = await call('project_point', {
      ...point,
      projection: 'stereographic',
      standard_parallel: deg(45)
    });
    const pole = await call('project_point', {
      projection: 'mercator',
      latitude: deg(90),
      longitude: deg(0),
      radius_m: 1000
    });

    assert.equal(centred.isError, true);
    assert.equal(parallel.isError, true);
    assert.equal(pole.isError, true);
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
    // The nine body datasets, the satellites and the probes
    assert.equal(resources.length, 11);
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

  test('reads the interstellar objects, on open orbits', async () => {
    const objects = (await readJson(
      'interstellar://datasets/interstellar-objects'
    )) as {
      name: string;
      designation: string;
      orbit: { e: number; period?: unknown; periapsisTime: string };
    }[];

    assert.deepEqual(
      objects.map(({ designation }) => designation),
      ['1I/2017 U1', '2I/2019 Q4', '3I/2025 N1']
    );

    for (const { orbit } of objects) {
      assert.ok(orbit.e > 1);
      assert.equal(orbit.period, undefined);
    }

    assert.equal(objects[0]!.orbit.periapsisTime, '2017-09-09T11:51:02.065Z');
  });

  test('find_body finds ʻOumuamua without its ʻokina', async () => {
    const res = await call('find_body', { query: 'oumuamua' });
    const { matches } = res.structuredContent!;

    assert.deepEqual(
      matches.map(
        (m: { dataset: string; body: { id: string } }) =>
          `${m.dataset}/${m.body.id}`
      ),
      ['interstellar-objects/1i-oumuamua']
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

describe('tracking tools', () => {
  const read = async (uri: string) => {
    const [content] = (await client.readResource({ uri })).contents;

    assert.ok(content && 'text' in content, `${uri} has no text content`);

    return JSON.parse(content.text);
  };
  const nairobi = {
    latitude: { value: -1.2864, unit: 'deg' },
    longitude: { value: 36.8172, unit: 'deg' },
    height_m: 1795
  };
  const oldTle = [
    '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
    '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
  ];

  test('satellite_position puts the ISS where the tracking guide does', async () => {
    const res = await call('satellite_position', {
      satellite: 'iss',
      time: '2026-11-05T00:00:00Z'
    });
    const out = res.structuredContent!;

    approx(out.latitude.deg, -51.01, 0.005);
    approx(out.longitude.deg, -157.48, 0.005);
    approx(out.height_m, 434_959, 1);
    approx(out.speed_m_s, 7660, 20);
    approx(out.elements_age_d, 0.1144, 0.0001);
    assert.equal(out.epoch_utc, '2026-11-04T21:15:15.205Z');
    assert.equal(out.name, 'ISS (ZARYA)');
    assert.ok(['sunlit', 'penumbra', 'umbra'].includes(out.shadow));
  });

  test('satellite_position takes a TLE or an OMM record, and agrees', async () => {
    const time = '2026-11-05T00:00:00Z';
    const fromTle = (await call('satellite_position', { tle: oldTle, time }))
      .structuredContent!;
    const omm = (await read('interstellar://tracking/satellites')).find(
      (entry: { id: string }) => entry.id === 'iss'
    ).omm;
    const fromOmm = (await call('satellite_position', { omm, time }))
      .structuredContent!;
    const fromId = (
      await call('satellite_position', { satellite: 'iss', time })
    ).structuredContent!;

    assert.deepEqual(fromOmm.position_teme_m, fromId.position_teme_m);
    // Two element sets 12 hours apart, within a kilometre of each other
    const apart = Math.hypot(
      ...fromTle.position_teme_m.map(
        (x: number, k: number) => x - fromId.position_teme_m[k]
      )
    );

    assert.ok(apart < 1000, `${apart} m`);
  });

  test('satellite_position rejects missing, doubled or unknown elements', async () => {
    const time = '2026-11-05T00:00:00Z';

    for (const [args, message] of [
      [{ time }, /exactly one way/],
      [{ satellite: 'iss', tle: oldTle, time }, /exactly one way/],
      [{ satellite: 'mir', time }, /Unknown satellite: mir/],
      [{ satellite: 'iss', time: 'yesterday' }, /ISO 8601/]
    ] as const) {
      const res = await call('satellite_position', args);

      assert.equal(res.isError, true, JSON.stringify(args));
      assert.match(res.content[0]!.text!, message);
    }
  });

  test('look_angles from Nairobi as the ISS passes overhead', async () => {
    const res = await call('look_angles', {
      satellite: 'iss',
      observer: nairobi,
      time: '2026-11-05T15:49:32.177Z',
      frequency_hz: 145_800_000
    });
    const out = res.structuredContent!;

    approx(out.elevation.deg, 88.8, 0.05);
    approx(out.range_m, 413_000, 1000);
    assert.equal(out.above_horizon, true);
    // At the top of the pass, neither approaching nor leaving
    approx(out.range_rate_m_s, 0, 50);
    approx(out.doppler_shift_hz, 0, 30);
  });

  test('satellite_passes finds three visible of eight over Nairobi', async () => {
    const res = await call('satellite_passes', {
      satellite: 'iss',
      observer: nairobi,
      from: '2026-11-04T21:15:15.205Z',
      to: '2026-11-07T21:15:15.205Z',
      min_elevation: { value: 10, unit: 'deg' }
    });
    const out = res.structuredContent!;
    const best = out.passes.find((pass: { visible: boolean }) => pass.visible);

    assert.equal(out.count, 8);
    assert.equal(out.visible_count, 3);
    assert.equal(best.rise_utc, '2026-11-05T15:46:12.996Z');
    approx(best.max_elevation.deg, 88.8, 0.05);
  });

  test('satellite_passes rejects a window longer than 14 days', async () => {
    const res = await call('satellite_passes', {
      satellite: 'iss',
      observer: nairobi,
      from: '2026-11-04T00:00:00Z',
      to: '2026-11-20T00:00:00Z'
    });

    assert.equal(res.isError, true);
    assert.match(res.content[0]!.text!, /at most 14 days/);
  });

  test('probe_position puts Voyager 1 172 au out', async () => {
    const res = await call('probe_position', {
      probe: 'voyager-1',
      time: '2026-11-05T00:00:00Z'
    });
    const out = res.structuredContent!;

    approx(out.distance_au, 172.26, 0.005);
    approx(out.light_time_s / 3600, 23.88, 0.005);
    approx(out.speed_m_s, 16_920, 10);
    assert.equal(out.horizons_id, '-31');
    assert.equal(out.near, 'sun');
  });

  test('probe_position rejects a time outside the ephemeris', async () => {
    const res = await call('probe_position', {
      probe: 'jwst',
      time: '2030-01-01T00:00:00Z'
    });

    assert.equal(res.isError, true);
  });

  test('lagrange_points from mu values, as the tracking guide gives them', async () => {
    const res = await call('lagrange_points', {
      primary_mu_m3_s2: 1.32712440041e20,
      secondary_mu_m3_s2: 4.0350323e14,
      separation_m: 1.495978707e11
    });
    const out = res.structuredContent!;

    approx(out.l1_from_secondary_m / 1000, 1_497_621, 1);
    approx(out.l2_from_secondary_m / 1000, 1_507_683, 1);
    assert.equal(out.trojan_points_stable, true);
    approx(out.l4_m[1], (Math.sqrt(3) / 2) * 1.495978707e11, 1);
  });

  test('lagrange_points from body ids, with the separation from the datasets', async () => {
    const earthMoon = (
      await call('lagrange_points', { primary: 'earth', secondary: 'moon' })
    ).structuredContent!;
    const sunJupiter = (
      await call('lagrange_points', { primary: 'sun', secondary: 'jupiter' })
    ).structuredContent!;

    // The Moon's semi-major axis in the datasets, 0.00257 au
    approx(earthMoon.separation_m, 0.00257 * 1.495978707e11, 1);
    approx(earthMoon.l1_from_secondary_m / 1000, 58_100, 500);
    approx(earthMoon.mass_ratio, 0.01215, 0.00001);
    assert.equal(sunJupiter.trojan_points_stable, true);
    approx(sunJupiter.hill_sphere_radius_m / 1.495978707e11, 0.338, 0.001);
  });

  test('lagrange_points rejects unknown bodies and a missing separation', async () => {
    for (const [args, message] of [
      [{ primary: 'vulcan', secondary: 'earth' }, /Unknown body: vulcan/],
      [{ primary: 'sun', primary_mu_m3_s2: 1, secondary: 'earth' }, /not both/],
      [{ primary: 'earth', secondary: 'jupiter' }, /Give separation_m/],
      [
        { primary_mu_m3_s2: 1, secondary_mu_m3_s2: 2, separation_m: 1 },
        /smaller body/
      ]
    ] as const) {
      const res = await call('lagrange_points', args);

      assert.equal(res.isError, true, JSON.stringify(args));
      assert.match(res.content[0]!.text!, message);
    }
  });

  test('reads the satellites and probes resources', async () => {
    const satellites = await read('interstellar://tracking/satellites');
    const probes = await read('interstellar://tracking/probes');

    assert.equal(satellites.length, 12);
    assert.equal(probes.length, 13);
    assert.equal(
      probes.find((probe: { id: string }) => probe.id === 'jwst').near,
      'sun-earth-l2'
    );
    assert.ok(!('ephemeris' in probes[0]));
    assert.equal(probes[0].ephemeris_from_utc, '2026-10-31T23:58:50.817Z');
  });
});
