import type { GpsArtCourse } from '../types/course';

/**
 * Calculate Haversine distance between two [lat, lng] coordinates in km
 */
export function haversineDistanceKm(a: [number, number], b: [number, number]): number {
  const R = 6371; // Earth radius in km
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

/**
 * Calculate total distance of a coordinate path in km
 */
export function calculateTotalDistanceKm(coords: [number, number][]): number {
  if (coords.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineDistanceKm(coords[i - 1], coords[i]);
  }
  return Math.round(total * 10) / 10;
}

/**
 * Interpolate dense points along a coordinate path so animation is smooth
 */
export function densifyCoordinates(
  coords: [number, number][],
  stepsPerSegment = 10
): [number, number][] {
  if (coords.length < 2) return coords;
  const result: [number, number][] = [];
  for (let i = 0; i < coords.length - 1; i++) {
    const start = coords[i];
    const end = coords[i + 1];
    for (let s = 0; s < stepsPerSegment; s++) {
      const t = s / stepsPerSegment;
      result.push([
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t,
      ]);
    }
  }
  result.push(coords[coords.length - 1]);
  return result;
}

/**
 * Generate a valid GPX 1.1 XML string from a course
 */
export function generateGpxXml(course: GpsArtCourse): string {
  const now = new Date().toISOString();
  const trkpts = course.coordinates
    .map(
      ([lat, lon]) =>
        `      <trkpt lat="${lat.toFixed(6)}" lon="${lon.toFixed(6)}"><time>${now}</time></trkpt>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TRACE GALLERY - GPS Art Archive" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(course.title)} (${course.shapeName})</name>
    <desc>${escapeXml(course.description)} | 거리: ${course.distanceKm}km | 출발: ${escapeXml(course.startPointName)}</desc>
    <time>${now}</time>
  </metadata>
  <trk>
    <name>${escapeXml(course.title)}</name>
    <type>running</type>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;
}

export function downloadCourseGpx(course: GpsArtCourse): void {
  const xml = generateGpxXml(course);
  const blob = new Blob([xml], { type: 'application/gpx+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = course.title.replace(/[^a-zA-Z0-9가-힣_-]/g, '_');
  a.href = url;
  a.download = `${safeTitle}_${course.distanceKm}km.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse a GPX XML string into an array of [lat, lng] coordinates
 */
export function parseGpxXml(xmlText: string): {
  name?: string;
  coordinates: [number, number][];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'application/xml');
  const nameNode = doc.querySelector('trk > name') || doc.querySelector('metadata > name');
  const name = nameNode?.textContent?.trim();

  let ptNodes = Array.from(doc.querySelectorAll('trkpt'));
  if (ptNodes.length === 0) {
    ptNodes = Array.from(doc.querySelectorAll('rtept'));
  }
  if (ptNodes.length === 0) {
    ptNodes = Array.from(doc.querySelectorAll('wpt'));
  }

  const rawCoords: [number, number][] = [];
  for (const node of ptNodes) {
    const lat = parseFloat(node.getAttribute('lat') || '');
    const lon = parseFloat(node.getAttribute('lon') || '');
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      rawCoords.push([lat, lon]);
    }
  }

  // Downsample if thousands of points so rendering stays snappy
  const maxPoints = 250;
  let coordinates = rawCoords;
  if (rawCoords.length > maxPoints) {
    const step = rawCoords.length / maxPoints;
    coordinates = [];
    for (let i = 0; i < maxPoints; i++) {
      coordinates.push(rawCoords[Math.floor(i * step)]);
    }
    coordinates.push(rawCoords[rawCoords.length - 1]);
  }

  return { name, coordinates };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
