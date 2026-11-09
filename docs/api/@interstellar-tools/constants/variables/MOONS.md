[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / MOONS

# Variable: MOONS

```ts
const MOONS: MoonsType;
```

Defined in:
[bodies/moons.ts:45](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/bodies/moons.ts#L45)

Represents a dataset of natural satellites (moons) in the solar system.

::: info

- Units: `a` in astronomical units (au), `period` in days (d), `radius` in
  kilometers (km), `mu` in m³/s².

- `a`, `e`, `i`, `w` and `om` are JPL's mean elements, in the plane JPL gives
  them in, `frame`: the ecliptic for the Moon and the irregular moons Himalia,
  Pasiphae, Nereid and Halimede, a Laplace plane for Mars's, Jupiter's and
  Saturn's regular moons, and the planet's equator for Uranus's, Neptune's and
  Pluto's, with each plane's pole. Dysnomia's are Holler et al. 2021's, against
  the ICRF equator, and Dimorphos's from JPL Horizons, against Didymos's
  equator, before DART hit it.

- `orbit.angle` is the true anomaly at J2000 that, with `w`, puts the moon where
  JPL Horizons has it at J2000, within its plane. For a near-circular orbit the
  periapsis is barely defined, so only `w + angle` matters. Irregular moons are
  strongly perturbed by the Sun, so their elements describe J2000 only.

- Moons orbit a planet, a dwarf planet, or an asteroid: Dimorphos orbits
  Didymos.

- `mu` is the moon's G·M from JPL's satellite physical parameters, where JPL
  publishes one.

- `rotation.period` is the sidereal rotation in days: 360° over the IAU's
  rotation rate (Archinal et al. 2018), or a light curve's period for Himalia,
  Nereid and Pluto's small moons, which spin chaotically. Most moons keep one
  face to their planet, `synchronous: true`. Hyperion tumbles, and Pasiphae's,
  Halimede's and Dysnomia's spins aren't known, so they have none.

- Colors are hex strings used only for visual representation.

- Sources: compiled from public references, mainly NASA, NASA JPL, ESA and
  Wikipedia. See
  [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
  :::

## Full list of moons in the dataset

This list is not an exhaustive list, and addition/changes will be added over
time.

<div class="ph table-overflow">

| id        | name      | category             | parent        | orbit.a        | orbit.e  | orbit.period | orbit.retrograde | orbit.angle | orbit.i | orbit.w | orbit.om | orbit.frame                             | rotation.period | rotation.retrograde | rotation.synchronous | radius     | mu (m³/s²)      | display.color                                                          |
| --------- | --------- | -------------------- | ------------- | -------------- | -------- | ------------ | ---------------- | ----------- | ------- | ------- | -------- | --------------------------------------- | --------------- | ------------------- | -------------------- | ---------- | --------------- | ---------------------------------------------------------------------- |
| moon      | Moon      | natural satellite    | earth         | 0.00257 au     | 0.0549   | 27.322 d     |                  | 2.4345      | 5.16    | 318.15  | 125.08   | ecliptic                                | 27.32166171 d   |                     | yes                  | 1737.4 km  | 4.902800118e+12 | #BFBFBF                                                                |
| phobos    | Phobos    | natural satellite    | mars          | 0.000062668 au | 0.0151   | 0.3189 d     |                  | 3.307969    | 1.1     | 216.3   | 169.2    | laplace (pole 317.7°, 52.9°)            | 0.3189101044 d  |                     | yes                  | 11.08 km   | 7.087e+5        | [#888888](https://github.com/phun-ky/interstellar-tools/issues/888888) |
| deimos    | Deimos    | natural satellite    | mars          | 0.0001568 au   | 0.0002   | 1.2624 d     |                  | 3.5778      | 1.8     | 0       | 54.3     | laplace (pole 316.6°, 53.5°)            | 1.262440789 d   |                     | yes                  | 6.2 km     | 9.62e+4         | #A0A0A0                                                                |
| io        | Io        | natural satellite    | jupiter       | 0.00282 au     | 0.0041   | 1.769 d      |                  | 5.7713      | 0       | 49.1    | 0        | laplace (pole 268.1°, 64.5°)            | 1.7691378 d     |                     | yes                  | 1821.49 km | 5.95991547e+12  | #FF8C00                                                                |
| europa    | Europa    | natural satellite    | jupiter       | 0.00448 au     | 0.0094   | 3.551 d      |                  | 6.02377     | 0.5     | 45      | 184      | laplace (pole 268.1°, 64.5°)            | 3.551181079 d   |                     | yes                  | 1560.8 km  | 3.2027121e+12   | #E6E6E6                                                                |
| ganymede  | Ganymede  | natural satellite    | jupiter       | 0.00715 au     | 0.0013   | 7.155 d      |                  | 5.6673      | 0.2     | 198.3   | 58.5     | laplace (pole 268.2°, 64.6°)            | 7.15455312 d    |                     | yes                  | 2631.2 km  | 9.88783275e+12  | #8B4513                                                                |
| callisto  | Callisto  | natural satellite    | jupiter       | 0.01258 au     | 0.0074   | 16.689 d     |                  | 1.5402      | 0.3     | 43.8    | 309.1    | laplace (pole 268.7°, 64.8°)            | 16.68901797 d   |                     | yes                  | 2410.3 km  | 7.1792834e+12   | [#696969](https://github.com/phun-ky/interstellar-tools/issues/696969) |
| amalthea  | Amalthea  | natural satellite    | jupiter       | 0.00121258 au  | 0.003    | 0.498 d      |                  | 5.4164      | 0.4     | 180.1   | 282.9    | laplace (pole 268.1°, 64.5°)            | 0.4981792545 d  |                     | yes                  | 83 km      | 1.6456e+8       | #A0522D                                                                |
| himalia   | Himalia   | natural satellite    | jupiter       | 0.076465 au    | 0.16     | 250.2 d      |                  | 1.6994      | 28.4    | 321.1   | 64.2     | ecliptic                                | 0.324246 d      |                     |                      | 85 km      | 1.5155e+8       | #A9A9A9                                                                |
| metis     | Metis     | natural satellite    | jupiter       | 0.000855627 au | 0.0002   | 0.295 d      |                  | 2.8973      | 0       | 0       | 0        | laplace (pole 268.1°, 64.5°)            | 0.2947787969 d  |                     | yes                  | 21 km      | 2.5e+6          | #CD853F                                                                |
| thebe     | Thebe     | natural satellite    | jupiter       | 0.00148331 au  | 0.0176   | 0.675 d      |                  | 3.183597    | 1.1     | 26.6    | 340.4    | laplace (pole 268.1°, 64.5°)            | 0.6745357381 d  |                     | yes                  | 49 km      | 3.015e+7        | #B87333                                                                |
| pasiphae  | Pasiphae  | irregular satellite  | jupiter       | 0.157 au       | 0.407    | 735 d        | yes              | 4.1307      | 148.3   | 172.8   | 315.7    | ecliptic                                |                 |                     |                      | 30 km      |                 | #8B0000                                                                |
| titan     | Titan     | natural satellite    | saturn        | 0.00817 au     | 0.0288   | 15.945 d     |                  | 3.7651      | 0.3     | 78.3    | 78.6     | laplace (pole 36.4°, 84°)               | 15.94544758 d   |                     | yes                  | 2575 km    | 8.9781371e+12   | #D4A017                                                                |
| enceladus | Enceladus | natural satellite    | saturn        | 0.00159 au     | 0.0047   | 1.37 d       |                  | 1.0989      | 0       | 119.5   | 0        | laplace (pole 40.6°, 83.5°)             | 1.370218084 d   |                     | yes                  | 252.1 km   | 7.21037e+9      | #F0FFFF                                                                |
| rhea      | Rhea      | natural satellite    | saturn        | 0.00352411 au  | 0.0012   | 4.518 d      |                  | 4.0861      | 0.3     | 44.3    | 133.7    | laplace (pole 40.6°, 83.5°)             | 4.517502623 d   |                     | yes                  | 764 km     | 1.5394175e+11   | #C0C0C0                                                                |
| iapetus   | Iapetus   | natural satellite    | saturn        | 0.0238 au      | 0.0283   | 79.33 d      |                  | 3.8026      | 7.6     | 254.5   | 86.5     | laplace (pole 288.7°, 78.9°)            | 79.33084957 d   |                     | yes                  | 735 km     | 1.2051511e+11   | #2F4F4F                                                                |
| hyperion  | Hyperion  | irregular satellite  | saturn        | 0.00990322 au  | 0.105    | 21.3 d       |                  | 0.2053      | 0.6     | 214     | 87.1     | laplace (pole 40.2°, 83.6°)             |                 |                     |                      | 135 km     | 3.7049e+8       | #CDAA7D                                                                |
| phoebe    | Phoebe    | retrograde satellite | saturn        | 0.0865 au      | 0.1634   | 550 d        | yes              | 2.1829      | 175.2   | 240.3   | 192.7    | laplace (pole 276°, 67.5°)              | 0.3864157683 d  |                     |                      | 106 km     | 5.5479e+8       | #483D8B                                                                |
| mimas     | Mimas     | natural satellite    | saturn        | 0.00124333 au  | 0.02     | 0.942422 d   |                  | 5.642       | 1.6     | 160.4   | 66.2     | laplace (pole 40.6°, 83.5°)             | 0.9424218102 d  |                     | yes                  | 198.2 km   | 2.50349e+9      | #C9C9C6                                                                |
| tethys    | Tethys    | natural satellite    | saturn        | 0.00197195 au  | 0.001    | 1.887802 d   |                  | 5.2137      | 1.1     | 335.3   | 273      | laplace (pole 40.6°, 83.5°)             | 1.887802561 d   |                     | yes                  | 531.1 km   | 4.121353e+10    | #E8E8E6                                                                |
| dione     | Dione     | natural satellite    | saturn        | 0.00252477 au  | 0.002    | 2.736916 d   |                  | 1.0601      | 0       | 116     | 0        | laplace (pole 40.6°, 83.5°)             | 2.736915553 d   |                     | yes                  | 561.4 km   | 7.311607e+10    | #D5D3CF                                                                |
| titania   | Titania   | natural satellite    | uranus        | 0.00292 au     | 0.0011   | 8.706 d      |                  | 1.1906      | 0.1     | 184     | 29.5     | parent-equator (pole 77.311°, 15.175°)  | 8.705865458 d   |                     | yes                  | 788 km     | 2.269e+11       | #8B8886                                                                |
| oberon    | Oberon    | natural satellite    | uranus        | 0.00390053 au  | 0.0014   | 13.46 d      |                  | 2.508       | 0.1     | 132.2   | 76.8     | parent-equator (pole 77.311°, 15.175°)  | 13.46323198 d   |                     | yes                  | 761 km     | 2.053e+11       | #6E6E6E                                                                |
| miranda   | Miranda   | natural satellite    | uranus        | 0.000867967 au | 0.0013   | 1.41 d       |                  | 1.2569      | 4.4     | 154.8   | 100.9    | parent-equator (pole 77.311°, 15.175°)  | 1.413479233 d   |                     | yes                  | 235 km     | 4.3e+9          | #CCCCCC                                                                |
| ariel     | Ariel     | natural satellite    | uranus        | 0.00127628 au  | 0.0012   | 2.52 d       |                  | 3.3767      | 0       | 9.6     | 0        | parent-equator (pole 77.311°, 15.175°)  | 2.520378872 d   |                     | yes                  | 578 km     | 8.35e+10        | #A9A9A9                                                                |
| umbriel   | Umbriel   | natural satellite    | uranus        | 0.00177801 au  | 0.0039   | 4.14 d       |                  | 4.4082      | 0.1     | 183.4   | 174.8    | parent-equator (pole 77.311°, 15.175°)  | 4.144176246 d   |                     | yes                  | 584 km     | 8.51e+10        | #5F9EA0                                                                |
| triton    | Triton    | retrograde satellite | neptune       | 0.002375 au    | 0.000016 | 5.87685 d    | yes              | 1.0196      | 157.3   | 0       | 177.7    | parent-equator (pole 299.334°, 42.95°)  | 5.876854078 d   | yes                 | yes                  | 1352.6 km  | 1.42849546e+12  | #C2A17C                                                                |
| nereid    | Nereid    | natural satellite    | neptune       | 0.0369 au      | 0.75     | 360.14 d     |                  | 3.278379    | 5.1     | 296.8   | 319.5    | ecliptic                                | 0.483083 d      |                     |                      | 170 km     |                 | #87CEFA                                                                |
| proteus   | Proteus   | natural satellite    | neptune       | 0.000786107 au | 0.0005   | 1.12 d       |                  | 4.9109      | 0.6     | 357.2   | 355.5    | parent-equator (pole 299.334°, 42.95°)  | 1.122315482 d   |                     | yes                  | 210 km     | 2.58342e+9      | [#708090](https://github.com/phun-ky/interstellar-tools/issues/708090) |
| halimede  | Halimede  | irregular satellite  | neptune       | 0.110901 au    | 0.521    | 1879 d       | yes              | 3.5101      | 119.6   | 157.9   | 198.5    | ecliptic                                |                 |                     |                      | 62 km      |                 | #A9A9A9                                                                |
| charon    | Charon    | natural satellite    | pluto         | 0.000131018 au | 0        | 6.387222 d   |                  | 5.3075      | 0       | 0       | 0        | parent-equator (pole 132.993°, -6.163°) | 6.387222999 d   |                     | yes                  | 606 km     | 1.061e+11       | #9A9590                                                                |
| styx      | Styx      | natural satellite    | pluto         | 0.000283493 au | 0        | 20.16 d      |                  | 3.3313      | 0       | 0       | 0        | parent-equator (pole 132.993°, -6.163°) | 3.24 d          |                     |                      | 5.2 km     |                 | #D4D4D2                                                                |
| nix       | Nix       | natural satellite    | pluto         | 0.000325466 au | 0        | 24.85 d      |                  | 1.6034      | 0       | 0       | 0        | parent-equator (pole 132.993°, -6.163°) | 1.829 d         |                     |                      | 18 km      | 1.5e+8          | #D2CFCB                                                                |
| kerberos  | Kerberos  | natural satellite    | pluto         | 0.000386028 au | 0        | 32.17 d      |                  | 5.4723      | 0.4     | 0       | 314.3    | parent-equator (pole 132.993°, -6.163°) | 5.31 d          |                     |                      | 6 km       |                 | #CCCCCA                                                                |
| hydra     | Hydra     | natural satellite    | pluto         | 0.00043262 au  | 0.006    | 38.2 d       |                  | 5.9181      | 0.3     | 139.3   | 114.3    | parent-equator (pole 132.993°, -6.163°) | 0.4295 d        |                     |                      | 18.5 km    | 2.01e+8         | #E4E4E2                                                                |
| dysnomia  | Dysnomia  | natural satellite    | eris          | 0.000249155 au | 0.0062   | 15.785899 d  |                  | 1.9488      | 45.49   | 180.8   | 126.17   | equator                                 |                 |                     |                      | 307.5 km   |                 | #4A4542                                                                |
| dimorphos | Dimorphos | natural satellite    | 65803-didymos | 7.948e-9 au    | 0        | 0.4967289 d  |                  | 4.4223      | 0       | 0       | 0        | parent-equator (pole 69.7°, -72.7°)     | 0.4967289 d     |                     | yes                  | 0.0755 km  | 2.87e-1         | #8A8279                                                                |

</div>

## See

[MoonsType](../../types/type-aliases/MoonsType.md).

**Example item in dataset:**

```ts
{
  id: 'moon',
  name: 'Moon',
  category: 'natural satellite',
  parent: 'earth',
  orbit: {
    /** Semi-major axis in AU */
    a: { value: 0.00257, unit: 'au' },
    /** Eccentricity (0 = circular orbit, 1 = parabolic trajectory) */
    e: 0.0549,
    /** Orbital period in days */
    period: { value: 27.322, unit: 'd' },
    /** Initial angle in orbit at J2000 */
    angle: 2.4345 as Radians,
    i: 5.16 as DegreesType,
    w: 318.15 as DegreesType,
    om: 125.08 as DegreesType,
    frame: { plane: 'ecliptic' }
  },
  /** Sidereal rotation in days: the IAU's 2009 rate, 13.17635815° a day */
  rotation: { period: { value: 27.32166171, unit: 'd' }, synchronous: true },
  /** Radius in km */
  radius: { value: 1737.4, unit: 'km' },
  ellipsoid: {
    equatorialRadius: { value: 1737.4, unit: 'km' },
    polarRadius: { value: 1737.4, unit: 'km' }
  },
  mu: 4.902800118e12,
  display: {
    /** Visual representation color */
    color: '#BFBFBF' // Light gray (realistic lunar appearance)
  }
},
```

## Example

```ts
console.log(MOONS[0].name); // "Moon"
```
