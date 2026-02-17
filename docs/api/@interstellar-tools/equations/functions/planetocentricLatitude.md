[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / planetocentricLatitude

# Function: planetocentricLatitude()

```ts
function planetocentricLatitude(x: number, y: number, z: number): number;
```

Defined in:
[cartography/planetocentric-latitude.ts:37](https://github.com/phun-ky/interstellar-tools/blob/0d7df195ae500c345b1c6ecb00826679455e45ef/packages/equations/src/categories/cartography/planetocentric-latitude.ts#L37)

Compute **planetocentric latitude** ($\varphi_c$) from body-fixed Cartesian
coordinates.

Planetocentric latitude is defined as the angle between the body's equatorial
plane and the radius vector from the body's center of mass to the point:

$$
\varphi_c = \arctan\!\left(\frac{z}{\sqrt{x^2+y^2}}\right)
$$

Implementation note:

- This uses `atan2(z, hypot(x,y))` for numerical stability and correct quadrant
  handling.

## Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `x`       | `number` | X coordinate in a body-fixed frame (finite). |
| `y`       | `number` | Y coordinate in a body-fixed frame (finite). |
| `z`       | `number` | Z coordinate in a body-fixed frame (finite). |

## Returns

`number`

Planetocentric latitude ($\varphi_c$) in **radians** (range: ($[- \pi/2, \pi/2]
$)).

## Throws

If any input is not a finite number.

## Example

```ts
// Point directly above the equator on +X axis:
const phi = planetocentricLatitude(1, 0, 0);
// phi === 0

// Point on +Z axis:
const northPole = planetocentricLatitude(0, 0, 1);
// northPole === Math.PI / 2
```

## See

- https://en.wikipedia.org/wiki/Planetary\_coordinate\_system Planetary
  coordinate system (definitions of planetocentric vs. planetographic latitude)
- https://planetarynames.wr.usgs.gov/Page/Website USGS Planetary Names
  (planetocentric latitude definition)
- https://pds.nasa.gov/datastandards/pds3/standards/sr/Chapter02.pdf NASA PDS
  Standards Reference (planetocentric latitude defined as angle to the
  center-of-mass vector)
- https://naif.jpl.nasa.gov/pub/naif/toolkit\_docs/Tutorials/pdf/individual\_docs/17\_frames\_and\_coordinate\_systems.pdf
  NAIF SPICE tutorial: Frames and Coordinate Systems (planetocentric/body-fixed
  frame conventions)
