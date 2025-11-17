import { MoonsType } from '@interstellar-tools/types';

/**
 * Represents a dataset of natural satellites (moons) in the solar system.
 *
 *
 * ::: info
 *
 * - Units: `a` in astronomical units (au), `period` in days (d), `radius` in kilometers (km).
 * - Colors are hex strings used only for visual representation.
 * - The table below is **NOT CURRENTLY** generated from the dataset at build time.
 *
 * :::
 *
 * {@include ../../../../docs/partials/moons.md}
 *
 * @see {@link MoonsType}.
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/moons.ts#datasetMoons}
 * @group Datasets
 * @example
 * ```ts
 * console.log(MOONS[0].name); // "Moon"
 * ```
 */
export const MOONS: MoonsType = [
  // **Earth**
  // #region datasetMoons
  {
    name: 'Moon',
    category: 'natural satellite',
    system: 'Earth',
    /** Semi-major axis in AU */
    a: { value: 0.00257, unit: 'au' },
    /** Eccentricity (0 = circular orbit, 1 = parabolic trajectory) */
    e: 0.0549,
    /** Orbital period in days */
    period: { value: -27.322, unit: 'd' },
    /** Radius in km */
    radius: { value: 1737.4, unit: 'km' },
    /** Visual representation color */
    color: '#BFBFBF', // Light gray (realistic lunar appearance)
    /** Initial angle in orbit at J2000 */
    angle: 2.41
  },
  // #endregion datasetMoons
  // **Mars**
  {
    name: 'Phobos',
    category: 'natural satellite',
    system: 'Mars',
    a: { value: 0.00006, unit: 'au' },
    e: 0.0151,
    period: { value: -0.3189, unit: 'd' },
    radius: { value: 11, unit: 'km' },
    color: '#888888', // Darker gray (rocky, low albedo)
    angle: 0
  },
  {
    name: 'Deimos',
    category: 'natural satellite',
    system: 'Mars',
    a: { value: 0.00016, unit: 'au' },
    e: 0.0002,
    period: { value: -1.2624, unit: 'd' },
    radius: { value: 6, unit: 'km' },
    color: '#A0A0A0', // Lighter gray (less cratered surface)
    angle: 0
  },

  // **Jupiter (Galilean Moons + Minor Moons)**
  {
    name: 'Io',
    category: 'natural satellite',
    system: 'Jupiter',
    a: { value: 0.00282, unit: 'au' },
    e: 0.0041,
    period: { value: -1.769, unit: 'd' },
    radius: { value: 1821, unit: 'km' },
    color: '#FF8C00', // Volcanic orange (due to sulphur deposits)
    angle: 0
  },
  {
    name: 'Europa',
    category: 'natural satellite',
    system: 'Jupiter',
    a: { value: 0.00448, unit: 'au' },
    e: 0.0094,
    period: { value: -3.551, unit: 'd' },
    radius: { value: 1560, unit: 'km' },
    color: '#E6E6E6', // Icy white (smooth ice-covered surface)
    angle: 0
  },
  {
    name: 'Ganymede',
    category: 'natural satellite',
    system: 'Jupiter',
    a: { value: 0.00715, unit: 'au' },
    e: 0.0013,
    period: { value: -7.155, unit: 'd' },
    radius: { value: 2634, unit: 'km' },
    color: '#8B4513', // Brownish (mixture of ice and rock)
    angle: 0
  },
  {
    name: 'Callisto',
    category: 'natural satellite',
    system: 'Jupiter',
    a: { value: 0.01258, unit: 'au' },
    e: 0.0074,
    period: { value: -16.689, unit: 'd' },
    radius: { value: 2410, unit: 'km' },
    color: '#696969', // Dark gray (heavily cratered)
    angle: 0
  },
  {
    name: 'Amalthea',
    category: 'natural satellite',
    system: 'Jupiter',
    a: { value: 0.0025, unit: 'au' },
    e: 0.003,
    period: { value: -0.498, unit: 'd' },
    radius: { value: 83, unit: 'km' },
    color: '#A0522D',
    angle: 0
  },
  {
    name: 'Himalia',
    category: 'natural satellite',
    system: 'Jupiter',
    a: { value: 0.045, unit: 'au' },
    e: 0.25,
    period: { value: -250.2, unit: 'd' },
    radius: { value: 85, unit: 'km' },
    color: '#A9A9A9', // Neutral gray (small irregular moon)
    angle: 0
  },
  {
    name: 'Metis',
    category: 'natural satellite',
    system: 'Jupiter',
    a: { value: 0.00179, unit: 'au' },
    e: 0.0002,
    period: { value: -0.295, unit: 'd' },
    radius: { value: 21, unit: 'km' },
    color: '#CD853F',
    angle: 0
  },
  {
    name: 'Thebe',
    category: 'natural satellite',
    system: 'Jupiter',
    a: { value: 0.00222, unit: 'au' },
    e: 0.0176,
    period: { value: -0.675, unit: 'd' },
    radius: { value: 49, unit: 'km' },
    color: '#B87333',
    angle: 0
  },
  {
    name: 'Pasiphae',
    category: 'irregular satellite',
    system: 'Jupiter',
    a: { value: 0.157, unit: 'au' },
    e: 0.407,
    period: { value: 735, unit: 'd' },
    radius: { value: 30, unit: 'km' },
    color: '#8B0000',
    angle: 0
  },

  // **Saturn (Large & Small Moons)**
  {
    name: 'Titan',
    category: 'natural satellite',
    system: 'Saturn',
    a: { value: 0.00817, unit: 'au' },
    e: 0.0288,
    period: { value: -15.945, unit: 'd' },
    radius: { value: 2575, unit: 'km' },
    color: '#D4A017', // Gold/amber (thick haze-rich atmosphere)
    angle: 0
  },
  {
    name: 'Enceladus',
    category: 'natural satellite',
    system: 'Saturn',
    a: { value: 0.00159, unit: 'au' },
    e: 0.0047,
    period: { value: -1.37, unit: 'd' },
    radius: { value: 252, unit: 'km' },
    color: '#F0FFFF', // Ice-blue white (brightest moon in the Solar System)
    angle: 0
  },
  {
    name: 'Rhea',
    category: 'natural satellite',
    system: 'Saturn',
    a: { value: 0.00874, unit: 'au' },
    e: 0.0012,
    period: { value: -4.518, unit: 'd' },
    radius: { value: 764, unit: 'km' },
    color: '#C0C0C0', // Silvery gray (icy and cratered)
    angle: 0
  },
  {
    name: 'Iapetus',
    category: 'natural satellite',
    system: 'Saturn',
    a: { value: 0.0238, unit: 'au' },
    e: 0.0283,
    period: { value: -79.33, unit: 'd' },
    radius: { value: 735, unit: 'km' },
    color: '#2F4F4F', // Dark gray-green (two-tone color due to one dark side)
    angle: 0
  },
  {
    name: 'Hyperion',
    category: 'irregular satellite',
    system: 'Saturn',
    a: { value: 0.00873, unit: 'au' },
    e: 0.123,
    period: { value: -21.3, unit: 'd' },
    radius: { value: 135, unit: 'km' },
    color: '#CDAA7D',
    angle: 0
  },
  {
    name: 'Phoebe',
    category: 'retrograde satellite',
    system: 'Saturn',
    a: { value: 0.0865, unit: 'au' },
    e: 0.1634,
    period: { value: 550, unit: 'd' },
    radius: { value: 106, unit: 'km' },
    color: '#483D8B',
    angle: 0
  },

  // **Uranus (Major Moons)**
  {
    name: 'Titania',
    category: 'natural satellite',
    system: 'Uranus',
    a: { value: 0.00292, unit: 'au' },
    e: 0.0011,
    period: { value: -8.706, unit: 'd' },
    radius: { value: 788, unit: 'km' },
    color: '#8B8886', // Gray-brown (heavily cratered with bright ice patches)
    angle: 0
  },
  {
    name: 'Oberon',
    category: 'natural satellite',
    system: 'Uranus',
    a: { value: 0.00384, unit: 'au' },
    e: 0.0014,
    period: { value: -13.46, unit: 'd' },
    radius: { value: 761, unit: 'km' },
    color: '#6E6E6E', // Dark gray (icy and rocky)
    angle: 0
  },
  {
    name: 'Miranda',
    category: 'natural satellite',
    system: 'Uranus',
    a: { value: 0.00129, unit: 'au' },
    e: 0.0013,
    period: { value: -1.41, unit: 'd' },
    radius: { value: 235, unit: 'km' },
    color: '#CCCCCC', // Light gray (fractured terrain)
    angle: 0
  },
  {
    name: 'Ariel',
    category: 'natural satellite',
    system: 'Uranus',
    a: { value: 0.00191, unit: 'au' },
    e: 0.0012,
    period: { value: -2.52, unit: 'd' },
    radius: { value: 578, unit: 'km' },
    color: '#A9A9A9',
    angle: 0
  },
  {
    name: 'Umbriel',
    category: 'natural satellite',
    system: 'Uranus',
    a: { value: 0.00266, unit: 'au' },
    e: 0.0039,
    period: { value: -4.14, unit: 'd' },
    radius: { value: 584, unit: 'km' },
    color: '#5F9EA0',
    angle: 0
  },

  // **Neptune (Major Moons)**
  {
    name: 'Triton',
    category: 'natural satellite',
    system: 'Neptune',
    a: { value: 0.002375, unit: 'au' },
    e: 0.000016,
    period: { value: 5.87685, unit: 'd' },
    radius: { value: 1353.4, unit: 'km' },
    color: '#C2A17C', // More accurate pale pinkish-brown hue
    angle: 0 // Consider updating based on actual epoch
  },
  {
    name: 'Nereid',
    category: 'natural satellite',
    system: 'Neptune',
    a: { value: 0.0369, unit: 'au' },
    e: 0.75,
    period: { value: -360.14, unit: 'd' },
    radius: { value: 170, unit: 'km' },
    color: '#87CEFA', // Light blue (possibly icy)
    angle: 0
  },
  {
    name: 'Proteus',
    category: 'natural satellite',
    system: 'Neptune',
    a: { value: 0.00082, unit: 'au' },
    e: 0.0005,
    period: { value: -1.12, unit: 'd' },
    radius: { value: 210, unit: 'km' },
    color: '#708090',
    angle: 0
  },
  {
    name: 'Halimede',
    category: 'irregular satellite',
    system: 'Neptune',
    a: { value: 0.0985, unit: 'au' },
    e: 0.5711,
    period: { value: -1879, unit: 'd' },
    radius: { value: 62, unit: 'km' },
    color: '#A9A9A9',
    angle: 0
  }
] as const satisfies MoonsType;
