import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import assert from 'node:assert/strict';
import { request, type Server } from 'node:http';
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

/** POST to the MCP path with a chosen Host header, as a browser would after DNS rebinding. */
const statusWithHost = (url: string, host: string) =>
  new Promise<number>((resolve, reject) => {
    const { hostname, port } = new URL(url);
    const req = request(
      {
        hostname,
        port,
        path: '/mcp',
        method: 'POST',
        headers: {
          host,
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream'
        }
      },
      (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      }
    );

    req.on('error', reject);
    req.end(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }));
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

  test('rejects a foreign Host header (DNS rebinding) with 403', async () => {
    const { port } = new URL(base);

    assert.equal(await statusWithHost(base, `attacker.example:${port}`), 403);
  });

  test('accepts the loopback host names', async () => {
    const { port } = new URL(base);

    for (const name of ['localhost', '127.0.0.1', '[::1]']) {
      assert.notEqual(await statusWithHost(base, `${name}:${port}`), 403, name);
    }
  });

  test('uses allowedHosts when given', async () => {
    const custom = await startHttpServer({
      port: 0,
      allowedHosts: ['mcp.internal']
    });
    const url = `http://127.0.0.1:${(custom.address() as AddressInfo).port}`;

    try {
      assert.notEqual(await statusWithHost(url, 'mcp.internal'), 403);
      assert.equal(await statusWithHost(url, 'localhost'), 403);
    } finally {
      custom.close();
    }
  });
});
