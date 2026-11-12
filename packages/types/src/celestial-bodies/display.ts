import type { DegreesType } from '../numeric.js';
import type { ProvenanceType } from '../observations.js';

/**
 * Represents **2D coordinates**, for example a point on a drawn orbit.
 *
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 *
 * @example
 * ```ts
 * const position: CartesianCoordinatesInterface = { x: 100, y: 200 };
 * ```
 * @group Celestial Bodies
 */
export interface CartesianCoordinatesInterface {
  x: number;
  y: number;
}

/**
 * How a body is **drawn**: everything about rendering, kept apart from its
 * physical data, its `orbit` and its `observations`.
 *
 * It holds three kinds of values:
 *
 * - **Hints from the datasets**: `color` on every body, `size` on comets and
 *   asteroids, `opacity` and `density` on asteroid belts.
 * - **State a renderer computes** and keeps on the body, so it doesn't have to
 *   recompute it every frame: `semiMinorAxis`, `focusOffsetX` and
 *   `orbitPath`. The datasets never set these.
 * - **How to draw the body itself**, for a procedural renderer: `model`, and
 *   the groups that model reads, `surface`, `bands`, `clouds`, `atmosphere`,
 *   `emission`, `rings`, `photosphere`, `astrosphere`, `coma`, `galaxy` and
 *   `blackHole`, with a noise `seed`. They come from the body's
 *   `observations` or from images of it, and `derivation` records which.
 *
 * ::: info
 *
 * - Colours are hex strings (`#rrggbb`) or CSS colour names, like `color`.
 * - Intensities, coverages and fractions run from 0 to 1.
 * - Sizes in the drawing groups are in multiples of the drawn body's radius,
 *   never physical units, but for `astrosphere`'s, which come from
 *   `observations`. The physical sizes, such as a ring's radii, are in
 *   `observations`.
 * - The computed orbit distances are in whatever unit the renderer uses for
 *   `orbit.a` (for example au), in the orbit's plane, with the parent at the
 *   origin and periapsis along +x.
 *
 * :::
 *
 * @example
 * ```ts
 * // Drawing an orbit: compute once, keep it on the body
 * const a = convertDistanceUnit(body.orbit.a, 'au').value;
 * const { e } = body.orbit;
 *
 * body.display = {
 *   ...body.display,
 *   semiMinorAxis: a * Math.sqrt(1 - e ** 2),
 *   focusOffsetX: a * e
 * };
 * ```
 * @example
 * ```ts
 * // Saturn, for a procedural renderer
 * const saturn: DisplayInterface = {
 *   color: '#D2B48C',
 *   model: 'giant',
 *   bands: {
 *     palette: ['#d4b884', '#efe1bd', '#b8975f'],
 *     count: 12,
 *     contrast: 0.45
 *   },
 *   rings: { color: '#d6c4a0', opacity: 0.95, shadows: true }
 * };
 * ```
 * @group Celestial Bodies
 */
export interface DisplayInterface {
  /** Colour to draw the body in, as a hex string (`#rrggbb`) or a CSS colour name. */
  color?: string;
  /** Scaled size for drawing, not the physical size (see `radius`). */
  size?: number;
  /** Transparency, from 0 (invisible) to 1 (solid). */
  opacity?: number;
  /** How densely to fill an area, e.g. how many asteroids to draw in a belt. */
  density?: number;
  /** Semi-minor axis of the orbit, $b = a\sqrt{1 - e^2}$, computed by a renderer. */
  semiMinorAxis?: number;
  /** Distance from the ellipse's centre to its focus, $c = a e$, computed by a renderer. */
  focusOffsetX?: number;
  /** Points along the drawn orbit, computed by a renderer. */
  orbitPath?: CartesianCoordinatesInterface[];
  /** Which procedural model draws the body. */
  model?: DisplayModelType;
  /** A solid surface: its colours, relief, oceans, ice caps and lava. */
  surface?: DisplaySurfaceInterface;
  /** A giant planet's belts, zones and storms. */
  bands?: DisplayBandsInterface;
  /** A cloud layer over a solid surface. */
  clouds?: DisplayCloudsInterface;
  /** The glow of an atmosphere at the limb. */
  atmosphere?: DisplayAtmosphereInterface;
  /** Light the body gives off itself, seen on its night side too. */
  emission?: DisplayEmissionInterface;
  /** How to draw the rings in `observations.rings`. */
  rings?: DisplayRingsInterface;
  /** A star's disc: its colour, limb darkening, granulation, spots and corona. */
  photosphere?: DisplayPhotosphereInterface;
  /** How to draw a star's astrosphere. */
  astrosphere?: DisplayAstrosphereInterface;
  /** A comet's coma and tails. */
  coma?: DisplayComaInterface;
  /** A galaxy's bulge, disk and arms. */
  galaxy?: DisplayGalaxyInterface;
  /** A black hole's photon ring and accretion disk. */
  blackHole?: DisplayBlackHoleInterface;
  /** A seed for the procedural noise, so the body always looks the same. */
  seed?: number;
  /** Why each drawing value is what it is. */
  derivation?: DisplayDerivationInterface[];
}

