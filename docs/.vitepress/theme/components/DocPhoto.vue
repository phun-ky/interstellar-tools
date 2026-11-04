<script setup lang="ts">
/**
 * A photo or illustration with a caption and its credit. Use it in Markdown,
 * with blank lines around the caption so it's parsed as Markdown:
 *
 * <DocPhoto
 *   src="apollo-11/earthrise.webp"
 *   alt="What the image shows, for screen readers"
 *   :width="1600"
 *   :height="1600"
 *   credit="NASA"
 *   licence="Public domain"
 *   source="https://commons.wikimedia.org/wiki/File:AS11-44-6552.jpg">
 *
 * The caption, as Markdown.
 *
 * </DocPhoto>
 *
 * `src` is relative to docs/public/images/docs. `paper` puts the image on a
 * light panel in the dark theme, for diagrams drawn in dark lines.
 */
import { withBase } from 'vitepress';
import { computed } from 'vue';

const props = defineProps<{
  /** Path under docs/public/images/docs. */
  src: string;
  /** What the image shows. */
  alt: string;
  /** Intrinsic width in px, to reserve the space before it loads. */
  width: number;
  /** Intrinsic height in px. */
  height: number;
  /** Who made it. */
  credit: string;
  /** Its licence, such as `Public domain` or `CC BY 4.0`. */
  licence: string;
  /** Its page on Wikimedia Commons. */
  source: string;
  /** Show it on a light panel in the dark theme. */
  paper?: boolean;
}>();

const url = computed(() => withBase(`/images/docs/${props.src}`));
</script>

<template>
  <figure class="doc-photo" :class="{ paper }">
    <img
      :src="url"
      :alt="alt"
      :width="width"
      :height="height"
      loading="lazy"
      decoding="async"
    />
    <figcaption>
      <div class="caption"><slot /></div>
      <span class="credit">
        {{ credit }} · {{ licence }} ·
        <a :href="source" target="_blank" rel="noopener">Wikimedia Commons</a>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.doc-photo {
  margin: 32px 0;
}

img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  background: var(--mc-bg-3);
  border: 1px solid var(--mc-line);
  border-radius: 4px;
}

.paper img {
  background: #fff;
  padding: 12px;
}

figcaption {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.caption :deep(p) {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--mc-muted);
}

.credit {
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--mc-muted);
}

.credit a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.credit a:hover {
  color: var(--mc-teal);
}
</style>
