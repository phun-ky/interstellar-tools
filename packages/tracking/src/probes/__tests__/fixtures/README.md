# Ephemeris fixtures

## CCSDS Orbit Ephemeris Messages

The example OEMs in KVN from annex G of
[CCSDS 502.0-B-3, _Orbit Data Messages_](https://ccsds.org/Pubs/502x0b3e1.pdf)
(April 2023), published by the Consultative Committee for Space Data Systems:

- `ccsds-oem-g11.oem`: figure G-11, two segments with no accelerations or
  covariance.
- `ccsds-oem-g12.oem`: figure G-12, with accelerations.
- `ccsds-oem-g13.oem`: figure G-13, with covariance matrices.

The lines that read "intervening data records omitted here" are left out, and so
are the page headers. The values are illustrative and not a physical orbit: they
test the parser, not the interpolation.

## JPL Horizons vectors

Vector tables from the
[JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html) of the Solar
System Dynamics group, fetched on 2026-11-05 and unchanged, all from the Sun's
centre in the ICRF:

- `horizons-voyager1.txt`: Voyager 1 (-31), daily from 2026-01-01 to 2026-01-11,
  in km and km/s.
- `horizons-voyager1-csv-au.txt`: the same, 2026-01-01 to 2026-01-03, as CSV in
  au and au/day.
- `horizons-psp-6h.txt` and `horizons-psp-1h.txt`: Parker Solar Probe (-96)
  every 6 hours and every hour, from 2025-06-18 to 2025-06-20, through its
  perihelion of 19 June 2025, about 10 solar radii from the Sun's centre.
- `horizons-<id>-30d.txt`: each probe in the `PROBES` dataset, every 30 days
  from 2026-11-01 to 2027-12-31, in km and km/s, to check the dataset against.
  Juno's and Pioneer 11's were fetched on 2026-11-12.
- `horizons-juno-perijove.txt`: Juno (-61) every 10 minutes from 2027-01-17
  20:00 to 2027-01-18 02:00 TDB, through its perijove, fetched on 2026-11-12.
