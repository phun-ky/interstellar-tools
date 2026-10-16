import { defineConfig } from 'eslint/config';

import SharedConfig from '../../eslint.config.mjs';

export default defineConfig([
  SharedConfig,
  {
    rules: {
      // The SDK publishes subpaths through a `./*` exports wildcard that the
      // import resolver can't follow; TypeScript still checks these imports
      'import-x/no-unresolved': [
        'error',
        { ignore: ['^@modelcontextprotocol/sdk/'] }
      ]
    }
  }
]);
