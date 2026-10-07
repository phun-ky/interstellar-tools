/**
 *
 *  Here you will find a set of function that can assist you when calculating orbits, angles, solve for kelper or find true anomalies.
 * @module
 */

// categories/angle
export * from './categories/angle/compute-angle.js';

export * from './categories/angle/wrap-angle.js';

// categories/cartography

export * from './categories/cartography/body-fixed-from-inertial-dcm-iau.js';

export * from './categories/cartography/eccentricity-squared-oblate-spheroid.js';

export * from './categories/cartography/flattening-oblate-spheroid.js';

export * from './categories/cartography/is-on-triaxial-ellipsoid-surface.js';

export * from './categories/cartography/planetocentric-latitude.js';

export * from './categories/cartography/planetographic-latitude-oblate.js';

// categories/helpers

export * from './categories/helpers/apply-matrix-3.js';

export * from './categories/helpers/det-3.js';

export * from './categories/helpers/mat-mul3.js';

export * from './categories/helpers/misc.js';

export * from './categories/helpers/radians.js';

export * from './categories/helpers/rot-1.js';

export * from './categories/helpers/rot-3.js';

export * from './categories/helpers/transpose-3.js';

// categories/anomalies

export * from './categories/anomalies/eccentric-to-true-anomaly.js';

export * from './categories/anomalies/mean-to-eccentric-anomaly.js';

export * from './categories/anomalies/true-to-mean-anomaly.js';

// categories/kepler (solvers)

export * from './categories/kepler/solve-kepler-bisection.js';

export * from './categories/kepler/solve-kepler-high-eccentricity.js';

export * from './categories/kepler/solve-kepler-newton-raphson.js';

export * from './categories/kepler/solve-kepler.js';

// categories/gravity

export * from './categories/gravity/acceleration-on1-by2.js';

export * from './categories/gravity/force-on1-by2.js';

export * from './categories/gravity/gravitational-force.js';

export * from './categories/gravity/gravitational-parameter.js';

// categories/orbits

export * from './categories/orbits/atmospheric-drag-acceleration.js';

export * from './categories/orbits/characteristic-energy-c3.js';

export * from './categories/orbits/circular-speed.js';

export * from './categories/orbits/cw-hill-derivatives.js';

export * from './categories/orbits/escape-speed.js';

export * from './categories/orbits/flight-path-angle-from-true-anomaly.js';

export * from './categories/orbits/hyperbolic-periapsis-speed.js';

export * from './categories/orbits/j2-nodal-precession-rate.js';

export * from './categories/orbits/kepler-period.js';

export * from './categories/orbits/mean-motion.js';

export * from './categories/orbits/specific-angular-momentum-from-elements.js';

export * from './categories/orbits/specific-angular-momentum.js';

export * from './categories/orbits/specific-mechanical-energy.js';

export * from './categories/orbits/sphere-of-influence-radius.js';

export * from './categories/orbits/vis-viva-speed.js';

// categories/manoeuvres

export * from './categories/manoeuvres/combine-burns-delta-v.js';

export * from './categories/manoeuvres/gravity-assist-turning-angle.js';

export * from './categories/manoeuvres/hohmann-transfer.js';

export * from './categories/manoeuvres/oberth-energy-gain.js';

export * from './categories/manoeuvres/plane-change-delta-v.js';

export * from './categories/manoeuvres/rocket-delta-v-from-isp.js';

export * from './categories/manoeuvres/rocket-delta-v-from-ve.js';
