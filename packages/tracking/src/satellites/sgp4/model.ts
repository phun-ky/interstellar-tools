// SGP4: initialisation (sgp4init, initl) and propagation (sgp4), written from
// Vallado, Crawford, Hujsak & Kelso (2006), "Revisiting Spacetrack Report #3",
// AIAA 2006-6753, in its "improved" mode, and keeping its names. Lengths are in
// Earth radii and times in minutes, as in the report.

import type { MeanElementsInterface } from '@interstellar-tools/types';

import {
  type CommonTerms,
  dpper,
  dscom,
  dsinit,
  dspace,
  type PerturbedElements,
  type ResonanceTerms
} from './deep-space.js';

const TWO_PI = 2 * Math.PI;
const X2O3 = 2 / 3;
const TEMP4 = 1.5e-12;

// WGS-72, the gravity model element sets are fitted with
export const RADIUS_EARTH_KM = 6378.135;

const MU = 398600.8;
const XKE = 60 / Math.sqrt(RADIUS_EARTH_KM ** 3 / MU);
const J2 = 0.001082616;
const J3 = -0.00000253881;
const J4 = -0.00000165597;
const J3OJ2 = J3 / J2;
// km/s per Earth radius per minute
const VKMPERSEC = (RADIUS_EARTH_KM * XKE) / 60;
// 1949 December 31 00:00 UT, the epoch SGP4 counts days from
const JD_1950 = 2433281.5;

export interface Sgp4Model {
  // The elements, in the report's units: radians and rad/min
  ecco: number;
  inclo: number;
  nodeo: number;
  argpo: number;
  mo: number;
  bstar: number;
  noUnkozai: number;
  // Secular rates and drag coefficients
  isimp: boolean;
  aycof: number;
  con41: number;
  cc1: number;
  cc4: number;
  cc5: number;
  d2: number;
  d3: number;
  d4: number;
  delmo: number;
  eta: number;
  argpdot: number;
  omgcof: number;
  sinmao: number;
  t2cof: number;
  t3cof: number;
  t4cof: number;
  t5cof: number;
  x1mth2: number;
  x7thm1: number;
  mdot: number;
  nodedot: number;
  xlcof: number;
  xmcof: number;
  nodecf: number;
  gsto: number;
  // Deep space, for periods of 225 minutes or more
  deepSpace?: { lunarSolar: CommonTerms; resonance: ResonanceTerms };
}

/** Greenwich mean sidereal time as SGP4 computes it, from a UT1 Julian date. */
const gstime = (jdut1: number): number => {
  const tut1 = (jdut1 - 2451545) / 36525;
  const temp =
    -6.2e-6 * tut1 * tut1 * tut1 +
    0.093104 * tut1 * tut1 +
    (876600 * 3600 + 8640184.812866) * tut1 +
    67310.54841;
  const gst = ((temp * Math.PI) / 180 / 240) % TWO_PI;

  return gst < 0 ? gst + TWO_PI : gst;
};

/** The error SGP4 reports, as a `RangeError`. */
export const sgp4Error = (message: string, t: number) =>
  new RangeError(
    `SGP4 can't propagate these elements to ${t} min from epoch: ${message}`
  );

