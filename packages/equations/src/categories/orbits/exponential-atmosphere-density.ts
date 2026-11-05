// Vallado (2013), table 8-4, from CIRA-72: the base height h0 in km, the
// density there ρ0 in kg/m³ and the scale height H in km, for each band
const TABLE: readonly (readonly [h0: number, rho0: number, H: number])[] = [
  [0, 1.225, 7.249],
  [25, 3.899e-2, 6.349],
  [30, 1.774e-2, 6.682],
  [40, 3.972e-3, 7.554],
  [50, 1.057e-3, 8.382],
  [60, 3.206e-4, 7.714],
  [70, 8.77e-5, 6.549],
  [80, 1.905e-5, 5.799],
  [90, 3.396e-6, 5.382],
  [100, 5.297e-7, 5.877],
  [110, 9.661e-8, 7.263],
  [120, 2.438e-8, 9.473],
  [130, 8.484e-9, 12.636],
  [140, 3.845e-9, 16.149],
  [150, 2.07e-9, 22.523],
  [180, 5.464e-10, 29.74],
  [200, 2.789e-10, 37.105],
  [250, 7.248e-11, 45.546],
  [300, 2.418e-11, 53.628],
  [350, 9.518e-12, 53.298],
  [400, 3.725e-12, 58.515],
  [450, 1.585e-12, 60.828],
  [500, 6.967e-13, 63.822],
  [600, 1.454e-13, 71.835],
  [700, 3.614e-14, 88.667],
  [800, 1.17e-14, 124.64],
  [900, 5.245e-15, 181.05],
  [1000, 3.019e-15, 268]
];

/**
 * The **density of Earth's atmosphere** at a height, from the exponential
 * model: within each band of heights, the density falls by a factor of $ e $
 * every scale height. It's the quick estimate for drag on a satellite.
 *
 * $$
 * \rho = \rho_0 \, e^{-(h - h_0)/H}
 * $$
 *
 * Where:
 * - $ h $ is the height above the surface (m)
 * - $ h_0 $ is the base of the band $ h $ falls in, $ \rho_0 $ the density there (kg/m³), and $ H $ the band's scale height, from Vallado's table 8-4: 28 bands from the ground to 1 000 km
 *
 * **Units**
 * - Input: `h` in **m**.
 * - Output: $ \rho $ in **kg/m³**.
 *
 * ::: info Notes
 *
 * - **An average.** The table is the CIRA-72 reference atmosphere at moderate
 *   solar activity. Above about 200 km, the real density swings by a factor
 *   of ten between solar minimum and maximum, and between day and night: use
 *   a model with solar activity, such as NRLMSISE-00, for anything more than
 *   an estimate.
 * - Above 1 000 km, the last band's scale height carries on.
 * - Feed it to {@link atmosphericDragAcceleration} for the drag on a satellite.
 *
 * :::
 *
 * ::: practice The ISS, 420 km up
 *
 * **2.6 × 10⁻¹² kg/m³**
 *
 * _A trillionth of the air at sea level_
 *
 * Thin enough to orbit through, thick enough that the ISS loses a couple of
 * kilometres of height a month and has to be boosted back up.
 *
 * ```ts
 * exponentialAtmosphereDensity(420_000); // ≈ 2.647e-12 kg/m³
 * ```
 *
 * :::
 *
 * @param h - Height above the surface $ h $ in **m** (finite, >= 0).
 * @returns The density $ \rho $ in **kg/m³**.
 * @throws {TypeError} If `h` is not a finite number.
 * @throws {RangeError} If `h < 0`.
 * @group Orbits
 *
 * @example
 * ```ts
 * // Vallado, example 8-4: 747.2119 km up
 * exponentialAtmosphereDensity(747_211.9); // ≈ 2.1219854e-14 kg/m³
 * ```
 *
 * @see {@link atmosphericDragAcceleration}
 * @see Vallado, _Fundamentals of Astrodynamics and Applications_, 4th ed. (2013), table 8-4 and example 8-4
 */
export const exponentialAtmosphereDensity = (h: number): number => {
  if (!Number.isFinite(h))
    throw new TypeError(`h must be a finite number. Received: ${h}`);

  if (h < 0) throw new RangeError(`h must be >= 0. Received: ${h}`);

  const km = h / 1000;

  // The last band whose base is at or below the height
  let band = TABLE[0]!;

  for (const row of TABLE) {
    if (row[0] > km) break;

    band = row;
  }

  const [h0, rho0, H] = band;

  return rho0 * Math.exp(-(km - h0) / H);
};
