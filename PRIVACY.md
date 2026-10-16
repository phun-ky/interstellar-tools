# Privacy

Interstellar Tools is designed to handle no personal data. This statement covers
the packages, the MCP server and the documentation site.

## The packages

`@interstellar-tools/constants`, `equations`, `temporal` and `types` are
calculation libraries. They run entirely inside your own application, make no
network requests, and collect, store or transmit no data of any kind.

## The MCP server

`@interstellar-tools/mcp` runs where you start it: on your own machine, or on a
server you control. Every tool is a pure calculation on the numbers it is given.
The server:

- stores nothing: it keeps no logs, sessions or state between requests;
- makes no outbound network requests;
- has no telemetry.

The AI assistant you connect it to is a separate service with its own privacy
policy, which governs your conversations with it.

## The documentation site

[phun-ky.net/interstellar-tools](https://phun-ky.net/interstellar-tools/) uses
no cookies, analytics or tracking. Fonts are served from the site itself.

Two things involve other servers, and they are listed here so you know about
them:

- **Build status in the navigation bar.** On screens 1600 px and wider, where
  the status is shown, your browser asks GitHub's public API for the latest test
  results of this project, which shares your IP address with GitHub. Narrower
  screens don't contact GitHub. The answer is kept in your browser for 10
  minutes and never sent anywhere else. See
  [GitHub's privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement).
- **Shared stylesheet.** The site loads a stylesheet from `phun-ky.net`, the
  author's own domain.

The site is hosted on `phun-ky.net`, whose web server may keep standard access
logs.

The theme toggle stores your light/dark choice in your browser's local storage.
It never leaves your device.

## Applicable laws

The project is built to comply with the EU General Data Protection Regulation
(GDPR). Because it processes no personal data itself, most GDPR obligations
don't arise. The statement above describes the few places where a third party
may see your IP address.

## Contact

Questions about privacy: <security@phun-ky.net>.
