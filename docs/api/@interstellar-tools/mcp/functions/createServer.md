[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
createServer

# Function: createServer()

```ts
function createServer(): McpServer;
```

Defined in:
[server.ts:30](https://github.com/phun-ky/interstellar-tools/blob/3def98a4bff9f31a20df012d1fde9828c566a9f9/packages/mcp/src/server.ts#L30)

Create an MCP server with every interstellar-tools tool and resource registered.
Connect it to a transport of your choice.

## Returns

`McpServer`

## Example

```ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from '@interstellar-tools/mcp';

await createServer().connect(new StdioServerTransport());
```
