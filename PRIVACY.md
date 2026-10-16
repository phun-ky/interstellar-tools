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

The site contacts no other service on its own. The only exception happens when
you ask for it:

- **Build status in the navigation bar.** On screens 1600 px and wider, the
  navigation bar has a **Request status** button. Only when you select it does
  your browser ask GitHub's public API for this project's latest test results,
  which shares your IP address with GitHub. The answer is kept in memory until
  you reload the page, and isn't stored or sent anywhere else. See
  [GitHub's privacy statement](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement).

The site also loads a shared stylesheet from `phun-ky.net`, the author's own
domain, which is the same server that hosts the site.

The site is hosted on `phun-ky.net`, whose web server may keep standard access
logs.

The site keeps one setting in your browser's local storage: whether to show the
light or dark theme (`vitepress-theme-appearance`). It's written when you first
visit, so pages open in the right theme, and it never leaves your device.

## Applicable laws

The project is built to comply with the EU General Data Protection Regulation
(GDPR) and the ePrivacy Directive. It processes no personal data itself, sets no
cookies, and stores nothing in your browser except the theme setting. Your IP
address only reaches a third party, GitHub, when you select **Request status**.

## Contact

Questions about privacy: <security@phun-ky.net>.
