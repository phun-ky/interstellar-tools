/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from 'vitepress';
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons';
import { withMermaid } from 'vitepress-plugin-mermaid';

// import path from 'node:path';
import { fileURLToPath } from 'node:url';

import typedocSidebar from '../api/typedoc-sidebar.json';

import darkTheme from './shiki/accessible-aa-dark-shiki.json' with { type: 'json' };
import lightTheme from './shiki/accessible-aa-light-shiki.json' with { type: 'json' };

// const here = fileURLToPath(new URL('.', import.meta.url));
// const root = path.resolve(here, '../../..');

export default withMermaid(
  defineConfig({
    base: '/interstellar-tools/',
    mermaidPlugin: {
      class: 'mermaid'
    },
    mermaid: {
      themeVariables: {
        fontFamily:
          "'Menlo for Powerline', 'Menlo Regular for Powerline', 'DejaVu Sans Mono', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
        fontSize: '16px'
      }
    },
    lang: 'en-GB',

    lastUpdated: true,
    cleanUrls: true,
    metaChunk: true,
    description: 'A set of tools',
    title: 'Interstellar Tools',
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
        { text: 'Reference', link: '/api/', activeMatch: '/api/' },
        { text: 'Sponsor', link: '/sponsor' },

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
          link: 'https://www.npmjs.com/package/@phun-ky/interstellar-tools'
        }
      ],
      footer: {
        message:
          'Released under the <a href="https://choosealicense.com/licenses/mit/" target="_blank" rel="nofollow noreferrer">MIT License</a>.',
        copyright:
          'Copyright © 2025-present <a href="https://phun-ky.net/">Alexander Vassbotn Røyne-Helgesen</a>'
      },
      sidebar: {
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
            text: 'Development',
            link: '/guide/development'
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
  })
);
