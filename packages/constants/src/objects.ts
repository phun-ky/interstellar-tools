/**
 * Solar radius constants (all values in **kilometres**).
 *
 * ## Conventions:
 * - **Nominal radius** is an exact conversion constant (IAU 2015 B3).
 * - **Photospheric/seismic** value follows Haberreiter–Schmutz–Kosovichev (2008),
 *   which reconciles seismic and photospheric definitions by lowering the standard radius.
 * - **Limb inflection offset** quantifies how the brightness–profile "edge" overestimates
 *   the photospheric/seismic radius (~0.333 Mm).
 * - **Transit** and **PICARD/SODISM** radii are precise observational determinations,
 *   with quoted 1σ uncertainties where available (bandpass-dependent for PICARD).
 */

// --- IAU nominal (exact conversion constant) ---
/**
 *  Nominal solar radius (IAU 2015 B3), exact.
 * @group Objects
 */
export const SOLAR_RADIUS_NOMINAL_KM = 695_700 as const;

// --- Photospheric / seismic convention (HSK 2008) ---
/**
 * Photospheric / "standard" solar radius suggested for models (HSK 2008).
 * Reconciles seismic and photospheric definitions.
 * @group Objects
 */
export const SOLAR_RADIUS_PHOTOSPHERIC_KM = 695_660;

/**
 *
 *   Limb–inflection minus photospheric offset (~0.333 Mm).
 /
export const SOLAR_RADIUS_LIMB_INFLECTION_MINUS_PHOTOSPHERIC_KM = 333;

// --- SOHO/MDI Mercury transits (2003, 2006) ---
/**
 *  Radius from SOHO/MDI Mercury transits (2003 & 2006).
 * @group Objects
 */
export const SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_KM = 696_342;

/**
 *  1σ uncertainty for SOHO/MDI Mercury-transit radius.
 * @group Objects
 */
export const SOLAR_RADIUS_SOHO_MDI_MERCURY_TRANSIT_UNC_KM = 65;

// --- PICARD/SODISM (Venus transit 2012; bandpass-specific, limb-inflection definition) ---
/**
 *  PICARD/SODISM radius at 535.7 nm.
 * @group Objects
 */
export const SOLAR_RADIUS_PICARD_SODISM_535_7_NM_KM = 696_134;

/**
 *  1σ uncertainty at 535.7 nm.
 * @group Objects
 */
export const SOLAR_RADIUS_PICARD_SODISM_535_7_NM_UNC_KM = 261;

/**
 *  PICARD/SODISM radius at 607.1 nm.
 * @group Objects
 */
export const SOLAR_RADIUS_PICARD_SODISM_607_1_NM_KM = 696_156;

/**
 *  1σ uncertainty at 607.1 nm.
 * @group Objects
 */
export const SOLAR_RADIUS_PICARD_SODISM_607_1_NM_UNC_KM = 145;

/**
 *  PICARD/SODISM radius at 782.2 nm.
 * @group Objects
 */
export const SOLAR_RADIUS_PICARD_SODISM_782_2_NM_KM = 696_192;

/**
 *  1σ uncertainty at 782.2 nm.
 * @group Objects
 */
export const SOLAR_RADIUS_PICARD_SODISM_782_2_NM_UNC_KM = 247;
