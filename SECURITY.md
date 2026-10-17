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

Report vulnerabilities privately, either with GitHub's
[private vulnerability reporting](https://github.com/phun-ky/interstellar-tools/security/advisories/new)
or by email to <security@phun-ky.net>. Please don't open a public issue for a
security problem.

## How Reports Are Handled

1. **Acknowledgement:** you'll get a reply within 7 days confirming the report
   was received.
2. **Assessment:** the maintainer reproduces the issue and judges its severity,
   and may ask you for details.
3. **Fix:** a fix is developed in a private GitHub security advisory and
   released as a new version of each affected package. The aim is a fix within
   30 days for serious issues.
4. **Disclosure:** the advisory is published when the fix is released, with a
   CVE where one applies. Please keep the issue private until then.
5. **Credit:** reporters are credited in the advisory and the release notes,
   unless they ask to stay anonymous.

## Security Expectations

What you can rely on:

- **The libraries do no I/O.** `constants`, `equations`, `temporal` and `types`
  are pure functions and data: no file, network or process access, no `eval`,
  and no data collection.
- **Invalid input is rejected.** Equations validate their inputs and throw on
  non-finite or out-of-domain values instead of returning a wrong result.
- **The MCP server only calculates.** Its tools are offline, read-only
  calculations, and every input is validated against a schema. It has no access
  to files, accounts or the network beyond answering requests.
- **The MCP server stays local by default.** Over HTTP it binds to `127.0.0.1`
  and only answers requests addressed to `localhost`, `127.0.0.1` or `[::1]`,
  which protects it from DNS rebinding.
- **Releases are traceable.** Every package is built and published from GitHub
  Actions, with signed provenance (see below).

What you can't rely on:

- **Flight or safety use.** The equations are not certified, and are not meant
  for operating real spacecraft or other safety-critical systems.
- **Authentication.** The MCP server has none, since it only does public
  calculations. If you expose it on a network, put access control in front of it
  and set `--allowed-hosts`.
- **Availability.** Very large inputs, such as huge numbers of requests to a
  public MCP server, are not rate-limited by the project.

## Verifying Releases

Every package is published from GitHub Actions with npm trusted publishing, and
carries a signed provenance attestation (Sigstore) that links it to the commit
and workflow run that built it. The signing identity comes from GitHub, so no
signing key is stored on npm. To verify the packages you've installed:

```shell
npm audit signatures
```

Each package's page on npm also shows its provenance, with links to the source
commit and the build.

## Assurance Case

Why these expectations hold, with the threat model and trust boundaries, is set
out in the [assurance case](ASSURANCE.md).