/** sgp4init: set up the model for an element set. */
export const sgp4Init = (elements: MeanElementsInterface): Sgp4Model => {
  const ecco = elements.e;
  const inclo = elements.i as number;
  const nodeo = elements.raan as number;
  const argpo = elements.argp as number;
  const mo = elements.meanAnomaly as number;
  const bstar = elements.bstar;
  const noKozai = elements.meanMotion * 60;
  const epoch = elements.epochJulianDate - JD_1950;
  // initl: un-Kozai the mean motion
  const eccsq = ecco * ecco;
  const omeosq = 1 - eccsq;
  const rteosq = Math.sqrt(omeosq);
  const cosio = Math.cos(inclo);
  const cosio2 = cosio * cosio;
  const ak = Math.pow(XKE / noKozai, X2O3);
  const d1 = (0.75 * J2 * (3 * cosio2 - 1)) / (rteosq * omeosq);

  let del = d1 / (ak * ak);

  const adel = ak * (1 - del * del - del * (1 / 3 + (134 * del * del) / 81));

  del = d1 / (adel * adel);

  const noUnkozai = noKozai / (1 + del);
  const ao = Math.pow(XKE / noUnkozai, X2O3);
  const sinio = Math.sin(inclo);
  const po = ao * omeosq;
  const con42 = 1 - 5 * cosio2;
  const con41 = -con42 - cosio2 - cosio2;
  const posq = po * po;
  const rp = ao * (1 - ecco);
  const gsto = gstime(epoch + JD_1950);
  // sgp4init
  const ss = 78 / RADIUS_EARTH_KM + 1;
  const qzms2t = ((120 - 78) / RADIUS_EARTH_KM) ** 4;

  // Perigee below 220 km: drop the higher-order drag terms
  let isimp = rp < 220 / RADIUS_EARTH_KM + 1;
  let sfour = ss;
  let qzms24 = qzms2t;

  const perige = (rp - 1) * RADIUS_EARTH_KM;

  // Below 156 km, move the atmosphere's reference height down with perigee
  if (perige < 156) {
    sfour = perige < 98 ? 20 : perige - 78;
    qzms24 = ((120 - sfour) / RADIUS_EARTH_KM) ** 4;
    sfour = sfour / RADIUS_EARTH_KM + 1;
  }

  const pinvsq = 1 / posq;
  const tsi = 1 / (ao - sfour);
  const eta = ao * ecco * tsi;
  const etasq = eta * eta;
  const eeta = ecco * eta;
  const psisq = Math.abs(1 - etasq);
  const coef = qzms24 * tsi ** 4;
  const coef1 = coef / psisq ** 3.5;
  const cc2 =
    coef1 *
    noUnkozai *
    (ao * (1 + 1.5 * etasq + eeta * (4 + etasq)) +
      ((0.375 * J2 * tsi) / psisq) * con41 * (8 + 3 * etasq * (8 + etasq)));
  const cc1 = bstar * cc2;
  const cc3 =
    ecco > 1e-4 ? (-2 * coef * tsi * J3OJ2 * noUnkozai * sinio) / ecco : 0;
  const x1mth2 = 1 - cosio2;
  const cc4 =
    2 *
    noUnkozai *
    coef1 *
    ao *
    omeosq *
    (eta * (2 + 0.5 * etasq) +
      ecco * (0.5 + 2 * etasq) -
      ((J2 * tsi) / (ao * psisq)) *
        (-3 * con41 * (1 - 2 * eeta + etasq * (1.5 - 0.5 * eeta)) +
          0.75 *
            x1mth2 *
            (2 * etasq - eeta * (1 + etasq)) *
            Math.cos(2 * argpo)));
  const cc5 =
    2 * coef1 * ao * omeosq * (1 + 2.75 * (etasq + eeta) + eeta * etasq);
  const cosio4 = cosio2 * cosio2;
  const temp1 = 1.5 * J2 * pinvsq * noUnkozai;
  const temp2 = 0.5 * temp1 * J2 * pinvsq;
  const temp3 = -0.46875 * J4 * pinvsq * pinvsq * noUnkozai;
  const mdot =
    noUnkozai +
    0.5 * temp1 * rteosq * con41 +
    0.0625 * temp2 * rteosq * (13 - 78 * cosio2 + 137 * cosio4);
  const argpdot =
    -0.5 * temp1 * con42 +
    0.0625 * temp2 * (7 - 114 * cosio2 + 395 * cosio4) +
    temp3 * (3 - 36 * cosio2 + 49 * cosio4);
  const xhdot1 = -temp1 * cosio;
  const nodedot =
    xhdot1 +
    (0.5 * temp2 * (4 - 19 * cosio2) + 2 * temp3 * (3 - 7 * cosio2)) * cosio;
  const xpidot = argpdot + nodedot;
  const delmotemp = 1 + eta * Math.cos(mo);
  const model: Sgp4Model = {
    ecco,
    inclo,
    nodeo,
    argpo,
    mo,
    bstar,
    noUnkozai,
    isimp,
    aycof: -0.5 * J3OJ2 * sinio,
    con41,
    cc1,
    cc4,
    cc5,
    d2: 0,
    d3: 0,
    d4: 0,
    delmo: delmotemp * delmotemp * delmotemp,
    eta,
    argpdot,
    omgcof: bstar * cc3 * Math.cos(argpo),
    sinmao: Math.sin(mo),
    t2cof: 1.5 * cc1,
    t3cof: 0,
    t4cof: 0,
    t5cof: 0,
    x1mth2,
    x7thm1: 7 * cosio2 - 1,
    mdot,
    nodedot,
    // Avoid dividing by 0 at 180° of inclination
    xlcof:
      (-0.25 * J3OJ2 * sinio * (3 + 5 * cosio)) /
      (Math.abs(cosio + 1) > TEMP4 ? 1 + cosio : TEMP4),
    xmcof: ecco > 1e-4 ? (-X2O3 * coef * bstar) / eeta : 0,
    nodecf: 3.5 * omeosq * xhdot1 * cc1,
    gsto
  };

  // A period of 225 minutes or more is deep space
  if (TWO_PI / noUnkozai >= 225) {
    isimp = true;
    model.isimp = true;

    const lunarSolar = dscom(epoch, ecco, argpo, 0, inclo, nodeo, noUnkozai);

    model.deepSpace = {
      lunarSolar,
      resonance: dsinit(lunarSolar, {
        xke: XKE,
        argpo,
        t: 0,
        tc: 0,
        gsto,
        mo,
        mdot,
        no: noUnkozai,
        nodeo,
        nodedot,
        xpidot,
        ecco,
        eccsq,
        inclm: inclo
      })
    };
  }

  if (!isimp) {
    const cc1sq = cc1 * cc1;
    const d2 = 4 * ao * tsi * cc1sq;
    const temp = (d2 * tsi * cc1) / 3;
    const d3 = (17 * ao + sfour) * temp;
    const d4 = 0.5 * temp * ao * tsi * (221 * ao + 31 * sfour) * cc1;

    model.d2 = d2;
    model.d3 = d3;
    model.d4 = d4;
    model.t3cof = d2 + 2 * cc1sq;
    model.t4cof = 0.25 * (3 * d3 + cc1 * (12 * d2 + 10 * cc1sq));
    model.t5cof =
      0.2 *
      (3 * d4 + 12 * cc1 * d3 + 6 * d2 * d2 + 15 * cc1sq * (2 * d2 + cc1sq));
  }

  return model;
};

