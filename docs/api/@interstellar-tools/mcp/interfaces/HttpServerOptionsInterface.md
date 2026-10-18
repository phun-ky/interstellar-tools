[Documentation](../../../index.md) / [@interstellar-tools/mcp](../index.md) /
HttpServerOptionsInterface

# Interface: HttpServerOptionsInterface

Defined in:
[http.ts:12](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/mcp/src/http.ts#L12)

## Properties

### allowedHosts?

```ts
optional allowedHosts?: string[];
```

Defined in:
[http.ts:25](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/mcp/src/http.ts#L25)

Host names a request's `Host` header may name. Defaults to the loopback names
when bound to loopback, which blocks DNS rebinding: a web page that points its
own domain at 127.0.0.1 still sends that domain as `Host`. Required to restrict
hosts when binding to another interface.

---

### host?

```ts
optional host?: string;
```

Defined in:
[http.ts:16](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/mcp/src/http.ts#L16)

Interface to bind to. Defaults to loopback only.

---

### path?

```ts
optional path?: string;
```

Defined in:
[http.ts:18](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/mcp/src/http.ts#L18)

Path that serves MCP requests.

---

### port

```ts
port: number;
```

Defined in:
[http.ts:14](https://github.com/phun-ky/interstellar-tools/blob/6e83a5875c979f30e6d60949b94ec4505f89ba8e/packages/mcp/src/http.ts#L14)

Port to listen on. Use 0 for a random free port.
