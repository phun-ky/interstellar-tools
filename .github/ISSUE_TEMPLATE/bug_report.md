---
name: Bug report
about: Report something that doesn't work, or a wrong result or value
title: ''
labels: 'problems: 🐛 bug'
assignees: ''

---

<!--
Found a security vulnerability? Don't open an issue: report it privately as
described in SECURITY.md.
-->

**Which package and version?**
For example `@interstellar-tools/equations@0.61.1`. Run `npm ls @interstellar-tools/equations` to find it.

**What happened?**
A clear and concise description of the bug. For a wrong result, include the value you got.

**What did you expect?**
The value or behaviour you expected, and where it comes from (a reference, a paper, another tool).

**How to reproduce**
The smallest code that shows the problem:

```ts
import { escapeSpeed } from '@interstellar-tools/equations';

escapeSpeed(6.371e6, 3.986004418e14);
```

**Environment**
- Node.js version:
- Operating system:
- For the MCP server: the assistant or client, and stdio or HTTP

**Additional context**
Anything else that helps, such as error messages or screenshots.
