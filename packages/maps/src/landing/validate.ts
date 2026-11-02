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
