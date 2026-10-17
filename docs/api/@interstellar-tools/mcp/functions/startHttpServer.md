[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
startHttpServer

# Function: startHttpServer()

```ts
function startHttpServer(
  __namedParameters: HttpServerOptionsInterface
): Promise<Server<typeof IncomingMessage, typeof ServerResponse>>;
```

Defined in:
[http.ts:76](https://github.com/phun-ky/interstellar-tools/blob/e34e70d11d6992afbf0893b789b57877dbc6210d/packages/mcp/src/http.ts#L76)

Serve the MCP server over Streamable HTTP, for clients that only accept remote
servers. Runs stateless: every request gets a fresh server, which is cheap
because every tool is a pure calculation.

Requests whose `Host` header isn't allowed are rejected with 403 before they
reach the server. Bound to loopback (the default), only `localhost`, `127.0.0.1`
and `[::1]` are allowed, which protects against DNS rebinding.

## Parameters

| Parameter           | Type                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| `__namedParameters` | [`HttpServerOptionsInterface`](../interfaces/HttpServerOptionsInterface.md) |

## Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<`Server`<_typeof_
`IncomingMessage`, _typeof_ `ServerResponse`>>

## Example

```ts
import { startHttpServer } from '@interstellar-tools/mcp';

await startHttpServer({ port: 3000 }); // http://127.0.0.1:3000/mcp
```
