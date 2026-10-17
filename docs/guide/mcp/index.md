# Using the MCP server

`@interstellar-tools/mcp` is a
[Model Context Protocol](https://modelcontextprotocol.io) (MCP) server. It turns
Interstellar Tools into tools that AI assistants can call, so when you ask about
Δv, orbital periods or anomalies, the assistant **computes** the answer with
tested equations instead of recalling a number that looks plausible.

[[toc]]

## What your assistant gets

| Tool                         | What it computes                                     |
| ---------------------------- | ---------------------------------------------------- |
| `gravitational_parameter`    | μ = G·(M + m) from masses                            |
| `circular_speed`             | Circular orbit speed at radius r                     |
| `escape_speed`               | Escape speed at radius r                             |
| `vis_viva_speed`             | Speed at radius r on an orbit with semi-major axis a |
| `kepler_period`              | Orbital period from semi-major axis                  |
| `peri_apoapsis_radii`        | Periapsis and apoapsis radii from a and e            |
| `sphere_of_influence_radius` | Laplace sphere of influence                          |
| `hohmann_transfer`           | Both burns, total Δv and transfer time               |
| `rocket_delta_v`             | Tsiolkovsky rocket equation from Isp and masses      |
| `plane_change_delta_v`       | Δv for a pure inclination change                     |
| `solve_kepler`               | Eccentric anomaly from mean anomaly                  |
| `convert_anomaly`            | Mean ↔ eccentric ↔ true anomaly                      |
| `convert_time`               | Durations from attoseconds to gigayears              |
| `find_body`                  | Planets, moons, stars, comets and more, by name      |

Every field name carries its unit (`r_m`, `mu_m3_s2`, `dv_total_m_s`), and
angles are passed as `{ "value": 28.5, "unit": "deg" }`, so there is no room for
kilometre/metre or degree/radian mix-ups. All tools are read-only and run
offline. The celestial datasets are also available as MCP resources at
`interstellar://datasets/{name}`.

## Before you start

- [Node.js](https://nodejs.org/) 22.9.0 or newer, so `npx` is on your `PATH`.
- Decide which of the two ways to run the server your assistant needs:

| How it runs               | Command                                 | For                                                                                 |
| ------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------- |
| **Local** (stdio)         | `npx -y @interstellar-tools/mcp`        | Desktop apps, IDEs and CLIs that start the server themselves                        |
| **Remote** (HTTP + HTTPS) | `npx -y @interstellar-tools/mcp --http` | Web assistants (claude.ai, ChatGPT, Le Chat, …) that call the server from the cloud |

You don't need to install anything up front: `npx -y` downloads and runs the
latest version on first use.

::: info Setup steps change often

AI assistants update their MCP support frequently. The steps below were checked
against each vendor's documentation in **October 2026**. If a menu has moved,
follow the linked official docs.

:::

## Local assistants

These start the server on your machine. Paste the snippet, restart or reload,
and the tools appear.

### Claude Desktop

1. Open **Claude › Settings… › Developer › Edit Config** (from the menu bar, not
   the in-window settings). This opens `claude_desktop_config.json`:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the server:

   ```json
   {
     "mcpServers": {
       "interstellar-tools": {
         "command": "npx",
         "args": ["-y", "@interstellar-tools/mcp"]
       }
     }
   }
   ```

3. Quit Claude completely and start it again. The server is listed under **+ ›
   Connectors**.

[Official docs](https://modelcontextprotocol.io/docs/develop/connect-local-servers)

### Claude Code

```shell
claude mcp add --transport stdio interstellar-tools -- npx -y @interstellar-tools/mcp
```

Add `--scope user` to make it available in every project, or `--scope project`
to share it with your team through a `.mcp.json` file in the repository. Check
it with `/mcp` inside Claude Code.

[Official docs](https://code.claude.com/docs/en/mcp)

### OpenAI Codex CLI

```shell
codex mcp add interstellar-tools -- npx -y @interstellar-tools/mcp
```

Or add it to `~/.codex/config.toml` by hand. The same configuration is used by
the Codex IDE extension and desktop app:

```toml
[mcp_servers.interstellar-tools]
command = "npx"
args = ["-y", "@interstellar-tools/mcp"]
```

[Official docs](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)

### Google Gemini CLI

```shell
gemini mcp add -s user interstellar-tools npx -y @interstellar-tools/mcp
```

Or add it to `~/.gemini/settings.json` (or `.gemini/settings.json` in a
project):

```json
{
  "mcpServers": {
    "interstellar-tools": {
      "command": "npx",
      "args": ["-y", "@interstellar-tools/mcp"]
    }
  }
}
```

[Official docs](https://geminicli.com/docs/tools/mcp-server/)

### GitHub Copilot in VS Code

Run **MCP: Add Server** from the Command Palette, or create `.vscode/mcp.json`.
Note that VS Code uses a `servers` key, not `mcpServers`:

```json
{
  "servers": {
    "interstellar-tools": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@interstellar-tools/mcp"]
    }
  }
}
```

Then pick the tools in Copilot Chat's **Agent** mode. On Copilot Business or
Enterprise, an administrator must first enable the **MCP servers in Copilot**
policy, which is off by default.

[Official docs](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

### Cursor

Add to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project):

```json
{
  "mcpServers": {
    "interstellar-tools": {
      "command": "npx",
      "args": ["-y", "@interstellar-tools/mcp"]
    }
  }
}
```

[Official docs](https://cursor.com/docs/context/mcp)

### JetBrains AI Assistant <Badge type="tip" text="🇪🇺 Europe" />

JetBrains is headquartered in Prague. In IntelliJ IDEA, WebStorm, PyCharm and
the other JetBrains IDEs:

1. Open **Settings › Tools › AI Assistant › Model Context Protocol (MCP)** and
   click **Add**.
2. Paste the configuration and choose **Global** or **Project** level:

   ```json
   {
     "mcpServers": {
       "interstellar-tools": {
         "command": "npx",
         "args": ["-y", "@interstellar-tools/mcp"]
       }
     }
   }
   ```

3. Click **OK**, then **Apply**.

Already set up Claude Desktop? Use **Import from Claude** instead.

[Official docs](https://www.jetbrains.com/help/ai-assistant/configure-an-mcp-server.html)

### JetBrains Junie <Badge type="tip" text="🇪🇺 Europe" />

Open **Settings › Tools › Junie › MCP Settings** and click **Add**. This opens
an `mcp.json` file that takes the same `mcpServers` configuration as the
JetBrains AI Assistant above. Junie CLI reads the same file; use `/mcp` to
manage servers.

[Official docs](https://junie.jetbrains.com/docs/junie-plugin-mcp-settings.html)

### Mistral Vibe <Badge type="tip" text="🇪🇺 Europe" />

Mistral's coding agent, from Paris. Add the server to `~/.vibe/config.toml` (or
`.vibe/config.toml` in a trusted project):

```toml
[[mcp_servers]]
name = "interstellar-tools"
transport = "stdio"
command = "npx"
args = ["-y", "@interstellar-tools/mcp"]
```

Run `/mcp` inside Vibe to confirm it is connected.

[Official docs](https://docs.mistral.ai/vibe/code/cli/mcp-servers)

### Windsurf

Add the same `mcpServers` block as for Cursor to
`~/.config/devin/mcp_config.json` (macOS and Linux) or
`%APPDATA%\devin\mcp_config.json` (Windows). Older installations use
`~/.codeium/windsurf/mcp_config.json`.

[Official docs](https://docs.devin.ai/desktop/cascade/mcp)

## Remote assistants

Web assistants call MCP servers **from their own cloud**, so `localhost` won't
work: the server needs a public HTTPS address. This takes two steps.

### 1. Run the server over HTTP

```shell
npx -y @interstellar-tools/mcp --http --port 3000
# interstellar-tools MCP server listening on http://127.0.0.1:3000/mcp
```

| Option                    | Default                                      | Description                                                  |
| ------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `--http`                  | off (stdio)                                  | Serve Streamable HTTP at `/mcp`                              |
| `--port <n>`              | `$PORT` or `3000`                            | Port to listen on                                            |
| `--host <addr>`           | `127.0.0.1`                                  | Interface to bind; use `0.0.0.0` in a container or on a host |
| `--allowed-hosts <names>` | `localhost`, `127.0.0.1`, `[::1]` (loopback) | Comma-separated host names that requests may be addressed to |

On loopback, the server rejects requests addressed to any other host name with
`403`. That stops a web page from reaching it through DNS rebinding.

### 2. Give it a public HTTPS address

For trying things out, a tunnel is the quickest route. Either of these works:

::: code-group

```shell [Cloudflare (no account)]
cloudflared tunnel --url http://localhost:3000 --http-host-header localhost:3000
# → https://<random-words>.trycloudflare.com
```

```shell [ngrok]
ngrok config add-authtoken <your-token>
ngrok http 3000 --host-header=rewrite
# → https://<name>.ngrok-free.dev
```

:::

The host header option makes the tunnel address the server as `localhost`, so it
passes the server's host check.

Your server URL is the tunnel address **plus `/mcp`**, for example
`https://example-words.trycloudflare.com/mcp`. Cloudflare quick-tunnel URLs
change every time you start them.

For something permanent, run the same command on any Node.js host (a VPS, a
container platform, Fly.io, Render, …) with `--host 0.0.0.0` behind HTTPS, and
`--allowed-hosts` set to your public host name, for example
`--allowed-hosts mcp.example.com`. The server is stateless, so it scales
horizontally without any session storage.

::: tip No secrets, no authentication

Every tool is a pure calculation with no access to files, networks or accounts,
so the server is set up without authentication. Choose **no authentication**
when your assistant asks. If you'd rather not leave it open, put it behind your
host's access controls.

:::

### claude.ai

Available on all plans. Free plans can add one custom connector.

1. Open **Customize › Connectors** and click **+ Add › Add custom connector**.
2. Enter a name (`Interstellar Tools`) and your server URL ending in `/mcp`.
3. Leave authentication empty and click **Add**.

On Team and Enterprise plans, an owner adds the connector under **Organization
settings › Connectors**, and members then connect to it.

[Official docs](https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp)

### ChatGPT

1. Go to [chatgpt.com/plugins](https://chatgpt.com/plugins) and click **+**,
   then **Add custom MCP server**.
2. Enter a name and description, paste your server URL ending in `/mcp`, and
   choose **No authentication**.
3. Confirm, create the plugin and install it. Mention it with `@` in a chat to
   use it.

Custom MCP servers depend on your plan and may need **Developer mode** turned on
under **Settings › Security and login**. In Business and Enterprise workspaces,
an admin has to allow them. ChatGPT asks for confirmation before tools that
change things; every tool here is marked read-only, so calls go straight
through.

[Official docs](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt)

### Mistral Le Chat <Badge type="tip" text="🇪🇺 Europe" />

Mistral's assistant, built in France.

1. Open **Connectors** and click **+ Add Connector**.
2. Choose the **Custom MCP Connector** tab.
3. Enter a connector name without spaces (`InterstellarTools`) and your server
   URL ending in `/mcp`.
4. Choose no authentication and click **Connect**.

Only the account admin can add connectors. On Free, Pro and Student plans,
that's you. Le Chat doesn't read MCP resources yet, so ask it to use `find_body`
to look up planets, moons and other bodies.

[Official docs](https://docs.mistral.ai/le-chat/knowledge-integrations/connectors/mcp-connectors)

### Langdock <Badge type="tip" text="🇪🇺 Europe" />

The Berlin-based AI workspace for companies. Open **Integrations › MCP**, enter
your server URL ending in `/mcp`, choose no authentication, click **Test
connection**, select the tools and **Save**.

[Official docs](https://docs.langdock.com/en/using-langdock/guides/integrations/mcp/mcp.md)

### Perplexity

On Pro, Max and Enterprise: open **Customize › Connectors**, click **Add
custom**, choose **Add MCP connector › Remote**, and enter your server URL
ending in `/mcp`.

[Official docs](https://www.perplexity.ai/help-center/en/articles/13915507-adding-custom-remote-connectors)

## Try it

Once it's connected, ask in plain language. For example:

> How much Δv does it take to go from a 300 km circular orbit to geostationary
> orbit, and how long is the transfer?

The assistant should call `hohmann_transfer` and answer with about **3.89 km/s**
in total (2.43 km/s and 1.47 km/s burns) and a transfer time of about **5.28
hours**.

More to try:

- _What's the escape speed from the surface of Mars?_
- _A probe has a mean anomaly of 120° on an orbit with e = 0.6. What's its true
  anomaly?_
- _I have 4 tonnes of propellant on a 1 tonne spacecraft with an Isp of 320 s.
  What's my Δv budget?_
- _How long is a megayear in seconds?_
- _What does the dataset say about Europa?_

::: tip Give the assistant a nudge

Most assistants pick up the tools on their own. If one answers from memory
instead, add _“use the interstellar-tools tools”_ to your question.

:::

## Use it from code

The server is also a library. Embed it in your own Node.js application, or
connect it to any transport the MCP SDK supports:

```ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createServer, startHttpServer } from '@interstellar-tools/mcp';

// stdio
await createServer().connect(new StdioServerTransport());

// or Streamable HTTP on http://127.0.0.1:3000/mcp
await startHttpServer({ port: 3000 });
```

## Troubleshooting

- **The tools don't appear.** Restart the app completely. Desktop apps only read
  their configuration at start-up. Then check that
  `npx -y @interstellar-tools/mcp --help` works in a terminal.
- **`npx` isn't found.** Desktop apps don't always inherit your shell's `PATH`.
  Use the full path to `npx` (`which npx` on macOS and Linux, `where npx` on
  Windows) as the `command`.
- **A remote assistant can't connect.** Check that the URL is public, uses HTTPS
  and ends in `/mcp`. Opening it in a browser should return an error from the
  server (that's expected), not a timeout.
- **The numbers look off.** Check the units in the tool call. Every field name
  ends with its unit, and the assistant may have converted a value on the way
  in.
- **Something else?**
  [Open an issue](https://github.com/phun-ky/interstellar-tools/issues).
