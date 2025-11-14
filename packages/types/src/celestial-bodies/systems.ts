/**
 * Represents a star system within the space visualization.
 * @group Celestial Bodies
 */
export interface SystemInterface {
  /** Name of the star system. */
  name: string;
  /** List of star names in the system. */
  stars: string[];
  /** Distance from the Sun in light-years. */
  distance: number;
}

/**
 * Type alias for a collection of star systems.
 * @group Celestial Bodies
 */
export type SystemsType = SystemInterface[];
