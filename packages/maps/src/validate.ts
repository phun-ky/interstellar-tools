/** Throw unless every named value is a finite number. */
export const assertFinite = (
  values: readonly (readonly [name: string, value: number])[]
) => {
  for (const [name, x] of values)
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
};

/** Throw unless every named value is > 0. */
export const assertPositive = (
  values: readonly (readonly [name: string, value: number])[]
) => {
  for (const [name, x] of values)
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);
};

/** Throw unless every component of every named vector is finite and the vector isn't zero. */
export const assertVectors = (
  values: readonly (readonly [name: string, value: readonly number[]])[]
) => {
  for (const [name, v] of values) {
    for (const x of v)
      if (!Number.isFinite(x))
        throw new TypeError(
          `${name} must have finite components. Received: ${x}`
        );

    if (v.every((x) => x === 0))
      throw new RangeError(`${name} must not be the zero vector.`);
  }
};
