[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
createServer

# Function: createServer()

```ts
function createServer(): McpServer;
```

Defined in:
[server.ts:30](https://github.com/phun-ky/interstellar-tools/blob/c48c12d1e1a0c7662e062aba029fbaa6743ccf30/packages/mcp/src/server.ts#L30)

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