/**
 * **Three colours** a procedural model blends between: lowland, midland and
 * highland on a solid surface; belt, zone and accent on a giant planet.
 *
 * @group Celestial Bodies
 */
export type DisplayPaletteType = readonly [
  low: string,
  mid: string,
  high: string
];

/**
 * Which **procedural model** draws a body.
 *
 * @group Celestial Bodies
 */
export type DisplayModelType =
  'solid' | 'giant' | 'star' | 'comet' | 'galaxy' | 'black hole';

/**
 * **Oceans** on a solid surface.
 *
 * @group Celestial Bodies
 */
export interface DisplayOceanInterface {
  /** The water's colour. */
  color: string;
  /** The share of the surface under water, 0–1. */
  coverage: number;
  /** How strong the Sun's glint is, 0–1. */
  specular?: number;
}

/**
 * **Polar ice caps** on a solid surface.
 *
 * @group Celestial Bodies
 */
export interface DisplayIceCapsInterface {
  /** How far the caps reach towards the equator, 0 (none) to 1 (the whole globe). */
  extent: number;
  /** The ice's colour; near-white if left out. */
  color?: string;
}

/**
 * Glowing **lava** cracks on a molten surface.
 *
 * @group Celestial Bodies
 */
export interface DisplayLavaInterface {
  /** How bright the cracks are, 0–1. */
  intensity: number;
  /** Their glow, normally the melt's blackbody colour. */
  color: string;
}

/**
 * How to draw a **solid surface**.
 *
 * @group Celestial Bodies
 */
export interface DisplaySurfaceInterface {
  /** Lowland, midland and highland colours. */
  palette: DisplayPaletteType;
  /** Small-scale relief and crater contrast, 0 (smooth) to 1 (rugged). */
  roughness?: number;
  /** Oceans. */
  ocean?: DisplayOceanInterface;
  /** Polar ice caps. */
  iceCaps?: DisplayIceCapsInterface;
  /** Lava. */
  lava?: DisplayLavaInterface;
}

/**
 * An oval **storm** on a giant planet.
 *
 * @group Celestial Bodies
 */
export interface DisplayStormInterface {
  /** The name of the feature in `observations.atmosphere.features` it draws, such as `'Great Red Spot'`. */
  feature?: string;
  /** The planetographic latitude of its centre. */
  latitude: DegreesType;
  /** Its longitude in the rotating frame; 0 if left out. */
  longitude?: DegreesType;
  /** How wide it is, east to west. */
  width: DegreesType;
  /** How tall it is, north to south. */
  height: DegreesType;
  /** Its colour. */
  color: string;
  /** `true` for a feature that has gone since, such as Neptune's Great Dark Spot. */
  historical?: boolean;
}

/**
 * How to draw a giant planet's **belts and zones**.
 *
 * @group Celestial Bodies
 */
export interface DisplayBandsInterface {
  /** Belt, zone and accent colours. */
  palette: DisplayPaletteType;
  /** How many belt and zone pairs, from pole to pole. */
  count: number;
  /** How much the bands waver, 0 (straight) to 1. */
  turbulence?: number;
  /** How different belts and zones are, 0 (featureless) to 1. */
  contrast?: number;
  /** Storms. */
  storms?: DisplayStormInterface[];
}

/**
 * How to draw a **cloud layer** over a solid surface.
 *
 * @group Celestial Bodies
 */
export interface DisplayCloudsInterface {
  /** The clouds' colour. */
  color: string;
  /** The share of the disc they cover, 0–1; 1 hides the surface. */
  coverage: number;
  /** How fast they move against the surface, as a share of the body's spin: 0 still. */
  drift?: number;
}

/**
 * How to draw the **glow of an atmosphere** at the limb.
 *
 * @group Celestial Bodies
 */
export interface DisplayAtmosphereInterface {
  /** The glow's colour, such as Rayleigh blue. */
  color: string;
  /** How strong it is, 0 (airless) to 1 (thick). */
  intensity: number;
  /** How far it reaches past the limb, in body radii. */
  haloExtent?: number;
}

/**
 * Light the body **gives off itself**, such as a hot Jupiter's thermal glow.
 *
 * @group Celestial Bodies
 */
export interface DisplayEmissionInterface {
  /** The glow's colour, normally a blackbody colour. */
  color: string;
  /** How strong it is, 0–1. */
  intensity: number;
}

/**
 * How to draw a **ring system**. Its radii, rings and gaps are the measured
 * ones, in the body's `observations.rings`.
 *
 * @group Celestial Bodies
 */
