/**
 * The NRLMSISE-00 model itself, ported from NRL's Fortran
 * (`nrlmsise00_sub.for`): GTD7 and GTD7D with the routines they call. The
 * public {@link nrlmsise00} validates its inputs and wraps {@link gtd7}.
 *
 * Simplifications from the Fortran, none of which changes a result:
 *
 * - Every switch is on (TSELEC's defaults), except SW(9), which is -1 when a
 *   3-hour Ap history is given. The switch products are dropped.
 * - Every species is computed (MASS = 48). GHP7, METERS, TSELEC, TRETRV and
 *   the VTST7 caching are left out: everything is recomputed on each call.
 * - The COMMON blocks become values passed between functions: no state
 *   survives a call.
 * - Guards that can't trigger with these coefficients, or that make no
 *   difference in double precision, are left out (noted where they were).
 *
 * The Fortran works in single precision, this port in double: it reproduces
 * NRL's reference output to the last printed digit.
 *
 * @module
 * @internal
 */

import {
  PAVGM,
  PD,
  PDL,
  PDM,
  PMA,
  PS,
  PT,
  PTL,
  PTM
} from './nrlmsise00-data.js';

/** The inputs to GTD7, in the Fortran's units. */
export interface Gtd7Input {
  /** Day of the year, 1 to 366. */
  day: number;
  /** Universal time, in seconds of the day. */
  sec: number;
  /** Geodetic height, in km. */
  alt: number;
  /** Geodetic latitude, in degrees. */
  lat: number;
  /** Geodetic longitude, in degrees. */
  lon: number;
  /** Local apparent solar time, in hours. */
  stl: number;
  /** 81-day average F10.7. */
  f107a: number;
  /** Daily F10.7 for the previous day. */
  f107: number;
  /** Daily Ap, or the 7-element Ap history (SW(9) = -1). */
  ap: number | readonly number[];
}

/** The outputs of GTD7 and GTD7D, in cgs: cm⁻³, g/cm³ and K. */
export interface Gtd7Output {
  /** D(1) to D(5), D(7) to D(9): number densities. */
  he: number;
  o: number;
  n2: number;
  o2: number;
  ar: number;
  h: number;
  n: number;
  anomalousO: number;
  /** D(6) of GTD7: total mass density without anomalous oxygen. */
  rho: number;
  /** D(6) of GTD7D: total mass density with anomalous oxygen. */
  rhoEffective: number;
  /** T(1): exospheric temperature. */
  tinf: number;
  /** T(2): temperature at the height. */
  t: number;
}

// The Fortran's constants, as written, so the results match NRL's
const DGTR = 1.74533e-2; // degrees to radians
const DR = 1.72142e-2; // days to radians, 2π / 365
const HR = 0.2618; // hours to radians, 2π / 24
const SR = 7.2722e-5; // seconds to radians, 2π / 86 400
const RGAS = 831.4; // gas constant, in the model's units
const AMU = 1.66e-24; // atomic mass unit, in g
// 1-based columns of a column-major array, so that cols[j][i] reads as the
// Fortran's A(i, j); a vector is its column 1
const columns = (
  a: readonly number[],
  rows: number
): readonly (readonly number[])[] =>
  Array.from({ length: a.length / rows + 1 }, (_, j) => [
    0,
    ...a.slice(rows * (j - 1), rows * j)
  ]);
const pt = columns(PT, 150)[1];
const ps = columns(PS, 150)[1];
const ptm = columns(PTM, 10)[1];
const pavgm = columns(PAVGM, 10)[1];
// pd[j]: 1 He, 2 O, 3 N2, 4 TLB, 5 O2, 6 Ar, 7 H, 8 N, 9 anomalous O
const pd = columns(PD, 150);
const pdl = columns(PDL, 25);
const ptl = columns(PTL, 100);
const pma = columns(PMA, 100);
// pdm[j]: 1 He, 2 O, 3 N2, 4 O2, 5 Ar, 6 H, 7 N, 8 anomalous O
const pdm = columns(PDM, 10);
// Node heights in km: the lower thermosphere from ZA down (GTS7), the
// mesosphere and the stratosphere and troposphere (GTD7)
const ZA = pdl[2][16];
const ZN1 = [ZA, 110, 100, 90, 72.5];
const ZN2 = [72.5, 55, 45, 32.5];
const ZN3 = [32.5, 20, 15, 10, 0];
// Below ZMIX the atmosphere is fully mixed
const ZMIX = 62.5;
// GLOBE7's coefficient indices for its magnetic-activity terms T(9) and
// T(13): from daily Ap (SW(9) = 1) or from the 3-hour history (SW(9) = -1)
const DAILY = {
  t9: [33, 46, 35, 101, 102, 103, 122, 123, 124, 125],
  t13: [121, 61, 62, 63, 64, 116, 117, 118, 119, 84, 85, 86, 76]
};
const HISTORY = {
  t9: [51, 97, 55, 126, 127, 128, 129, 130, 131, 132],
  t13: [133, 53, 99, 68, 98, 134, 135, 136, 137, 56, 57, 58, 59]
};

