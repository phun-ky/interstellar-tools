---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Interstellar Tools'
  text: 'A set of tools'
  tagline: 'boing'
  image:
    src: './logo/logo.svg'
    alt: 'Hero Image Description'
  actions:
    - theme: brand
      text: Get started
      link: /guide/introduction/
    - theme: alt
      text: View on GitHub
      link: https://github.com/phun-ky/hybrid-compute

features:
  - title: Run compute where it runs best
    details:
      Dispatch tasks to the optimal environment - local JS, Web Worker, or a
      remote service - without changing your application code.

  - title: Auto strategy routing
    details:
      Use the <code class="ph language-">auto</code> strategy to prefer workers
      for CPU work, local for trivial logic, and remote when needed - based on
      <code class="ph language-">canRun()</code> capability checks.

  - title: Pluggable backends
    details:
      Swap or combine backends (local, worker, remote) via a clean interface;
      add custom backends without touching core.

  - title: Web Worker offloading
    details:
      Move heavy computations off the main thread to keep the UI smooth and
      responsive.

  - title: Remote execution over HTTP or WebSocket
    details:
      Call remote compute services with fetch or persistent WebSocket transport
      for low-latency streaming and batching.

  - title: Streaming-friendly design
    details:
      Built to accommodate token/NDJSON/chunked flows; ideal for LLM streaming
      and progressive rendering.
---

## Other features
