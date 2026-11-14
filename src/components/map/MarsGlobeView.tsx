import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { useMarsLayerSync } from '../../hooks/useMarsLayerSync.ts';
import {
  MARS_SERVICE_ENDPOINTS,
  MARS_PLANETARY_SR,
  MARS_DEFAULT_CAMERA,
  MARS_GROUND_COLOR,
} from '../../config/marsLayers.ts';
import { MARS_LANDING_SITES } from '../../config/mars.ts';
import { MARS_LANDMARKS } from '../../config/marsLandmarks.ts';
import { findRegionAtCoordinates } from '../../config/marsRegions.ts';
import { GlobeControls } from './GlobeControls.tsx';
import {
  queryPointElevation,
  inspectMartianTerrain,
} from '../../services/data/terrainElevationService.ts';
import {
  getRoverMilestones,
  getRoverColorRgba,
} from '../../services/data/roverMissionService.ts';
import { Radio, AlertCircle, Map } from 'lucide-react';

export const MarsGlobeView: React.FC = () => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<any>(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [initNotice, setInitNotice] = useState<string | null>(null);

  // Synchronize scientific layers with 3D Globe SceneView
  useMarsLayerSync(viewRef.current, isGlobeReady);

  const {
    viewMode,
    selectedLandingSiteId,
    selectedLandmarkId,
    setSelectedLandingSiteId,
    regionalCenter,
    setRegionalCenter,
    setViewMode,
    setTelemetry,
    activeTerrainInspection,
    setActiveTerrainInspection,
    measurementPoints,
    activeMeasurementTool,
    selectedRoverId,
    activeSol,
    setActiveSol,
    isRoverTraverseVisible,
    candidateRoutes,
    selectedRouteIndex,
    routeOrigin,
    routeDestination,
    isHudVisible,
  } = useAppStore();

  const prevViewModeRef = useRef(viewMode);

  // Sync measurement graphics onto 3D globe
  useEffect(() => {
    if (!viewRef.current || !viewRef.current.map) return;
    const measLayer = viewRef.current.map.layers?.find
      ? viewRef.current.map.layers.find((l: any) => l.id === 'mars-measurement-layer')
      : null;
    if (!measLayer) return;

    if (typeof measLayer.removeAll === 'function') {
      measLayer.removeAll();
    }
    if (!activeMeasurementTool || measurementPoints.length === 0) return;

    Promise.all([
      import('@arcgis/core/Graphic'),
      import('@arcgis/core/geometry/Point'),
      import('@arcgis/core/geometry/Polyline'),
      import('@arcgis/core/geometry/Polygon'),
      import('@arcgis/core/geometry/SpatialReference'),
    ]).then(([
      { default: Graphic },
      { default: Point },
      { default: Polyline },
      { default: Polygon },
      { default: SpatialReference },
    ]) => {
      const marsSR = new SpatialReference({ wkid: MARS_PLANETARY_SR.wkid });

      // Add points
      measurementPoints.forEach((pt, index) => {
        const pointGeom = new Point({
          x: pt.lon,
          y: pt.lat,
          spatialReference: marsSR,
        });

        const markerGraphic = new Graphic({
          geometry: pointGeom,
          symbol: {
            type: 'simple-marker',
            style: 'circle',
            color: [6, 182, 212, 0.9],
            size: index === 0 ? 10 : 8,
            outline: {
              color: [255, 255, 255, 1],
              width: 1.5,
            },
          } as any,
        });
        measLayer.add(markerGraphic);
      });

      // Add line if distance or profile
      if (
        (activeMeasurementTool === 'distance' || activeMeasurementTool === 'profile') &&
        measurementPoints.length >= 2
      ) {
        const polylineGeom = new Polyline({
          paths: [measurementPoints.map((p) => [p.lon, p.lat])],
          spatialReference: marsSR,
        });

        const lineGraphic = new Graphic({
          geometry: polylineGeom,
          symbol: {
            type: 'simple-line',
            color: [6, 182, 212, 0.95],
            width: 2.5,
          } as any,
        });
        measLayer.add(lineGraphic);
      }

      // Add polygon if area
      if (activeMeasurementTool === 'area' && measurementPoints.length >= 3) {
        const ring = measurementPoints.map((p) => [p.lon, p.lat]);
        ring.push([measurementPoints[0].lon, measurementPoints[0].lat]);

        const polygonGeom = new Polygon({
          rings: [ring],
          spatialReference: marsSR,
        });

        const polygonGraphic = new Graphic({
          geometry: polygonGeom,
          symbol: {
            type: 'simple-fill',
            color: [16, 185, 129, 0.25],
            outline: {
              color: [16, 185, 129, 0.95],
              width: 2,
            },
          } as any,
        });
        measLayer.add(polygonGraphic);
      }
    }).catch(() => {});
  }, [measurementPoints, activeMeasurementTool]);

  // Sync activeTerrainInspection reticle pin onto 3D globe
  useEffect(() => {
    if (!viewRef.current || !viewRef.current.map) return;
    const inspLayer = viewRef.current.map.layers?.find
      ? viewRef.current.map.layers.find((l: any) => l.id === 'mars-inspection-layer')
      : null;
    if (!inspLayer) return;

    if (typeof inspLayer.removeAll === 'function') {
      inspLayer.removeAll();
    }

    if (activeTerrainInspection) {
      Promise.all([
        import('@arcgis/core/Graphic'),
        import('@arcgis/core/geometry/Point'),
      ]).then(([{ default: Graphic }, { default: Point }]) => {
        const point = new Point({
          x: activeTerrainInspection.longitude,
          y: activeTerrainInspection.latitude,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        });

        const reticleGraphic = new Graphic({
          geometry: point,
          symbol: {
            type: 'simple-marker',
            style: 'cross',
            color: [6, 182, 212, 1], // ARES Cyan
            size: 16,
            outline: {
              color: [255, 255, 255, 0.95],
              width: 2,
            },
          } as any,
        });

        inspLayer.add(reticleGraphic);
      });
    }
  }, [activeTerrainInspection, isGlobeReady]);

  // Sync Rover Traverse & Sol Milestones onto 3D Globe
  useEffect(() => {
    if (!viewRef.current || !viewRef.current.map) return;
    const traverseLayer = viewRef.current.map.layers?.find
      ? viewRef.current.map.layers.find((l: any) => l.id === 'mars-rover-traverse-layer')
      : null;
    if (!traverseLayer) return;

    if (typeof traverseLayer.removeAll === 'function') {
      traverseLayer.removeAll();
    }

    if (!isRoverTraverseVisible || !selectedRoverId) return;

    const milestones = getRoverMilestones(selectedRoverId);
    if (!milestones || milestones.length === 0) return;

    Promise.all([
      import('@arcgis/core/Graphic'),
      import('@arcgis/core/geometry/Point'),
      import('@arcgis/core/geometry/Polyline'),
      import('@arcgis/core/geometry/SpatialReference'),
    ]).then(([{ default: Graphic }, { default: Point }, { default: Polyline }, { default: SpatialReference }]) => {
      const marsSR = new SpatialReference({ wkid: MARS_PLANETARY_SR.wkid });
      const primaryColor = getRoverColorRgba(selectedRoverId);

      // 1. Draw Polyline traverse track
      const pathCoords = milestones.map((m) => [m.longitude, m.latitude]);
      const traversePolyline = new Polyline({
        paths: [pathCoords],
        spatialReference: marsSR,
      });

      const lineGraphic = new Graphic({
        geometry: traversePolyline,
        symbol: {
          type: 'simple-line',
          color: primaryColor,
          width: 3.5,
        } as any,
      });
      traverseLayer.add(lineGraphic);

      // 2. Draw milestone Points
      milestones.forEach((m) => {
        const isActive = activeSol !== null && m.sol === activeSol;
        const point = new Point({
          x: m.longitude,
          y: m.latitude,
          spatialReference: marsSR,
        });

        const markerGraphic = new Graphic({
          geometry: point,
          attributes: {
            sol: m.sol,
            siteName: m.siteName,
            distanceKm: m.distanceKm,
            elevation: m.elevationMeters,
            formation: m.formation,
          },
          symbol: {
            type: 'simple-marker',
            style: 'circle',
            color: isActive ? [249, 115, 22, 1.0] : primaryColor,
            size: isActive ? 12 : 6,
            outline: {
              color: [255, 255, 255, 0.9],
              width: isActive ? 2.5 : 1,
            },
          } as any,
        });
        traverseLayer.add(markerGraphic);
      });
    }).catch(() => {});
  }, [selectedRoverId, activeSol, isRoverTraverseVisible, isGlobeReady]);

  // Sync Phase 09 Surface Route Planning Graphics onto 3D Globe
  useEffect(() => {
    if (!viewRef.current || !viewRef.current.map) return;
    const routesLayer = viewRef.current.map.layers?.find
      ? viewRef.current.map.layers.find((l: any) => l.id === 'mars-routes-layer')
      : null;
    if (!routesLayer) return;

    if (typeof routesLayer.removeAll === 'function') {
      routesLayer.removeAll();
    }

    Promise.all([
      import('@arcgis/core/Graphic'),
      import('@arcgis/core/geometry/Point'),
      import('@arcgis/core/geometry/Polyline'),
      import('@arcgis/core/geometry/SpatialReference'),
    ]).then(([{ default: Graphic }, { default: Point }, { default: Polyline }, { default: SpatialReference }]) => {
      const marsSR = new SpatialReference({ wkid: MARS_PLANETARY_SR.wkid });

      // 1. Draw Origin and Destination Pins
      if (routeOrigin) {
        const originPoint = new Point({
          x: routeOrigin.lon,
          y: routeOrigin.lat,
          spatialReference: marsSR,
        });
        const originMarker = new Graphic({
          geometry: originPoint,
          symbol: {
            type: 'simple-marker',
            style: 'diamond',
            color: [16, 185, 129, 1.0], // Emerald
            size: 12,
            outline: {
              color: [255, 255, 255, 1.0],
              width: 2,
            },
          } as any,
        });
        routesLayer.add(originMarker);
      }

      if (routeDestination) {
        const destPoint = new Point({
          x: routeDestination.lon,
          y: routeDestination.lat,
          spatialReference: marsSR,
        });
        const destMarker = new Graphic({
          geometry: destPoint,
          symbol: {
            type: 'simple-marker',
            style: 'diamond',
            color: [239, 68, 68, 1.0], // Red
            size: 12,
            outline: {
              color: [255, 255, 255, 1.0],
              width: 2,
            },
          } as any,
        });
        routesLayer.add(destMarker);
      }

      // 2. Draw Candidate Routes
      if (candidateRoutes && candidateRoutes.length > 0) {
        candidateRoutes.forEach((route, idx) => {
          if (!route.waypoints || route.waypoints.length < 2) return;
          const isSelected = selectedRouteIndex === idx;

          const pathCoords = route.waypoints.map((w) => [w.longitude, w.latitude]);
          const routePolyline = new Polyline({
            paths: [pathCoords],
            spatialReference: marsSR,
          });

          const lineColor = isSelected
            ? route.colorRgba
            : [route.colorRgba[0], route.colorRgba[1], route.colorRgba[2], 0.45];

          const lineGraphic = new Graphic({
            geometry: routePolyline,
            attributes: {
              routeId: route.id,
              name: route.name,
              totalDistanceKm: route.totalDistanceKm,
              maxSlopeDegrees: route.maxSlopeDegrees,
            },
            symbol: {
              type: 'simple-line',
              color: lineColor,
              width: isSelected ? 4.5 : 2.0,
            } as any,
          });
          routesLayer.add(lineGraphic);
        });
      }
    }).catch(() => {});
  }, [candidateRoutes, selectedRouteIndex, routeOrigin, routeDestination, isGlobeReady]);

  // Camera action handlers
  const handleResetView = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.goTo(
      {
        position: {
          x: MARS_DEFAULT_CAMERA.position.x,
          y: MARS_DEFAULT_CAMERA.position.y,
          z: MARS_DEFAULT_CAMERA.position.z,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        heading: MARS_DEFAULT_CAMERA.heading,
        tilt: MARS_DEFAULT_CAMERA.tilt,
      },
      { duration: 1500 }
    );
  }, []);

  const handleRotateNorth = useCallback(() => {
    if (!viewRef.current) return;
    const currentCamera = viewRef.current.camera.clone();
    currentCamera.heading = 0;
    viewRef.current.goTo(currentCamera, { duration: 1000 });
  }, []);

  const handleToggleTilt = useCallback(() => {
    if (!viewRef.current) return;
    const currentCamera = viewRef.current.camera.clone();
    currentCamera.tilt = currentCamera.tilt > 20 ? 0 : 50;
    viewRef.current.goTo(currentCamera, { duration: 1000 });
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!viewRef.current) return;
    const currentCamera = viewRef.current.camera.clone();
    if (viewMode === 'GLOBAL_3D' && currentCamera.position.z <= 600000) {
      // Zooming in from low orbit auto-transitions directly into 2D Regional Map only in GLOBAL_3D
      const view = viewRef.current;
      const screenCenter = { x: (view.width || 800) / 2, y: (view.height || 600) / 2 };
      const groundPoint = view.toMap ? view.toMap(screenCenter) : null;
      const target = groundPoint || view.center;
      const lon = typeof target?.longitude === 'number' ? target.longitude : target?.x;
      const lat = typeof target?.latitude === 'number' ? target.latitude : target?.y;
      if (
        typeof lon === 'number' &&
        typeof lat === 'number' &&
        !isNaN(lon) &&
        !isNaN(lat)
      ) {
        const roundedLon = Number(lon.toFixed(4));
        const roundedLat = Number(lat.toFixed(4));
        setRegionalCenter({
          longitude: roundedLon,
          latitude: roundedLat,
          scale: 500000,
        });
        const match = findRegionAtCoordinates(roundedLon, roundedLat);
        useAppStore.setState({ selectedRegionId: match ? match.id : null });
      }
      setViewMode('REGIONAL_2D');
      return;
    }
    currentCamera.position.z = Math.max(currentCamera.position.z * 0.4, 1500);
    viewRef.current.goTo(currentCamera, { duration: 400 });
  }, [setRegionalCenter, setViewMode, viewMode]);

  const handleZoomOut = useCallback(() => {
    if (!viewRef.current) return;
    const currentCamera = viewRef.current.camera.clone();
    currentCamera.position.z *= 2.0;
    viewRef.current.goTo(currentCamera, { duration: 400 });
  }, []);

  // Listen to selected landing site changes to execute camera fly-to
  useEffect(() => {
    if (!viewRef.current || !selectedLandingSiteId) return;

    const site = MARS_LANDING_SITES.find((s) => s.id === selectedLandingSiteId);
    if (!site) return;

    const isPov = viewMode === 'LOCAL_ANALYSIS';
    const eyeAlt = isPov ? Math.max(site.elevationMeters + 3000, 2000) : 500000;
    const tiltAngle = isPov ? 75 : 35;
    const latOffset = isPov ? -0.04 : -1.2;

    viewRef.current.goTo(
      {
        target: {
          x: site.longitude,
          y: site.latitude,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        position: {
          x: site.longitude,
          y: site.latitude + latOffset,
          z: eyeAlt,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        heading: 0,
        tilt: tiltAngle,
      },
      { duration: 2000 }
    );
  }, [selectedLandingSiteId, viewMode]);

  // Listen to selected landmark changes to execute camera fly-to
  useEffect(() => {
    if (!viewRef.current || !selectedLandmarkId) return;

    const landmark = MARS_LANDMARKS.find((l) => l.id === selectedLandmarkId);
    if (!landmark) return;

    const isPov = viewMode === 'LOCAL_ANALYSIS';
    const eyeAlt = isPov
      ? landmark.type === 'VOLCANO'
        ? landmark.elevationMeters + 6000
        : landmark.elevationMeters + 3500
      : 800000;
    const tiltAngle = isPov ? 75 : 35;
    const latOffset = isPov ? (landmark.type === 'VOLCANO' ? -0.15 : -0.06) : -1.5;

    viewRef.current.goTo(
      {
        target: {
          x: landmark.longitude,
          y: landmark.latitude,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        position: {
          x: landmark.longitude,
          y: landmark.latitude + latOffset,
          z: Math.max(eyeAlt, 2500),
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        heading: 0,
        tilt: tiltAngle,
      },
      { duration: 2200 }
    );
  }, [selectedLandmarkId, viewMode]);

  // Synchronize 3D Globe camera ONLY when returning from 2D regional cartography into 3D
  useEffect(() => {
    const wasRegional = prevViewModeRef.current === 'REGIONAL_2D';
    prevViewModeRef.current = viewMode;

    if (!wasRegional || viewMode !== 'GLOBAL_3D' || !viewRef.current || !regionalCenter) {
      return;
    }

    const p = viewRef.current.goTo(
      {
        position: {
          x: regionalCenter.longitude,
          y: regionalCenter.latitude,
          z: 1800000,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        heading: 0,
        tilt: 0,
      },
      { duration: 800 }
    );
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, [viewMode, regionalCenter]);

  // Listen to rover and sol selection changes to execute camera fly-to / Ground POV ONLY when traverse is active
  useEffect(() => {
    if (!viewRef.current || !selectedRoverId || !isRoverTraverseVisible) return;

    const milestones = getRoverMilestones(selectedRoverId);
    if (!milestones || milestones.length === 0) return;

    const targetMilestone =
      activeSol !== null
        ? milestones.find((m) => m.sol === activeSol) || milestones[milestones.length - 1]
        : milestones[milestones.length - 1];

    if (!targetMilestone) return;

    const isPov = viewMode === 'LOCAL_ANALYSIS' || activeSol !== null;
    const eyeAlt = isPov
      ? Math.max(targetMilestone.elevationMeters + 1200, 1500)
      : Math.max(targetMilestone.elevationMeters + 35000, 40000);
    const tiltAngle = isPov ? 70 : 35;
    const latOffset = isPov ? -0.015 : -0.2;

    viewRef.current.goTo(
      {
        target: {
          x: targetMilestone.longitude,
          y: targetMilestone.latitude,
          z: targetMilestone.elevationMeters,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        position: {
          x: targetMilestone.longitude,
          y: targetMilestone.latitude + latOffset,
          z: eyeAlt,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        heading: 0,
        tilt: tiltAngle,
      },
      { duration: 1800 }
    );
  }, [selectedRoverId, activeSol, viewMode]);

  // Mount ArcGIS SceneView
  useEffect(() => {
    let isMounted = true;
    let viewInstance: any = null;
    let cameraWatchHandle: any = null;
    let cameraPositionWatchHandle: any = null;
    let scaleWatchHandle: any = null;

    async function initMarsGlobe() {
      if (!mapDivRef.current) return;

      // Safely check WebGL capability
      const hasWebGL =
        typeof window !== 'undefined' &&
        typeof window.WebGLRenderingContext !== 'undefined';

      if (!hasWebGL) {
        if (isMounted) {
          setInitNotice('WebGL acceleration not available in current test environment.');
        }
        return;
      }

      try {
        const [
          { default: EsriMap },
          { default: SceneView },
          { default: SpatialReference },
          { default: TileLayer },
          { default: ElevationLayer },
          { default: GraphicsLayer },
          { default: Graphic },
          { default: Point },
          reactiveUtils,
        ] = await Promise.all([
          import('@arcgis/core/Map'),
          import('@arcgis/core/views/SceneView'),
          import('@arcgis/core/geometry/SpatialReference'),
          import('@arcgis/core/layers/TileLayer'),
          import('@arcgis/core/layers/ElevationLayer'),
          import('@arcgis/core/layers/GraphicsLayer'),
          import('@arcgis/core/Graphic'),
          import('@arcgis/core/geometry/Point'),
          import('@arcgis/core/core/reactiveUtils'),
        ]);

        if (!isMounted || !mapDivRef.current) return;

        const marsSR = new SpatialReference({ wkid: MARS_PLANETARY_SR.wkid });

        // 1. Mars MDIM Surface Imagery Layer
        const marsSurfaceLayer = new TileLayer({
          id: 'mars-viking-mdim21',
          url: MARS_SERVICE_ENDPOINTS.imagery,
          title: 'Mars MDIM 2.1 Color Mosaic',
          copyright: 'NASA / USGS Astrogeology / Esri',
        });

        // 2. Mars MDEM200M Elevation Ground Layer
        const marsElevationLayer = new ElevationLayer({
          id: 'mars-mdem200m-elevation',
          url: MARS_SERVICE_ENDPOINTS.elevation,
          title: 'Mars MDEM 200m Elevation',
          copyright: 'NASA, ESA, HRSC, USGS Astrogeology, Esri',
        });

        // 3. Landing Sites Graphics Layer
        const landingGraphicsLayer = new GraphicsLayer({
          id: 'mars-landing-sites',
          title: 'Verified Mars Landing Sites',
          elevationInfo: {
            mode: 'on-the-ground',
          },
        });

        // Populate verified landing site pins
        MARS_LANDING_SITES.forEach((site) => {
          const point = new Point({
            x: site.longitude,
            y: site.latitude,
            spatialReference: marsSR,
          });

          const markerGraphic = new Graphic({
            geometry: point,
            attributes: {
              siteId: site.id,
              name: site.name,
              mission: site.mission,
              elevation: site.elevationMeters,
            },
            symbol: {
              type: 'simple-marker',
              style: 'circle',
              color: [234, 88, 12, 0.9], // ARES Rust
              size: 10,
              outline: {
                color: [255, 255, 255, 0.9],
                width: 1.5,
              },
            } as any,
          });

          landingGraphicsLayer.add(markerGraphic);
        });

        // 4. Terrain Inspection Reticle Graphics Layer
        const inspectionGraphicsLayer = new GraphicsLayer({
          id: 'mars-inspection-layer',
          title: 'Terrain Inspection Reticle',
          elevationInfo: {
            mode: 'on-the-ground',
          },
        });

        // 5. Phase 07 Measurement Graphics Layer
        const measurementGraphicsLayer = new GraphicsLayer({
          id: 'mars-measurement-layer',
          title: 'Martian Geodesic Measurements',
          elevationInfo: {
            mode: 'on-the-ground',
          },
        });

        // 6. Phase 08 Rover Traverse & Sol Milestones Graphics Layer
        const roverTraverseGraphicsLayer = new GraphicsLayer({
          id: 'mars-rover-traverse-layer',
          title: 'Rover Traverses & Sol Milestones',
          elevationInfo: {
            mode: 'on-the-ground',
          },
        });

        // 7. Phase 09 Surface Route Planning Graphics Layer
        const routesGraphicsLayer = new GraphicsLayer({
          id: 'mars-routes-layer',
          title: 'Surface Route Planning',
          elevationInfo: {
            mode: 'on-the-ground',
          },
        });

        // Mars Planetary Map
        const map = new EsriMap({
          layers: [
            marsSurfaceLayer,
            landingGraphicsLayer,
            inspectionGraphicsLayer,
            measurementGraphicsLayer,
            roverTraverseGraphicsLayer,
            routesGraphicsLayer,
          ],
          ground: {
            surfaceColor: MARS_GROUND_COLOR,
            layers: [marsElevationLayer],
          },
        });

        // 3D SceneView
        const view = new SceneView({
          container: mapDivRef.current,
          map,
          spatialReference: marsSR,
          qualityProfile: 'high',
          constraints: {
            altitude: {
              min: 1000, // 1 km ground-level threshold allowing POV surface exploration
              max: 25000000,
            },
            tilt: {
              max: 85, // Steep ground-level horizon pitch
            },
          },
          environment: {
            background: {
              type: 'color',
              color: [5, 7, 13, 1], // Deep space black
            },
            starsEnabled: true,
            atmosphereEnabled: true,
            lighting: {
              type: 'virtual',
              directShadowsEnabled: true,
            },
          },
          camera: {
            position: MARS_DEFAULT_CAMERA.position,
            heading: MARS_DEFAULT_CAMERA.heading,
            tilt: MARS_DEFAULT_CAMERA.tilt,
          },
          ui: {
            components: [], // Clean UI: controlled entirely by ARES custom HUD
          },
        });

        viewRef.current = view;
        viewInstance = view;

        await view.when();

        if (isMounted) {
          setIsGlobeReady(true);
          if (typeof view.scale === 'number' && !isNaN(view.scale) && view.scale > 0) {
            setTelemetry({
              scale: `1:${Math.round(view.scale).toLocaleString()}`,
            });
          }
        }

        // Auto-switch to 2D Regional Map only when in GLOBAL_3D mode and user zooms in below 600 km
        cameraWatchHandle = reactiveUtils.watch(
          () => (view.camera?.position?.z as number | undefined),
          (altitude?: number) => {
            const currentMode = useAppStore.getState().viewMode;
            if (
              currentMode === 'GLOBAL_3D' &&
              typeof altitude === 'number' &&
              altitude <= 600000
            ) {
              const screenCenter = { x: (view.width || 800) / 2, y: (view.height || 600) / 2 };
              const groundPoint = view.toMap ? view.toMap(screenCenter) : null;
              const target = groundPoint || view.center;
              const lon = typeof target?.longitude === 'number' ? target.longitude : target?.x;
              const lat = typeof target?.latitude === 'number' ? target.latitude : target?.y;
              if (
                typeof lon === 'number' &&
                typeof lat === 'number' &&
                !isNaN(lon) &&
                !isNaN(lat)
              ) {
                const roundedLon = Number(lon.toFixed(4));
                const roundedLat = Number(lat.toFixed(4));
                setRegionalCenter({
                  longitude: roundedLon,
                  latitude: roundedLat,
                  scale: 500000,
                });
                const match = findRegionAtCoordinates(roundedLon, roundedLat);
                useAppStore.setState({ selectedRegionId: match ? match.id : null });
              }
              setViewMode('REGIONAL_2D');
              // Back off camera altitude to 1,500,000m to prevent instant bounce back when returning to 3D
              if (view.camera) {
                const safeCam = view.camera.clone();
                safeCam.position.z = 1500000;
                view.goTo(safeCam, { duration: 0 });
              }
            }
          }
        );

        // Live camera aim point tracking to synchronize regionalCenter, telemetry, and region ID in 3D
        cameraPositionWatchHandle = reactiveUtils.watch(
          () => [view.camera?.position?.x, view.camera?.position?.y, view.camera?.position?.z],
          () => {
            if (useAppStore.getState().viewMode !== 'GLOBAL_3D') return;
            const screenCenter = { x: (view.width || 800) / 2, y: (view.height || 600) / 2 };
            const groundPoint = view.toMap ? view.toMap(screenCenter) : null;
            const target = groundPoint || view.camera?.position;
            if (target) {
              const lon = typeof target.longitude === 'number' ? target.longitude : target.x;
              const lat = typeof target.latitude === 'number' ? target.latitude : target.y;
              if (typeof lon === 'number' && !isNaN(lon) && typeof lat === 'number' && !isNaN(lat)) {
                const roundedLon = Number(lon.toFixed(4));
                const roundedLat = Number(lat.toFixed(4));
                setRegionalCenter({
                  longitude: roundedLon,
                  latitude: roundedLat,
                  scale: 500000,
                });
                setTelemetry({
                  longitude: roundedLon,
                  latitude: roundedLat,
                });
                const match = findRegionAtCoordinates(roundedLon, roundedLat);
                useAppStore.setState({ selectedRegionId: match ? match.id : null });
              }
            }
          }
        );

        // Live camera scale telemetry tracking
        scaleWatchHandle = reactiveUtils.watch(
          () => view.scale,
          (scale: number) => {
            if (typeof scale === 'number' && !isNaN(scale) && scale > 0) {
              setTelemetry({
                scale: `1:${Math.round(scale).toLocaleString()}`,
              });
            }
          }
        );

        // Double-click anywhere on the Mars surface to directly dive into 2D Regional Cartography
        view.on('double-click', (event: any) => {
          event.stopPropagation();
          const mapPoint = view.toMap({ x: event.x, y: event.y });
          if (
            mapPoint &&
            typeof mapPoint.latitude === 'number' &&
            typeof mapPoint.longitude === 'number'
          ) {
            setRegionalCenter({
              longitude: Number(mapPoint.longitude.toFixed(4)),
              latitude: Number(mapPoint.latitude.toFixed(4)),
              scale: 500000,
            });
            setViewMode('REGIONAL_2D');
          }
        });

        // Live pointer coordinate telemetry tracking
        view.on('pointer-move', async (event: any) => {
          const mapPoint = event.mapPoint || (view.toMap ? view.toMap({ x: event.x, y: event.y }) : null);
          if (
            mapPoint &&
            typeof mapPoint.latitude === 'number' &&
            typeof mapPoint.longitude === 'number'
          ) {
            const altitude = view.camera?.position?.z
              ? Math.round(view.camera.position.z / 1000)
              : 450;
            try {
              const elevation = await queryPointElevation(
                mapPoint.longitude,
                mapPoint.latitude,
                marsElevationLayer
              );
              setTelemetry({
                latitude: Number(mapPoint.latitude.toFixed(2)),
                longitude: Number(mapPoint.longitude.toFixed(2)),
                altitudeKm: altitude,
                elevation,
              });
            } catch {
              setTelemetry({
                latitude: Number(mapPoint.latitude.toFixed(2)),
                longitude: Number(mapPoint.longitude.toFixed(2)),
                altitudeKm: altitude,
              });
            }
          }
        });

        // Click on 3D pin to select site, milestone, or inspect Mars surface
        view.on('click', async (event: any) => {
          try {
            if (typeof view.hitTest === 'function') {
              const hitResult = await view.hitTest(event);
              const siteHit: any = hitResult?.results?.find(
                (r: any) => 'graphic' in r && ((r as any).graphic?.layer?.id === 'mars-landing-sites' || (r as any).graphic?.attributes?.siteId)
              );
              if (siteHit && siteHit.graphic?.attributes?.siteId) {
                setSelectedLandingSiteId(siteHit.graphic.attributes.siteId);
                return;
              }

              const milestoneHit: any = hitResult?.results?.find(
                (r: any) => 'graphic' in r && (r as any).graphic?.attributes?.sol !== undefined
              );
              if (milestoneHit && milestoneHit.graphic?.attributes?.sol !== undefined) {
                setActiveSol(milestoneHit.graphic.attributes.sol);
                return;
              }
            }
          } catch {
            // ignore hit-test errors
          }

          const mapPoint = event.mapPoint || (view.toMap ? view.toMap({ x: event.x, y: event.y }) : null);
          if (
            mapPoint &&
            typeof mapPoint.latitude === 'number' &&
            typeof mapPoint.longitude === 'number'
          ) {
            // When route point picking mode is active, record origin or destination and reset picker
            const pickingPoint = useAppStore.getState().isPickingRoutePoint;
            if (pickingPoint === 'origin') {
              useAppStore.getState().setRouteOrigin({
                lon: Number(mapPoint.longitude.toFixed(4)),
                lat: Number(mapPoint.latitude.toFixed(4)),
              });
              useAppStore.getState().setIsPickingRoutePoint(null);
              return;
            } else if (pickingPoint === 'destination') {
              useAppStore.getState().setRouteDestination({
                lon: Number(mapPoint.longitude.toFixed(4)),
                lat: Number(mapPoint.latitude.toFixed(4)),
              });
              useAppStore.getState().setIsPickingRoutePoint(null);
              return;
            }

            // When measurement tool is active, record measurement point and do not trigger spot inspection
            if (useAppStore.getState().activeMeasurementTool !== null) {
              useAppStore.getState().addMeasurementPoint({
                lon: Number(mapPoint.longitude.toFixed(4)),
                lat: Number(mapPoint.latitude.toFixed(4)),
              });
              return;
            }

            try {
              const data = await inspectMartianTerrain(
                mapPoint.longitude,
                mapPoint.latitude,
                marsElevationLayer
              );
              setActiveTerrainInspection(data);
            } catch (err) {
              console.warn('Terrain inspection failed:', err);
            }
          }
        });
      } catch (err: any) {
        console.warn('Mars globe initialization warning:', err);
        if (isMounted) {
          setInitNotice(err?.message || 'Planetary engine running in fallback state.');
        }
      }
    }

    initMarsGlobe();

    return () => {
      isMounted = false;
      if (cameraWatchHandle) {
        try {
          cameraWatchHandle.remove();
        } catch {
          // ignore cleanup errors
        }
      }
      if (cameraPositionWatchHandle) {
        try {
          cameraPositionWatchHandle.remove();
        } catch {
          // ignore cleanup errors
        }
      }
      if (scaleWatchHandle) {
        try {
          scaleWatchHandle.remove();
        } catch {
          // ignore cleanup errors
        }
      }
      if (viewInstance) {
        try {
          viewInstance.destroy();
        } catch {
          // ignore cleanup errors during unmount
        }
      }
    };
  }, [setTelemetry, setSelectedLandingSiteId, setRegionalCenter, setViewMode, setActiveTerrainInspection]);

  return (
    <div className="relative w-full h-full min-h-[100dvh] bg-ares-space overflow-hidden select-none">
      {/* Primary ArcGIS 3D Canvas Viewport */}
      <div
        ref={mapDivRef}
        data-testid="ares-globe-container"
        className="absolute inset-0 w-full h-full"
      />

      {isHudVisible && (
        <>
          {/* Floating Tactical Camera Controls (Zoom, Tilt, North, Reset) */}
          <GlobeControls
            onResetView={handleResetView}
            onRotateNorth={handleRotateNorth}
            onToggleTilt={handleToggleTilt}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />

          {/* Engine Status Notification */}
          <div className="absolute top-20 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl bg-black/80 border border-white/10 shadow-xl font-mono text-[11px] text-slate-300">
            <Radio className="w-3.5 h-3.5 text-ares-rust animate-pulse" />
            <span>3D MARS GLOBE:</span>
            <span className={`font-bold ${isGlobeReady ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {isGlobeReady ? 'ELEVATION MESH ACTIVE' : 'INITIALIZING'}
            </span>
            {initNotice && (
              <span className="flex items-center gap-1 text-slate-400 text-[10px] ml-1">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>({initNotice})</span>
              </span>
            )}
          </div>

          {/* Target Site Callout Banner with Quick Dive to 2D Regional Map */}
          {selectedLandingSiteId && (
            <div className="absolute bottom-24 left-4 z-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-2xl bg-black/90 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.92),inset_0_1px_0_0_rgba(255,255,255,0.12)] font-mono text-xs text-slate-200">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">TARGET LANDING SITE</span>
                <span className="font-bold text-white text-sm">
                  {MARS_LANDING_SITES.find((s) => s.id === selectedLandingSiteId)?.name}
                </span>
              </div>
              <button
                onClick={() => {
                  const site = MARS_LANDING_SITES.find((s) => s.id === selectedLandingSiteId);
                  if (site) {
                    setRegionalCenter({
                      latitude: site.latitude,
                      longitude: site.longitude,
                      scale: 500000,
                    });
                    setViewMode('REGIONAL_2D');
                  }
                }}
                aria-label="Enter 2D Regional Map"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-ares-rust to-orange-600 text-white shadow-md shadow-orange-950/40 hover:from-orange-600 hover:to-orange-500 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              >
                <Map className="w-3.5 h-3.5" />
                <span>EXPLORE 2D &rarr;</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLandingSiteId(null)}
                aria-label="Dismiss target site callout"
                className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              >
                <span className="text-sm font-bold leading-none">&times;</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MarsGlobeView;
