# Security Policy

The libraries (`@interstellar-tools/constants`, `equations`, `temporal` and
`types`) have no runtime dependencies outside this monorepo, and they collect,
store and transmit no data. `@interstellar-tools/mcp` depends on the
[Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
and [Zod](https://github.com/colinhacks/zod), both MIT-licensed. How
dependencies are chosen, tracked and kept clear of known vulnerabilities is
described under [Dependencies](#dependencies).

## Supported Versions

The project is in early alpha (`0.x`). Until 1.0, security fixes are released
for the latest published version of each package only: a release is supported
until the next release of the same package. To get a fix, upgrade to the latest
version; the
[upgrading guide](https://phun-ky.net/interstellar-tools/guide/upgrading)
explains any changes you need to make.

From 1.0, support follows the major version:

- **The current major is supported as a whole.** Fixes are released as a new
  patch or minor of it, and upgrading within a major never breaks your code, so
  everyone on 1.x gets a fix by upgrading to the newest 1.x. That includes
  **deprecated APIs**: as long as a major ships them, they get security fixes
  like everything else.
- **The previous major gets fixes for high and critical vulnerabilities for 6
  months** after the next major is released, as a patch on its latest release.
  That leaves time to migrate without staying exposed. This starts with 1.x when
  2.0 ships; `0.x` gets no more releases once 1.0 is out.
- **Security comes before the deprecation grace period.** If a vulnerability
  can't be fixed without breaking an API, deprecated or not, the fix may change
  or remove it in a patch or minor release instead of waiting for a major. The
  change is kept as small as possible, and the advisory and the release notes
  say what changed and why.

| Release                                     | Supported                        |
| ------------------------------------------- | -------------------------------- |
| Latest release of the current major         | ✅                               |
| Older releases of the current major         | ✅ by upgrading within the major |
| Previous major, for 6 months after the next | ✅ high and critical fixes only  |
| Anything older                              | ❌                               |

Every package is covered: `@interstellar-tools/constants`, `equations`, `mcp`,
`temporal` and `types`.

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

To check **who** built a release, look at its provenance: it must name the
repository `phun-ky/interstellar-tools` and the workflow
`.github/workflows/publish.yml`. Each package's page on npm shows this under
"Provenance", with links to the source commit and the workflow run, and
`npm view @interstellar-tools/<package>@<version> dist.attestations` lists the
attestations themselves.

Each GitHub release also has a software bill of materials attached, in CycloneDX
format (`<package>-<version>.cdx.json`), listing the package's runtime
dependencies.

## Dependencies

**Choosing them.** The fewer dependencies, the better. The libraries
(`constants`, `equations`, `temporal`, `types`) have no runtime dependencies
outside this monorepo, and should keep it that way. A new runtime dependency is
discussed in an issue first, and must be widely used, actively maintained and
under an OSI-approved licence compatible with MIT; strong copyleft licences
(GPL, AGPL) are not accepted for runtime dependencies. Development dependencies
follow the same rules, judged more loosely.

**Obtaining them.** Packages come only from the npm registry, with exact
versions locked in `package-lock.json` and installed with `npm ci` in CI. GitHub
Actions are pinned to commit SHAs.

**Tracking them.** Dependabot proposes version updates weekly and security
updates as soon as an advisory is published. Every pull request runs
[dependency review](https://github.com/phun-ky/interstellar-tools/blob/main/.github/workflows/dependency-review.yml),
and every release runs `npm audit` first.

**Fixing known vulnerabilities.** Findings are checked against the GitHub
Advisory Database, which also lists known malicious npm packages:

| Finding                    | Where                  | What happens                                                                                     |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| Critical or high           | Runtime dependency     | Blocks merging (dependency review) and releasing (`npm audit`); fixed and released within 7 days |
| Critical or high           | Development dependency | Blocks merging when introduced; an existing one is fixed within 30 days                          |
| Moderate or low            | Any dependency         | Fixed with the next update, within 90 days                                                       |
| Licence outside the policy | New dependency         | Not merged                                                                                       |

**Vulnerabilities that don't affect the project.** If a dependency has a
vulnerability that can't be exploited through this project, for example because
the vulnerable code is never called, the alert is dismissed with that reason and
recorded as an [OpenVEX](https://openvex.dev/) statement in `vex.openvex.json`
in this repository. There are none at the moment.

## Code Scanning

CodeQL analyses every pull request and every push to `main`. The ruleset on
`main` blocks merging while CodeQL reports an error, or a security alert of high
or critical severity. Medium and low alerts are reviewed within 30 days, and
either fixed or dismissed with the reason recorded in the alert.

## Secrets

The project keeps as few secrets as possible:

| Secret          | Used by                                                                     | For                                                                                |
| --------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `GH_TOKEN`      | `publish.yml`, and the failed-build alerts in `check.yml` and `publish.yml` | Release commits, tags and GitHub releases, and opening an issue when a build fails |
| `CODECOV_TOKEN` | `check.yml`                                                                 | Uploading coverage reports                                                         |

Publishing to npm needs no secret: it uses short-lived OIDC tokens from GitHub.

- **Storage:** secrets are kept only as encrypted GitHub Actions secrets, never
  in the repository. Secret scanning with push protection blocks commits that
  contain one.
- **Access:** only the maintainer can view or change them, and they are not
  available to workflows run from forks.
- **Scope:** each token is limited to this repository and to the permissions its
  task needs, with an expiry date.
- **Rotation:** at least once a year, immediately if one may have been exposed,
  and when someone with access leaves the project.

## Assurance Case

Why these expectations hold, with the threat model and trust boundaries, is set
out in the [assurance case](ASSURANCE.md).
