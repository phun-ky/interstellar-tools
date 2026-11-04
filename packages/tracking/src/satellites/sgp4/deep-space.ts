// SDP4, the deep-space part of SGP4: lunar and solar perturbations, and the
// resonances of 12- and 24-hour orbits. Written from Vallado, Crawford,
// Hujsak & Kelso (2006), "Revisiting Spacetrack Report #3", AIAA 2006-6753,
// and keeping its names (dscom, dpper, dsinit, dspace), so the code can be
// read against the paper line by line.

const TWO_PI = 2 * Math.PI;
// Solar and lunar constants
const ZES = 0.01675;
const ZEL = 0.0549;
const ZNS = 1.19459e-5;
const ZNL = 1.5835218e-4;
// Earth's rotation rate, rad/min: the report's 4.37526908801129966e-3, as
// the nearest double
const RPTIM = 4.3752690880113e-3;

/** The lunar and solar coefficients that stay fixed for an element set. */
export interface LunarSolarTerms {
  e3: number;
  ee2: number;
  se2: number;
  se3: number;
  sgh2: number;
  sgh3: number;
  sgh4: number;
  sh2: number;
  sh3: number;
  si2: number;
  si3: number;
  sl2: number;
  sl3: number;
  sl4: number;
  xgh2: number;
  xgh3: number;
  xgh4: number;
  xh2: number;
  xh3: number;
  xi2: number;
  xi3: number;
  xl2: number;
  xl3: number;
  xl4: number;
  zmol: number;
  zmos: number;
}

/** What dscom computes for dsinit, besides the lunar and solar terms. */
export interface CommonTerms extends LunarSolarTerms {
  sinim: number;
  cosim: number;
  emsq: number;
  s1: number;
  s2: number;
  s3: number;
  s4: number;
  s5: number;
  ss1: number;
  ss2: number;
  ss3: number;
  ss4: number;
  ss5: number;
  sz1: number;
  sz3: number;
  sz11: number;
  sz13: number;
  sz21: number;
  sz23: number;
  sz31: number;
  sz33: number;
  z1: number;
  z3: number;
  z11: number;
  z13: number;
  z21: number;
  z23: number;
  z31: number;
  z33: number;
}

/** The secular rates and resonance terms dsinit sets up for dspace. */
export interface ResonanceTerms {
  irez: 0 | 1 | 2;
  d2201: number;
  d2211: number;
  d3210: number;
  d3222: number;
  d4410: number;
  d4422: number;
  d5220: number;
  d5232: number;
  d5421: number;
  d5433: number;
  dedt: number;
  didt: number;
  dmdt: number;
  dnodt: number;
  domdt: number;
  del1: number;
  del2: number;
  del3: number;
  xfact: number;
  xlamo: number;
}

/**
 * dscom: the lunar and solar terms, from the epoch (days since 1949-12-31
 * 00:00 UT) and the elements at it.
 */