/** What the Fortran shares through COMMON/LPOLY/ and /PARMB/ for one call. */
interface Context {
  input: Gtd7Input;
  /** Associated Legendre functions of latitude: plg[n][m] is PLG(n, m). */
  plg: number[][];
  /** F107 - F107A, and F107A - 150. */
  df: number;
  dfa: number;
  /** Surface gravity (cm/s²) and effective Earth radius (km), from GLATF. */
  gsurf: number;
  re: number;
}

const context = (input: Gtd7Input): Context => {
  const c = Math.sin(input.lat * DGTR);
  const s = Math.cos(input.lat * DGTR);
  const c2 = c * c;
  const c4 = c2 * c2;
  const s2 = s * s;
  const plg = Array.from({ length: 9 }, () => [0, 0, 0, 0, 0]);

  // GLOBE7: Legendre functions
  plg[2][1] = c;
  plg[3][1] = 0.5 * (3 * c2 - 1);
  plg[4][1] = 0.5 * (5 * c * c2 - 3 * c);
  plg[5][1] = (35 * c4 - 30 * c2 + 3) / 8;
  plg[6][1] = (63 * c2 * c2 * c - 70 * c2 * c + 15 * c) / 8;
  plg[7][1] = (11 * c * plg[6][1] - 5 * plg[5][1]) / 6;
  plg[2][2] = s;
  plg[3][2] = 3 * c * s;
  plg[4][2] = 1.5 * (5 * c2 - 1) * s;
  plg[5][2] = 2.5 * (7 * c2 * c - 3 * c) * s;
  plg[6][2] = 1.875 * (21 * c4 - 14 * c2 + 1) * s;
  plg[7][2] = (11 * c * plg[6][2] - 6 * plg[5][2]) / 5;
  plg[3][3] = 3 * s2;
  plg[4][3] = 15 * s2 * c;
  plg[5][3] = 7.5 * (7 * c2 - 1) * s2;
  plg[6][3] = 3 * c * plg[5][3] - 2 * plg[4][3];
  plg[7][3] = (11 * c * plg[6][3] - 7 * plg[5][3]) / 4;
  plg[8][3] = (13 * c * plg[7][3] - 8 * plg[6][3]) / 5;
  plg[4][4] = 15 * s2 * s;
  plg[5][4] = 105 * s2 * s * c;
  plg[6][4] = (9 * c * plg[5][4] - 7 * plg[4][4]) / 2;
  plg[7][4] = (11 * c * plg[6][4] - 8 * plg[5][4]) / 3;

  // GLATF: gravity and effective radius at the latitude
  const c2lat = Math.cos(2 * DGTR * input.lat);
  const gsurf = 980.616 * (1 - 0.0026373 * c2lat);
  const re = ((2 * gsurf) / (3.085462e-6 + 2.27e-9 * c2lat)) * 1e-5;

  return {
    input,
    plg,
    df: input.f107 - input.f107a,
    dfa: input.f107a - 150,
    gsurf,
    re
  };
};
/**
 * The magnetic-activity function for a parameter set: APDF from daily Ap, or
 * APT(1) from the 3-hour history (GLOBE7, Eqs. A24a to A24d). The Fortran
 * clamps P(44) and P(25) and caps EXP1 at 0.99999; none can trigger with
 * these coefficients.
 */
const activity = (ctx: Context, p: readonly number[]): number => {
  const { ap, lat } = ctx.input;

  if (typeof ap === 'number') {
    const apd = ap - 4;

    return apd + (p[45] - 1) * (apd + (Math.exp(-p[44] * apd) - 1) / p[44]);
  }

  // Sets without history terms (P(52) = 0) leave T(9) and T(13) at 0
  if (p[52] === 0) return 0;

  const p25 = Math.abs(p[25]);
  const g0 = (a: number) =>
    a - 4 + (p[26] - 1) * (a - 4 + (Math.exp(-p25 * (a - 4)) - 1) / p25);
  const ex = Math.exp(
    (-10800 * Math.abs(p[52])) / (1 + p[139] * (45 - Math.abs(lat)))
  );
  const sumex = 1 + ((1 - ex ** 19) / (1 - ex)) * Math.sqrt(ex);

  return (
    (g0(ap[1]) +
      (g0(ap[2]) * ex +
        g0(ap[3]) * ex * ex +
        g0(ap[4]) * ex ** 3 +
        ((g0(ap[5]) * ex ** 4 + g0(ap[6]) * ex ** 12) * (1 - ex ** 8)) /
          (1 - ex))) /
    sumex
  );
};
/** The seasonal cosines CD14, CD18, CD32 and CD39 of GLOBE7 and GLOB7S. */
const seasons = (day: number, p: readonly number[]) => ({
  cd14: Math.cos(DR * (day - p[14])),
  cd18: Math.cos(2 * DR * (day - p[18])),
  cd32: Math.cos(DR * (day - p[32])),
  cd39: Math.cos(2 * DR * (day - p[39]))
});
/**
 * GLOBE7: the upper-thermosphere variation G(L), a sum of spherical harmonics
 * in latitude, local time, season, UT and longitude, scaled by solar (F10.7)
 * and geomagnetic (Ap) activity. Returns G(L) and the magnetic-activity
 * function, which GLOB7S reuses.
 */
