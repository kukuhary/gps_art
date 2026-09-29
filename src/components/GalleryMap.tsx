import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { ArtDecoration, GpsArtCourse } from '../types/course';
import { densifyCoordinates } from '../utils/gpx';

interface GalleryMapProps {
  courses: GpsArtCourse[];
  selectedCourse: GpsArtCourse | null;
  onSelectCourse: (course: GpsArtCourse) => void;
  showIllustrationOverlay: boolean;
  overlayOpacity: number;
  showWaypoints: boolean;
  animationProgress: number; // 0 to 100
  isPlaying: boolean;
  mapStyle: 'light' | 'dark' | 'color';
  // Drawing mode props
  isDrawingMode: boolean;
  drawingPoints: [number, number][];
  drawingDecorations: ArtDecoration[];
  drawingColor: string;
  activeStickerTool: 'route' | 'eye' | 'nose' | 'blush';
  onAddDrawingPoint: (latlng: [number, number]) => void;
  onAddDrawingDecoration: (dec: ArtDecoration) => void;
}

function createDecorationIcon(dec: ArtDecoration, accentColor: string): L.DivIcon {
  const scale = dec.scale || 1;
  if (dec.type === 'eye') {
    const size = Math.round(28 * scale);
    return L.divIcon({
      className: 'custom-art-decoration',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      html: `
        <div style="width:${size}px;height:${size}px;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.28));">
          <svg viewBox="0 0 32 32" width="${size}" height="${size}">
            <circle cx="16" cy="16" r="14" fill="#FFFFFF" stroke="#18181B" stroke-width="2.6"/>
            <circle cx="17.5" cy="15.5" r="8.5" fill="#18181B"/>
            <circle cx="14" cy="12" r="3.2" fill="#FFFFFF"/>
            <circle cx="20" cy="19" r="1.4" fill="#FFFFFF"/>
          </svg>
        </div>
      `,
    });
  }

  if (dec.type === 'nose') {
    const size = Math.round(26 * scale);
    const fill = dec.color || '#18181B';
    return L.divIcon({
      className: 'custom-art-decoration',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      html: `
        <div style="width:${size}px;height:${size}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.25));">
          <svg viewBox="0 0 32 32" width="${size}" height="${size}">
            <ellipse cx="16" cy="15" rx="12" ry="9.5" fill="${fill}" stroke="#FFFFFF" stroke-width="2"/>
            <ellipse cx="12.5" cy="12" rx="4" ry="2.2" fill="#FFFFFF" fill-opacity="0.65"/>
          </svg>
        </div>
      `,
    });
  }

  if (dec.type === 'blush') {
    const w = Math.round(34 * scale);
    const h = Math.round(20 * scale);
    const fill = dec.color || '#FB7185';
    return L.divIcon({
      className: 'custom-art-decoration',
      iconSize: [w, h],
      iconAnchor: [w / 2, h / 2],
      html: `
        <div style="width:${w}px;height:${h}px;">
          <svg viewBox="0 0 36 22" width="${w}" height="${h}">
            <ellipse cx="18" cy="11" rx="16" ry="9" fill="${fill}" fill-opacity="0.55"/>
            <line x1="11" y1="8" x2="9" y2="14" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.75"/>
            <line x1="18" y1="8" x2="16" y2="14" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.75"/>
            <line x1="25" y1="8" x2="23" y2="14" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0.75"/>
          </svg>
        </div>
      `,
    });
  }

  if (dec.type === 'whisker') {
    const rot = dec.rotation || 0;
    return L.divIcon({
      className: 'custom-art-decoration',
      iconSize: [44, 28],
      iconAnchor: [22, 14],
      html: `
        <div style="transform:rotate(${rot}deg);filter:drop-shadow(0 1px 2px rgba(0,0,0,0.2));">
          <svg viewBox="0 0 44 28" width="44" height="28">
            <line x1="4" y1="6" x2="40" y2="9" stroke="#18181B" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="2" y1="14" x2="42" y2="14" stroke="#18181B" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="4" y1="22" x2="40" y2="19" stroke="#18181B" stroke-width="2.4" stroke-linecap="round"/>
          </svg>
        </div>
      `,
    });
  }

  // Default ear / sparkle / label badge
  return L.divIcon({
    className: 'custom-art-decoration',
    iconSize: [96, 26],
    iconAnchor: [48, 13],
    html: `
      <div style="display:flex;align-items:center;justify-content:center;">
        <span style="background:${accentColor};color:#FFF;font-size:11px;font-weight:700;padding:2px 8px;border-radius:9999px;box-shadow:0 2px 8px rgba(0,0,0,0.22);white-space:nowrap;border:1.5px solid #FFF;">
          ✦ ${dec.text || '포인트'}
        </span>
      </div>
    `,
  });
}

