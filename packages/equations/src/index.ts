/**
 *
 *  Here you will find a set of function that can assist you when calculating orbits, angles, solve for kelper or find true anomalies.
 * @module
 */

// categories/angle
export * from './categories/angle/compute-angle';

export * from './categories/angle/wrap-angle';

// categories/anomalies
export * from './categories/anomalies/mean-to-eccentric-anomaly';

export * from './categories/anomalies/eccentric-to-true-anomaly';

export * from './categories/anomalies/true-to-mean-anomaly';

// categories/kepler (solvers)
export * from './categories/kepler/solve-kepler';

export * from './categories/kepler/solve-kepler-newton-raphson';

export * from './categories/kepler/solve-kepler-bisection';

export * from './categories/kepler/solve-kepler-high-eccentricity';

// categories/gravity
export * from './categories/gravity/gravitational-parameter';

export * from './categories/gravity/gravitational-force';

export * from './categories/gravity/force-on1-by2';

export * from './categories/gravity/acceleration-on1-by2';

// categories/orbits
export * from './categories/orbits/vis-viva-speed';

export * from './categories/orbits/circular-speed';

export * from './categories/orbits/escape-speed';

export * from './categories/orbits/kepler-period';

export * from './categories/orbits/specific-angular-momentum';

export * from './categories/orbits/specific-angular-momentum-from-elements';

export * from './categories/orbits/specific-mechanical-energy';

export * from './categories/orbits/flight-path-angle-from-true-anomaly';

// categories/manoeuvres

export * from './categories/manoeuvres/hohmann-transfer';

export * from './categories/manoeuvres/plane-change-delta-v';
