/* eslint-disable @typescript-eslint/no-explicit-any */
import container from 'markdown-it-container';
import { defineConfig } from 'vitepress';
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons';

// import path from 'node:path';
import { fileURLToPath } from 'node:url';

import typedocSidebar from '../api/typedoc-sidebar.json';

import darkTheme from './shiki/accessible-aa-dark-shiki.json' with { type: 'json' };
import lightTheme from './shiki/accessible-aa-light-shiki.json' with { type: 'json' };

// const here = fileURLToPath(new URL('.', import.meta.url));
// const root = path.resolve(here, '../../..');

export default defineConfig({
  base: '/interstellar-tools/',
  lang: 'en-GB',

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  description:
    'Open, tested building blocks for orbital mechanics and space software in TypeScript: equations, constants, datasets, time utilities and an MCP server for AI assistants.',
  title: 'Interstellar Tools',
  // Mission Control is designed dark-first; the toggle switches to light
  appearance: 'dark',
  head: [
    ['meta', { name: 'theme-color', content: '#0b1016' }],
    // Add the theme's scope class before first paint, not after hydration
    ['script', {}, 'document.documentElement.classList.add("ph");']
  ],
  themeConfig: {
    search: {
      provider: 'local'
    },
    editLink: {
      pattern:
        'https://github.com/phun-ky/interstellar-tools/edit/main/docs/:path',
      text: 'Suggest changes to this page'
    },
    siteTitle: 'Interstellar Tools',
    logo: {
      src: '/logo/logo.svg',
      alt: 'Interstellar Tools logo'
    },
    nav: [
      { text: 'Guide', link: '/guide/introduction/' },
      {
        text: 'AI assistants',
        link: '/guide/mcp/',
        activeMatch: '/guide/mcp/'
      },
      { text: 'Learn', link: '/learn/', activeMatch: '/learn/' },
      { text: 'Reference', link: '/api/', activeMatch: '/api/' },
      { text: 'Sponsor', link: 'https://github.com/sponsors/phun-ky' },

      {
        text: 'Contributing',
        link: 'https://github.com/phun-ky/interstellar-tools/blob/main/CONTRIBUTING.md'
      }
    ],
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/phun-ky/interstellar-tools'
      },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/org/interstellar-tools'
      }
    ],
    footer: {
      message:
        'Released under the <a href="https://choosealicense.com/licenses/mit/" target="_blank" rel="nofollow noreferrer">MIT License</a>.',
      copyright:
        'Copyright © 2025-present <a href="https://phun-ky.net/">Alexander Vassbotn Røyne-Helgesen</a>'
    },
    sidebar: {
      '/learn/': [
        {
          text: 'Learn',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/learn/' },
            {
              text: 'Where is Earth today?',
              link: '/learn/where-is-earth-today'
            }
          ]
        }
      ],
      '/guide/': [
        {
          text: 'Introduction',
          collapsed: false,
          items: [
            {
              text: 'About Interstellar Tools',
              link: '/guide/introduction/about'
            },
            { text: 'Getting started', link: '/guide/introduction/' }
          ]
        },
        {
          text: 'Usage',
          collapsed: false,
          items: [
            {
              text: 'Equations',
              collapsed: false,
              items: [
                {
                  text: 'Manoeuvres',
                  link: '/guide/usage/equations/manoeuvres'
                }
              ]
            }
          ]
        },
        {
          text: 'AI assistants',
          collapsed: false,
          items: [{ text: 'Using the MCP server', link: '/guide/mcp/' }]
        },
        {
          text: 'Development',
          collapsed: false,
          items: [
            { text: 'Development setup', link: '/guide/development' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Upgrading', link: '/guide/upgrading' }
          ]
        },
        {
          text: 'Reference',
          items: typedocSidebar.map((s) => ({
            ...s,
            collapsed: true
          }))
        }
      ],
      '/api/': [
        {
          text: 'Reference',
          items: typedocSidebar.map((s) => ({
            ...s,
            collapsed: true
          }))
        }
      ]
    }
  },
  vite: {
    plugins: [groupIconVitePlugin()],
    resolve: {
      alias: [
        // Import the packages from source, so the docs always run the
        // current code and the deploy doesn't need a package build first
        ...['constants', 'equations', 'temporal', 'types'].map((name) => ({
          find: `@interstellar-tools/${name}`,
          replacement: fileURLToPath(
            new URL(`../../packages/${name}/src/index.ts`, import.meta.url)
          )
        })),
        {
          find: /^.*\/VPSwitchAppearance\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/ToggleDarkMode.vue', import.meta.url)
          )
        }
      ]
    }
  },
  markdown: {
    math: true,
    toc: {
      level: [2, 3, 4]
    },
    config(md) {
      md.use(groupIconMdPlugin);
      // `::: practice Title` → an "In practice" readout box (see practice.css)
      md.use(container, 'practice', {
        render(tokens: any[], idx: number) {
          const token = tokens[idx];

          if (token.nesting !== 1) return '</div></div>\n';

          const title = md.renderInline(
            token.info.trim().slice('practice'.length).trim()
          );

          return `<div class="mc-practice"><div class="mc-practice__head"><span class="mc-practice__tag">In practice</span><span class="mc-practice__title">${title}</span></div><div class="mc-practice__body">\n`;
        }
      });
    },

    theme: {
      dark: darkTheme as any,
      light: lightTheme as any
    },
    // (Optional) Preload themes explicitly
    shikiSetup: async (shiki) => {
      await shiki.loadTheme(darkTheme as any);
      await shiki.loadTheme(lightTheme as any);
    }
  }
});
