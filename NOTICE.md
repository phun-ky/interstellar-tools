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
- **Earth's gravity field:** the zonal coefficients, gravitational parameter and
  reference radius of EGM2008, the Earth Gravitational Model of the US National
  Geospatial-Intelligence Agency (Pavlis et al. 2012, JGR 117, B04406), from the
  coefficient file served by [ICGEM](https://icgem.gfz-potsdam.de/).
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
- **Rotation periods:** the sidereal rotation of the planets, Ceres, Pluto and
  the moons from the rotation rates of the IAU Working Group on Cartographic
  Coordinates and Rotational Elements (Archinal et al. 2018, Celestial Mechanics
  and Dynamical Astronomy 130, 22, and for the Moon Archinal et al. 2011, 109,
  101), Earth's from the IERS Conventions' Earth rotation angle, Himalia's from
  Pilcher, Mottola and Denk (2012, Icarus 219, 741) and Nereid's from Kiss et
  al. (2016, MNRAS 457, 2908).
- **Galaxies:** Andromeda's distance from Li et al. (2021, ApJ 920, 84) and
  Triangulum's from Breuval et al. (2023, ApJ 951, 118), both from Cepheids.
  Andromeda's and Triangulum's D25 diameters and morphological types from the
  Third Reference Catalogue of Bright Galaxies (RC3, de Vaucouleurs et al.
  1991), and the Milky Way's diameter from Goodwin, Gribbin and Hendry (1998,
  The Observatory 118, 201) and its type from McConnachie (2012, AJ 144, 4). The
  mass of Sagittarius A\* from the GRAVITY Collaboration (2024, A&A 692, A242),
  of M31\* from Bender et al. (2005, ApJ 631, 280), and the upper limit for a
  black hole in Triangulum from Gebhardt et al. (2001, AJ 122, 2469).
- **Sagittarius A\* and the S-stars:** Sagittarius A\*'s distance from the
  GRAVITY Collaboration (2024, A&A 692, A242), fitted with its mass, and the
  diameter of its ring from the Event Horizon Telescope Collaboration (2022,
  ApJL 930, L12). S2's orbit from the GRAVITY Collaboration (2024) and its
  period from the GRAVITY Collaboration (2022, A&A 657, L12). The orbits of S1,
  S4, S6, S8, S9 and S12 from Gillessen et al. (2017, ApJ 837, 30), and every
  S-star's mass and radius from Habibi et al. (2017, ApJ 847, 120).
- **Rotation of the Sun, stars, asteroids and comets:**
  - **The Sun:** the IAU's rotation rate (Archinal et al. 2018), and its
    equatorial and polar periods from the differential rotation of Snodgrass and
    Ulrich (1990, ApJ 351, 309).
  - **Stars:** Vega from Monnier et al. (2012, ApJL 761, L3), Altair from
    Bouchaud et al. (2020, A&A 633, A78), Spica A and B from Tkachenko et al.
    (2016, MNRAS 458, 1964), Alpha Centauri A from Hallam et al. (1991) and B
    from DeWarf et al. (2010, ApJ 722, 343), and Proxima Centauri from Benedict
    et al. (1998, AJ 116, 429).
  - **Asteroids:** Vesta, Eros, Pallas, Davida and 52 Europa from the IAU's
    rotation rates (Archinal et al. 2018). Hygiea from Vernazza et al. (2020,
    Nature Astronomy 4, 136), Interamnia from Hanuš et al. (2020, A&A 633, A65),
    Euphrosyne from Yang et al. (2020, A&A 641, A80), Psyche from Viikinkoski et
    al. (2018, A&A 619, L3), Juno from Viikinkoski et al. (2015, A&A 581, L3)
    and Eunomia from Viikinkoski et al. (2017, A&A 607, A117). Their spin
    directions from the poles in those papers, and Pallas's from Carry et al.
    (2010, Icarus 205, 460).
  - **Comets:** 67P/Churyumov–Gerasimenko from the IAU's rotation rate (Archinal
    et al. 2018), Hale-Bopp from Licandro et al. (1998, ApJL 501, L221), Halley
    from Belton et al. (1991, Icarus 93, 183) and Encke from Lowry and Weissman
    (2007, Icarus 188, 212).
- **Days on Earth and Mars:** the Martian sol and sidereal day from Allison and
  McEwen (2000, Planetary and Space Science 48, 215), and the ratio of a sol to
  a day from NASA GISS's
  [Mars24 algorithm](https://www.giss.nasa.gov/tools/mars24/help/algorithm.html).
- **Moon orbits:** semi-major axes and eccentricities from JPL's
  [planetary satellite mean elements](https://ssd.jpl.nasa.gov/sats/elem/), and
  true anomalies at J2000 from the osculating elements in
  [JPL Horizons](https://ssd.jpl.nasa.gov/horizons/).

The exponential atmosphere in `@interstellar-tools/equations`
(`exponentialAtmosphereDensity`) uses the base densities and scale heights of
table 8-4 in D. A. Vallado, _Fundamentals of Astrodynamics and Applications_
(4th ed., 2013), from the CIRA-72 reference atmosphere.

The Moon's position in `@interstellar-tools/equations` (`moonPosition`) uses the
low-precision lunar series of O. Montenbruck and E. Gill, _Satellite Orbits_
(Springer, 2000), section 3.3.2; its tests compare it with
[JPL Horizons](https://ssd.jpl.nasa.gov/horizons/).

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
- **Photos in the tutorials and guides:** from
  [Wikimedia Commons](https://commons.wikimedia.org/), mostly public domain from
  NASA, in `docs/public/images/docs/`. Each is credited on its page, with its
  licence and a link to its Commons page. The Voyager artist's concept in the
  [probes guide](https://phun-ky.net/interstellar-tools/guide/usage/tracking/probes)
  (`docs/public/images/docs/probes/voyager.webp`) is by NASA/JPL, in the public
  domain, from
  [File:Voyager spacecraft.jpg](https://commons.wikimedia.org/wiki/File:Voyager_spacecraft.jpg).
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