const globe7 = (
  ctx: Context,
  p: readonly number[]
): { g: number; ap: number } => {
  const { day, sec, lon, stl, ap } = ctx.input;
  const { plg, df, dfa } = ctx;
  const { cd14, cd18, cd32, cd39 } = seasons(day, p);
  const a = activity(ctx, p);
  const k9 = typeof ap === 'number' ? DAILY.t9 : HISTORY.t9;
  const k13 = typeof ap === 'number' ? DAILY.t13 : HISTORY.t13;
  const f1 = 1 + (p[48] * dfa + p[20] * df + p[21] * df * df);
  const f2 = 1 + (p[50] * dfa + p[20] * df + p[21] * df * df);
  const t: number[] = [];

  // F10.7
  t[1] =
    p[20] * df * (1 + p[60] * dfa) +
    p[21] * df * df +
    p[22] * dfa +
    p[30] * dfa ** 2;
  // Time independent
  t[2] =
    p[2] * plg[3][1] +
    p[3] * plg[5][1] +
    p[23] * plg[7][1] +
    p[15] * plg[3][1] * dfa +
    p[27] * plg[2][1];
  // Symmetrical annual and semiannual
  t[3] = p[19] * cd32;
  t[4] = (p[16] + p[17] * plg[3][1]) * cd18;
  // Asymmetrical annual and semiannual
  t[5] = f1 * (p[10] * plg[2][1] + p[11] * plg[4][1]) * cd14;
  t[6] = p[38] * plg[2][1] * cd39;
  // Diurnal, semidiurnal and terdiurnal
  t[7] =
    f2 *
    ((p[4] * plg[2][2] +
      p[5] * plg[4][2] +
      p[28] * plg[6][2] +
      p[12] * plg[3][2] * cd14) *
      Math.cos(HR * stl) +
      (p[7] * plg[2][2] +
        p[8] * plg[4][2] +
        p[29] * plg[6][2] +
        p[13] * plg[3][2] * cd14) *
        Math.sin(HR * stl));
  t[8] =
    f2 *
    ((p[6] * plg[3][3] +
      p[42] * plg[5][3] +
      (p[24] * plg[4][3] + p[36] * plg[6][3]) * cd14) *
      Math.cos(2 * HR * stl) +
      (p[9] * plg[3][3] +
        p[43] * plg[5][3] +
        (p[34] * plg[4][3] + p[37] * plg[6][3]) * cd14) *
        Math.sin(2 * HR * stl));
  t[14] =
    f2 *
    ((p[40] * plg[4][4] + (p[94] * plg[5][4] + p[47] * plg[7][4]) * cd14) *
      Math.sin(3 * HR * stl) +
      (p[41] * plg[4][4] + (p[95] * plg[5][4] + p[49] * plg[7][4]) * cd14) *
        Math.cos(3 * HR * stl));
  // Magnetic activity
  t[9] =
    a *
    (p[k9[0]] +
      p[k9[1]] * plg[3][1] +
      p[k9[2]] * plg[5][1] +
      (p[k9[3]] * plg[2][1] + p[k9[4]] * plg[4][1] + p[k9[5]] * plg[6][1]) *
        cd14 +
      (p[k9[6]] * plg[2][2] + p[k9[7]] * plg[4][2] + p[k9[8]] * plg[6][2]) *
        Math.cos(HR * (stl - p[k9[9]])));
  // Longitudinal
  t[11] =
    (1 + p[81] * dfa) *
    ((p[65] * plg[3][2] +
      p[66] * plg[5][2] +
      p[67] * plg[7][2] +
      p[104] * plg[2][2] +
      p[105] * plg[4][2] +
      p[106] * plg[6][2] +
      (p[110] * plg[2][2] + p[111] * plg[4][2] + p[112] * plg[6][2]) * cd14) *
      Math.cos(DGTR * lon) +
      (p[91] * plg[3][2] +
        p[92] * plg[5][2] +
        p[93] * plg[7][2] +
        p[107] * plg[2][2] +
        p[108] * plg[4][2] +
        p[109] * plg[6][2] +
        (p[113] * plg[2][2] + p[114] * plg[4][2] + p[115] * plg[6][2]) * cd14) *
        Math.sin(DGTR * lon));
  // UT, and mixed UT and longitude
  t[12] =
    (1 + p[96] * plg[2][1]) *
      (1 + p[82] * dfa) *
      (1 + p[120] * plg[2][1] * cd14) *
      ((p[69] * plg[2][1] + p[70] * plg[4][1] + p[71] * plg[6][1]) *
        Math.cos(SR * (sec - p[72]))) +
    (p[77] * plg[4][3] + p[78] * plg[6][3] + p[79] * plg[8][3]) *
      Math.cos(SR * (sec - p[80]) + 2 * DGTR * lon) *
      (1 + p[138] * dfa);
  // UT, longitude and magnetic activity
  t[13] =
    a *
      (1 + p[k13[0]] * plg[2][1]) *
      ((p[k13[1]] * plg[3][2] + p[k13[2]] * plg[5][2] + p[k13[3]] * plg[7][2]) *
        Math.cos(DGTR * (lon - p[k13[4]]))) +
    a *
      (p[k13[5]] * plg[2][2] + p[k13[6]] * plg[4][2] + p[k13[7]] * plg[6][2]) *
      cd14 *
      Math.cos(DGTR * (lon - p[k13[8]])) +
    a *
      (p[k13[9]] * plg[2][1] +
        p[k13[10]] * plg[4][1] +
        p[k13[11]] * plg[6][1]) *
      Math.cos(SR * (sec - p[k13[12]]));

  // T(10) is never set
  return {
    g:
      p[31] +
      t[1] +
      t[2] +
      t[3] +
      t[4] +
      t[5] +
      t[6] +
      t[7] +
      t[8] +
      t[9] +
      t[11] +
      t[12] +
      t[13] +
      t[14],
    ap: a
  };
};
/**
 * GLOB7S: the lower-atmosphere variation, a shorter sum of the same
 * harmonics. `a` is the magnetic-activity function of the last GLOBE7 call,
 * as the Fortran reads it from COMMON/LPOLY/.
 */
