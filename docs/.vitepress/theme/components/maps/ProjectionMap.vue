<script setup lang="ts">
/**
 * A world map in one of the maps package's projections: a 30° graticule, the
 * map's edge, and Tissot's circles, small circles of the same size on the
 * sphere, which show how the projection stretches and squashes. Drawn with
 * the package's own projection functions, so the picture can't drift from the
 * code. Use it in Markdown as
 * <ProjectionMap projection="mercator" :max-latitude="80">caption</ProjectionMap>.
 */
import {
  equirectangular,
  lambertAzimuthalEqualArea,
  mercator,
  mollweide,
  orthographic,
  sinusoidal,
  stereographic
} from '@interstellar-tools/maps';
import type { Radians } from '@interstellar-tools/types';
import { computed } from 'vue';

const PROJECTIONS = {
  equirectangular,
  mercator,
  sinusoidal,
  mollweide,
  lambertAzimuthalEqualArea,
  stereographic,
  orthographic
} as const;
const AZIMUTHAL = new Set([
  'lambertAzimuthalEqualArea',
  'stereographic',
  'orthographic'
]);

const props = withDefaults(
  defineProps<{
    projection: keyof typeof PROJECTIONS;
    /** Centre of an azimuthal map, in degrees */
    phi0?: number;
    lambda0?: number;
    /** How far from the centre an azimuthal map reaches, in degrees */
    reach?: number;
    /** Where a cylindrical map stops, in degrees: Mercator never reaches the poles */
    maxLatitude?: number;
    label?: string;
  }>(),
  { phi0: 0, lambda0: 0, reach: 180, maxLatitude: 90, label: undefined }
);

type Point = { x: number; y: number };

const WIDTH = 320;
const PAD = 4;
const STEP = 2;
const rad = (deg: number) => (deg * Math.PI) / 180;
const range = (from: number, to: number, step: number) =>
  Array.from(
    { length: Math.round((to - from) / step) + 1 },
    (_, k) => from + k * step
  );

// The point an angular distance away from (lat, lon), towards a bearing
const destination = (
  lat: number,
  lon: number,
  distance: number,
  bearing: number
): [number, number] => {
  // From a pole every bearing is a meridian: due south, or due north
  if (Math.abs(lat) === 90)
    return [lat - Math.sign(lat) * distance, lon + bearing];

  const [p, d, b] = [rad(lat), rad(distance), rad(bearing)];
  const lat2 = Math.asin(
    Math.sin(p) * Math.cos(d) + Math.cos(p) * Math.sin(d) * Math.cos(b)
  );
  const lon2 =
    rad(lon) +
    Math.atan2(
      Math.sin(b) * Math.sin(d) * Math.cos(p),
      Math.cos(d) - Math.sin(p) * Math.sin(lat2)
    );

  return [(lat2 * 180) / Math.PI, (lon2 * 180) / Math.PI];
};

