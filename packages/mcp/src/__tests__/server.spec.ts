import { quadkey, tileAt } from '@interstellar-tools/maps';
import type { Radians } from '@interstellar-tools/types';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- tool outputs mix numbers, strings and vectors
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
      'camera_ground_resolution',
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
      'illumination_geometry',
      'kepler_period',
      'lagrange_points',
      'landing_stability',
      'look_angles',
      'peri_apoapsis_radii',
      'plane_change_delta_v',
      'probe_position',
      'project_point',
      'propagate_state',
      'rocket_delta_v',
      'safe_landing_map',
      'satellite_passes',
      'satellite_position',
      'solve_kepler',
      'solve_lambert',
      'sphere_of_influence_radius',
      'state_to_elements',
      'terrain_at_cell',
      'terrain_layer',
      'tile_for_point',
      'tile_info',
      'unproject_point',
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

  test('elements_to_state and state_to_elements round-trip a parabola', async () => {
    const { a_m: _, ...rest } = elements;
    const rp = 7_000_000;
    const state = (await call('elements_to_state', { ...rest, e: 1, rp_m: rp }))
      .structuredContent!;
    const back = (
      await call('state_to_elements', {
        r_m: state.r_m,
        v_m_s: state.v_m_s,
        mu_m3_s2: MU_EARTH
      })
    ).structuredContent!;

    approx(back.e, 1, 1e-12);
    approx(back.rp_m, rp, 1e-3);
    approx(back.energy_m2_s2, 0, 1);
    assert.equal(back.T_s, undefined);

    for (const key of ['i', 'raan', 'argp', 'nu'] as const)
      approx(back[key].deg, rest[key].value, 1e-9);
  });

  test('elements_to_state takes rp_m for an ellipse too', async () => {
    const { a_m: _, ...rest } = elements;
    const viaA = (await call('elements_to_state', elements)).structuredContent!;
    const viaRp = (
      await call('elements_to_state', { ...rest, rp_m: 7_200_000 })
    ).structuredContent!;

    for (let k = 0; k < 3; k++) {
      approx(viaRp.r_m[k], viaA.r_m[k], 1e-6);
      approx(viaRp.v_m_s[k], viaA.v_m_s[k], 1e-9);
    }
  });

  test('state_to_elements leaves out a for an exact parabola', async () => {
    // Powers of two keep v²/2 and μ/r both exactly 2²⁵, so the energy is 0
    const r = MU_EARTH / 2 ** 25;
    const res = await call('state_to_elements', {
      r_m: [r, 0, 0],
      v_m_s: [0, 2 ** 13, 0],
      mu_m3_s2: MU_EARTH
    });
    const out = res.structuredContent!;

    assert.equal(res.isError, undefined);
    assert.equal(out.a_m, undefined);
    assert.equal(out.energy_m2_s2, 0);
    approx(out.e, 1, 1e-12);
    approx(out.rp_m, r, 1e-6);
  });

  test('state_to_elements gives a period for a closed orbit just below escape speed', async () => {
    // e rounds to just under 1 here, while the energy came out positive: the
    // period was NaN and failed the output schema
    const res = await call('state_to_elements', {
      r_m: [44051376.77658507, 0, 0],
      v_m_s: [1086.312919306011, 4113.027476691657, 0],
      mu_m3_s2: MU_EARTH
    });
    const out = res.structuredContent!;

    assert.equal(res.isError, undefined);
    assert.ok(out.e < 1);
    assert.ok(out.a_m > 0);
    assert.ok(Number.isFinite(out.T_s) && out.T_s > 0);
    assert.ok(out.energy_m2_s2 < 0);
  });

  test('propagate_state goes a parabola forward and back', async () => {
    const { a_m: _, ...rest } = elements;
    const start = (
      await call('elements_to_state', { ...rest, e: 1, rp_m: 7_000_000 })
    ).structuredContent!;
    const there = (
      await call('propagate_state', {
        r_m: start.r_m,
        v_m_s: start.v_m_s,
        dt_s: 86_400,
        mu_m3_s2: MU_EARTH
      })
    ).structuredContent!;
    const back = (
      await call('propagate_state', {
        r_m: there.r_m,
        v_m_s: there.v_m_s,
        dt_s: -86_400,
        mu_m3_s2: MU_EARTH
      })
    ).structuredContent!;

    assert.ok(Math.hypot(...there.r_m) > 7_000_000);

    for (let k = 0; k < 3; k++) {
      approx(back.r_m[k], start.r_m[k], 1e-3);
      approx(back.v_m_s[k], start.v_m_s[k], 1e-6);
    }
  });

  test('propagate_state rejects straight-down motion', async () => {
    const res = await call('propagate_state', {
      r_m: [7_000_000, 0, 0],
      v_m_s: [-100, 0, 0],
      dt_s: 60,
      mu_m3_s2: MU_EARTH
    });

    assert.equal(res.isError, true);
  });

  test('elements_to_state needs exactly one size, and rp_m for a parabola', async () => {
    const { a_m: _, ...rest } = elements;

    // The tool takes rp_m, so a parabola is pointed there, not to p
    assert.match(
      (await call('elements_to_state', { ...elements, e: 1 })).content[0]!
        .text!,
      /give rp_m, its periapsis radius, instead of a_m/
    );

    for (const args of [
      { ...elements, e: 1 },
      rest,
      { ...elements, rp_m: 7_200_000 }
    ])
      assert.equal(
        (await call('elements_to_state', args)).isError,
        true,
        JSON.stringify(args)
      );
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

describe('inverse projection and tile tools', () => {
  test('unproject_point on sinusoidal: the Moon docs example', async () => {
    const res = await call('unproject_point', {
      projection: 'sinusoidal',
      x_m: 1_364_551,
      y_m: 1_819_401,
      body: 'moon'
    });

    approx(res.structuredContent!.latitude.deg, 60, 1e-4);
    approx(res.structuredContent!.longitude.deg, 90, 1e-4);
  });

  test('unproject_point on a south polar stereographic map of Mars', async () => {
    const res = await call('unproject_point', {
      projection: 'stereographic',
      x_m: 419_375,
      y_m: 419_375,
      body: 'mars',
      center_latitude: deg(-90)
    });

    approx(res.structuredContent!.latitude.deg, -80, 1e-4);
    approx(res.structuredContent!.longitude.deg, 45, 1e-4);
  });

  test('unproject_point rejects a point off the map and options a projection lacks', async () => {
    const off = await call('unproject_point', {
      projection: 'sinusoidal',
      x_m: 4,
      y_m: 0,
      radius_m: 1
    });
    const centred = await call('unproject_point', {
      projection: 'mercator',
      x_m: 0,
      y_m: 0,
      radius_m: 1,
      center_latitude: deg(45)
    });

    assert.equal(off.isError, true);
    assert.match(off.content[0]!.text!, /beyond the edge meridians/);
    assert.equal(centred.isError, true);
  });

  test('project_point and unproject_point accept an explicit default of 0 for options a projection lacks', async () => {
    const projected = await call('project_point', {
      projection: 'mercator',
      latitude: deg(0),
      longitude: deg(90),
      radius_m: 1000,
      center_latitude: deg(0)
    });
    const unprojected = await call('unproject_point', {
      projection: 'sinusoidal',
      x_m: 0,
      y_m: 0,
      radius_m: 1000,
      standard_parallel: { value: 0, unit: 'rad' }
    });

    assert.equal(projected.isError, undefined);
    approx(projected.structuredContent!.x_m, 500 * Math.PI, 1e-9);
    assert.equal(unprojected.isError, undefined);
    assert.equal(unprojected.structuredContent!.latitude.deg, 0);
  });

  test('tile_for_point finds Oslo at zoom 10', async () => {
    const res = await call('tile_for_point', {
      latitude: deg(59.9139),
      longitude: deg(10.7522),
      zoom: 10
    });

    assert.deepEqual(res.structuredContent, {
      x: 542,
      y: 297,
      z: 10,
      quadkey: '1200213112'
    });
  });

  test('tile_for_point rejects a zoom past 30 or not an integer', async () => {
    const point = { latitude: deg(0), longitude: deg(0) };

    assert.equal(
      (await call('tile_for_point', { ...point, zoom: 31 })).isError,
      true
    );
    assert.equal(
      (await call('tile_for_point', { ...point, zoom: 1.5 })).isError,
      true
    );
  });

  test('the tile tools’ zoom limit of 30 is the maps package’s MAX_ZOOM', async () => {
    // MAX_ZOOM isn't exported: check the library still draws the line there
    assert.equal(quadkey(0, 0, 30), '0'.repeat(30));
    assert.throws(() => quadkey(0, 0, 31), RangeError);
    assert.throws(() => tileAt(0 as Radians, 0 as Radians, 31), RangeError);

    const res = await call('tile_for_point', {
      latitude: deg(0),
      longitude: deg(0),
      zoom: 30
    });

    assert.equal(res.structuredContent!.quadkey.length, 30);
  });

  test('tile_info reads a quadkey', async () => {
    const res = await call('tile_info', { quadkey: '213' });

    assert.equal(res.structuredContent!.x, 3);
    assert.equal(res.structuredContent!.y, 5);
    assert.equal(res.structuredContent!.z, 3);
    assert.equal(res.structuredContent!.quadkey, '213');
  });

  test('tile_info gives the edges of the whole map at zoom 0', async () => {
    const res = await call('tile_info', { x: 0, y: 0, z: 0 });

    approx(res.structuredContent!.north.deg, 85.0511287798, 1e-9);
    approx(res.structuredContent!.south.deg, -85.0511287798, 1e-9);
    assert.equal(res.structuredContent!.west.deg, -180);
    assert.equal(res.structuredContent!.east.deg, 180);
    assert.equal(res.structuredContent!.quadkey, '');
  });

  test('tile_info rejects both forms, half a tile, a bad quadkey and a tile off the map', async () => {
    for (const args of [
      { x: 3, y: 5, z: 3, quadkey: '213' },
      { x: 3, y: 5 },
      {},
      { quadkey: '124' },
      { x: 8, y: 0, z: 3 }
    ])
      assert.equal(
        (await call('tile_info', args)).isError,
        true,
        JSON.stringify(args)
      );
  });
});

describe('imaging tools', () => {
  test('camera_ground_resolution: a 10 µrad pixel sees 3 m from 300 km', async () => {
    const res = await call('camera_ground_resolution', {
      pixel_pitch_m: 7e-6,
      focal_length_m: 0.7,
      distance_m: 300_000
    });

    approx(res.structuredContent!.ifov.rad, 1e-5, 1e-14);
    approx(res.structuredContent!.gsd_m, 3, 1e-6);
    assert.equal(res.structuredContent!.swath_m, undefined);
  });

  test('camera_ground_resolution: a detector twice the focal length wide sees 90°', async () => {
    const res = await call('camera_ground_resolution', {
      pixel_pitch_m: 1e-5,
      focal_length_m: 0.5,
      distance_m: 1000,
      pixels_across: 100_000
    });

    approx(res.structuredContent!.field_of_view.deg, 90, 1e-9);
    approx(res.structuredContent!.swath_m, 2000, 1e-9);
  });

  test('says which output overflowed, instead of failing the output check', async () => {
    const res = await call('camera_ground_resolution', {
      distance_m: 1e308,
      pixel_pitch_m: 1,
      focal_length_m: 0.1
    });

    assert.equal(res.isError, true);
    assert.equal(
      res.content[0]!.text,
      'gsd_m came out as Infinity: the inputs are too large or too small for a finite result.'
    );
  });

  test('camera_ground_resolution rejects a zero distance or pixel count', async () => {
    const camera = { pixel_pitch_m: 7e-6, focal_length_m: 0.7 };

    assert.equal(
      (await call('camera_ground_resolution', { ...camera, distance_m: 0 }))
        .isError,
      true
    );
    assert.equal(
      (
        await call('camera_ground_resolution', {
          ...camera,
          distance_m: 1,
          pixels_across: 0
        })
      ).isError,
      true
    );
  });

  test('illumination_geometry gives the Sun’s zenith angle as incidence', async () => {
    const res = await call('illumination_geometry', {
      normal: [0, 0, 5],
      to_sun: [1.5, 0, (Math.sqrt(3) / 2) * 3],
      to_observer: [0, 0, 0.1]
    });
    const mu0 = Math.cos(Math.PI / 6);

    approx(res.structuredContent!.incidence.deg, 30, 1e-9);
    approx(res.structuredContent!.emission.deg, 0, 1e-9);
    approx(res.structuredContent!.phase.deg, 30, 1e-9);
    approx(res.structuredContent!.lambert_reflectance, mu0, 1e-12);
    approx(
      res.structuredContent!.lommel_seeliger_reflectance,
      mu0 / (mu0 + 1),
      1e-12
    );
  });

  test('illumination_geometry rejects a zero vector', async () => {
    const res = await call('illumination_geometry', {
      normal: [0, 0, 1],
      to_sun: [0, 0, 1],
      to_observer: [0, 0, 0]
    });

    assert.equal(res.isError, true);
    assert.match(res.content[0]!.text!, /zero vector/);
  });
});

describe('landing tools', () => {
  const lander = { r_footprint_m: 2, h_com_m: 2 };

  test('landing_stability: 30° plus 10° of rock-up stays up with a 45° limit', async () => {
    const res = await call('landing_stability', {
      ...lander,
      slope: deg(30),
      dynamic_tilt: deg(10)
    });

    approx(res.structuredContent!.tip_over_angle.deg, 45, 1e-9);
    approx(res.structuredContent!.total_tilt.deg, 40, 1e-9);
    approx(res.structuredContent!.margin.deg, 5, 1e-9);
    assert.equal(res.structuredContent!.stable, true);
  });

  test('landing_stability: 40° plus 10° tips over', async () => {
    const res = await call('landing_stability', {
      ...lander,
      slope: deg(40),
      dynamic_tilt: deg(10)
    });

    approx(res.structuredContent!.margin.deg, -5, 1e-9);
    assert.equal(res.structuredContent!.stable, false);
  });

  test('landing_stability rejects a slope past vertical', async () => {
    const res = await call('landing_stability', {
      ...lander,
      slope: deg(400)
    });

    assert.equal(res.isError, true);
    assert.match(res.content[0]!.text!, /slope must be in \[0°, 90°\]/);
  });

  test('landing_stability rejects a negative slope or rock-up, in the caller’s unit', async () => {
    const slope = await call('landing_stability', {
      ...lander,
      slope: deg(-1)
    });
    const tilt = await call('landing_stability', {
      ...lander,
      slope: deg(10),
      dynamic_tilt: deg(-5)
    });

    assert.equal(slope.isError, true);
    assert.match(
      slope.content[0]!.text!,
      /slope must be in \[0°, 90°\]\. Received: -1 deg/
    );
    assert.equal(tilt.isError, true);
    assert.match(
      tilt.content[0]!.text!,
      /dynamic_tilt must be at least 0\. Received: -5 deg/
    );
  });

  test('safe_landing_map: level ground is safe inside, unknown on the edge', async () => {
    const res = await call('safe_landing_map', {
      ...lander,
      elevation_m: Array.from({ length: 5 }, () => Array(5).fill(100)),
      cell_size_m: 1,
      max_roughness_m: 0.5
    });
    const { values, safe_cells, unsafe_cells, unknown_cells } =
      res.structuredContent!;

    assert.deepEqual([safe_cells, unsafe_cells, unknown_cells], [9, 0, 16]);
    assert.equal(values[2][2], 1);
    assert.equal(values[0][0], null);
  });

  test('safe_landing_map: a slope just over the tip-over angle is unsafe', async () => {
    const res = await call('safe_landing_map', {
      ...lander,
      elevation_m: Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, (_, x) => 1.05 * x)
      ),
      cell_size_m: 1,
      max_roughness_m: 2
    });

    assert.equal(res.structuredContent!.safe_cells, 0);
    assert.equal(res.structuredContent!.unsafe_cells, 9);
  });

  test('safe_landing_map rejects a negative roughness limit', async () => {
    const res = await call('safe_landing_map', {
      ...lander,
      elevation_m: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      cell_size_m: 1,
      max_roughness_m: -1
    });

    assert.equal(res.isError, true);
  });

  test('safe_landing_map rejects a negative rock-up, in the caller’s unit', async () => {
    const res = await call('safe_landing_map', {
      ...lander,
      elevation_m: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      cell_size_m: 1,
      max_roughness_m: 1,
      dynamic_tilt: deg(-5)
    });

    assert.equal(res.isError, true);
    assert.match(
      res.content[0]!.text!,
      /dynamic_tilt must be at least 0\. Received: -5 deg/
    );
  });
});