const glob7s = (ctx: Context, p: readonly number[], a: number): number => {
  const { day, lon, stl, ap } = ctx.input;
  const { plg, dfa } = ctx;
  const { cd14, cd18, cd32, cd39 } = seasons(day, p);
  const k9 = typeof ap === 'number' ? DAILY.t9 : HISTORY.t9;
  const t1 = p[22] * dfa;
  const t2 =
    p[2] * plg[3][1] +
    p[3] * plg[5][1] +
    p[23] * plg[7][1] +
    p[27] * plg[2][1] +
    p[15] * plg[4][1] +
    p[60] * plg[6][1];
  const t3 = (p[19] + p[48] * plg[3][1] + p[30] * plg[5][1]) * cd32;
  const t4 = (p[16] + p[17] * plg[3][1] + p[31] * plg[5][1]) * cd18;
  const t5 = (p[10] * plg[2][1] + p[11] * plg[4][1] + p[21] * plg[6][1]) * cd14;
  const t6 = p[38] * plg[2][1] * cd39;
  const t7 =
    (p[4] * plg[2][2] + p[5] * plg[4][2] + p[12] * plg[3][2] * cd14) *
      Math.cos(HR * stl) +
    (p[7] * plg[2][2] + p[8] * plg[4][2] + p[13] * plg[3][2] * cd14) *
      Math.sin(HR * stl);
  const t8 =
    (p[6] * plg[3][3] +
      p[42] * plg[5][3] +
      (p[24] * plg[4][3] + p[36] * plg[6][3]) * cd14) *
      Math.cos(2 * HR * stl) +
    (p[9] * plg[3][3] +
      p[43] * plg[5][3] +
      (p[34] * plg[4][3] + p[37] * plg[6][3]) * cd14) *
      Math.sin(2 * HR * stl);
  const t14 =
    p[40] * plg[4][4] * Math.sin(3 * HR * stl) +
    p[41] * plg[4][4] * Math.cos(3 * HR * stl);
  const t9 = a * (p[k9[0]] + p[k9[1]] * plg[3][1]);
  const t11 =
    (1 +
      plg[2][1] *
        (p[81] * Math.cos(DR * (day - p[82])) +
          p[86] * Math.cos(2 * DR * (day - p[87]))) +
      p[84] * Math.cos(DR * (day - p[85])) +
      p[88] * Math.cos(2 * DR * (day - p[89]))) *
    ((p[65] * plg[3][2] +
      p[66] * plg[5][2] +
      p[67] * plg[7][2] +
      p[75] * plg[2][2] +
      p[76] * plg[4][2] +
      p[77] * plg[6][2]) *
      Math.cos(DGTR * lon) +
      (p[91] * plg[3][2] +
        p[92] * plg[5][2] +
        p[93] * plg[7][2] +
        p[78] * plg[2][2] +
        p[79] * plg[4][2] +
        p[80] * plg[6][2]) *
        Math.sin(DGTR * lon));

  return t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t11 + t14;
};
/** ZETA: geopotential height difference from zl to zz, in km. */
const zeta = (re: number, zz: number, zl: number) =>
  ((zz - zl) * (re + zl)) / (re + zz);
/**
 * SPLINE: second derivatives of the cubic spline through (x, y), with first
 * derivatives yp1 and ypn at the ends (Numerical Recipes). The Fortran's
 * natural-spline option is never used.
 */
