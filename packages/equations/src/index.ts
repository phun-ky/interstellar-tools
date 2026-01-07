/**
 *
 *  Here you will find a set of function that can assist you when calculating orbits, angles, solve for kelper or find true anomalies.
 * @module
 */

// categories/angle
export * from './categories/angle/compute-angle';

export * from './categories/angle/wrap-angle';

// categories/cartography

export * from './categories/cartography/body-fixed-from-inertial-dcm-iau';

export * from './categories/cartography/eccentricity-squared-oblate-spheroid';

export * from './categories/cartography/flattening-oblate-spheroid';

export * from './categories/cartography/is-on-triaxial-ellipsoid-surface';

export * from './categories/cartography/planetocentric-latitude';

export * from './categories/cartography/planetographic-latitude-oblate';

// categories/helpers

export * from './categories/helpers/apply-matrix-3';

export * from './categories/helpers/det-3';

export * from './categories/helpers/mat-mul3';

export * from './categories/helpers/misc';

export * from './categories/helpers/radians';

export * from './categories/helpers/rot-1';

export * from './categories/helpers/rot-3';

export * from './categories/helpers/transpose-3';

// categories/anomalies

export * from './categories/anomalies/eccentric-to-true-anomaly';

export * from './categories/anomalies/mean-to-eccentric-anomaly';

export * from './categories/anomalies/true-to-mean-anomaly';

// categories/kepler (solvers)

export * from './categories/kepler/solve-kepler-bisection';

export * from './categories/kepler/solve-kepler-high-eccentricity';

export * from './categories/kepler/solve-kepler-newton-raphson';

export * from './categories/kepler/solve-kepler';

// categories/gravity

export * from './categories/gravity/acceleration-on1-by2';

export * from './categories/gravity/force-on1-by2';

export * from './categories/gravity/gravitational-force';

export * from './categories/gravity/gravitational-parameter';

// categories/orbits

export * from './categories/orbits/atmospheric-drag-acceleration';

export * from './categories/orbits/characteristic-energy-c3';

export * from './categories/orbits/circular-speed';

export * from './categories/orbits/cw-hill-derivatives';

export * from './categories/orbits/escape-speed';

export * from './categories/orbits/flight-path-angle-from-true-anomaly';

export * from './categories/orbits/hyperbolic-periapsis-speed';

export * from './categories/orbits/j2-nodal-precession-rate';

export * from './categories/orbits/kepler-period';

export * from './categories/orbits/mean-motion';

export * from './categories/orbits/specific-angular-momentum-from-elements';

export * from './categories/orbits/specific-angular-momentum';

export * from './categories/orbits/specific-mechanical-energy';

export * from './categories/orbits/sphere-of-influence-radius';

export * from './categories/orbits/vis-viva-speed';

// categories/manoeuvres

export * from './categories/manoeuvres/combine-burns-delta-v';

export * from './categories/manoeuvres/gravity-assist-turning-angle';

export * from './categories/manoeuvres/hohmann-transfer';

export * from './categories/manoeuvres/oberth-energy-gain';

export * from './categories/manoeuvres/plane-change-delta-v';

export * from './categories/manoeuvres/rocket-delta-v-from-isp';

export * from './categories/manoeuvres/rocket-delta-v-from-ve';
