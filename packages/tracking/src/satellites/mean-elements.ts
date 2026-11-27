import type { MeanElementsInterface, Radians } from '@interstellar-tools/types';

const DAY = 86_400;
const REVOLUTIONS_PER_DAY = (2 * Math.PI) / DAY;
const DEGREES = Math.PI / 180;

/**
 * The elements as TLEs and OMMs carry them: angles in degrees, mean motion in
 * rev/day, and half its first derivative and a sixth of its second.
 */
export interface PublishedElements {
  name?: string;
  objectId?: string;
  catalogNumber: number;
  classification: 'U' | 'C' | 'S';
  epoch: Date;
  epochJulianDate: number;
  meanMotion: number;
  meanMotionDot: number;
  meanMotionDdot: number;
  eccentricity: number;
  inclination: number;
  raan: number;
  argp: number;
  meanAnomaly: number;
  bstar: number;
  elementSetNumber: number;
  revolutionNumber: number;
}

export type NumericKey = Exclude<
  keyof PublishedElements,
  'name' | 'objectId' | 'classification' | 'epoch' | 'epochJulianDate'
>;

const count = (x: number) => Number.isInteger(x) && x >= 0;
const angle = (x: number) => x >= 0 && x <= 360;
// The values with a range, and how to say it. Both formats only give finite
// numbers
const RANGES: Partial<
  Record<NumericKey, readonly [check: (x: number) => boolean, range: string]>
> = {
  catalogNumber: [count, 'a whole number ≥ 0'],
  meanMotion: [(x) => x > 0, '> 0'],
  eccentricity: [(x) => x >= 0 && x < 1, 'in [0, 1)'],
  inclination: [(x) => x >= 0 && x <= 180, 'in [0, 180]'],
  raan: [angle, 'in [0, 360]'],
  argp: [angle, 'in [0, 360]'],
  meanAnomaly: [angle, 'in [0, 360]'],
  elementSetNumber: [count, 'a whole number ≥ 0'],
  revolutionNumber: [count, 'a whole number ≥ 0']
};
/**
 * Throw unless each published value is in its range. `label` names a value
 * in error messages.
 */
const assertRanges = (
  published: Pick<PublishedElements, NumericKey>,
  label: (key: NumericKey) => string
) => {
  for (const [key, [check, range]] of Object.entries(RANGES) as [
    NumericKey,
    readonly [(x: number) => boolean, string]
  ][])
    if (!check(published[key]))
      throw new RangeError(
        `${label(key)} must be ${range}. Received: ${published[key]}`
      );
};

/**
 * Check the published elements and convert them to the library's units.
 * `label` names a value in error messages, the way its format does.
 */
export const toMeanElements = (
  published: PublishedElements,
  label: (key: NumericKey) => string
): MeanElementsInterface => {
  assertRanges(published, label);

  return {
    ...(published.name ? { name: published.name } : {}),
    ...(published.objectId ? { objectId: published.objectId } : {}),
    catalogNumber: published.catalogNumber,
    classification: published.classification,
    epoch: published.epoch,
    epochJulianDate: published.epochJulianDate,
    meanMotion: published.meanMotion * REVOLUTIONS_PER_DAY,
    meanMotionDot: (2 * published.meanMotionDot * REVOLUTIONS_PER_DAY) / DAY,
    meanMotionDdot:
      (6 * published.meanMotionDdot * REVOLUTIONS_PER_DAY) / DAY ** 2,
    e: published.eccentricity,
    i: (published.inclination * DEGREES) as Radians,
    raan: (published.raan * DEGREES) as Radians,
    argp: (published.argp * DEGREES) as Radians,
    meanAnomaly: (published.meanAnomaly * DEGREES) as Radians,
    bstar: published.bstar,
    elementSetNumber: published.elementSetNumber,
    revolutionNumber: published.revolutionNumber
  };
};

/**
 * Convert mean elements back to the units TLEs and OMMs carry: the reverse of
 * {@link toMeanElements}.
 */
export const toPublishedElements = (
  elements: MeanElementsInterface
): Omit<
  PublishedElements,
  'name' | 'objectId' | 'classification' | 'epoch'
> => ({
  catalogNumber: elements.catalogNumber,
  epochJulianDate: elements.epochJulianDate,
  meanMotion: elements.meanMotion / REVOLUTIONS_PER_DAY,
  meanMotionDot: (elements.meanMotionDot * DAY) / (2 * REVOLUTIONS_PER_DAY),
  meanMotionDdot:
    (elements.meanMotionDdot * DAY ** 2) / (6 * REVOLUTIONS_PER_DAY),
  eccentricity: elements.e,
  inclination: elements.i / DEGREES,
  raan: elements.raan / DEGREES,
  argp: elements.argp / DEGREES,
  meanAnomaly: elements.meanAnomaly / DEGREES,
  bstar: elements.bstar,
  elementSetNumber: elements.elementSetNumber,
  revolutionNumber: elements.revolutionNumber
});

// How formatTle and formatOmm name a value: its field in the mean elements,
// with the unit of the published value they check
const FIELD_NAMES: Partial<Record<NumericKey, string>> = {
  eccentricity: 'e',
  meanMotion: 'meanMotion, in revolutions a day,',
  inclination: 'i, in degrees,',
  raan: 'raan, in degrees,',
  argp: 'argp, in degrees,',
  meanAnomaly: 'meanAnomaly, in degrees,'
};

/**
 * Throw unless mean elements can be written as a TLE or an OMM: the checks
 * {@link toMeanElements} makes when one is read, so a writer can't give what
 * its reader rejects.
 */
export const assertPublishable = (
  elements: MeanElementsInterface,
  published: Pick<PublishedElements, NumericKey>
) => {
  assertRanges(published, (key) => `elements.${FIELD_NAMES[key] ?? key}`);

  const { classification = 'U' } = elements;

  if (
    classification !== 'U' &&
    classification !== 'C' &&
    classification !== 'S'
  )
    throw new RangeError(
      `elements.classification must be U, C or S. Received: "${String(classification)}"`
    );
};
