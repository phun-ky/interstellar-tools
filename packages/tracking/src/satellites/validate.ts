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
