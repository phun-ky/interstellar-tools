<script setup lang="ts">
/**
 * A pull quote: a short excerpt set large, the full quotation underneath and
 * the source below. Use it in Markdown, with a blank line after the opening
 * tag so the quotation is parsed as Markdown:
 *
 * <PullQuote
 *   kicker="Mission statement, 1962"
 *   excerpt="A short line with *highlighted* words."
 *   cite="Speaker · Venue · 12.09.1962">
 *
 * The full quotation, as Markdown.
 *
 * </PullQuote>
 */
import { computed } from 'vue';

const props = defineProps<{
  /** Small mono label above the excerpt. */
  kicker?: string;
  /** The line set large; wrap words in *asterisks* to highlight them. */
  excerpt: string;
  /** Who said it, where and when. */
  cite: string;
}>();

// "a *b* c" → [a, b, c]: every odd part is highlighted
const parts = computed(() => props.excerpt.split('*'));
</script>

<template>
  <figure class="pull-quote">
    <span v-if="kicker" class="kicker">// {{ kicker }}</span>
    <!-- The excerpt repeats words from the full quote, so screen readers skip it -->
    <p class="excerpt" aria-hidden="true">
      <template v-for="(part, index) in parts" :key="index">
        <em v-if="index % 2">{{ part }}</em>
        <template v-else>{{ part }}</template>
      </template>
    </p>
    <blockquote class="full"><slot /></blockquote>
    <figcaption>{{ cite }}</figcaption>
  </figure>
</template>

<style scoped>
.pull-quote {
  margin: 48px 0;
  padding: 8px 0;
  border-top: 1px solid var(--mc-line);
  border-bottom: 1px solid var(--mc-line);
}

.kicker {
  display: block;
  margin: 20px 0 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mc-amber);
}

/* `.ph .vp-doc` outranks the site-wide paragraph colour and size */
.ph .vp-doc .excerpt,
.excerpt {
  margin: 0;
  max-width: none;
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.005em;
  text-transform: uppercase;
  color: var(--mc-text);
}

.excerpt em {
  font-style: normal;
  color: var(--mc-teal);
}

/* Reset the site-wide blockquote styles; this one is plain body text */
.ph .vp-doc .full,
.full {
  margin: 18px 0 0;
  padding: 0;
  border: 0;
  background: none;
  font-size: 15.5px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.65;
}

.ph .vp-doc .full::before {
  content: none;
}

.full :deep(p) {
  margin: 0;
  max-width: none;
  font-size: inherit;
  line-height: inherit;
  color: var(--mc-muted);
}

.full :deep(p:first-child)::before {
  content: '“';
}

.full :deep(p:last-child)::after {
  content: '”';
}

figcaption {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--mc-muted);
}

figcaption::before {
  content: '';
  flex: none;
  width: 40px;
  height: 2px;
  background: var(--mc-amber-fill);
}
</style>
