import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, describe, test } from 'node:test';

import { startHttpServer } from '../http.js';

let http: Server;
let base: string;

before(async () => {
  http = await startHttpServer({ port: 0 });

  const { port } = http.address() as AddressInfo;

  base = `http://127.0.0.1:${port}`;
});

after(() => {
  http.close();
});

describe('Streamable HTTP', () => {
  test('binds to loopback by default', () => {
    assert.equal((http.address() as AddressInfo).address, '127.0.0.1');
  });

  test('serves tools to an HTTP client', async () => {
    const client = new Client({ name: 'test', version: '0.0.0' });

    await client.connect(
      new StreamableHTTPClientTransport(new URL(`${base}/mcp`))
    );

    const { tools } = await client.listTools();
    const res = (await client.callTool({
      name: 'escape_speed',
      arguments: { r_m: 6_378_137, mu_m3_s2: 3.986004418e14 }
    })) as unknown as { structuredContent: { v_m_s: number } };

    assert.equal(tools.length, 14);
    assert.ok(Math.abs(res.structuredContent.v_m_s - 11_179.9) < 1);

    await client.close();
  });

  test('handles independent clients', async () => {
    const clients = await Promise.all(
      [1, 2, 3].map(async () => {
        const client = new Client({ name: 'test', version: '0.0.0' });

        await client.connect(
          new StreamableHTTPClientTransport(new URL(`${base}/mcp`))
        );

        return client;
      })
    );
    const results = await Promise.all(
      clients.map((client) => client.listResources())
    );

    for (const { resources } of results) assert.equal(resources.length, 8);

    await Promise.all(clients.map((client) => client.close()));
  });

  test('returns 404 outside the MCP path', async () => {
    const res = await fetch(`${base}/`);

    assert.equal(res.status, 404);
  });
});
