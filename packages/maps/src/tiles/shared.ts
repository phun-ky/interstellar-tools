/** The deepest zoom: 2^30 tiles across, about 4 cm on Earth. */
export const MAX_ZOOM = 30;

/** Throw unless `z` is an integer zoom in [0, MAX_ZOOM]. */
export const assertZoom = (z: number) => {
  if (!Number.isInteger(z) || z < 0 || z > MAX_ZOOM)
    throw new RangeError(
      `z must be an integer in [0, ${MAX_ZOOM}]. Received: ${z}`
    );
};

/** Throw unless `x`, `y` and `z` name a tile. */
export const assertTile = (x: number, y: number, z: number) => {
  assertZoom(z);

  const n = 2 ** z;

  for (const [name, index] of [
    ['x', x],
    ['y', y]
  ] as const)
    if (!Number.isInteger(index) || index < 0 || index >= n)
      throw new RangeError(
        `${name} must be an integer in [0, ${n}) at zoom ${z}. Received: ${index}`
      );
};