const drawing = computed(() => {
  const azimuthal = AZIMUTHAL.has(props.projection);
  const top = azimuthal ? 90 : props.maxLatitude;
  const options = {
    phi0: rad(props.phi0) as Radians,
    lambda0: rad(props.lambda0) as Radians
  };
  // The orthographic map ends at the horizon, 90° from the centre
  const reach = Math.min(
    props.reach,
    props.projection === 'orthographic' ? 90 : 179.9
  );
  const cosReach = Math.cos(rad(reach));
  // A point on the unit sphere's map, or null where the map doesn't show it
  const at = (lat: number, lon: number): Point | null => {
    const cosC =
      Math.sin(rad(props.phi0)) * Math.sin(rad(lat)) +
      Math.cos(rad(props.phi0)) *
        Math.cos(rad(lat)) *
        Math.cos(rad(lon - props.lambda0));

    if (azimuthal && cosC < cosReach - 1e-9) return null;

    try {
      const { x, y } = PROJECTIONS[props.projection](
        rad(lat) as Radians,
        rad(lon) as Radians,
        1,
        options
      );

      return { x, y };
    } catch {
      return null;
    }
  };
  // Polylines through the points, broken where the map doesn't show them or
  // where a line jumps across the map
  const lines = (points: [number, number][]) => {
    const out: Point[][] = [[]];

    for (const [lat, lon] of points) {
      const p = at(lat, lon);
      const line = out[out.length - 1]!;
      const last = line[line.length - 1];

      if (!p || (last && Math.hypot(p.x - last.x, p.y - last.y) > 0.5)) {
        if (line.length) out.push([]);
      }

      if (p) out[out.length - 1]!.push(p);
    }

    return out.filter((line) => line.length > 1);
  };
  const graticule = [
    ...range(-150, 150, 30).flatMap((lon) =>
      lines(range(-top, top, STEP).map((lat) => [lat, lon]))
    ),
    ...range(-60, 60, 30).flatMap((lat) =>
      lines(range(-180, 180, STEP).map((lon) => [lat, lon]))
    )
  ];
  const edge = azimuthal
    ? lines(
        range(0, 360, STEP).map((bearing) =>
          destination(props.phi0, props.lambda0, reach, bearing)
        )
      )
    : [
        ...[-180, 180].flatMap((lon) =>
          lines(range(-top, top, STEP).map((lat) => [lat, lon]))
        ),
        ...[-top, top].flatMap((lat) =>
          lines(range(-180, 180, STEP).map((lon) => [lat, lon]))
        )
      ];
  // Circles 12° across on the sphere; skipped where the map can't show all of one
  const circles = range(-60, 60, 30)
    .flatMap((lat) => range(-120, 120, 60).map((lon) => [lat, lon]))
    .map(([lat, lon]) =>
      range(0, 360, 10).map((bearing) =>
        at(...destination(lat!, lon!, 6, bearing))
      )
    )
    .filter((ring): ring is Point[] => ring.every(Boolean));
  // Fit everything into the drawing, with y up the page
  const all = [...graticule.flat(), ...edge.flat(), ...circles.flat()];
  const [minX, maxX] = [
    Math.min(...all.map((p) => p.x)),
    Math.max(...all.map((p) => p.x))
  ];
  const [minY, maxY] = [
    Math.min(...all.map((p) => p.y)),
    Math.max(...all.map((p) => p.y))
  ];
  const scale = (WIDTH - 2 * PAD) / (maxX - minX);
  const toPath = (points: Point[], close = false) =>
    points
      .map(
        (p, k) =>
          `${k ? 'L' : 'M'}${(PAD + (p.x - minX) * scale).toFixed(1)} ${(
            PAD +
            (maxY - p.y) * scale
          ).toFixed(1)}`
      )
      .join(' ') + (close ? ' Z' : '');

  return {
    height: Math.ceil((maxY - minY) * scale + 2 * PAD),
    graticule: graticule.map((line) => toPath(line)).join(' '),
    edge: edge.map((line) => toPath(line)).join(' '),
    circles: circles.map((ring) => toPath(ring, true))
  };
});

const NAMES: Record<keyof typeof PROJECTIONS, string> = {
  equirectangular: 'Equirectangular',
  mercator: 'Mercator',
  sinusoidal: 'Sinusoidal',
  mollweide: 'Mollweide',
  lambertAzimuthalEqualArea: 'Lambert azimuthal equal-area',
  stereographic: 'Stereographic',
  orthographic: 'Orthographic'
};
const label = computed(
  () =>
    props.label ??
    `${NAMES[props.projection]} projection: a 30° graticule, with circles of the same size on the sphere`
);
</script>

<template>
  <figure class="pm">
    <svg
      :viewBox="`0 0 ${WIDTH} ${drawing.height}`"
      role="img"
      :aria-label="label"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path class="pm__grid" :d="drawing.graticule" />
      <path
        v-for="(d, k) in drawing.circles"
        :key="k"
        class="pm__circle"
        :d="d"
      />
      <path class="pm__edge" :d="drawing.edge" />
    </svg>
    <figcaption><slot /></figcaption>
  </figure>
</template>

<style scoped>
.pm {
  margin: 0;
}
svg {
  display: block;
  width: 100%;
  height: auto;
}
.pm__grid {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-opacity: 0.6;
  stroke-width: 1;
}
.pm__edge {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 1.5;
}
.pm__circle {
  fill: var(--vp-c-brand-soft);
  stroke: var(--vp-c-brand-1);
  stroke-width: 1;
}
figcaption {
  margin-top: 8px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>