const spline = (
  x: readonly number[],
  y: readonly number[],
  yp1: number,
  ypn: number
): number[] => {
  const n = x.length;
  const y2 = [-0.5];
  const u = [(3 / (x[1] - x[0])) * ((y[1] - y[0]) / (x[1] - x[0]) - yp1)];

  for (let i = 1; i < n - 1; i++) {
    const sig = (x[i] - x[i - 1]) / (x[i + 1] - x[i - 1]);
    const p = sig * y2[i - 1] + 2;

    y2[i] = (sig - 1) / p;
    u[i] =
      ((6 *
        ((y[i + 1] - y[i]) / (x[i + 1] - x[i]) -
          (y[i] - y[i - 1]) / (x[i] - x[i - 1]))) /
        (x[i + 1] - x[i - 1]) -
        sig * u[i - 1]) /
      p;
  }

  const un =
    (3 / (x[n - 1] - x[n - 2])) *
    (ypn - (y[n - 1] - y[n - 2]) / (x[n - 1] - x[n - 2]));

  y2[n - 1] = (un - 0.5 * u[n - 2]) / (0.5 * y2[n - 2] + 1);

  for (let k = n - 2; k >= 0; k--) y2[k] = y2[k] * y2[k + 1] + u[k];

  return y2;
};
/** SPLINT: the cubic spline's value at x, by bisection for the interval. */
const splint = (
  xa: readonly number[],
  ya: readonly number[],
  y2a: readonly number[],
  x: number
): number => {
  let klo = 0;
  let khi = xa.length - 1;

  while (khi - klo > 1) {
    const k = (khi + klo) >> 1;

    if (xa[k] > x) khi = k;
    else klo = k;
  }

  const h = xa[khi] - xa[klo];
  const a = (xa[khi] - x) / h;
  const b = (x - xa[klo]) / h;

  return (
    a * ya[klo] +
    b * ya[khi] +
    (((a * a * a - a) * y2a[klo] + (b * b * b - b) * y2a[khi]) * h * h) / 6
  );
};
/** SPLINI: the integral of the cubic spline from xa[0] to x. */
const splini = (
  xa: readonly number[],
  ya: readonly number[],
  y2a: readonly number[],
  x: number
): number => {
  const n = xa.length;

  let yi = 0;

  for (let klo = 0, khi = 1; x > xa[klo] && khi < n; klo++, khi++) {
    const xx = khi < n - 1 ? Math.min(x, xa[khi]) : x;
    const h = xa[khi] - xa[klo];
    const a = (xa[khi] - xx) / h;
    const b = (xx - xa[klo]) / h;
    const a2 = a * a;
    const b2 = b * b;

    yi +=
      (((1 - a2) * ya[klo]) / 2 +
        (b2 * ya[khi]) / 2 +
        (((-(1 + a2 * a2) / 4 + a2 / 2) * y2a[klo] +
          ((b2 * b2) / 4 - b2 / 2) * y2a[khi]) *
          h *
          h) /
          6) *
      h;
  }

  return yi;
};
/**
 * The temperature profile between nodes, shared by DENSU and DENSM: 1/T is a
 * cubic spline in geopotential height through the nodes `zn` (km,
 * descending) at temperatures `tn`, with gradients `tg1` and `tg2` (K/km) at
 * the ends. Returns T1 = tn[0], the temperature at z, and the barometric
 * exponent per unit molecular weight, (g/R) ∫ dz/T from zn[0] down to z
 * (negative, as z is below zn[0]).
 */
const nodes = (
  ctx: Context,
  zn: readonly number[],
  tn: readonly number[],
  tg1: number,
  tg2: number,
  z: number
) => {
  const { gsurf, re } = ctx;
  const n = zn.length;
  const z1 = zn[0];
  const z2 = zn[n - 1];
  const t1 = tn[0];
  const t2 = tn[n - 1];
  const zgdif = zeta(re, z2, z1);
  const xs = zn.map((zk) => zeta(re, zk, z1) / zgdif);
  const ys = tn.map((tk) => 1 / tk);
  const yd1 = (-tg1 / (t1 * t1)) * zgdif;
  const yd2 = (-tg2 / (t2 * t2)) * zgdif * ((re + z2) / (re + z1)) ** 2;
  const y2 = spline(xs, ys, yd1, yd2);
  const x = zeta(re, z, z1) / zgdif;
  const glb = gsurf / (1 + z1 / re) ** 2;

  return {
    t1,
    tz: 1 / splint(xs, ys, y2, x),
    gamma: ((glb * zgdif) / RGAS) * splini(xs, ys, y2, x)
  };
};

/** The thermosphere's temperature profile, from GTS7. */
interface Thermosphere {
  /** Exospheric temperature and temperature at ZLB, in K. */
  tinf: number;
  tlb: number;
  /** Shape of the Bates profile, 1/km. */
  s: number;
  /** TN1(2) to TN1(5), in K, and TGN1(2), in K/km. */
  tn1: readonly number[];
  tgn1: number;
}

/**
 * DENSU: temperature and density of a species of molecular weight `xm` at
 * `alt` (km), in diffusive equilibrium from density `dlb` at ZLB.
 *
 * Above ZA the temperature follows the Bates profile, rising from TLB at ZLB
 * towards TINF; below, the spline through the TN1 nodes, joined to the Bates
 * profile at ZA in value and gradient. The density follows the barometric
 * law, with thermal diffusion factor `alpha`. The Fortran's caps on its
 * exponents can't trigger for heights of 72.5 km and up.
 */