export const GalleryMap: React.FC<GalleryMapProps> = ({
  courses,
  selectedCourse,
  onSelectCourse,
  showIllustrationOverlay,
  overlayOpacity,
  showWaypoints,
  animationProgress,
  isPlaying,
  mapStyle,
  isDrawingMode,
  drawingPoints,
  drawingDecorations,
  drawingColor,
  activeStickerTool,
  onAddDrawingPoint,
  onAddDrawingDecoration,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const lastSelectedCourseIdRef = useRef<string | null>(null);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [37.5326, 127.0246],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Official OpenStreetMap tiles (100% free, no API key required, styled via CSS monochrome filter)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle map clicks during Drawing Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawingMode) return;
      const pos: [number, number] = [
        Number(e.latlng.lat.toFixed(5)),
        Number(e.latlng.lng.toFixed(5)),
      ];
      if (activeStickerTool === 'route') {
        onAddDrawingPoint(pos);
      } else {
        onAddDrawingDecoration({
          id: `dec-${Date.now()}`,
          type: activeStickerTool,
          position: pos,
          scale: 1.05,
        });
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [
    isDrawingMode,
    activeStickerTool,
    onAddDrawingPoint,
    onAddDrawingDecoration,
  ]);

  // Fly to selected course when selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedCourse || isDrawingMode) return;

    if (lastSelectedCourseIdRef.current !== selectedCourse.id) {
      lastSelectedCourseIdRef.current = selectedCourse.id;
      const bounds = L.latLngBounds(selectedCourse.coordinates);
      map.flyToBounds(bounds, {
        padding: [68, 68],
        maxZoom: 15,
        duration: 0.85,
      });
    }
  }, [selectedCourse, isDrawingMode]);

  // Render courses, overlays, animations, and drawing paths
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. If in Drawing Mode, render user's active sketch
    if (isDrawingMode) {
      if (drawingPoints.length >= 3 && showIllustrationOverlay) {
        L.polygon(drawingPoints, {
          color: 'transparent',
          fillColor: drawingColor,
          fillOpacity: overlayOpacity * 0.35,
        }).addTo(group);
      }

      if (drawingPoints.length >= 2) {
        L.polyline(drawingPoints, {
          color: drawingColor,
          weight: 6,
          opacity: 0.92,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(group);
      }

      drawingPoints.forEach((pt, idx) => {
        L.circleMarker(pt, {
          radius: idx === 0 ? 7 : 4.5,
          color: '#FFFFFF',
          weight: 2,
          fillColor: idx === 0 ? '#18181B' : drawingColor,
          fillOpacity: 1,
        })
          .bindTooltip(idx === 0 ? '출발점' : `#${idx + 1}`, {
            direction: 'top',
          })
          .addTo(group);
      });

      drawingDecorations.forEach((dec) => {
        L.marker(dec.position, {
          icon: createDecorationIcon(dec, drawingColor),
        }).addTo(group);
      });

      return;
    }

    // 2. Render background non-selected courses subtly so users can browse on the map
    courses.forEach((course) => {
      const isSelected = selectedCourse?.id === course.id;
      if (isSelected) return;

      const bgPoly = L.polyline(course.coordinates, {
        color: course.accentColor,
        weight: 3.5,
        opacity: 0.55,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(group);

      bgPoly.on('click', () => onSelectCourse(course));
      bgPoly.bindTooltip(
        `<div style="font-weight:700;font-size:12px;">${course.title} (${course.shapeName} · ${course.distanceKm}km)</div>`,
        { sticky: true }
      );
    });

    // 3. Render Selected Course with Artwork Overlay & Animation
    if (!selectedCourse) return;

    const denseCoords = densifyCoordinates(selectedCourse.coordinates, 14);
    const totalPts = denseCoords.length;
    const activeCount = Math.max(
      2,
      Math.round((animationProgress / 100) * totalPts)
    );
    const activeSlice = denseCoords.slice(0, activeCount);
    const currentRunnerPos =
      activeSlice[activeSlice.length - 1] || selectedCourse.coordinates[0];

    // 3a. Illustration Silhouette Fill Layer (when enabled)
    if (showIllustrationOverlay) {
      // Soft artistic fill inside the GPS art shape
      L.polygon(selectedCourse.coordinates, {
        color: selectedCourse.accentColor,
        weight: 1.5,
        opacity: 0.35,
        dashArray: '4 4',
        fillColor: selectedCourse.accentColor,
        fillOpacity: overlayOpacity,
      }).addTo(group);
    }

    // 3b. Full route ghost baseline (visible when animation is < 100%)
    if (animationProgress < 99.5) {
      L.polyline(selectedCourse.coordinates, {
        color: selectedCourse.accentColor,
        weight: 4,
        opacity: 0.24,
        dashArray: '6 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(group);
    }

    // 3c. Outer neon gallery halo for active route
    L.polyline(activeSlice, {
      color: selectedCourse.accentColor,
      weight: 13,
      opacity: 0.22,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(group);

    // 3d. Main crisp GPS Art Stroke
    L.polyline(activeSlice, {
      color: selectedCourse.accentColor,
      weight: 5.5,
      opacity: 0.98,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(group);

    // 3e. Direction chevron arrows along the route
    const arrowIndices = [0.2, 0.45, 0.7, 0.9].map((ratio) =>
      Math.floor(ratio * (denseCoords.length - 2))
    );
    arrowIndices.forEach((idx) => {
      if (idx < 0 || idx >= activeCount - 1) return;
      const p1 = denseCoords[idx];
      const p2 = denseCoords[idx + 1];
      const angle =
        (Math.atan2(p2[0] - p1[0], p2[1] - p1[1]) * 180) / Math.PI;
      const arrowIcon = L.divIcon({
        className: 'direction-chevron',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        html: `<div style="transform:rotate(${-angle + 90}deg);color:#FFFFFF;background:${selectedCourse.accentColor};width:18px;height:18px;border-radius:9999px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;box-shadow:0 1px 4px rgba(0,0,0,0.25);border:1.5px solid #FFF;">▲</div>`,
      });
      L.marker(p1, { icon: arrowIcon, interactive: false }).addTo(group);
    });

    // 3f. Render Illustration Decorations (Eyes, Nose, Blush, Whiskers, Ear Tags)
    if (showIllustrationOverlay) {
      selectedCourse.decorations.forEach((dec) => {
        L.marker(dec.position, {
          icon: createDecorationIcon(dec, selectedCourse.accentColor),
        }).addTo(group);
      });
    }

    // 3g. Render Start Pin & Key Waypoints
    const startPt = selectedCourse.coordinates[0];
    const startIcon = L.divIcon({
      className: 'start-pin',
      iconSize: [68, 26],
      iconAnchor: [34, 28],
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <span style="background:#18181B;color:#FFFFFF;font-size:10px;font-weight:800;padding:2px 8px;border-radius:9999px;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:1.5px solid #FFFFFF;white-space:nowrap;">
            START · 출발
          </span>
        </div>
      `,
    });
    L.marker(startPt, { icon: startIcon }).addTo(group);

    if (showWaypoints) {
      selectedCourse.waypoints.forEach((wp, i) => {
        const pt =
          selectedCourse.coordinates[wp.index] ||
          selectedCourse.coordinates[0];
        const wpIcon = L.divIcon({
          className: 'waypoint-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          html: `
            <div style="width:24px;height:24px;border-radius:9999px;background:#FFFFFF;color:#18181B;border:2.5px solid ${selectedCourse.accentColor};font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.22);">
              ${i + 1}
            </div>
          `,
        });
        L.marker(pt, { icon: wpIcon })
          .bindTooltip(
            `<div style="padding:2px 4px;">
              <div style="font-weight:800;font-size:12px;color:#18181B;">${i + 1}. ${wp.title}</div>
              <div style="font-size:11px;color:#52525B;">${wp.description}</div>
            </div>`,
            { direction: 'top', offset: [0, -8] }
          )
          .addTo(group);
      });
    }

    // 3h. Live Runner Marker during Animation or Scrubbing
    if (isPlaying || animationProgress < 99.5) {
      const currentDist = (
        (animationProgress / 100) *
        selectedCourse.distanceKm
      ).toFixed(1);
      const runnerIcon = L.divIcon({
        className: 'runner-live-marker',
        iconSize: [96, 42],
        iconAnchor: [48, 21],
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;">
            <div style="background:${selectedCourse.accentColor};color:#FFF;font-size:10px;font-weight:800;padding:1px 7px;border-radius:9999px;margin-bottom:2px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:1.5px solid #FFF;">
              🏃 ${currentDist}km
            </div>
            <div style="position:relative;width:16px;height:16px;display:flex;align-items:center;justify-content:center;">
              <div class="runner-pulse-ring" style="position:absolute;inset:-4px;border-radius:9999px;background:${selectedCourse.accentColor};"></div>
              <div style="position:relative;width:12px;height:12px;border-radius:9999px;background:#FFFFFF;border:3px solid ${selectedCourse.accentColor};box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>
            </div>
          </div>
        `,
      });
      L.marker(currentRunnerPos, {
        icon: runnerIcon,
        zIndexOffset: 1000,
      }).addTo(group);
    }
  }, [
    courses,
    selectedCourse,
    showIllustrationOverlay,
    overlayOpacity,
    showWaypoints,
    animationProgress,
    isPlaying,
    isDrawingMode,
    drawingPoints,
    drawingDecorations,
    drawingColor,
    onSelectCourse,
  ]);

  const mapClass =
    mapStyle === 'dark'
      ? 'gallery-map-dark'
      : mapStyle === 'color'
      ? 'gallery-map-color'
      : 'gallery-map-light';

  return (
    <div className={`relative w-full h-full ${mapClass}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
};
