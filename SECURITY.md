# Security Policy

The libraries (`@interstellar-tools/constants`, `equations`, `temporal` and
`types`) have no runtime dependencies outside this monorepo, and they collect,
store and transmit no data. `@interstellar-tools/mcp` depends on the
[Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
and [Zod](https://github.com/colinhacks/zod), both MIT-licensed. Dependencies
are monitored with Dependabot, and pinned versions are kept clear of known
advisories.

## Supported Versions

The project is in early alpha (`0.x`). Security fixes are released for the
latest published version of each package only.

| Package                         | Supported                |
| ------------------------------- | ------------------------ |
| `@interstellar-tools/constants` | Latest release on npm ✅ |
| `@interstellar-tools/equations` | Latest release on npm ✅ |
| `@interstellar-tools/mcp`       | Latest release on npm ✅ |
| `@interstellar-tools/temporal`  | Latest release on npm ✅ |
| `@interstellar-tools/types`     | Latest release on npm ✅ |
| Any older release               | ❌                       |

## Reporting a Vulnerability

Report vulnerabilities privately to <security@phun-ky.net>. Please don't open a
public issue for a security problem.
