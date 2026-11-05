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
- **Reference ellipsoids and mean radii:** the mean, equatorial, along-orbit and
  polar radii of the planets, Pluto and the larger moons from the IAU Working
  Group on Cartographic Coordinates and Rotational Elements (Archinal et al.
  2018, Celestial Mechanics and Dynamical Astronomy 130, 22), and WGS 84 from
  the US National Geospatial-Intelligence Agency.
- **Moon orbits:** semi-major axes and eccentricities from JPL's
  [planetary satellite mean elements](https://ssd.jpl.nasa.gov/sats/elem/), and
  true anomalies at J2000 from the osculating elements in
  [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/).

The exponential atmosphere in `@interstellar-tools/equations`
(`exponentialAtmosphereDensity`) uses the base densities and scale heights of
table 8-4 in D. A. Vallado, _Fundamentals of Astrodynamics and Applications_
(4th ed., 2013), from the CIRA-72 reference atmosphere.

The NRLMSISE-00 atmosphere model in `@interstellar-tools/equations`
(`nrlmsise00`) is ported from the original Fortran by M. Picone, A. E. Hedin and
D. Drob of the US Naval Research Laboratory (`nrlmsise00_sub.for`, MSISE-00
01-FEB-02), a US government work, as archived by NASA's
[Space Physics Data Facility](https://spdf.gsfc.nasa.gov/pub/models/old_nonpublic/old_models_from_nssdc/atmospheric/msis/nrlmsise00/);
its tests reproduce the reference output distributed with it. Picone et al.
(2002), _J. Geophys. Res._ 107(A12), 1468, doi:10.1029/2002JA009430.

Wikipedia text is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Only factual
values are taken from it, never text.

The `PROBES` dataset in `@interstellar-tools/tracking` holds positions and
velocities of eleven space probes, from 1 November 2026 to 31 December 2027,
sampled from vector tables of
[JPL Horizons](https://ssd.jpl.nasa.gov/horizons/), the Solar System Dynamics
group's ephemeris service at the Jet Propulsion Laboratory, fetched on 5
November 2026. The probes' names, agencies and launch dates are from the
agencies that fly them: NASA, ESA and CSA.

The `SATELLITES` dataset in `@interstellar-tools/tracking` holds the orbital
elements of twelve satellites, dated 4 November 2026, from
[CelesTrak](https://celestrak.org/) by Dr. T.S. Kelso, which republishes the US
Space Force's public satellite catalogue. Like the constants, they're
measurements: a small snapshot for examples and tests, not a copy of the
catalogue. The SGP4 verification cases in the tests are credited in their own
[README](./packages/tracking/src/satellites/__tests__/fixtures/README.md), and
so are the example ephemerides, from the CCSDS Orbit Data Messages standard and
JPL Horizons, in
[theirs](./packages/tracking/src/probes/__tests__/fixtures/README.md).

## Documentation site

- **Mars terrain:** the elevation grid in the tutorial
  [Choose a landing site on Mars](https://phun-ky.net/interstellar-tools/learn/choose-a-landing-site-on-mars)
  (`docs/.vitepress/theme/components/mars/jezero-delta-front.json`) samples the
  HiRISE digital terrain model `DTEEC_045994_1985_046060_1985_U01` of Jezero
  crater, one height every 20 m. Credit: NASA/JPL/University of Arizona, via the
  [HiRISE PDS archive](https://hirise-pds.lpl.arizona.edu/PDS/). The coordinates
  of Perseverance's landing site are from NASA GISS's
  [Mars24 list of landers](https://www.giss.nasa.gov/tools/mars24/help/landers.html).
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
