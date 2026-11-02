/** Throw unless every named value is a finite number. */
export const assertFinite = (
  values: readonly (readonly [name: string, value: number])[]
) => {
  for (const [name, x] of values)
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
};

/** Throw unless `value` is a latitude in [-π/2, π/2]. */
export const assertLatitude = (name: string, value: number) => {
  if (Math.abs(value) > Math.PI / 2)
    throw new RangeError(`${name} must be in [-π/2, π/2]. Received: ${value}`);
};

/** Throw unless `a > 0` and `eSquared` is in [0, 1). */
export const assertEllipsoid = (a: number, eSquared: number) => {
  if (a <= 0) throw new RangeError(`a must be > 0. Received: ${a}`);

  if (eSquared < 0 || eSquared >= 1)
    throw new RangeError(`eSquared must be in [0, 1). Received: ${eSquared}`);
};
