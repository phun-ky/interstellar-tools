# Assurance Case

This document argues why Interstellar Tools meets the security expectations in
the [security policy](SECURITY.md#security-expectations). It covers the threat
model, the trust boundaries, how secure design principles are applied, and how
common weaknesses are countered. It's reviewed whenever a change affects
security, such as a new way to run the MCP server.

## What is being protected

- **The integrity of the published packages:** what users install from npm must
  be exactly what was built from this repository.
- **The machines that run the code:** using a package or running the MCP server
  must not give anyone access to the user's files, processes or network.
- **The correctness of results:** invalid input must be rejected rather than
  produce a quietly wrong number, since results may feed into other software.

There are no secrets, accounts or personal data in the software itself.

## Threat model

| Threat                                                                        | Where it would come from             |
| ----------------------------------------------------------------------------- | ------------------------------------ |
| Malicious code merged into the repository                                     | A pull request                       |
| A compromised dependency or CI action                                         | The npm registry, GitHub Actions     |
| A tampered package on npm                                                     | The release pipeline, a stolen token |
| Malicious or malformed input to a function or MCP tool                        | Callers, AI assistants, MCP clients  |
| A web page reaching an MCP server on the user's machine through DNS rebinding | Any website the user visits          |
| Overloading a publicly exposed MCP server                                     | Anyone who can reach it              |

## Trust boundaries

```text
 contributor ──pull request──▶ repository ──GitHub Actions──▶ npm ──install──▶ user
                  (review, CI)              (trusted publishing,        (npm audit
                                             provenance)                 signatures)

 caller / MCP client ──input──▶ equations / MCP server
                     (validation, schemas, host check)
```

1. **Contributor to repository.** Every change arrives as a pull request and is
   reviewed by the maintainer. The ruleset on `main` requires the Checks
   workflow (build, lint, type-check, docs check and tests) to pass, and CodeQL
   results with no errors and no high or critical security alerts, before a
   merge.
2. **Repository to npm.** Releases are built and published by GitHub Actions
   with npm trusted publishing (OIDC). There is no long-lived npm token to
   steal, and every package gets a signed provenance attestation.
3. **npm to user.** Users can check that what they installed was built from this
   repository with `npm audit signatures`.
4. **Caller to library.** Anything passed to a function is untrusted. Every
   equation validates its input and throws on invalid values.
5. **Client to MCP server.** Tool input from an AI assistant or MCP client is
   untrusted, and is validated against a Zod schema before use. Over HTTP, the
   request itself is untrusted: its `Host` header must name an allowed host.

## Secure design principles

- **Economy of mechanism.** The libraries are small, pure functions with no
  runtime dependencies outside the monorepo, which keeps them simple to review.
- **Fail-safe defaults.** Invalid input throws instead of returning a value. The
  MCP server binds to `127.0.0.1` and only accepts loopback host names unless
  configured otherwise.
- **Complete mediation.** Every MCP tool call passes through its schema, and
  every HTTP request through the host check, with no way around them.
- **Least privilege.** The libraries need no permissions at all. GitHub Actions
  workflows are read-only by default, and jobs are granted only what they need,
  such as `id-token: write` for publishing.
- **Least common mechanism.** The HTTP server is stateless: every request gets
  its own MCP server, so requests share no state.
- **Open design.** All code, CI configuration and release tooling are public.
  Nothing depends on keeping the design secret.
- **Limited attack surface.** The MCP tools only calculate. They have no access
  to files, processes or the network, and the datasets are read-only.

## Common weaknesses countered

| Weakness                                      | How it's countered                                                                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Improper input validation (CWE-20)            | Equations check inputs and throw on non-finite or out-of-domain values; MCP inputs are validated with Zod schemas with ranges and enums |
| Code injection (CWE-94, CWE-95)               | No `eval`, `new Function` or dynamic imports of user input anywhere in the packages                                                     |
| OS command injection (CWE-78)                 | No `child_process` or shell access in the packages                                                                                      |
| Path traversal (CWE-22)                       | No filesystem access in the packages                                                                                                    |
| DNS rebinding, missing origin check (CWE-346) | The HTTP server rejects requests whose `Host` isn't an allowed name                                                                     |
| Hard-coded credentials (CWE-798)              | No credentials exist: publishing uses short-lived OIDC tokens                                                                           |
| Supply chain compromise (CWE-1357)            | Dependencies pinned in `package-lock.json`, actions pinned to commit SHAs, Dependabot updates, CodeQL and OpenSSF Scorecard in CI       |
| Tampered releases (CWE-494)                   | Signed npm provenance, verifiable with `npm audit signatures`                                                                           |

These are checked continuously: CodeQL scans every change, the tests cover the
validation and the host check, and lint and strict TypeScript run on every pull
request.

## Known limits

- **No authentication or rate limiting in the MCP server.** It only does public
  calculations, so there is nothing to protect behind a login. Anyone exposing
  it publicly should put access control and rate limiting in front of it, as the
  security policy says.
- **One maintainer reviews changes.** There is no second reviewer yet, so review
  relies on the maintainer and the automated checks, and the maintainer can
  bypass the ruleset as an administrator. See the [governance](GOVERNANCE.md).
- **Release tags are not signed.** The npm provenance attestations are the
  verifiable link between a release and its source.
