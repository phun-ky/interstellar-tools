# Apollo 11: there and back again

On 16 July 1969, Apollo 11 left Pad 39A for the Moon. Eight days, 3 hours and 18
minutes later, its command module splashed down in the Pacific. This tutorial
flies the whole mission with the library: up to Earth orbit, out to the Moon,
down to the Sea of Tranquility, back up to the command module, and home through
the atmosphere. Each step uses the equations that explain it, with the numbers
the mission actually flew.

- **You'll use:** most of `@interstellar-tools/equations`, one step at a time
- **Time:** about 10 minutes per chapter

## The mission at a glance

Step through the mission's main events. The map turns with the Moon, and the
distances are to scale. The path is computed: a free return from Apollo 11's
trans-lunar injection, integrated with the restricted three-body equations
(`cr3bpDerivatives`, `rk4Integrate`). It's the figure-eight that loops behind
the Moon and back to Earth, the way home if the service module's engine had
failed; the real return, after lunar orbit, followed a similar path.

<ApolloMissionMap />

## Chapters

The chapters follow the flight plan. Each one is published once the library has
the equations it needs; the issues show what's still missing.

| Chapter                                                                              | What happens                                                                  | Status                                                                                |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Prologue: Why lunar orbit rendezvous?](/learn/apollo-11/why-lunar-orbit-rendezvous) | Three ways to the Moon, compared by mass                                      | Ready                                                                                 |
| [I. Leaving Earth](/learn/apollo-11/leaving-earth)                                   | Launch, Earth parking orbit, trans-lunar injection                            | Ready                                                                                 |
| [II. Coasting to the Moon](/learn/apollo-11/coasting-to-the-moon)                    | Docking with the LM, the midcourse correction, the Moon's sphere of influence | Ready                                                                                 |
| III. Down to the surface                                                             | Lunar orbit insertion, descent orbit, powered descent, landing                | Needs the [Maps milestone](https://github.com/phun-ky/interstellar-tools/milestone/2) |
| [IV. Lunar orbit rendezvous](/learn/apollo-11/lunar-orbit-rendezvous)                | Lunar ascent, rendezvous and docking                                          | Ready                                                                                 |
| [V. Coming home](/learn/apollo-11/coming-home)                                       | Trans-Earth injection, coast, entry and splashdown                            | Ready                                                                                 |

## The Δv budget

Every burn after Earth orbit, grouped by the engine that made it. Open a row to
see what the burn did. The ascent to orbit isn't listed: NASA reports where it
ended, not a single Δv for it, and its losses to gravity and drag are in
[chapter I](/learn/apollo-11/leaving-earth).

<ApolloDvLedger />

More than three-quarters of the total goes into just three burns: leaving Earth
orbit, and landing on and leaving the Moon. The prologue shows why splitting the
spacecraft in two made the last two affordable.

## Sources

Times are ground elapsed time (GET) from range zero, 13:32:00 UTC on 16
July 1969. Where sources disagree, times follow _Apollo by the Numbers_ and
burns follow the tables in the Mission Report. Every number in the tutorial's
text is checked by a test.

- Richard W. Orloff,
  [_Apollo by the Numbers: A Statistical Reference_](https://www.nasa.gov/wp-content/uploads/2023/04/sp-4029.pdf),
  NASA SP-2000-4029
- [_Apollo 11 Mission Report_](https://ntrs.nasa.gov/api/citations/19700008096/downloads/19700008096.pdf),
  MSC-00171, November 1969
- [_Saturn V Launch Vehicle Flight Evaluation Report AS-506_](https://ibiblio.org/apollo/Documents/lvfea-AS506-Apollo11.pdf),
  MPR-SAT-FE-69-9
- [_Mission Director's Summary Report_](https://apollojournals.org/afj/ap11fj/pdf/a11-postlaunch-rep.pdf),
  M-932-69-11, 24 July 1969
- [_Apollo Flight Journal_: Apollo 11](https://apollojournals.org/afj/ap11fj/)
- [_Apollo Experience Report: Descent Propulsion System_](https://ntrs.nasa.gov/api/citations/19730011150/downloads/19730011150.pdf),
  NASA TN D-7143
- [_Mission Planning for Apollo Entry_](https://ntrs.nasa.gov/api/citations/19720013191/downloads/19720013191.pdf),
  NASA TN D-6725
- Ernest R. Hillje,
  [_Entry Aerodynamics at Lunar Return Conditions Obtained From the Flight of Apollo 4 (AS-501)_](https://ntrs.nasa.gov/api/citations/19690029435/downloads/19690029435.pdf),
  NASA TN D-5399
- [_Apollo Experience Report: Earth Landing System_](https://ntrs.nasa.gov/api/citations/19740003586/downloads/19740003586.pdf),
  NASA TN D-7437
