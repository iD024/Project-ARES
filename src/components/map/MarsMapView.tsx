import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { useMarsLayerSync } from '../../hooks/useMarsLayerSync.ts';
import {
  MARS_SERVICE_ENDPOINTS,
  MARS_PLANETARY_SR,
} from '../../config/marsLayers.ts';
import { MARS_LANDING_SITES } from '../../config/mars.ts';
import { MARS_REGIONS, getRegionById } from '../../config/marsRegions.ts';
import { MapControls } from './MapControls.tsx';
import {
  queryPointElevation,
  inspectMartianTerrain,
} from '../../services/data/terrainElevationService.ts';
import {
  getRoverMilestones,
  getRoverColorRgba,
} from '../../services/data/roverMissionService.ts';
import { Radio, AlertCircle, Map as MapIcon } from 'lucide-react';

export const MarsMapView: React.FC = () => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [initNotice, setInitNotice] = useState<string | null>(null);

  // Synchronize scientific layers with 2D Regional MapView
  useMarsLayerSync(viewRef.current, isMapReady);

  const {
    regionalCenter,
    selectedRegionId,
    setSelectedLandingSiteId,
    setSelectedRegionId,
    setTelemetry,
    setViewMode,
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
  } = useAppStore();

  // Sync measurement graphics onto 2D regional map
  useEffect(() => {
    if (!viewRef.current || !viewRef.current.map) return;
    const measLayer = viewRef.current.map.layers?.find
      ? viewRef.current.map.layers.find((l: any) => l.id === 'mars-measurement-layer-2d')
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

  // Sync activeTerrainInspection reticle pin onto 2D map
  useEffect(() => {
    if (!viewRef.current || !viewRef.current.map) return;
    const inspLayer = viewRef.current.map.layers?.find
      ? viewRef.current.map.layers.find((l: any) => l.id === 'mars-inspection-layer-2d')
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
  }, [activeTerrainInspection, isMapReady]);

  // Sync Rover Traverse & Sol Milestones onto 2D Regional Map
  useEffect(() => {
    if (!viewRef.current || !viewRef.current.map) return;
    const traverseLayer = viewRef.current.map.layers?.find
      ? viewRef.current.map.layers.find((l: any) => l.id === 'mars-rover-traverse-layer-2d')
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
  }, [selectedRoverId, activeSol, isRoverTraverseVisible, isMapReady]);

  // Sync Phase 09 Surface Route Planning Graphics onto 2D Map
  useEffect(() => {
    if (!viewRef.current || !viewRef.current.map) return;
    const routesLayer = viewRef.current.map.layers?.find
      ? viewRef.current.map.layers.find((l: any) => l.id === 'mars-routes-layer-2d')
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
  }, [candidateRoutes, selectedRouteIndex, routeOrigin, routeDestination, isMapReady]);

  // Reset Extent back to selected region or default regional extent
  const handleResetExtent = useCallback(() => {
    if (!viewRef.current) return;
    const region = selectedRegionId ? getRegionById(selectedRegionId) : MARS_REGIONS[0];
    const centerLon = region ? region.centerLongitude : regionalCenter.longitude;
    const centerLat = region ? region.centerLatitude : regionalCenter.latitude;
    const targetScale = region ? region.targetScale : 500000;

    viewRef.current.goTo(
      {
        center: [centerLon, centerLat],
        scale: targetScale,
        rotation: 0,
      },
      { duration: 1200 }
    );
  }, [selectedRegionId, regionalCenter]);

  // Reset North rotation to 0 degrees
  const handleRotateNorth = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.goTo({ rotation: 0 }, { duration: 800 });
  }, []);

  // Zoom In
  const handleZoomIn = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.goTo({ zoom: viewRef.current.zoom + 1 }, { duration: 400 });
  }, []);

  // Zoom Out
  const handleZoomOut = useCallback(() => {
    if (!viewRef.current) return;
    viewRef.current.goTo({ zoom: viewRef.current.zoom - 1 }, { duration: 400 });
  }, []);

  // Return to 3D Globe
  const handleReturnToGlobe = useCallback(() => {
    setViewMode('GLOBAL_3D');
  }, [setViewMode]);

  // Sync regionalCenter changes to 2D MapView
  useEffect(() => {
    if (!viewRef.current || !regionalCenter) return;
    viewRef.current.goTo(
      {
        center: [regionalCenter.longitude, regionalCenter.latitude],
        scale: regionalCenter.scale ?? 500000,
      },
      { duration: 1200 }
    );
  }, [regionalCenter]);

  // Sync rover and sol selection to 2D MapView extent
  useEffect(() => {
    if (!viewRef.current || !selectedRoverId) return;

    const milestones = getRoverMilestones(selectedRoverId);
    if (!milestones || milestones.length === 0) return;

    const targetMilestone =
      activeSol !== null
        ? milestones.find((m) => m.sol === activeSol) || milestones[milestones.length - 1]
        : milestones[milestones.length - 1];

    if (!targetMilestone) return;

    viewRef.current.goTo(
      {
        center: [targetMilestone.longitude, targetMilestone.latitude],
        scale: activeSol !== null ? 25000 : 75000,
      },
      { duration: 1200 }
    );
  }, [selectedRoverId, activeSol]);

  // Mount ArcGIS MapView
  useEffect(() => {
    let isMounted = true;
    let viewInstance: any = null;
    let scaleWatchHandle: any = null;

    async function initMarsMap() {
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
          { default: MapView },
          { default: SpatialReference },
          { default: TileLayer },
          { default: GraphicsLayer },
          { default: Graphic },
          { default: Point },
          reactiveUtils,
        ] = await Promise.all([
          import('@arcgis/core/Map'),
          import('@arcgis/core/views/MapView'),
          import('@arcgis/core/geometry/SpatialReference'),
          import('@arcgis/core/layers/TileLayer'),
          import('@arcgis/core/layers/GraphicsLayer'),
          import('@arcgis/core/Graphic'),
          import('@arcgis/core/geometry/Point'),
          import('@arcgis/core/core/reactiveUtils'),
        ]);

        if (!isMounted || !mapDivRef.current) return;

        const marsSR = new SpatialReference({ wkid: MARS_PLANETARY_SR.wkid });

        // 1. Mars MDIM 2.1 Color Basemap
        const marsSurfaceLayer = new TileLayer({
          id: 'mars-viking-mdim21',
          url: MARS_SERVICE_ENDPOINTS.imagery,
          title: 'Mars MDIM 2.1 Color Mosaic',
          copyright: 'NASA / USGS Astrogeology / Esri',
        });

        // 2. Landing Sites Graphics Layer
        const landingGraphicsLayer = new GraphicsLayer({
          id: 'mars-landing-sites-2d',
          title: 'Verified Mars Landing Sites',
        });

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
                color: [255, 255, 255, 0.95],
                width: 1.5,
              },
            } as any,
          });

          landingGraphicsLayer.add(markerGraphic);
        });

        // 3. Regional Interest Areas Graphics Layer
        const regionsGraphicsLayer = new GraphicsLayer({
          id: 'mars-regions-2d',
          title: 'Exploration Region Centers',
        });

        MARS_REGIONS.forEach((region) => {
          const point = new Point({
            x: region.centerLongitude,
            y: region.centerLatitude,
            spatialReference: marsSR,
          });

          const markerGraphic = new Graphic({
            geometry: point,
            attributes: {
              regionId: region.id,
              name: region.name,
              type: region.type,
            },
            symbol: {
              type: 'simple-marker',
              style: 'diamond',
              color: [6, 182, 212, 0.85], // ARES Cyan
              size: 8,
              outline: {
                color: [255, 255, 255, 0.8],
                width: 1.2,
              },
            } as any,
          });

          regionsGraphicsLayer.add(markerGraphic);
        });

        // 4. Terrain Inspection Reticle Graphics Layer
        const inspectionGraphicsLayer = new GraphicsLayer({
          id: 'mars-inspection-layer-2d',
          title: 'Terrain Inspection Reticle',
        });

        // 5. Phase 07 Measurement Graphics Layer
        const measurementGraphicsLayer = new GraphicsLayer({
          id: 'mars-measurement-layer-2d',
          title: 'Martian Geodesic Measurements',
        });

        // 6. Phase 08 Rover Traverse & Sol Milestones Graphics Layer
        const roverTraverseGraphicsLayer = new GraphicsLayer({
          id: 'mars-rover-traverse-layer-2d',
          title: 'Rover Traverses & Sol Milestones',
        });

        // 7. Phase 09 Surface Route Planning Graphics Layer
        const routesGraphicsLayer = new GraphicsLayer({
          id: 'mars-routes-layer-2d',
          title: 'Surface Route Planning',
        });

        // Assemble Mars 2D Map
        const map = new EsriMap({
          layers: [
            marsSurfaceLayer,
            regionsGraphicsLayer,
            landingGraphicsLayer,
            inspectionGraphicsLayer,
            measurementGraphicsLayer,
            roverTraverseGraphicsLayer,
            routesGraphicsLayer,
          ],
        });

        const activeCenter = regionalCenter ?? {
          longitude: 77.45,
          latitude: 18.38,
          scale: 500000,
        };

        // 2D MapView
        const view = new MapView({
          container: mapDivRef.current,
          map,
          spatialReference: marsSR,
          center: [activeCenter.longitude, activeCenter.latitude],
          scale: activeCenter.scale ?? 500000,
          constraints: {
            minScale: 25000000,
            maxScale: 25000,
          },
          ui: {
            components: [], // Custom ARES HUD controls
          },
        });

        viewRef.current = view;
        viewInstance = view;

        await view.when();

        if (isMounted) {
          setIsMapReady(true);
          if (typeof view.scale === 'number' && !isNaN(view.scale) && view.scale > 0) {
            setTelemetry({
              scale: `1:${Math.round(view.scale).toLocaleString()}`,
            });
          }
        }

        // Auto-switch back to 3D Globe when user zooms out past regional scale (scale >= 12,000,000)
        // and track live scale changes in telemetry
        scaleWatchHandle = reactiveUtils.watch(
          () => view.scale,
          (scale: number) => {
            if (typeof scale === 'number' && !isNaN(scale) && scale > 0) {
              setTelemetry({
                scale: `1:${Math.round(scale).toLocaleString()}`,
              });
            }
            if (
              useAppStore.getState().viewMode === 'REGIONAL_2D' &&
              typeof scale === 'number' &&
              scale >= 12000000
            ) {
              setViewMode('GLOBAL_3D');
            }
          }
        );

        // Live pointer coordinate and elevation telemetry tracking
        view.on('pointer-move', async (event: any) => {
          const mapPoint = event.mapPoint || (view.toMap ? view.toMap({ x: event.x, y: event.y }) : null);
          if (
            mapPoint &&
            typeof mapPoint.latitude === 'number' &&
            typeof mapPoint.longitude === 'number'
          ) {
            const scaleFormatted = view.scale
              ? `1:${Math.round(view.scale).toLocaleString()}`
              : '1:500,000';
            try {
              const elevation = await queryPointElevation(mapPoint.longitude, mapPoint.latitude);
              setTelemetry({
                latitude: parseFloat(mapPoint.latitude.toFixed(4)),
                longitude: parseFloat(mapPoint.longitude.toFixed(4)),
                elevation,
                scale: scaleFormatted,
                crs: 'GCS_Mars_2000 (WKID 104905)',
              });
            } catch {
              setTelemetry({
                latitude: parseFloat(mapPoint.latitude.toFixed(4)),
                longitude: parseFloat(mapPoint.longitude.toFixed(4)),
                scale: scaleFormatted,
                crs: 'GCS_Mars_2000 (WKID 104905)',
              });
            }
          }
        });

        // Single click on Mars surface to inspect terrain or select feature
        view.on('click', async (event: any) => {
          try {
            if (typeof view.hitTest === 'function') {
              const hitResult = await view.hitTest(event);
              const siteHit: any = hitResult?.results?.find(
                (r: any) => 'graphic' in r && ((r as any).graphic?.layer?.id === 'mars-landing-sites-2d' || (r as any).graphic?.attributes?.siteId)
              );
              if (siteHit && siteHit.graphic?.attributes?.siteId) {
                setSelectedLandingSiteId(siteHit.graphic.attributes.siteId);
                return;
              }
              const regionHit: any = hitResult?.results?.find(
                (r: any) => 'graphic' in r && ((r as any).graphic?.layer?.id === 'mars-regions-2d' || (r as any).graphic?.attributes?.regionId)
              );
              if (regionHit && regionHit.graphic?.attributes?.regionId) {
                setSelectedRegionId(regionHit.graphic.attributes.regionId);
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

            // When measurement tool is active, record point and avoid triggering terrain inspection
            if (useAppStore.getState().activeMeasurementTool !== null) {
              useAppStore.getState().addMeasurementPoint({
                lon: Number(mapPoint.longitude.toFixed(4)),
                lat: Number(mapPoint.latitude.toFixed(4)),
              });
              return;
            }

            try {
              const data = await inspectMartianTerrain(mapPoint.longitude, mapPoint.latitude);
              setActiveTerrainInspection(data);
            } catch (err) {
              console.warn('Terrain inspection failed:', err);
            }
          }
        });
      } catch (err: any) {
        console.error('Failed to initialize 2D Mars MapView:', err);
        if (isMounted) {
          setInitNotice('Planetary 2D Map initialization error: ' + (err.message || 'Unknown'));
        }
      }
    }

    initMarsMap();

    return () => {
      isMounted = false;
      if (scaleWatchHandle) {
        try {
          scaleWatchHandle.remove();
        } catch {
          // ignore cleanup errors
        }
      }
      if (viewInstance) {
        viewInstance.destroy();
      }
    };
  }, [setTelemetry, setSelectedLandingSiteId, setSelectedRegionId, setViewMode, setActiveTerrainInspection]);

  return (
    <div
      data-testid="mars-map-view"
      className="relative w-full h-full min-h-screen bg-ares-space overflow-hidden select-none"
    >
      {/* 2D ArcGIS MapView Mount Node */}
      <div
        ref={mapDivRef}
        className="w-full h-full min-h-screen outline-none"
        tabIndex={0}
      />

      {/* 2D Map Navigation Controls */}
      <MapControls
        onResetExtent={handleResetExtent}
        onRotateNorth={handleRotateNorth}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReturnToGlobe={handleReturnToGlobe}
      />

      {/* Top Center: Regional View Indicator Badge */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-slate-900/85 border border-ares-cyan/40 text-[11px] font-mono text-cyan-300 shadow-xl">
          <MapIcon className="w-3.5 h-3.5 text-ares-cyan" />
          <span className="font-semibold tracking-wider uppercase">2D Regional Cartography</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            {selectedRegionId
              ? getRegionById(selectedRegionId)?.name ?? 'Surface Extent'
              : 'Surface Extent'}
          </span>
        </div>
      </div>

      {/* Headless Testing & Fallback State Display */}
      {initNotice && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ares-space/95 backdrop-blur-md p-6 text-center z-10">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-ares-cyan" />
          </div>
          <h2 className="text-sm font-bold font-mono tracking-wider text-slate-100 uppercase">
            2D REGIONAL CARTOGRAPHY VIEW
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1 max-w-md">{initNotice}</p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-slate-400 border border-slate-800 px-3 py-1 rounded bg-slate-950/80">
            <Radio className="w-3 h-3 text-ares-cyan animate-pulse" />
            <span>CRS: GCS_Mars_2000 (WKID 104971 / 104905)</span>
          </div>
        </div>
      )}

      {/* Loading Radar Overlay */}
      {!isMapReady && !initNotice && (
        <div className="absolute bottom-16 right-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-xl bg-slate-900/80 border border-slate-700 text-xs font-mono text-ares-cyan">
          <Radio className="w-3.5 h-3.5 animate-spin" />
          <span>INITIALIZING 2D REGIONAL MAPVIEW...</span>
        </div>
      )}
    </div>
  );
};

export default MarsMapView;