const densu = (
  ctx: Context,
  th: Thermosphere,
  alt: number,
  dlb: number,
  xm: number,
  alpha: number
): { d: number; tz: number } => {
  const { gsurf, re } = ctx;
  const { tinf, tlb, s } = th;
  const zlb = ptm[6];
  const zg2 = zeta(re, Math.max(alt, ZA), zlb);
  // Bates temperature
  const tt = tinf - (tinf - tlb) * Math.exp(-s * zg2);
  const glb = gsurf / (1 + zlb / re) ** 2;
  const gamma = (xm * glb) / (s * RGAS * tinf);
  const densa =
    dlb * (tlb / tt) ** (1 + alpha + gamma) * Math.exp(-s * gamma * zg2);

  if (alt >= ZA) return { d: densa, tz: tt };

  // Gradient at ZA from the Bates profile
  const dta = (tinf - tt) * s * ((re + zlb) / (re + ZA)) ** 2;
  const low = nodes(ctx, ZN1, [tt, ...th.tn1], dta, th.tgn1, alt);

  return {
    d: densa * (low.t1 / low.tz) ** (1 + alpha) * Math.exp(-xm * low.gamma),
    tz: low.tz
  };
};
/**
 * DNET: blend a diffusive density `dd` and a fully mixed one `dm` across the
 * turbopause, with transition scale length `zhm`. The Fortran's other
 * cut-off, to `dm` above ylog = 10, can't trigger: from 72.5 km up, ylog
 * stays below about 8.
 */
const dnet = (dd: number, dm: number, zhm: number, xmm: number, xm: number) => {
  const a = zhm / (xmm - xm);
  const ylog = a * Math.log(dm / dd);

  if (ylog < -10) return dd;

  return dd * (1 + Math.exp(ylog)) ** (1 / a);
};
/**
 * CCOR: chemistry and dissociation correction, a factor going from e^r well
 * below `zh` to 1 well above, over scale length `h1`. The Fortran's cut-offs
 * at ±70 scale lengths make no difference in double precision.
 */
const ccor = (alt: number, r: number, h1: number, zh: number) =>
  Math.exp(r / (1 + Math.exp((alt - zh) / h1)));
/** CCOR2: CCOR for O and O2, with two scale lengths. */
const ccor2 = (alt: number, r: number, h1: number, zh: number, h2: number) =>
  Math.exp(
    r / (1 + 0.5 * (Math.exp((alt - zh) / h1) + Math.exp((alt - zh) / h2)))
  );
/** SCALH: scale height in km. */
const scalh = (ctx: Context, alt: number, xm: number, temp: number) =>
  (RGAS * temp) / ((ctx.gsurf / (1 + alt / ctx.re) ** 2) * xm);

/** A species' parameters for the turbopause blend in GTS7. */
interface Species {
  /** Molecular weight. */
  xm: number;
  /** Thermal diffusion factor. */
  alpha: number;
  /** Highest altitude where mixing matters, km (ALTL). */
  altl: number;
}

/**
 * GTS7: the thermosphere, from 72.5 km up. Each species is in diffusive
 * equilibrium above the turbopause and mixed below it (DNET), with
 * corrections for chemistry and dissociation (CCOR, CCOR2). Densities and
 * temperatures at the lower boundary vary with season, local time, latitude
 * and solar and magnetic activity (GLOBE7).
 */
