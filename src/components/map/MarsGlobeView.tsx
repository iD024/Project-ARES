import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import {
  MARS_SERVICE_ENDPOINTS,
  MARS_PLANETARY_SR,
  MARS_DEFAULT_CAMERA,
  MARS_GROUND_COLOR,
} from '../../config/marsLayers.ts';
import { MARS_LANDING_SITES } from '../../config/mars.ts';
import { GlobeControls } from './GlobeControls.tsx';
import { Radio, AlertCircle, Map } from 'lucide-react';

export const MarsGlobeView: React.FC = () => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<any>(null);
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [initNotice, setInitNotice] = useState<string | null>(null);

  const {
    selectedLandingSiteId,
    setSelectedLandingSiteId,
    setRegionalCenter,
    setViewMode,
    setTelemetry,
  } = useAppStore();

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
    currentCamera.position.z *= 0.6;
    viewRef.current.goTo(currentCamera, { duration: 500 });
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!viewRef.current) return;
    const currentCamera = viewRef.current.camera.clone();
    currentCamera.position.z *= 1.4;
    viewRef.current.goTo(currentCamera, { duration: 500 });
  }, []);

  // Listen to selected landing site changes to execute camera fly-to
  useEffect(() => {
    if (!viewRef.current || !selectedLandingSiteId) return;

    const site = MARS_LANDING_SITES.find((s) => s.id === selectedLandingSiteId);
    if (!site) return;

    viewRef.current.goTo(
      {
        target: {
          x: site.longitude,
          y: site.latitude,
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        position: {
          x: site.longitude,
          y: site.latitude - 1.2, // Offset for perspective tilt
          z: 320000, // 320 km regional altitude
          spatialReference: { wkid: MARS_PLANETARY_SR.wkid },
        },
        heading: 0,
        tilt: 45,
      },
      { duration: 2500 }
    );
  }, [selectedLandingSiteId]);

  // Mount ArcGIS SceneView
  useEffect(() => {
    let isMounted = true;
    let viewInstance: any = null;

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
        ] = await Promise.all([
          import('@arcgis/core/Map'),
          import('@arcgis/core/views/SceneView'),
          import('@arcgis/core/geometry/SpatialReference'),
          import('@arcgis/core/layers/TileLayer'),
          import('@arcgis/core/layers/ElevationLayer'),
          import('@arcgis/core/layers/GraphicsLayer'),
          import('@arcgis/core/Graphic'),
          import('@arcgis/core/geometry/Point'),
        ]);

        if (!isMounted || !mapDivRef.current) return;

        const marsSR = new SpatialReference({ wkid: MARS_PLANETARY_SR.wkid });

        // 1. Mars MDIM Surface Imagery Layer
        const marsSurfaceLayer = new TileLayer({
          id: 'mars-mdim-basemap',
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

        // Mars Planetary Map
        const map = new EsriMap({
          layers: [marsSurfaceLayer, landingGraphicsLayer],
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
        }

        // Live pointer coordinate telemetry tracking
        view.on('pointer-move', (event: any) => {
          const mapPoint = view.toMap({ x: event.x, y: event.y });
          if (
            mapPoint &&
            typeof mapPoint.latitude === 'number' &&
            typeof mapPoint.longitude === 'number'
          ) {
            const altitude = view.camera?.position?.z
              ? Math.round(view.camera.position.z / 1000)
              : 450;
            setTelemetry({
              latitude: Number(mapPoint.latitude.toFixed(2)),
              longitude: Number(mapPoint.longitude.toFixed(2)),
              altitudeKm: altitude,
            });
          }
        });

        // Click on 3D pin to select site
        view.on('click', async (event: any) => {
          try {
            const hitResult = await view.hitTest(event);
            const siteHit: any = hitResult.results?.find(
              (r: any) => 'graphic' in r && (r as any).graphic?.layer?.id === 'mars-landing-sites'
            );
            if (siteHit && siteHit.graphic?.attributes?.siteId) {
              setSelectedLandingSiteId(siteHit.graphic.attributes.siteId);
            }
          } catch {
            // ignore hit-test errors
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
      if (viewInstance) {
        try {
          viewInstance.destroy();
        } catch {
          // ignore cleanup errors during unmount
        }
      }
    };
  }, [setTelemetry]);

  return (
    <div className="relative w-full h-full min-h-screen bg-ares-space overflow-hidden select-none">
      {/* Primary ArcGIS 3D Canvas Viewport */}
      <div
        ref={mapDivRef}
        data-testid="ares-globe-container"
        className="absolute inset-0 w-full h-full"
      />

      {/* Floating Tactical Camera Controls (Zoom, Tilt, North, Reset) */}
      <GlobeControls
        onResetView={handleResetView}
        onRotateNorth={handleRotateNorth}
        onToggleTilt={handleToggleTilt}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      {/* Engine Status Notification */}
      <div className="absolute top-20 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 shadow-xl font-mono text-[11px] text-slate-300">
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
        <div className="absolute bottom-20 left-4 z-10 flex items-center gap-3 px-4 py-2.5 rounded-xl backdrop-blur-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl font-mono text-xs text-slate-200">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">TARGET LANDING SITE</span>
            <span className="font-bold text-slate-100">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-ares-rust to-orange-600 text-white shadow-md shadow-orange-950/40 hover:from-orange-600 hover:to-orange-500 transition-all cursor-pointer"
          >
            <Map className="w-3.5 h-3.5" />
            <span>EXPLORE 2D &rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MarsGlobeView;
