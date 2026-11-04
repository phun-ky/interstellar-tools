[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ tleChecksum

# Function: tleChecksum()

```ts
function tleChecksum(line: string): number;
```

Defined in:
[tle.ts:133](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/tle.ts#L133)

The **checksum** of a TLE line: the sum of its digits, with 1 for each minus
sign, modulo 10. It's the last column of each line, and catches most typos.

$$
c = \Big(\sum_{k=1}^{68} d_k\Big) \bmod 10
$$

Where:

- $d_k$ is the digit in column $k$, 1 for a minus sign and 0 for anything else

## Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `line`    | `string` | A TLE line; only its first 68 columns count. |

## Returns

`number`

The checksum, from 0 to 9.

## Throws

If `line` is not a string.

## Example

```ts
tleChecksum(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991'
); // 1
```

## See

[parseTle](parseTle.md)
