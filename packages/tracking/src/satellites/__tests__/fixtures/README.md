# SGP4 verification set

The verification set of Vallado, Crawford, Hujsak & Kelso (2006), _Revisiting
Spacetrack Report #3_, AIAA 2006-6753, as maintained in the
[`sgp4` Python package](https://github.com/brandon-rhodes/python-sgp4) (MIT):

- `sgp4-ver.tle`: the element sets. After column 69, line 2 of each set gives
  the start, end and step of the run, in minutes from epoch.
- `tcppver.out`: the reference C++ implementation's output, in "improved" mode
  and WGS-72. Each run starts with `<catalogue number> xx`, followed by one line
  per time: minutes from epoch, then the TEME position in km and velocity in
  km/s.

Sets 33333 to 33335 are copies of other sets with the catalogue number changed
and the checksum left as it was; the tests set the checksums again.
