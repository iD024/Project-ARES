import React, { useEffect, useRef, useState } from 'react';
import { MARS_SPATIAL_REFERENCE, MARS_EQUATORIAL_RADIUS_METERS } from '../config/mars.ts';
import { Compass, Globe, Info, Radio } from 'lucide-react';

interface MarsHarnessProps {
  onReady?: () => void;
}

export const MarsHarness: React.FC<MarsHarnessProps> = ({ onReady }) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [initStatus, setInitStatus] = useState<'INITIALIZING' | 'READY' | 'HEADLESS_FALLBACK'>('INITIALIZING');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let viewInstance: any = null;

    async function initMarsScene() {
      if (!mapDivRef.current) return;

      // Detect WebGL capability safely without triggering jsdom canvas getContext errors
      const checkWebGL = (): boolean => {
        try {
          if (typeof window === 'undefined' || typeof window.WebGLRenderingContext === 'undefined') {
            return false;
          }
          const canvas = document.createElement('canvas');
          return Boolean(
            canvas.getContext('webgl2') ||
            canvas.getContext('webgl') ||
            (canvas as any).getContext('experimental-webgl')
          );
        } catch {
          return false;
        }
      };

      const hasWebGL = checkWebGL();

      if (!hasWebGL) {
        if (isMounted) {
          setInitStatus('HEADLESS_FALLBACK');
          onReady?.();
        }
        return;
      }

      try {
        // Dynamically import ArcGIS modules to preserve bundle isolation
        const [
          { default: EsriMap },
          { default: SceneView },
          { default: SpatialReference }
        ] = await Promise.all([
          import('@arcgis/core/Map'),
          import('@arcgis/core/views/SceneView'),
          import('@arcgis/core/geometry/SpatialReference'),
        ]);

        if (!isMounted || !mapDivRef.current) return;

        const marsSpatialRef = new SpatialReference({
          wkid: MARS_SPATIAL_REFERENCE.wkid,
        });

        // Mars planetary map instance
        const map = new EsriMap({
          basemap: undefined, // Custom Mars planetary layers loaded in Phase 02
          ground: 'world-elevation', // Default or custom LERC Mars elevation
        });

        // 3D SceneView initialized on Mars 2000 datum
        const view = new SceneView({
          container: mapDivRef.current,
          map: map,
          spatialReference: marsSpatialRef,
          viewingMode: 'global',
          environment: {
            background: {
              type: 'color',
              color: [5, 7, 13, 1], // Deep space black
            },
            starsEnabled: true,
            atmosphereEnabled: true,
          },
          camera: {
            position: {
              x: 0,
              y: 0,
              z: 15000000, // 15,000 km altitude over Mars
              spatialReference: marsSpatialRef,
            },
            heading: 0,
            tilt: 0,
          },
          ui: {
            components: ['compass', 'zoom'],
          },
        });

        viewInstance = view;

        await view.when();
        if (isMounted) {
          setInitStatus('READY');
          onReady?.();
        }
      } catch (err: any) {
        console.warn('ArcGIS SceneView initialization notice:', err);
        if (isMounted) {
          setInitStatus('HEADLESS_FALLBACK');
          setErrorMessage(err?.message || 'WebGL acceleration not detected in current environment.');
          onReady?.();
        }
      }
    }

    initMarsScene();

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
  }, [onReady]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-ares-space">
      {/* Primary Map Container */}
      <div
        ref={mapDivRef}
        data-testid="ares-map-container"
        className="absolute inset-0 w-full h-full"
      />

      {/* Floating HUD: Geodetic & Telemetry Pill */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg backdrop-blur-md bg-slate-900/85 border border-slate-700/60 shadow-xl text-xs font-mono text-slate-200">
          <div className="flex items-center gap-2 text-ares-rust">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase">ARES Engine</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-ares-cyan" />
            <span>CRS: <strong className="text-ares-cyan">{MARS_SPATIAL_REFERENCE.name}</strong> (WKID {MARS_SPATIAL_REFERENCE.wkid})</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Compass className="w-3.5 h-3.5 text-ares-amber" />
            <span>Req: <strong>{(MARS_EQUATORIAL_RADIUS_METERS / 1000).toLocaleString('en-US', { minimumFractionDigits: 2 })} km</strong></span>
          </div>
        </div>

        {/* Phase 00 Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md backdrop-blur-md bg-slate-900/75 border border-slate-800 text-[11px] font-mono text-slate-400">
          <Info className="w-3 h-3 text-slate-400" />
          <span>Status: </span>
          <span className={`font-semibold ${initStatus === 'READY' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {initStatus === 'READY' ? '3D MARS GLOBE ACTIVE' : 'PHASE 00 HARNESS ONLINE'}
          </span>
          {errorMessage && (
            <span className="text-slate-500 text-[10px]">({errorMessage})</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarsHarness;