export const dscom = (
  epoch: number,
  ep: number,
  argpp: number,
  tc: number,
  inclp: number,
  nodep: number,
  np: number
): CommonTerms => {
  const c1ss = 2.9864797e-6;
  const c1l = 4.7968065e-7;
  const zsinis = 0.39785416;
  const zcosis = 0.91744867;
  const zcosgs = 0.1945905;
  const zsings = -0.98088458;
  const nm = np;
  const em = ep;
  const snodm = Math.sin(nodep);
  const cnodm = Math.cos(nodep);
  const sinomm = Math.sin(argpp);
  const cosomm = Math.cos(argpp);
  const sinim = Math.sin(inclp);
  const cosim = Math.cos(inclp);
  const emsq = em * em;
  const betasq = 1 - emsq;
  const rtemsq = Math.sqrt(betasq);
  const day = epoch + 18261.5 + tc / 1440;
  const xnodce = (4.523602 - 9.2422029e-4 * day) % TWO_PI;
  const stem = Math.sin(xnodce);
  const ctem = Math.cos(xnodce);
  const zcosil = 0.91375164 - 0.03568096 * ctem;
  const zsinil = Math.sqrt(1 - zcosil * zcosil);
  const zsinhl = (0.089683511 * stem) / zsinil;
  const zcoshl = Math.sqrt(1 - zsinhl * zsinhl);
  const gam = 5.8351514 + 0.001944368 * day;

  let zx = (0.39785416 * stem) / zsinil;

  const zy = zcoshl * ctem + 0.91744867 * zsinhl * stem;

  zx = Math.atan2(zx, zy);
  zx = gam + zx - xnodce;

  const zcosgl = Math.cos(zx);
  const zsingl = Math.sin(zx);

  // The Sun first, then the Moon
  let zcosg = zcosgs;
  let zsing = zsings;
  let zcosi = zcosis;
  let zsini = zsinis;
  let zcosh = cnodm;
  let zsinh = snodm;
  let cc = c1ss;

  const xnoi = 1 / nm;
  const sun = { s: [0, 0, 0, 0, 0, 0, 0], z: [] as number[] };

  let s = [0, 0, 0, 0, 0, 0, 0];
  let z: number[] = [];

  for (let lsflg = 1; lsflg <= 2; lsflg++) {
    const a1 = zcosg * zcosh + zsing * zcosi * zsinh;
    const a3 = -zsing * zcosh + zcosg * zcosi * zsinh;
    const a7 = -zcosg * zsinh + zsing * zcosi * zcosh;
    const a8 = zsing * zsini;
    const a9 = zsing * zsinh + zcosg * zcosi * zcosh;
    const a10 = zcosg * zsini;
    const a2 = cosim * a7 + sinim * a8;
    const a4 = cosim * a9 + sinim * a10;
    const a5 = -sinim * a7 + cosim * a8;
    const a6 = -sinim * a9 + cosim * a10;
    const x1 = a1 * cosomm + a2 * sinomm;
    const x2 = a3 * cosomm + a4 * sinomm;
    const x3 = -a1 * sinomm + a2 * cosomm;
    const x4 = -a3 * sinomm + a4 * cosomm;
    const x5 = a5 * sinomm;
    const x6 = a6 * sinomm;
    const x7 = a5 * cosomm;
    const x8 = a6 * cosomm;
    const z31 = 12 * x1 * x1 - 3 * x3 * x3;
    const z32 = 24 * x1 * x2 - 6 * x3 * x4;
    const z33 = 12 * x2 * x2 - 3 * x4 * x4;

    let z1 = 3 * (a1 * a1 + a2 * a2) + z31 * emsq;
    let z2 = 6 * (a1 * a3 + a2 * a4) + z32 * emsq;
    let z3 = 3 * (a3 * a3 + a4 * a4) + z33 * emsq;

    const z11 = -6 * a1 * a5 + emsq * (-24 * x1 * x7 - 6 * x3 * x5);
    const z12 =
      -6 * (a1 * a6 + a3 * a5) +
      emsq * (-24 * (x2 * x7 + x1 * x8) - 6 * (x3 * x6 + x4 * x5));
    const z13 = -6 * a3 * a6 + emsq * (-24 * x2 * x8 - 6 * x4 * x6);
    const z21 = 6 * a2 * a5 + emsq * (24 * x1 * x5 - 6 * x3 * x7);
    const z22 =
      6 * (a4 * a5 + a2 * a6) +
      emsq * (24 * (x2 * x5 + x1 * x6) - 6 * (x4 * x7 + x3 * x8));
    const z23 = 6 * a4 * a6 + emsq * (24 * x2 * x6 - 6 * x4 * x8);

    z1 = z1 + z1 + betasq * z31;
    z2 = z2 + z2 + betasq * z32;
    z3 = z3 + z3 + betasq * z33;

    const s3 = cc * xnoi;
    const s2 = (-0.5 * s3) / rtemsq;
    const s4 = s3 * rtemsq;
    const s1 = -15 * em * s4;
    const s5 = x1 * x3 + x2 * x4;
    const s6 = x2 * x3 + x1 * x4;
    const s7 = x2 * x4 - x1 * x3;

    s = [s1, s2, s3, s4, s5, s6, s7];
    // z1, z2, z3, z11, z12, z13, z21, z22, z23, z31, z32, z33
    z = [z1, z2, z3, z11, z12, z13, z21, z22, z23, z31, z32, z33];

    if (lsflg === 1) {
      sun.s = s;
      sun.z = z;
      zcosg = zcosgl;
      zsing = zsingl;
      zcosi = zcosil;
      zsini = zsinil;
      zcosh = zcoshl * cnodm + zsinhl * snodm;
      zsinh = snodm * zcoshl - cnodm * zsinhl;
      cc = c1l;
    }
  }

  const [ss1, ss2, ss3, ss4, ss5, ss6, ss7] = sun.s as [
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  const [sz1, sz2, sz3, sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33] =
    sun.z as [
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number,
      number
    ];
  const [s1, s2, s3, s4, s5, s6, s7] = s as [
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  const [z1, z2, z3, z11, z12, z13, z21, z22, z23, z31, z32, z33] = z as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];

  return {
    sinim,
    cosim,
    emsq,
    s1,
    s2,
    s3,
    s4,
    s5,
    ss1,
    ss2,
    ss3,
    ss4,
    ss5,
    sz1,
    sz3,
    sz11,
    sz13,
    sz21,
    sz23,
    sz31,
    sz33,
    z1,
    z3,
    z11,
    z13,
    z21,
    z23,
    z31,
    z33,
    zmol: (4.7199672 + 0.2299715 * day - gam) % TWO_PI,
    zmos: (6.2565837 + 0.017201977 * day) % TWO_PI,
    // Solar terms
    se2: 2 * ss1 * ss6,
    se3: 2 * ss1 * ss7,
    si2: 2 * ss2 * sz12,
    si3: 2 * ss2 * (sz13 - sz11),
    sl2: -2 * ss3 * sz2,
    sl3: -2 * ss3 * (sz3 - sz1),
    sl4: -2 * ss3 * (-21 - 9 * emsq) * ZES,
    sgh2: 2 * ss4 * sz32,
    sgh3: 2 * ss4 * (sz33 - sz31),
    sgh4: -18 * ss4 * ZES,
    sh2: -2 * ss2 * sz22,
    sh3: -2 * ss2 * (sz23 - sz21),
    // Lunar terms
    ee2: 2 * s1 * s6,
    e3: 2 * s1 * s7,
    xi2: 2 * s2 * z12,
    xi3: 2 * s2 * (z13 - z11),
    xl2: -2 * s3 * z2,
    xl3: -2 * s3 * (z3 - z1),
    xl4: -2 * s3 * (-21 - 9 * emsq) * ZEL,
    xgh2: 2 * s4 * z32,
    xgh3: 2 * s4 * (z33 - z31),
    xgh4: -18 * s4 * ZEL,
    xh2: -2 * s2 * z22,
    xh3: -2 * s2 * (z23 - z21)
  };
};

/** Elements that dpper and dspace update. */
export interface PerturbedElements {
  ep: number;
  inclp: number;
  nodep: number;
  argpp: number;
  mp: number;
}

/**
 * dpper: add the lunar and solar periodics at `t` minutes since epoch to the
 * elements, in place. Below 0.2 rad of inclination it applies them with
 * Lyddane's modification, which avoids dividing by sin i.
 */
export const dpper = (
  terms: LunarSolarTerms,
  t: number,
  elements: PerturbedElements
): void => {
  let zm = terms.zmos + ZNS * t;
  let zf = zm + 2 * ZES * Math.sin(zm);
  let sinzf = Math.sin(zf);
  let f2 = 0.5 * sinzf * sinzf - 0.25;
  let f3 = -0.5 * sinzf * Math.cos(zf);

  const ses = terms.se2 * f2 + terms.se3 * f3;
  const sis = terms.si2 * f2 + terms.si3 * f3;
  const sls = terms.sl2 * f2 + terms.sl3 * f3 + terms.sl4 * sinzf;
  const sghs = terms.sgh2 * f2 + terms.sgh3 * f3 + terms.sgh4 * sinzf;
  const shs = terms.sh2 * f2 + terms.sh3 * f3;

  zm = terms.zmol + ZNL * t;
  zf = zm + 2 * ZEL * Math.sin(zm);
  sinzf = Math.sin(zf);
  f2 = 0.5 * sinzf * sinzf - 0.25;
  f3 = -0.5 * sinzf * Math.cos(zf);

  const sel = terms.ee2 * f2 + terms.e3 * f3;
  const sil = terms.xi2 * f2 + terms.xi3 * f3;
  const sll = terms.xl2 * f2 + terms.xl3 * f3 + terms.xl4 * sinzf;
  const sghl = terms.xgh2 * f2 + terms.xgh3 * f3 + terms.xgh4 * sinzf;
  const shll = terms.xh2 * f2 + terms.xh3 * f3;
  // The report subtracts the periodics at epoch too, but they're always 0
  const pe = ses + sel;
  const pinc = sis + sil;
  const pl = sls + sll;

  let pgh = sghs + sghl;
  let ph = shs + shll;

  elements.inclp += pinc;
  elements.ep += pe;

  const sinip = Math.sin(elements.inclp);
  const cosip = Math.cos(elements.inclp);

  if (elements.inclp >= 0.2) {
    ph /= sinip;
    pgh -= cosip * ph;
    elements.argpp += pgh;
    elements.nodep += ph;
    elements.mp += pl;
  } else {
    // Lyddane's modification
    const sinop = Math.sin(elements.nodep);
    const cosop = Math.cos(elements.nodep);

    let alfdp = sinip * sinop;
    let betdp = sinip * cosop;

    const dalf = ph * cosop + pinc * cosip * sinop;
    const dbet = -ph * sinop + pinc * cosip * cosop;

    alfdp += dalf;
    betdp += dbet;
    elements.nodep %= TWO_PI;

    let xls = elements.mp + elements.argpp + cosip * elements.nodep;

    const dls = pl + pgh - pinc * elements.nodep * sinip;

    xls += dls;

    const xnoh = elements.nodep;

    elements.nodep = Math.atan2(alfdp, betdp);

    if (Math.abs(xnoh - elements.nodep) > Math.PI)
      elements.nodep += elements.nodep < xnoh ? TWO_PI : -TWO_PI;

    elements.mp += pl;
    elements.argpp = xls - elements.mp - cosip * elements.nodep;
  }
};

/** What dsinit needs from the near-Earth initialisation. */
export interface DeepSpaceInputs {
  xke: number;
  argpo: number;
  t: number;
  tc: number;
  gsto: number;
  mo: number;
  mdot: number;
  no: number;
  nodeo: number;
  nodedot: number;
  xpidot: number;
  ecco: number;
  eccsq: number;
  inclm: number;
}

/**
 * dsinit: the secular lunar and solar rates, and, for orbits near 12 or 24
 * hours, the resonance terms.
 */
export const dsinit = (
  c: CommonTerms,
  inputs: DeepSpaceInputs
): ResonanceTerms => {
  const q22 = 1.7891679e-6;
  const q31 = 2.1460748e-6;
  const q33 = 2.2123015e-7;
  const root22 = 1.7891679e-6;
  const root44 = 7.3636953e-9;
  const root54 = 2.1765803e-9;
  const root32 = 3.7393792e-7;
  const root52 = 1.1428639e-7;
  const { xke, argpo, tc, gsto, mo, mdot, no, nodeo, nodedot, xpidot } = inputs;
  const { cosim, sinim } = c;
  const nm = no;
  const em = inputs.ecco;

  let emsq = c.emsq;

  // Near 24 hours, or near 12 hours on an eccentric orbit
  const irez =
    nm < 0.0052359877 && nm > 0.0034906585
      ? 1
      : nm >= 8.26e-3 && nm <= 9.24e-3 && em >= 0.5
        ? 2
        : 0;
  // Solar terms
  const ses = c.ss1 * ZNS * c.ss5;
  const sis = c.ss2 * ZNS * (c.sz11 + c.sz13);
  const sls = -ZNS * c.ss3 * (c.sz1 + c.sz3 - 14 - 6 * emsq);
  const sghs = c.ss4 * ZNS * (c.sz31 + c.sz33 - 6);
  // Within 3° of an equatorial orbit, the node is undefined
  const equatorial =
    inputs.inclm < 5.2359877e-2 || inputs.inclm > Math.PI - 5.2359877e-2;

  let shs = equatorial ? 0 : -ZNS * c.ss2 * (c.sz21 + c.sz23);

  if (sinim !== 0) shs /= sinim;

  const sgs = sghs - cosim * shs;
  // Lunar terms
  const dedt = ses + c.s1 * ZNL * c.s5;
  const didt = sis + c.s2 * ZNL * (c.z11 + c.z13);
  const dmdt = sls - ZNL * c.s3 * (c.z1 + c.z3 - 14 - 6 * emsq);
  const sghl = c.s4 * ZNL * (c.z31 + c.z33 - 6);
  const shll = equatorial ? 0 : -ZNL * c.s2 * (c.z21 + c.z23);

  let domdt = sgs + sghl;
  let dnodt = shs;

  if (sinim !== 0) {
    domdt -= (cosim / sinim) * shll;
    dnodt += shll / sinim;
  }

  const theta = (gsto + tc * RPTIM) % TWO_PI;
  const terms: ResonanceTerms = {
    irez,
    d2201: 0,
    d2211: 0,
    d3210: 0,
    d3222: 0,
    d4410: 0,
    d4422: 0,
    d5220: 0,
    d5232: 0,
    d5421: 0,
    d5433: 0,
    dedt,
    didt,
    dmdt,
    dnodt,
    domdt,
    del1: 0,
    del2: 0,
    del3: 0,
    xfact: 0,
    xlamo: 0
  };

  if (irez === 0) return terms;

  const aonv = Math.pow(nm / xke, 2 / 3);

  if (irez === 2) {
    // Geopotential resonance of 12-hour orbits
    const cosisq = cosim * cosim;
    const e = inputs.ecco;

    emsq = inputs.eccsq;

    const eoc = e * emsq;
    const g201 = -0.306 - (e - 0.64) * 0.44;

    let g211: number;
    let g310: number;
    let g322: number;
    let g410: number;
    let g422: number;
    let g520: number;

    if (e <= 0.65) {
      g211 = 3.616 - 13.247 * e + 16.29 * emsq;
      g310 = -19.302 + 117.39 * e - 228.419 * emsq + 156.591 * eoc;
      g322 = -18.9068 + 109.7927 * e - 214.6334 * emsq + 146.5816 * eoc;
      g410 = -41.122 + 242.694 * e - 471.094 * emsq + 313.953 * eoc;
      g422 = -146.407 + 841.88 * e - 1629.014 * emsq + 1083.435 * eoc;
      g520 = -532.114 + 3017.977 * e - 5740.032 * emsq + 3708.276 * eoc;
    } else {
      g211 = -72.099 + 331.819 * e - 508.738 * emsq + 266.724 * eoc;
      g310 = -346.844 + 1582.851 * e - 2415.925 * emsq + 1246.113 * eoc;
      g322 = -342.585 + 1554.908 * e - 2366.899 * emsq + 1215.972 * eoc;
      g410 = -1052.797 + 4758.686 * e - 7193.992 * emsq + 3651.957 * eoc;
      g422 = -3581.69 + 16178.11 * e - 24462.77 * emsq + 12422.52 * eoc;
      g520 =
        e > 0.715
          ? -5149.66 + 29936.92 * e - 54087.36 * emsq + 31324.56 * eoc
          : 1464.74 - 4664.75 * e + 3763.64 * emsq;
    }

    let g533: number;
    let g521: number;
    let g532: number;

    if (e < 0.7) {
      g533 = -919.2277 + 4988.61 * e - 9064.77 * emsq + 5542.21 * eoc;
      g521 = -822.71072 + 4568.6173 * e - 8491.4146 * emsq + 5337.524 * eoc;
      g532 = -853.666 + 4690.25 * e - 8624.77 * emsq + 5341.4 * eoc;
    } else {
      g533 = -37995.78 + 161616.52 * e - 229838.2 * emsq + 109377.94 * eoc;
      g521 = -51752.104 + 218913.95 * e - 309468.16 * emsq + 146349.42 * eoc;
      g532 = -40023.88 + 170470.89 * e - 242699.48 * emsq + 115605.82 * eoc;
    }

    const sini2 = sinim * sinim;
    const f220 = 0.75 * (1 + 2 * cosim + cosisq);
    const f221 = 1.5 * sini2;
    const f321 = 1.875 * sinim * (1 - 2 * cosim - 3 * cosisq);
    const f322 = -1.875 * sinim * (1 + 2 * cosim - 3 * cosisq);
    const f441 = 35 * sini2 * f220;
    const f442 = 39.375 * sini2 * sini2;
    const f522 =
      9.84375 *
      sinim *
      (sini2 * (1 - 2 * cosim - 5 * cosisq) +
        0.33333333 * (-2 + 4 * cosim + 6 * cosisq));
    const f523 =
      sinim *
      (4.92187512 * sini2 * (-2 - 4 * cosim + 10 * cosisq) +
        6.56250012 * (1 + 2 * cosim - 3 * cosisq));
    const f542 =
      29.53125 *
      sinim *
      (2 - 8 * cosim + cosisq * (-12 + 8 * cosim + 10 * cosisq));
    const f543 =
      29.53125 *
      sinim *
      (-2 - 8 * cosim + cosisq * (12 + 8 * cosim - 10 * cosisq));
    const xno2 = nm * nm;
    const ainv2 = aonv * aonv;

    let temp1 = 3 * xno2 * ainv2;
    let temp = temp1 * root22;

    terms.d2201 = temp * f220 * g201;
    terms.d2211 = temp * f221 * g211;
    temp1 *= aonv;
    temp = temp1 * root32;
    terms.d3210 = temp * f321 * g310;
    terms.d3222 = temp * f322 * g322;
    temp1 *= aonv;
    temp = 2 * temp1 * root44;
    terms.d4410 = temp * f441 * g410;
    terms.d4422 = temp * f442 * g422;
    temp1 *= aonv;
    temp = temp1 * root52;
    terms.d5220 = temp * f522 * g520;
    terms.d5232 = temp * f523 * g532;
    temp = 2 * temp1 * root54;
    terms.d5421 = temp * f542 * g521;
    terms.d5433 = temp * f543 * g533;
    terms.xlamo = (mo + nodeo + nodeo - theta - theta) % TWO_PI;
    terms.xfact = mdot + dmdt + 2 * (nodedot + dnodt - RPTIM) - no;
  } else {
    // Synchronous resonance of 24-hour orbits
    const g200 = 1 + emsq * (-2.5 + 0.8125 * emsq);
    const g310 = 1 + 2 * emsq;
    const g300 = 1 + emsq * (-6 + 6.60937 * emsq);
    const f220 = 0.75 * (1 + cosim) * (1 + cosim);
    const f311 = 0.9375 * sinim * sinim * (1 + 3 * cosim) - 0.75 * (1 + cosim);
    const f330 = 1.875 * (1 + cosim) * (1 + cosim) * (1 + cosim);
    const del1 = 3 * nm * nm * aonv * aonv;

    terms.del2 = 2 * del1 * f220 * g200 * q22;
    terms.del3 = 3 * del1 * f330 * g300 * q33 * aonv;
    terms.del1 = del1 * f311 * g310 * q31 * aonv;
    terms.xlamo = (mo + nodeo + argpo - theta) % TWO_PI;
    terms.xfact = mdot + xpidot - RPTIM + dmdt + domdt + dnodt - no;
  }

  return terms;
};

/** The mean elements dspace updates for the secular and resonance effects. */
export interface MeanState {
  em: number;
  argpm: number;
  inclm: number;
  mm: number;
  nm: number;
  nodem: number;
}

/**
 * dspace: add the secular lunar and solar effects at `t` minutes since epoch
 * to the mean elements, in place, and integrate the resonances in 720-minute
 * steps from the epoch.
 */
export const dspace = (
  r: ResonanceTerms,
  argpo: number,
  argpdot: number,
  t: number,
  gsto: number,
  no: number,
  state: MeanState
): void => {
  const fasx2 = 0.13130908;
  const fasx4 = 2.8843198;
  const fasx6 = 0.37448087;
  const g22 = 5.7686396;
  const g32 = 0.95240898;
  const g44 = 1.8014998;
  const g52 = 1.050833;
  const g54 = 4.4108898;
  const stepp = 720;
  const step2 = 259200;
  const theta = (gsto + t * RPTIM) % TWO_PI;

  state.em += r.dedt * t;
  state.inclm += r.didt * t;
  state.argpm += r.domdt * t;
  state.nodem += r.dnodt * t;
  state.mm += r.dmdt * t;

  if (r.irez === 0) return;

  // Euler-Maclaurin integration from the epoch. The report keeps the
  // integrator's state between calls to resume it; starting again from the
  // epoch takes the same steps, so gives the same result
  const delt = t > 0 ? stepp : -stepp;

  let atime = 0;
  let xni = no;
  let xli = r.xlamo;
  let xndt: number;
  let xldot: number;
  let xnddt: number;
  let ft: number;

  for (;;) {
    if (r.irez !== 2) {
      // Near-synchronous
      xndt =
        r.del1 * Math.sin(xli - fasx2) +
        r.del2 * Math.sin(2 * (xli - fasx4)) +
        r.del3 * Math.sin(3 * (xli - fasx6));
      xldot = xni + r.xfact;
      xnddt =
        (r.del1 * Math.cos(xli - fasx2) +
          2 * r.del2 * Math.cos(2 * (xli - fasx4)) +
          3 * r.del3 * Math.cos(3 * (xli - fasx6))) *
        xldot;
    } else {
      // Near half a day
      const xomi = argpo + argpdot * atime;
      const x2omi = xomi + xomi;
      const x2li = xli + xli;

      xndt =
        r.d2201 * Math.sin(x2omi + xli - g22) +
        r.d2211 * Math.sin(xli - g22) +
        r.d3210 * Math.sin(xomi + xli - g32) +
        r.d3222 * Math.sin(-xomi + xli - g32) +
        r.d4410 * Math.sin(x2omi + x2li - g44) +
        r.d4422 * Math.sin(x2li - g44) +
        r.d5220 * Math.sin(xomi + xli - g52) +
        r.d5232 * Math.sin(-xomi + xli - g52) +
        r.d5421 * Math.sin(xomi + x2li - g54) +
        r.d5433 * Math.sin(-xomi + x2li - g54);
      xldot = xni + r.xfact;
      xnddt =
        (r.d2201 * Math.cos(x2omi + xli - g22) +
          r.d2211 * Math.cos(xli - g22) +
          r.d3210 * Math.cos(xomi + xli - g32) +
          r.d3222 * Math.cos(-xomi + xli - g32) +
          r.d5220 * Math.cos(xomi + xli - g52) +
          r.d5232 * Math.cos(-xomi + xli - g52) +
          2 *
            (r.d4410 * Math.cos(x2omi + x2li - g44) +
              r.d4422 * Math.cos(x2li - g44) +
              r.d5421 * Math.cos(xomi + x2li - g54) +
              r.d5433 * Math.cos(-xomi + x2li - g54))) *
        xldot;
    }

    if (Math.abs(t - atime) < stepp) {
      ft = t - atime;
      break;
    }

    xli += xldot * delt + xndt * step2;
    xni += xndt * delt + xnddt * step2;
    atime += delt;
  }

  state.nm = xni + xndt * ft + xnddt * ft * ft * 0.5;

  const xl = xli + xldot * ft + xndt * ft * ft * 0.5;

  state.mm =
    r.irez !== 1
      ? xl - 2 * state.nodem + 2 * theta
      : xl - state.nodem - state.argpm + theta;
};
