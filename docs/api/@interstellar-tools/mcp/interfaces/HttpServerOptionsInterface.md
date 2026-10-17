[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
HttpServerOptionsInterface

# Interface: HttpServerOptionsInterface

Defined in:
[http.ts:7](https://github.com/phun-ky/interstellar-tools/blob/863383fff6e28d7137a1400d3602561b477a518c/packages/mcp/src/http.ts#L7)

## Properties

### host?

```ts
optional host?: string;
```

Defined in:
[http.ts:11](https://github.com/phun-ky/interstellar-tools/blob/863383fff6e28d7137a1400d3602561b477a518c/packages/mcp/src/http.ts#L11)

Interface to bind to. Defaults to loopback only.

---

### path?

```ts
optional path?: string;
```

Defined in:
[http.ts:13](https://github.com/phun-ky/interstellar-tools/blob/863383fff6e28d7137a1400d3602561b477a518c/packages/mcp/src/http.ts#L13)

Path that serves MCP requests.

---

### port

```ts
port: number;
```

Defined in:
[http.ts:9](https://github.com/phun-ky/interstellar-tools/blob/863383fff6e28d7137a1400d3602561b477a518c/packages/mcp/src/http.ts#L9)

Port to listen on. Use 0 for a random free port.
