/**
 *
 *  Here you will find a set of function that can assist you when calculating orbits, angles, solve for kelper or find true anomalies.
 * @showCategories
 * @module
 */

export * from './categories/angle/compute-angle';

export * from './categories/anomaly/compute-mean-anomaly';

export * from './categories/anomaly/eccentric-to-true-anomaly';

export * from './categories/solve-for-kepler/solve-kepler-bisection';

export * from './categories/solve-for-kepler/solve-kepler-high-eccentricity';

export * from './categories/solve-for-kepler/solve-kepler-newton-raphson';

export * from './categories/solve-for-kepler/solve-kepler';

export * from './categories/anomaly/true-anomaly-to-mean-anomaly';

export * from './categories/angle/wrap-angle';

export * from './categories/dynamics/gravitational-parameter';

export * from './categories/dynamics/law-of-gravitation';

export * from './categories/dynamics/vis-viva-speed';

export * from './categories/dynamics/kepler-period';

export * from './categories/dynamics/specific-mechanical-energy';
