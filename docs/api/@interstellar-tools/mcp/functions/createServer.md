[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
createServer

# Function: createServer()

```ts
function createServer(): McpServer;
```

Defined in:
[server.ts:25](https://github.com/phun-ky/interstellar-tools/blob/ca52edc369416679c33b3a8bbc7f1efc863a328d/packages/mcp/src/server.ts#L25)

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
