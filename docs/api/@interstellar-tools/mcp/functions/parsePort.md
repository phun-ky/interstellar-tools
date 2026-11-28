[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
parsePort

# Function: parsePort()

```ts
function parsePort(text: string): number;
```

Defined in:
[http.ts:40](https://github.com/phun-ky/interstellar-tools/blob/main/packages/mcp/src/http.ts#L40)

A TCP port from the command line or `$PORT`: a whole number in \[0, 65535],
where 0 picks a free one.

## Parameters

| Parameter | Type     |
| --------- | -------- |
| `text`    | `string` |

## Returns

`number`

## Throws

If `text` is anything else, including empty.