const gts7 = (ctx: Context, z: number) => {
  const { lat, day, f107a } = ctx.input;
  // Exospheric temperature, and the gradient at the lower boundary: their
  // variations don't matter below ZA and 72.5 km
  const tinf =
    z > ZA ? ptm[1] * pt[1] * (1 + globe7(ctx, pt).g) : ptm[1] * pt[1];
  const g0 =
    z > ZN1[4] ? ptm[4] * ps[1] * (1 + globe7(ctx, ps).g) : ptm[4] * ps[1];
  const tlbG = globe7(ctx, pd[4]);
  const tlb = ptm[2] * (1 + tlbG.g) * pd[4][1];
  const s = g0 / (tinf - tlb);
  // Lower-thermosphere nodes: their variations don't matter above 300 km
  const vary = (p: readonly number[]) =>
    z < 300 ? glob7s(ctx, p, tlbG.ap) : 0;
  const tn1 = [
    (ptm[7] * ptl[1][1]) / (1 - vary(ptl[1])),
    (ptm[3] * ptl[2][1]) / (1 - vary(ptl[2])),
    (ptm[8] * ptl[3][1]) / (1 - vary(ptl[3])),
    (ptm[5] * ptl[4][1]) / (1 - vary(ptl[4]))
  ];
  const tgn1 =
    (ptm[9] * pma[9][1] * (1 + vary(pma[9])) * tn1[3] * tn1[3]) /
    (ptm[5] * ptl[4][1]) ** 2;
  const th: Thermosphere = { tinf, tlb, s, tn1, tgn1 };
  const xmm = pdm[3][5];
  // N2: diffusive density at ZLB and at the height, and the turbopause
  const db28 = pdm[3][1] * Math.exp(globe7(ctx, pd[3]).g) * pd[3][1];
  const n2 = densu(ctx, th, z, db28, 28, 0);
  const zhf =
    pdl[2][25] *
    (1 + pdl[1][25] * Math.sin(DGTR * lat) * Math.cos(DR * (day - pt[14])));
  const zh28 = pdm[3][3] * zhf;
  const zhm28 = pdm[3][4] * pdl[2][6];
  // Mixed density at ZLB, and at the height
  const b28 = densu(ctx, th, zh28, db28, 28 - xmm, -1).d;
  const dm28 = densu(ctx, th, z, b28, xmm, 0).d;
  const d3 = z > 160 ? n2.d : dnet(n2.d, dm28, zhm28, xmm, 28);
  // Another species, with column j of PDM: diffusive density at the height,
  // blended below `altl` with the mixed density, then corrected (`mixed`,
  // given its mixed density at ZLB) towards its mixing ratio at the ground
  // and for chemistry
  const species = (
    { xm, alpha, altl }: Species,
    p: readonly number[],
    j: number,
    mixed: (b: number) => number
  ) => {
    const db = pdm[j][1] * Math.exp(globe7(ctx, p).g) * p[1];
    const dd = densu(ctx, th, z, db, xm, alpha).d;

    if (z > altl) return dd;

    const b = densu(ctx, th, pdm[j][3], db, xm - xmm, alpha - 1).d;
    const dm = densu(ctx, th, z, b, xmm, 0).d;

    return dnet(dd, dm, zhm28, xmm, xm) * mixed(b);
  };
  const he = species({ xm: 4, alpha: -0.38, altl: 200 }, pd[1], 1, (b) =>
    ccor(
      z,
      Math.log((b28 * pdm[1][2]) / b),
      pdm[1][6] * pdl[2][2],
      pdm[1][5] * pdl[2][1]
    )
  );
  // O: since 3/16/99 the correction matches O2's departure from diffusive
  // equilibrium near 150 km, and depends on F10.7
  const o = species(
    { xm: 16, alpha: 0, altl: 300 },
    pd[2],
    2,
    () =>
      ccor2(
        z,
        pdm[2][2] * pdl[2][17] * (1 + pdl[1][24] * (f107a - 150)),
        pdm[2][6] * pdl[2][4],
        pdm[2][5] * pdl[2][3],
        pdm[2][6] * pdl[2][5]
      ) *
      ccor(
        z,
        pdm[2][4] * pdl[2][15],
        pdm[2][8] * pdl[2][14],
        pdm[2][7] * pdl[2][13]
      )
  );
  // O2, with a general departure from diffusive equilibrium above ZLB
  const o2 =
    species({ xm: 32, alpha: 0, altl: 250 }, pd[5], 4, (b) =>
      ccor(
        z,
        Math.log((b28 * pdm[4][2]) / b),
        pdm[4][6] * pdl[2][8],
        pdm[4][5] * pdl[2][7]
      )
    ) *
    ccor2(
      z,
      pdm[4][4] * pdl[2][24] * (1 + pdl[1][24] * (f107a - 150)),
      pdm[4][8] * pdl[2][23],
      pdm[4][7] * pdl[2][22],
      pdm[4][8] * pdl[1][23]
    );
  const ar = species({ xm: 40, alpha: 0.17, altl: 240 }, pd[6], 5, (b) =>
    ccor(
      z,
      Math.log((b28 * pdm[5][2]) / b),
      pdm[5][6] * pdl[2][10],
      pdm[5][5] * pdl[2][9]
    )
  );
  const h = species(
    { xm: 1, alpha: -0.38, altl: 320 },
    pd[7],
    6,
    (b) =>
      ccor(
        z,
        Math.log((b28 * pdm[6][2] * Math.abs(pdl[2][18])) / b),
        pdm[6][6] * pdl[2][12],
        pdm[6][5] * pdl[2][11]
      ) *
      ccor(
        z,
        pdm[6][4] * pdl[2][21],
        pdm[6][8] * pdl[2][20],
        pdm[6][7] * pdl[2][19]
      )
  );
  const n = species(
    { xm: 14, alpha: 0, altl: 450 },
    pd[8],
    7,
    (b) =>
      ccor(
        z,
        Math.log((b28 * pdm[7][2] * Math.abs(pdl[1][3])) / b),
        pdm[7][6] * pdl[1][2],
        pdm[7][5] * pdl[1][1]
      ) *
      ccor(
        z,
        pdm[7][4] * pdl[1][6],
        pdm[7][8] * pdl[1][5],
        pdm[7][7] * pdl[1][4]
      )
  );
  // Anomalous oxygen: isothermal at THO, falling off below ZMHO with scale
  // length ZSHT
  const tho = pdm[8][10] * pdl[1][7];
  const dbHot = pdm[8][1] * Math.exp(globe7(ctx, pd[9]).g) * pd[9][1];
  const hot = densu(ctx, { ...th, tinf: tho, tlb: tho }, z, dbHot, 16, 0).d;
  const zsht = pdm[8][6];
  const zmho = pdm[8][5];
  const zsho = scalh(ctx, zmho, 16, tho);
  const anomalousO =
    hot * Math.exp((-zsht / zsho) * (Math.exp(-(z - zmho) / zsht) - 1));

  return {
    d: { he, o, n2: d3, o2, ar, h, n, anomalousO },
    tinf,
    tz: n2.tz,
    dm28,
    tn1,
    tgn1,
    ap: tlbG.ap
  };
};
/**
 * DENSM: temperature and density of the fully mixed lower atmosphere, of
 * mean molecular weight `xm`, from density `d0` at 72.5 km: down the
 * spline through the TN2 nodes to 32.5 km, then the TN3 nodes to the ground.
 */