/**
 * sgp4: position and velocity in TEME at `t` minutes since epoch, in km and
 * km/s.
 */
export const sgp4 = (
  model: Sgp4Model,
  t: number
): { r: [number, number, number]; v: [number, number, number] } => {
  // Secular gravity and atmospheric drag
  const xmdf = model.mo + model.mdot * t;
  const argpdf = model.argpo + model.argpdot * t;
  const nodedf = model.nodeo + model.nodedot * t;
  const t2 = t * t;

  let argpm = argpdf;
  let mm = xmdf;
  let nodem = nodedf + model.nodecf * t2;
  let tempa = 1 - model.cc1 * t;
  let tempe = model.bstar * model.cc4 * t;
  let templ = model.t2cof * t2;

  if (!model.isimp) {
    const delomg = model.omgcof * t;
    const delmtemp = 1 + model.eta * Math.cos(xmdf);
    const delm = model.xmcof * (delmtemp * delmtemp * delmtemp - model.delmo);
    const temp = delomg + delm;
    const t3 = t2 * t;
    const t4 = t3 * t;

    mm = xmdf + temp;
    argpm = argpdf - temp;
    tempa = tempa - model.d2 * t2 - model.d3 * t3 - model.d4 * t4;
    tempe += model.bstar * model.cc5 * (Math.sin(mm) - model.sinmao);
    templ += model.t3cof * t3 + t4 * (model.t4cof + t * model.t5cof);
  }

  let nm = model.noUnkozai;
  let em = model.ecco;
  let inclm = model.inclo;

  if (model.deepSpace) {
    const state = { em, argpm, inclm, mm, nm, nodem };

    dspace(
      model.deepSpace.resonance,
      model.argpo,
      model.argpdot,
      t,
      model.gsto,
      model.noUnkozai,
      state
    );
    ({ em, argpm, inclm, mm, nm, nodem } = state);
  }

  if (nm <= 0) throw sgp4Error(`the mean motion fell to ${nm} rad/min`, t);

  const am = Math.pow(XKE / nm, X2O3) * tempa * tempa;

  nm = XKE / am ** 1.5;
  em -= tempe;

  if (em >= 1 || em < -0.001)
    throw sgp4Error(`the mean eccentricity reached ${em}`, t);

  // Avoid dividing by 0
  if (em < 1e-6) em = 1e-6;

  mm += model.noUnkozai * templ;

  let xlm = mm + argpm + nodem;

  nodem %= TWO_PI;
  argpm %= TWO_PI;
  xlm %= TWO_PI;
  mm = (xlm - argpm - nodem) % TWO_PI;

  // Lunar and solar periodics
  const p: PerturbedElements = {
    ep: em,
    inclp: inclm,
    nodep: nodem,
    argpp: argpm,
    mp: mm
  };

  let sinip = Math.sin(inclm);
  let cosip = Math.cos(inclm);
  let { aycof, xlcof, con41, x1mth2, x7thm1 } = model;

  if (model.deepSpace) {
    dpper(model.deepSpace.lunarSolar, t, p);

    if (p.inclp < 0) {
      p.inclp = -p.inclp;
      p.nodep += Math.PI;
      p.argpp -= Math.PI;
    }

    if (p.ep < 0 || p.ep > 1)
      throw sgp4Error(`the perturbed eccentricity reached ${p.ep}`, t);

    sinip = Math.sin(p.inclp);
    cosip = Math.cos(p.inclp);
    aycof = -0.5 * J3OJ2 * sinip;
    xlcof =
      (-0.25 * J3OJ2 * sinip * (3 + 5 * cosip)) /
      (Math.abs(cosip + 1) > TEMP4 ? 1 + cosip : TEMP4);
  }

  // Long-period periodics
  const axnl = p.ep * Math.cos(p.argpp);

  let temp = 1 / (am * (1 - p.ep * p.ep));

  const aynl = p.ep * Math.sin(p.argpp) + temp * aycof;
  const xl = p.mp + p.argpp + p.nodep + temp * xlcof * axnl;
  // Kepler's equation, with the steps limited
  const u = (xl - p.nodep) % TWO_PI;

  let eo1 = u;
  let tem5 = 9999.9;
  let sineo1 = 0;
  let coseo1 = 0;

  for (let ktr = 1; Math.abs(tem5) >= 1e-12 && ktr <= 10; ktr++) {
    sineo1 = Math.sin(eo1);
    coseo1 = Math.cos(eo1);
    tem5 = 1 - coseo1 * axnl - sineo1 * aynl;
    tem5 = (u - aynl * coseo1 + axnl * sineo1 - eo1) / tem5;

    if (Math.abs(tem5) >= 0.95) tem5 = tem5 > 0 ? 0.95 : -0.95;

    eo1 += tem5;
  }

  // Short-period periodics
  const ecose = axnl * coseo1 + aynl * sineo1;
  const esine = axnl * sineo1 - aynl * coseo1;
  const el2 = axnl * axnl + aynl * aynl;
  const pl = am * (1 - el2);

  if (pl < 0) throw sgp4Error(`the semi-latus rectum fell to ${pl}`, t);

  const rl = am * (1 - ecose);
  const rdotl = (Math.sqrt(am) * esine) / rl;
  const rvdotl = Math.sqrt(pl) / rl;
  const betal = Math.sqrt(1 - el2);

  temp = esine / (1 + betal);

  const sinu = (am / rl) * (sineo1 - aynl - axnl * temp);
  const cosu = (am / rl) * (coseo1 - axnl + aynl * temp);

  let su = Math.atan2(sinu, cosu);

  const sin2u = (cosu + cosu) * sinu;
  const cos2u = 1 - 2 * sinu * sinu;

  temp = 1 / pl;

  const temp1 = 0.5 * J2 * temp;
  const temp2 = temp1 * temp;

  if (model.deepSpace) {
    const cosisq = cosip * cosip;

    con41 = 3 * cosisq - 1;
    x1mth2 = 1 - cosisq;
    x7thm1 = 7 * cosisq - 1;
  }

  const mrt =
    rl * (1 - 1.5 * temp2 * betal * con41) + 0.5 * temp1 * x1mth2 * cos2u;

  su -= 0.25 * temp2 * x7thm1 * sin2u;

  const xnode = p.nodep + 1.5 * temp2 * cosip * sin2u;
  const xinc = p.inclp + 1.5 * temp2 * cosip * sinip * cos2u;
  const mvt = rdotl - (nm * temp1 * x1mth2 * sin2u) / XKE;
  const rvdot = rvdotl + (nm * temp1 * (x1mth2 * cos2u + 1.5 * con41)) / XKE;
  // Orientation vectors
  const sinsu = Math.sin(su);
  const cossu = Math.cos(su);
  const snod = Math.sin(xnode);
  const cnod = Math.cos(xnode);
  const sini = Math.sin(xinc);
  const cosi = Math.cos(xinc);
  const xmx = -snod * cosi;
  const xmy = cnod * cosi;
  const ux = xmx * sinsu + cnod * cossu;
  const uy = xmy * sinsu + snod * cossu;
  const uz = sini * sinsu;
  const vx = xmx * cossu - cnod * sinsu;
  const vy = xmy * cossu - snod * sinsu;
  const vz = sini * cossu;

  // Below the surface: the satellite has decayed
  if (mrt < 1)
    throw sgp4Error(
      `the satellite has decayed: its distance from Earth's centre fell to ${(mrt * RADIUS_EARTH_KM).toFixed(1)} km`,
      t
    );

  return {
    r: [
      mrt * ux * RADIUS_EARTH_KM,
      mrt * uy * RADIUS_EARTH_KM,
      mrt * uz * RADIUS_EARTH_KM
    ],
    v: [
      (mvt * ux + rvdot * vx) * VKMPERSEC,
      (mvt * uy + rvdot * vy) * VKMPERSEC,
      (mvt * uz + rvdot * vz) * VKMPERSEC
    ]
  };
};
