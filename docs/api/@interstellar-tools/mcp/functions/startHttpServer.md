[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
startHttpServer

# Function: startHttpServer()

```ts
function startHttpServer(
  __namedParameters: HttpServerOptionsInterface
): Promise<Server<typeof IncomingMessage, typeof ServerResponse>>;
```

Defined in:
[http.ts:28](https://github.com/phun-ky/interstellar-tools/blob/67f4eb8ba20d421a65a56d0a4b194110e4445a49/packages/mcp/src/http.ts#L28)

Serve the MCP server over Streamable HTTP, for clients that only accept remote
servers. Runs stateless: every request gets a fresh server, which is cheap
because every tool is a pure calculation.

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