const densm = (
  ctx: Context,
  alt: number,
  d0: number,
  xm: number,
  tn2: readonly number[],
  tgn2: readonly number[],
  tn3: readonly number[],
  tgn3: readonly number[]
): { d: number; tz: number } => {
  // Stratosphere and mesosphere
  const meso = nodes(ctx, ZN2, tn2, tgn2[0], tgn2[1], Math.max(alt, ZN2[3]));
  const d = d0 * (meso.t1 / meso.tz) * Math.exp(-xm * meso.gamma);

  if (alt >= ZN3[0]) return { d, tz: meso.tz };

  // Troposphere and stratosphere
  const strat = nodes(ctx, ZN3, tn3, tgn3[0], tgn3[1], alt);

  return {
    d: d * (strat.t1 / strat.tz) * Math.exp(-xm * strat.gamma),
    tz: strat.tz
  };
};

type Densities = Pick<
  Gtd7Output,
  'he' | 'o' | 'n2' | 'o2' | 'ar' | 'h' | 'n' | 'anomalousO'
>;

/** Total mass densities: D(6) of GTD7, and of GTD7D with anomalous O. */
const output = (d: Densities, tinf: number, t: number): Gtd7Output => {
  const rho =
    AMU *
    (4 * d.he + 16 * d.o + 28 * d.n2 + 32 * d.o2 + 40 * d.ar + d.h + 14 * d.n);

  return { ...d, rho, rhoEffective: rho + AMU * 16 * d.anomalousO, tinf, t };
};

/**
 * GTD7 and GTD7D: NRLMSISE-00 from the ground up, in cgs. Above 72.5 km,
 * the thermosphere model (GTS7); below, the fully mixed lower atmosphere
 * (DENSM), blended into it between 62.5 and 72.5 km. O, H, N and anomalous O
 * are 0 below 72.5 km, and the exospheric temperature is the global average
 * below ZA (about 123 km).
 *
 * @internal
 */
export const gtd7 = (input: Gtd7Input): Gtd7Output => {
  const ctx = context(input);
  const { alt } = input;
  const ts = gts7(ctx, Math.max(alt, ZN2[0]));

  if (alt >= ZN2[0]) return output(ts.d, ts.tinf, ts.tz);

  // Temperatures at the nodes and gradients at the end nodes: the inverse
  // temperature is linear in the harmonics of GLOB7S. PMA has no
  // magnetic-activity terms, so the activity function passed doesn't matter
  const g = (j: number) => glob7s(ctx, pma[j], ts.ap);
  const tn2 = [
    ts.tn1[3],
    (pma[1][1] * pavgm[1]) / (1 - g(1)),
    (pma[2][1] * pavgm[2]) / (1 - g(2)),
    (pma[3][1] * pavgm[3]) / (1 - g(3))
  ];
  const tgn2 = [
    ts.tgn1,
    (pavgm[9] * pma[10][1] * (1 + g(10)) * tn2[3] * tn2[3]) /
      (pma[3][1] * pavgm[3]) ** 2
  ];
  const tn3 = [
    tn2[3],
    (pma[4][1] * pavgm[4]) / (1 - g(4)),
    (pma[5][1] * pavgm[5]) / (1 - g(5)),
    (pma[6][1] * pavgm[6]) / (1 - g(6)),
    (pma[7][1] * pavgm[7]) / (1 - g(7))
  ];
  const tgn3 = [
    tgn2[1],
    (pma[8][1] * pavgm[8] * (1 + g(8)) * tn3[4] * tn3[4]) /
      (pma[7][1] * pavgm[7]) ** 2
  ];
  const xmm = pdm[3][5];
  const ds = ts.d;
  // Linear transition to full mixing, from 72.5 down to 62.5 km
  const dmc = alt > ZMIX ? 1 - (ZN2[0] - alt) / (ZN2[0] - ZMIX) : 0;
  const lower = densm(ctx, alt, ts.dm28, xmm, tn2, tgn2, tn3, tgn3);
  const n2 = lower.d * (1 + (ds.n2 / ts.dm28 - 1) * dmc);
  // He, O2 and Ar at their mixing ratios to N2
  const mixed = (d: number, j: number) =>
    n2 * pdm[j][2] * (1 + (d / (ds.n2 * pdm[j][2]) - 1) * dmc);

  return output(
    {
      he: mixed(ds.he, 1),
      o: 0,
      n2,
      o2: mixed(ds.o2, 4),
      ar: mixed(ds.ar, 5),
      h: 0,
      n: 0,
      anomalousO: 0
    },
    ts.tinf,
    lower.tz
  );
};
