import type { ByBodyIdType, RingDisplayType } from '@interstellar-tools/types';

/**
 * How to **draw the giant planets' rings**, keyed by planet id: each as
 * opaque as its densest ring, with Saturn's colour measured from Cassini's
 * images and the others' assumed. `derivation` says which.
 *
 * Kept apart from {@link PLANETS}; {@link withDisplay} puts them back, as
 * the planets' `display.rings`.
 *
 * @group Observations
 * @example
 * ```ts
 * RING_DISPLAY.saturn.rings?.opacity; // 0.93
 * ```
 */
export const RING_DISPLAY: ByBodyIdType<RingDisplayType> = {
  jupiter: {
    rings: {
      color: '#212121',
      opacity: 5e-6
    },
    derivation: [
      {
        property: 'rings.color',
        basis: 'assumed',
        reason:
          'No true-colour image of them exists: a neutral grey at the albedo of about 0.015 NASA NSSDCA gives their particles, as sRGB'
      },
      {
        property: 'rings.opacity',
        basis: 'derived',
        reason: '1 − e^−τ for the main ring, the densest, at its τ of 5 × 10⁻⁶',
        from: 'rings.rings'
      }
    ]
  },
  saturn: {
    rings: {
      color: '#cabcba',
      opacity: 0.93,
      shadows: true
    },
    derivation: [
      {
        property: 'rings.color',
        basis: 'imagery',
        reason:
          'The mean of the brighter half of the rings’ pixels in Cassini’s natural-colour mosaic PIA06175 (NASA/JPL/Space Science Institute, 2005)'
      },
      {
        property: 'rings.opacity',
        basis: 'derived',
        reason: '1 − e^−τ for the B ring, the densest, at its τ of 2.7',
        from: 'rings.rings'
      }
    ]
  },
  uranus: {
    rings: {
      color: '#212121',
      opacity: 0.75
    },
    derivation: [
      {
        property: 'rings.color',
        basis: 'assumed',
        reason:
          'No true-colour image of them exists: a neutral grey at the albedo of about 0.015 NASA NSSDCA gives their particles, as sRGB'
      },
      {
        property: 'rings.opacity',
        basis: 'derived',
        reason: '1 − e^−τ for the ε ring, the densest, at its τ of 1.4',
        from: 'rings.rings'
      }
    ]
  },
  neptune: {
    rings: {
      color: '#212121',
      opacity: 0.054
    },
    derivation: [
      {
        property: 'rings.color',
        basis: 'assumed',
        reason:
          'No true-colour image of them exists: a neutral grey at the albedo of about 0.015 NASA NSSDCA gives their particles, as sRGB'
      },
      {
        property: 'rings.opacity',
        basis: 'derived',
        reason: '1 − e^−τ for the Adams ring, the densest, at its τ of 0.055',
        from: 'rings.rings'
      }
    ]
  }
};
