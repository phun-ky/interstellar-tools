/** Throw a TypeError for each non-finite input, named as in the caller's signature. */
export const assertFinite = (
  inputs: readonly (readonly [string, number])[]
) => {
  for (const [name, x] of inputs) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }
};

/** Throw a RangeError for each input that isn't strictly positive. */
export const assertPositive = (
  inputs: readonly (readonly [string, number])[]
) => {
  for (const [name, x] of inputs) {
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);
  }
};

/** Throw a RangeError unless the flight-path angle is a descent or climb, not level or past vertical. */
export const assertFlightPathAngle = (gamma: number) => {
  if (gamma === 0 || Math.abs(gamma) > Math.PI / 2)
    throw new RangeError(
      `gamma must be non-zero and within [-π/2, π/2]. Received: ${gamma}`
    );
};