export interface DisplayRingsInterface {
  /** The rings' colour. */
  color: string;
  /** How opaque they are overall, 0–1, scaled by each ring's optical depth where it's known. */
  opacity: number;
  /** Whether the planet and the rings cast shadows on each other. */
  shadows?: boolean;
}

/**
 * How to draw a star's **corona**.
 *
 * @group Celestial Bodies
 */
export interface DisplayCoronaInterface {
  /** How strong it is, 0–1. */
  intensity: number;
  /** How far it reaches past the limb, in stellar radii. */
  extent?: number;
}

/**
 * How to draw a **star's disc**.
 *
 * @group Celestial Bodies
 */
export interface DisplayPhotosphereInterface {
  /** The blackbody colour at its effective temperature. */
  color: string;
  /** The linear limb-darkening coefficient, u, 0–1. */
  limbDarkening: number;
  /** How many convection cells span the disc: a handful for a supergiant, hundreds for a dwarf. */
  granulation?: number;
  /** The share of the surface covered by spots, 0–1. */
  spotCoverage?: number;
  /** The latitude band spots keep to; ±40° if left out. */
  spotLatitude?: DegreesType;
  /** Its corona. */
  corona?: DisplayCoronaInterface;
}

/**
 * How to draw a star's **astrosphere**, its boundaries from the star's
 * `observations.astrosphere`.
 *
 * Unlike the other groups, its sizes are physical, from `observations`, as
 * it's drawn around the star's whole system: the heliosphere is over a hundred
 * times wider than Neptune's orbit.
 *
 * @group Celestial Bodies
 */
export interface DisplayAstrosphereInterface {
  /** The colour of its boundaries. */
  color: string;
  /** How opaque they are, 0–1. */
  opacity: number;
  /**
   * Whether to draw it without being asked. Left out, a renderer keeps it
   * hidden, behind an option to show it.
   */
  visibleByDefault?: boolean;
}

/**
 * One **comet tail** to draw.
 *
 * @group Celestial Bodies
 */
export interface DisplayTailInterface {
  /** What kind. */
  kind: 'dust' | 'ion' | 'sodium' | 'anti-tail';
  /** Its colour. */
  color: string;
  /** How long it is, in multiples of the drawn nucleus's radius. */
  length: number;
  /** How far it curves from the line away from the Sun, 0 (straight, as an ion tail) to 1. */
  curvature?: number;
  /** How opaque it is, 0–1. */
  opacity?: number;
}

/**
 * How to draw a comet's **coma and tails**.
 *
 * @group Celestial Bodies
 */
export interface DisplayComaInterface {
  /** The coma's colour. */
  color: string;
  /** Its radius, in multiples of the drawn nucleus's radius. */
  radius: number;
  /** How bright it is, 0–1. */
  intensity?: number;
  /** Its tails. */
  tails?: DisplayTailInterface[];
}

/**
 * How to draw a **galaxy**.
 *
 * @group Celestial Bodies
 */
export interface DisplayGalaxyInterface {
  /** The bulge's colour. */
  bulgeColor: string;
  /** The disk's colour. */
  diskColor: string;
  /** The colour of star-forming knots in the arms. */
  starFormingColor?: string;
  /** The colour of the dust lanes. */
  dustColor?: string;
  /** How many spiral arms; 0 for ellipticals and irregulars. */
  armCount: number;
  /** The arms' pitch angle: the smaller, the tighter they wind. */
  armPitch?: DegreesType;
  /** The bar's length, as a share of the disk's radius, 0–1. */
  barLength?: number;
  /** The bulge's radius, as a share of the disk's radius, 0–1. */
  bulgeRadius?: number;
  /** An elliptical's axis ratio, b/a, 0–1. */
  ellipticity?: number;
  /** How strong the dust lanes are, 0–1. */
  dust?: number;
}

/**
 * How to draw a **black hole**.
 *
 * @group Celestial Bodies
 */
export interface DisplayBlackHoleInterface {
  /** The photon ring's colour. */
  ringColor: string;
  /** The accretion disk's colour, if one is drawn. */
  diskColor?: string;
  /** How much brighter Doppler beaming makes the approaching side, 0–1. */
  beaming?: number;
}

/**
 * **Why a drawing value is what it is**: taken from images, worked out from
 * an observation, or assumed.
 *
 * @example
 * ```ts
 * const why: DisplayDerivationInterface = {
 *   property: 'photosphere.color',
 *   basis: 'derived',
 *   reason: 'Blackbody colour at Teff = 5772 K',
 *   from: 'effectiveTemperature'
 * };
 * ```
 * @group Celestial Bodies
 */
export interface DisplayDerivationInterface {
  /** A dotted path into `display`, such as `'bands.count'`. */
  property: string;
  /** How it was set: `'imagery'` for colours taken from spacecraft or telescope images. */
  basis: ProvenanceType | 'imagery';
  /** Why, in plain words. */
  reason: string;
  /** A dotted path into `observations` to the value it came from. */
  from?: string;
}
