import type { ObservationSourceInterface } from '@interstellar-tools/types';

// Shared by the datasets. Not exported from the package.

/** A paper, by its citation and DOI. */
export const paper = (
  citation: string,
  doi: string
): ObservationSourceInterface => ({
  catalog: citation,
  reference: doi
});

/** A symmetric 1σ uncertainty. */
export const sigma = (value: number) => ({ plus: value, minus: value });
