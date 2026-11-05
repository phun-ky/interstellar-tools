/** Throw unless a vector is three finite numbers. */
export const assertVector = (name: string, vector: readonly number[]) => {
  if (
    !Array.isArray(vector) ||
    vector.length !== 3 ||
    !vector.every(Number.isFinite)
  )
    throw new TypeError(
      `${name} must be three finite numbers. Received: ${String(vector)}`
    );
};

/** Throw unless `date` is a valid `Date`; its time in Unix ms. */
export const assertDate = (name: string, date: Date): number => {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()))
    throw new TypeError(
      `${name} must be a valid Date. Received: ${String(date)}`
    );

  return date.getTime();
};