describe('terrain tools', () => {
  // 3 × 3 cells of 10 m, rising 1 m a cell to the east (createGrid's example)
  const ramp = {
    elevation_m: [
      [0, 1, 2],
      [0, 1, 2],
      [0, 1, 2]
    ],
    cell_size_m: 10
  };
  // 3 × 4 cells, falling 10 m a cell to the east
  const fallingEast = {
    elevation_m: Array.from({ length: 3 }, () => [0, -10, -20, -30]),
    cell_size_m: 10
  };

  test('terrain_at_cell on a plane', async () => {
    const res = await call('terrain_at_cell', {
      ...ramp,
      row: 1,
      column: 1,
      sun_azimuth: deg(270),
      sun_elevation: deg(45)
    });
    const s = res.structuredContent!;
    const slope = Math.atan(0.1);

    assert.equal(s.elevation_m, 1);
    approx(s.dz_dx, 0.1, 1e-12);
    approx(s.dz_dy, 0, 1e-12);
    approx(s.slope.rad, slope, 1e-12);
    // Downhill is west
    approx(s.aspect.deg, 270, 1e-9);
    approx(s.profile_curvature_per_m, 0, 1e-12);
    approx(s.planform_curvature_per_m, 0, 1e-12);
    // Six neighbours 1 m off, two level
    approx(s.roughness_m, Math.sqrt(6 / 8), 1e-12);
    // The Sun is in the west, 45° up, so 45° minus the slope from the normal
    approx(s.hillshade, Math.cos(Math.PI / 4 - slope), 1e-12);
  });

  test('terrain_at_cell gives null on the edge and for a missing cell', async () => {
    const edge = await call('terrain_at_cell', { ...ramp, row: 0, column: 0 });

    assert.equal(edge.structuredContent!.elevation_m, 0);
    assert.equal(edge.structuredContent!.slope, null);
    assert.equal(edge.structuredContent!.roughness_m, null);
    assert.equal(edge.structuredContent!.hillshade, undefined);

    for (const missing of [null, -9999]) {
      const res = await call('terrain_at_cell', {
        elevation_m: [
          [1, 1, 1],
          [1, missing, 1],
          [1, 1, 1]
        ],
        cell_size_m: 1,
        no_data: -9999,
        row: 1,
        column: 1
      });

      assert.equal(res.structuredContent!.elevation_m, null);
      assert.equal(res.structuredContent!.slope, null);
    }
  });

  test('terrain_at_cell has no curvature or aspect at a summit', async () => {
    const res = await call('terrain_at_cell', {
      elevation_m: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ],
      cell_size_m: 1,
      row: 1,
      column: 1
    });

    assert.equal(res.structuredContent!.slope.rad, 0);
    assert.equal(res.structuredContent!.aspect, null);
    assert.equal(res.structuredContent!.profile_curvature_per_m, null);
    assert.equal(res.structuredContent!.planform_curvature_per_m, null);
  });

  test('terrain tools reject heights past 1000 km and cells outside 1 mm to 1000 km, but not a float no_data marker', async () => {
    const flat = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const high = await call('terrain_at_cell', {
      elevation_m: [
        [0, 0, 0],
        [0, 2e6, 0],
        [0, 0, 0]
      ],
      cell_size_m: 1,
      row: 1,
      column: 1
    });
    const wide = await call('terrain_at_cell', {
      elevation_m: flat,
      cell_size_m: 2e6,
      row: 1,
      column: 1
    });
    const marker = await call('terrain_at_cell', {
      elevation_m: [
        [0, 0, 0],
        [0, -3.4028234663852886e38, 0],
        [0, 0, 0]
      ],
      cell_size_m: 1,
      no_data: -3.4028234663852886e38,
      row: 1,
      column: 1
    });

    assert.equal(high.isError, true);
    assert.match(high.content[0]!.text!, /within ±1000000 m/);
    assert.equal(wide.isError, true);
    assert.equal(
      (
        await call('terrain_at_cell', {
          elevation_m: flat,
          cell_size_m: 1e-4,
          row: 1,
          column: 1
        })
      ).isError,
      true
    );
    assert.equal(marker.isError, undefined);
    assert.equal(marker.structuredContent!.elevation_m, null);
  });

  test('terrain_at_cell rejects a cell outside the grid', async () => {
    const res = await call('terrain_at_cell', { ...ramp, row: 3, column: 1 });

    assert.equal(res.isError, true);
    assert.match(res.content[0]!.text!, /row/);
  });

  test('terrain_layer flow_accumulation grows along a tilted plane', async () => {
    const res = await call('terrain_layer', {
      ...fallingEast,
      cell_size_y_m: 5,
      layer: 'flow_accumulation'
    });

    assert.deepEqual(res.structuredContent, {
      layer: 'flow_accumulation',
      unit: 'm²',
      values: Array.from({ length: 3 }, () => [50, 100, 150, 200]),
      valid_cells: 12,
      min: 50,
      max: 200,
      mean: 125,
      min_cell: { row: 0, column: 0 },
      max_cell: { row: 0, column: 3 }
    });
  });

  test('terrain_layer flow_direction runs east, and stops at the low edge', async () => {
    const res = await call('terrain_layer', {
      ...fallingEast,
      layer: 'flow_direction'
    });

    assert.deepEqual(
      res.structuredContent!.values,
      Array.from({ length: 3 }, () => [2, 2, 2, null])
    );
  });

  test('terrain_layer gives no min, max or mean for aspect and flow_direction', async () => {
    for (const layer of ['aspect', 'flow_direction']) {
      const s = (await call('terrain_layer', { ...fallingEast, layer }))
        .structuredContent!;

      assert.ok(s.valid_cells > 0, layer);
      assert.deepEqual(
        [s.min, s.max, s.mean, s.min_cell, s.max_cell],
        [null, null, null, null, null],
        layer
      );
    }
  });

  test('terrain_layer and safe_landing_map send their text without indentation', async () => {
    for (const [name, args] of [
      ['terrain_layer', { ...ramp, layer: 'slope' }],
      [
        'safe_landing_map',
        { ...ramp, r_footprint_m: 2, h_com_m: 2, max_roughness_m: 1 }
      ]
    ] as const) {
      const res = await call(name, args);
      const text = res.content[0]!.text!;

      assert.ok(!text.includes('\n'), name);
      assert.deepEqual(JSON.parse(text), res.structuredContent, name);
    }
  });

  test('terrain_layer slope is in degrees, null on the edge', async () => {
    const res = await call('terrain_layer', { ...ramp, layer: 'slope' });
    const { values, unit, valid_cells, max_cell } = res.structuredContent!;

    assert.equal(unit, 'deg');
    assert.equal(valid_cells, 1);
    assert.deepEqual(max_cell, { row: 1, column: 1 });
    approx(values[1][1], (Math.atan(0.1) * 180) / Math.PI, 1e-9);
    assert.equal(values[0][1], null);
  });

  test('terrain_layer aspect, roughness, curvature and wetness on a plane', async () => {
    const centre = async (layer: string) =>
      (await call('terrain_layer', { ...ramp, layer })).structuredContent!
        .values[1][1];

    approx(await centre('aspect'), 270, 1e-9);
    approx(await centre('roughness'), Math.sqrt(6 / 8), 1e-12);
    approx(await centre('profile_curvature'), 0, 1e-12);
    approx(await centre('planform_curvature'), 0, 1e-12);
    // Two 100 m² cells drain through a 10 m wide cell on a 0.1 slope
    approx(await centre('wetness_index'), Math.log(200 / 10 / 0.1), 1e-12);
  });

  test('terrain_layer hillshade takes the Sun', async () => {
    const res = await call('terrain_layer', {
      ...ramp,
      layer: 'hillshade',
      sun_azimuth: deg(270),
      sun_elevation: deg(45)
    });

    approx(
      res.structuredContent!.values[1][1],
      Math.cos(Math.PI / 4 - Math.atan(0.1)),
      1e-12
    );
  });

  test('terrain_layer rejects a missing or unneeded Sun, and half a Sun', async () => {
    for (const args of [
      { layer: 'hillshade' },
      { layer: 'slope', sun_azimuth: deg(0), sun_elevation: deg(45) },
      { layer: 'hillshade', sun_azimuth: deg(0) }
    ])
      assert.equal(
        (await call('terrain_layer', { ...ramp, ...args })).isError,
        true,
        JSON.stringify(args)
      );
  });

  test('terrain tools reject a Sun past the zenith, in the caller’s unit', async () => {
    const sun = { sun_azimuth: deg(315), sun_elevation: deg(100) };

    for (const [name, args] of [
      ['terrain_layer', { ...ramp, layer: 'hillshade', ...sun }],
      ['terrain_at_cell', { ...ramp, row: 1, column: 1, ...sun }]
    ] as const) {
      const res = await call(name, args);

      assert.equal(res.isError, true, name);
      assert.equal(
        res.content[0]!.text,
        'sun_elevation must be in [-90°, 90°]. Received: 100 deg',
        name
      );
    }
  });

  test('terrain tools reject ragged, too small and too large grids', async () => {
    for (const elevation_m of [
      [
        [0, 1, 2],
        [0, 1],
        [0, 1, 2]
      ],
      [
        [0, 1, 2],
        [0, 1, 2]
      ],
      Array.from({ length: 33 }, () => [0, 1, 2]),
      Array.from({ length: 3 }, () => Array(33).fill(0))
    ])
      assert.equal(
        (
          await call('terrain_layer', {
            elevation_m,
            cell_size_m: 1,
            layer: 'slope'
          })
        ).isError,
        true,
        `${elevation_m.length} × ${elevation_m[1]!.length}`
      );
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

  test('says an inherited key is not a dataset', async () => {
    for (const name of ['constructor', 'toString', 'hasOwnProperty'])
      await assert.rejects(
        client.readResource({ uri: `interstellar://datasets/${name}` }),
        new RegExp(`Unknown dataset: ${name}`)
      );
  });

  test('find_body rejects a blank query instead of matching everything', async () => {
    for (const query of ['', '   '])
      assert.equal((await call('find_body', { query })).isError, true, query);
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

  test('serves the bodies whole, with what is measured about them', async () => {
    type BodyType = {
      id: string;
      observations?: Record<string, { value?: number } & object>;
      display?: Record<string, unknown>;
    };

    const find = async (dataset: string, id: string) =>
      (
        (await readJson(
          `interstellar://datasets/${dataset}`
        )) as unknown as BodyType[]
      ).find((body) => body.id === id)!;
    const vega = await find('stars', 'vega');
    const sun = await find('stars', 'sun');
    const saturn = await find('planets', 'saturn');

    assert.equal(vega.observations?.luminosity?.value, 40.12);
    assert.ok(sun.observations?.astrosphere);
    assert.ok(sun.display?.astrosphere);
    assert.ok(saturn.observations?.rings);
    assert.ok(saturn.display?.rings);
    assert.ok((await find('moons', 'enceladus')).observations?.ringInteraction);
    assert.ok(
      (await find('interstellar-objects', '2i-borisov')).observations?.discovery
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

  test('takes a time without Z or an offset as UTC, whatever the server’s time zone', async () => {
    const tz = process.env.TZ;

    // An hour off UTC in November: local time would move the ISS ~4000 km
    process.env.TZ = 'Europe/Oslo';

    try {
      const utc = await call('satellite_position', {
        satellite: 'iss',
        time: '2026-11-05T15:49:00Z'
      });

      for (const time of [
        '2026-11-05T15:49:00',
        '2026-11-05 15:49:00',
        ' 2026-11-05T15:49:00 ',
        '2026-11-05T16:49:00+01:00'
      ]) {
        const res = await call('satellite_position', {
          satellite: 'iss',
          time
        });

        assert.deepEqual(res.structuredContent, utc.structuredContent, time);
      }

      const late = await call('probe_position', {
        probe: 'voyager-1',
        time: '2026-11-05T12:00:00'
      });
      const lateUtc = await call('probe_position', {
        probe: 'voyager-1',
        time: '2026-11-05T12:00:00Z'
      });

      assert.deepEqual(late.structuredContent, lateUtc.structuredContent);
    } finally {
      if (tz === undefined) delete process.env.TZ;
      else process.env.TZ = tz;
    }
  });

  test('satellite_position rejects blank elements with a clear message', async () => {
    for (const omm of ['', '   ']) {
      const res = await call('satellite_position', {
        omm,
        time: '2026-11-05T15:49:00Z'
      });

      assert.equal(res.isError, true, JSON.stringify(omm));
      assert.match(res.content[0]!.text!, /omm/);
      assert.doesNotMatch(res.content[0]!.text!, /Cannot read properties/);
    }
  });

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

  test('lagrange_points rejects unknown, swapped and unrelated bodies', async () => {
    for (const [args, message] of [
      [{ primary: 'vulcan', secondary: 'earth' }, /Unknown body: vulcan/],
      [{ primary: 'sun', primary_mu_m3_s2: 1, secondary: 'earth' }, /not both/],
      // Earth doesn't orbit Jupiter, so there's no separation to default to
      [{ primary: 'jupiter', secondary: 'earth' }, /Give separation_m/],
      // Swapped, by id or by mu, with or without a separation
      [{ primary: 'earth', secondary: 'sun' }, /Swap primary and secondary/],
      [
        { primary: 'earth', secondary: 'sun', separation_m: 1.496e11 },
        /Swap primary and secondary/
      ],
      [
        { primary_mu_m3_s2: 1, secondary_mu_m3_s2: 2, separation_m: 1 },
        /Swap primary and secondary/
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
