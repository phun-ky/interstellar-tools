[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
HttpServerOptionsInterface

# Interface: HttpServerOptionsInterface

Defined in:
[http.ts:7](https://github.com/phun-ky/interstellar-tools/blob/b0aaadc24c0246f5c4bb94a85788219caf1c8025/packages/mcp/src/http.ts#L7)

## Properties

### host?

```ts
optional host?: string;
```

Defined in:
[http.ts:11](https://github.com/phun-ky/interstellar-tools/blob/b0aaadc24c0246f5c4bb94a85788219caf1c8025/packages/mcp/src/http.ts#L11)

Interface to bind to. Defaults to loopback only.

---

### path?

```ts
optional path?: string;
```

Defined in:
[http.ts:13](https://github.com/phun-ky/interstellar-tools/blob/b0aaadc24c0246f5c4bb94a85788219caf1c8025/packages/mcp/src/http.ts#L13)

Path that serves MCP requests.

---

### port

```ts
port: number;
```

Defined in:
[http.ts:9](https://github.com/phun-ky/interstellar-tools/blob/b0aaadc24c0246f5c4bb94a85788219caf1c8025/packages/mcp/src/http.ts#L9)

Port to listen on. Use 0 for a random free port.
