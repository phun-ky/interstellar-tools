# Notice

Interstellar Tools is copyright © 2025-present Alexander Vassbotn Røyne-Helgesen
and released under the [MIT License](./LICENSE). This file credits the sources
of the data and the third-party material in the repository.

## Code

All code in this repository is written by the author and released under the MIT
License. Contributions made through GitHub are licensed under the same terms
([GitHub Terms of Service, section D.6](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#6-contributions-under-repository-license)).

Runtime dependencies are installed from npm under their own open-source licences
(MIT, ISC and BSD); none is bundled into this repository.

## Data

The constants and datasets in `@interstellar-tools/constants` are factual
scientific values: measurements and defined constants, which aren't protected by
copyright. They're compiled from public references, credited here:

- **Physical constants:**
  [CODATA recommended values](https://physics.nist.gov/cuu/Constants/), via the
  US National Institute of Standards and Technology (NIST).
- **Units and defined constants:** the
  [SI Brochure](https://www.bipm.org/en/publications/si-brochure) (BIPM) and
  resolutions of the [International Astronomical Union](https://www.iau.org/)
  (IAU), for example the astronomical unit (IAU 2012 B2) and the parsec (IAU
  2015 B2).
- **Celestial body datasets** (planets, moons, stars, comets, asteroids, belts,
  galaxies and systems): mostly compiled from
  [NASA](https://nssdc.gsfc.nasa.gov/planetary/factsheet/),
  [NASA JPL Solar System Dynamics](https://ssd.jpl.nasa.gov/),
  [ESA](https://www.esa.int/Science_Exploration/Space_Science) and
  [Wikipedia](https://en.wikipedia.org/). Some values are approximations for
  visualisation, as noted in each dataset's documentation.
- **Alpha Centauri orbits and masses:** Akeson et al. 2021 (AJ 162, 14) for the
  A-B orbit, its orientation, masses and radii, and Kervella et al. 2017 (A&A
  598, L7) for Proxima Centauri's orbit around the pair.
- **Spica:** Tkachenko et al. 2016 (MNRAS 458, 1964) for the orbit, masses and
  radii of the binary, Harrington et al. 2016 (A&A 590, A54) for its apsidal
  motion, and the Hipparcos new reduction (van Leeuwen 2007) for its distance.
- **Star masses:** Yoon et al. 2010 (ApJ 708, 71) for Vega, Peterson et al. 2006
  (ApJ 636, 1087) for Altair, and Schiller & Przybilla 2008 (A&A 479, 849) for
  Deneb.
- **Gravitational parameters (`mu`):** the DE440 ephemeris (Park et al. 2021, AJ
  161, 105) for the Sun, Mercury, Venus and Earth, Park et al. 2016 (Nature
  537, 515) for Ceres, and JPL's
  [planetary satellite physical parameters](https://ssd.jpl.nasa.gov/sats/phys_par/)
  for the other planets, Pluto and the moons.
- **Moon orbits:** semi-major axes and eccentricities from JPL's
  [planetary satellite mean elements](https://ssd.jpl.nasa.gov/sats/elem/), and
  true anomalies at J2000 from the osculating elements in
  [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/).

Wikipedia text is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Only factual
values are taken from it, never text.

## Documentation site

- **Background photo:**
  [photo by Jonny Gios](https://unsplash.com/photos/bxDJ12Kv9Rk) on Unsplash,
  used under the [Unsplash License](https://unsplash.com/license)
  (`docs/public/images/jonny-gios-bxDJ12Kv9Rk-unsplash.jpg`).
- **Code colour themes:** the "Accessible (AA)" light and dark themes in
  `docs/.vitepress/shiki/` are original work by the author, under the MIT
  License.
- **Fonts:** [IBM Plex](https://github.com/IBM/plex), under the
  [SIL Open Font License 1.1](https://openfontlicense.org/), installed through
  the [Fontsource](https://fontsource.org/) packages.
