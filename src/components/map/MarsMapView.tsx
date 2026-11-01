import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import {
  MARS_SERVICE_ENDPOINTS,
  MARS_PLANETARY_SR,
} from '../../config/marsLayers.ts';
import { MARS_LANDING_SITES } from '../../config/mars.ts';
import { MARS_REGIONS, getRegionById } from '../../config/marsRegions.ts';
import { MapControls } from './MapControls.tsx';
import { Radio, AlertCircle, Map as MapIcon } from 'lucide-react';

export const MarsMapView: React.FC = () => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [initNotice, setInitNotice] = useState<string | null>(null);

  const {
    regionalCenter,
    selectedRegionId,
    setTelemetry,
    setViewMode,
  } = useAppStore();

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

  // Mount ArcGIS MapView
  useEffect(() => {
    let isMounted = true;
    let viewInstance: any = null;

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
        ] = await Promise.all([
          import('@arcgis/core/Map'),
          import('@arcgis/core/views/MapView'),
          import('@arcgis/core/geometry/SpatialReference'),
          import('@arcgis/core/layers/TileLayer'),
          import('@arcgis/core/layers/GraphicsLayer'),
          import('@arcgis/core/Graphic'),
          import('@arcgis/core/geometry/Point'),
        ]);

        if (!isMounted || !mapDivRef.current) return;

        const marsSR = new SpatialReference({ wkid: MARS_PLANETARY_SR.wkid });

        // 1. Mars MDIM 2.1 Color Basemap
        const marsSurfaceLayer = new TileLayer({
          id: 'mars-mdim-basemap-2d',
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

        // Assemble Mars 2D Map
        const map = new EsriMap({
          layers: [marsSurfaceLayer, regionsGraphicsLayer, landingGraphicsLayer],
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
          ui: {
            components: [], // Custom ARES HUD controls
          },
        });

        viewRef.current = view;
        viewInstance = view;

        await view.when();

        if (isMounted) {
          setIsMapReady(true);
        }

        // Live pointer coordinate telemetry tracking
        view.on('pointer-move', (event: any) => {
          const mapPoint = view.toMap({ x: event.x, y: event.y });
          if (
            mapPoint &&
            typeof mapPoint.latitude === 'number' &&
            typeof mapPoint.longitude === 'number'
          ) {
            const scaleFormatted = view.scale
              ? `1:${Math.round(view.scale).toLocaleString()}`
              : '1:500,000';

            setTelemetry({
              latitude: parseFloat(mapPoint.latitude.toFixed(4)),
              longitude: parseFloat(mapPoint.longitude.toFixed(4)),
              scale: scaleFormatted,
              crs: 'GCS_Mars_2000 (WKID 104905)',
            });
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
      if (viewInstance) {
        viewInstance.destroy();
      }
    };
  }, [setTelemetry]);

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
