import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { ScientificIntelTab } from '../../types/hud.ts';
import {
  getAllDatasetDossiers,
  getAllGeologicalEpochs,
  getTerrainPhysicsDossier,
  getRouteTraversalScienceDossier,
} from '../../services/data/scientificIntelligenceService.ts';
import { Badge } from '../ui/Badge.tsx';
import {
  Atom,
  Layers,
  Mountain,
  Navigation,
  BookOpen,
  Search,
  X,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { clsx } from 'clsx';

export const ScientificIntelDrawer: React.FC = () => {
  const {
    activeDrawer,
    setActiveDrawer,
    activeIntelTab,
    setActiveIntelTab,
    intelFocusedDatasetId,
    intelFocusedGeologyPeriod,
    intelFocusedQuadCode,
    isHudVisible,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [selectedEpoch, setSelectedEpoch] = useState<string | null>(intelFocusedGeologyPeriod);

  if (!isHudVisible || activeDrawer !== 'intel') return null;

  const datasetDossiers = getAllDatasetDossiers();
  const epochs = getAllGeologicalEpochs();
  const terrainPhysics = getTerrainPhysicsDossier();
  const routeScience = getRouteTraversalScienceDossier();

  // Filter datasets by search query
  const filteredDatasets = datasetDossiers.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.mission.toLowerCase().includes(q) ||
      d.sensor.toLowerCase().includes(q) ||
      d.classification.toLowerCase().includes(q) ||
      d.citation.toLowerCase().includes(q)
    );
  });

  const handleCopyCitation = (id: string, citation: string) => {
    navigator.clipboard
      .writeText(citation)
      .then(() => {
        setCopiedCitationId(id);
        setTimeout(() => setCopiedCitationId(null), 2000);
      })
      .catch(() => {
        // Fallback silently if clipboard permissions are restricted in iframe
      });
  };

  const tabs: Array<{ id: ScientificIntelTab; label: string; icon: React.ReactNode }> = [
    { id: 'layers', label: 'Layers', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
    { id: 'geology', label: 'Geology', icon: <BookOpen className="w-4 h-4 text-amber-400" /> },
    { id: 'terrain', label: 'Terrain', icon: <Mountain className="w-4 h-4 text-emerald-400" /> },
    { id: 'routes', label: 'Routes', icon: <Navigation className="w-4 h-4 text-rose-400" /> },
  ];

  return (
    <aside
      data-testid="scientific-intel-drawer"
      className="fixed top-0 right-0 z-30 w-full sm:w-[500px] h-[100dvh] bg-[#080A0F]/95 backdrop-blur-2xl border-l border-white/10 text-white shadow-2xl flex flex-col font-sans select-none overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-950/40 shrink-0">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-wider text-white font-mono uppercase">
                SCIENTIFIC INTELLIGENCE
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                PDS Verified
              </span>
            </div>
            <p className="text-xs text-white/60 font-medium">
              Traceable Planetary Science, Stratigraphy & Physics
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveDrawer(null)}
          aria-label="Close Scientific Intelligence"
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-white/10 bg-black/40 font-mono text-xs">
        {tabs.map((t) => {
          const isActive = activeIntelTab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIntelTab(t.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold tracking-wide transition-all cursor-pointer border',
                isActive
                  ? 'bg-white/15 text-white border-white/30 shadow-md'
                  : 'text-white/50 hover:text-white/80 bg-transparent border-transparent hover:bg-white/5'
              )}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm">
        {/* TAB 1: LAYERS & PROVENANCE */}
        {activeIntelTab === 'layers' && (
          <div role="tabpanel" className="space-y-4">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search datasets, missions, sensors, citations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all font-mono"
              />
            </div>

            {/* Integrity Policy Notice */}
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-purple-200 uppercase font-mono tracking-wide">
                  DATA PROVENANCE & CALIBRATION
                </span>
                <p className="text-white/70 mt-1 leading-relaxed">
                  All layers strictly ingest real, verifiable datasets from NASA, USGS Astrogeology, ESA, and PDS.
                  Data products are explicitly labeled <strong>Observed</strong>, <strong>Derived</strong>, or <strong>Modeled</strong>.
                </p>
              </div>
            </div>

            {/* Datasets List */}
            <div className="space-y-4">
              {filteredDatasets.map((d) => {
                const isFocused = intelFocusedDatasetId === d.id;
                const isCopied = copiedCitationId === d.id;

                return (
                  <div
                    key={d.id}
                    data-testid={`dataset-dossier-${d.id}`}
                    className={clsx(
                      'p-4 rounded-xl border transition-all text-xs space-y-3',
                      isFocused
                        ? 'bg-purple-950/30 border-purple-400 shadow-lg shadow-purple-950/50 ring-1 ring-purple-400'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-white font-mono">{d.name}</h3>
                        <p className="text-white/60 text-[11px] font-mono mt-0.5">{d.mission} • {d.provider}</p>
                      </div>
                      <Badge variant={d.classification}>{d.classification}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/[0.02] p-2.5 rounded-lg border border-white/5 font-mono">
                      <div>
                        <span className="text-white/40">RESOLUTION:</span>
                        <p className="text-white font-semibold">{d.resolution}</p>
                      </div>
                      <div>
                        <span className="text-white/40">COVERAGE:</span>
                        <p className="text-white font-semibold">{d.coverage}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-white/40">SENSOR & WAVELENGTH:</span>
                        <p className="text-white font-semibold">{d.sensor} ({d.wavelength})</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">
                        PHYSICAL OPERATING PRINCIPLE:
                      </span>
                      <p className="text-white/80 leading-relaxed mt-1 text-[11px]">
                        {d.physicalPrinciple}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
                        <span>PDS CITATION:</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCitation(d.id, d.citation)}
                          aria-label={`Copy Citation for ${d.name}`}
                          className="flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Citation</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-white/70 italic font-mono">{d.citation}</p>
                    </div>

                    {d.caveats && (
                      <div className="flex items-start gap-1.5 text-[11px] text-amber-300/80">
                        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span>{d.caveats}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredDatasets.length === 0 && (
                <div className="py-8 text-center text-white/40 font-mono text-xs">
                  No datasets matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GEOLOGICAL STRATIGRAPHY */}
        {activeIntelTab === 'geology' && (
          <div role="tabpanel" className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Chronostratigraphic Epochs of Mars
              </h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Martian history is divided into three primary chronostratigraphic systems based on impact crater densities and surface weathering signatures.
              </p>
            </div>

            {/* Focused Quad Alert if deep-linked */}
            {intelFocusedQuadCode && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs font-mono">
                  <span className="font-bold text-amber-200 uppercase tracking-wide">
                    TARGET REGION: {intelFocusedQuadCode}
                  </span>
                  <p className="text-white/80 mt-1">
                    Deep inspection of geological units associated with USGS quadrangle {intelFocusedQuadCode}.
                  </p>
                </div>
              </div>
            )}

            {/* Epoch Selector Cards */}
            <div className="space-y-4">
              {epochs.map((ep) => {
                const isSelected = (selectedEpoch || intelFocusedGeologyPeriod)?.toLowerCase() === ep.epoch.toLowerCase();

                return (
                  <div
                    key={ep.epoch}
                    onClick={() => setSelectedEpoch(ep.epoch)}
                    className={clsx(
                      'p-4 rounded-xl border transition-all text-xs space-y-3 cursor-pointer',
                      isSelected
                        ? 'bg-amber-950/20 border-amber-400 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: ep.color }}
                        />
                        <h4 className="font-bold text-sm text-white font-mono">{ep.epoch} Period</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white/80 border border-white/10">
                        {ep.ageRange}
                      </span>
                    </div>

                    <p className="text-white/80 leading-relaxed text-xs">
                      {ep.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-white/10 text-[11px] font-mono">
                      <div>
                        <span className="text-white/40">DOMINANT PROCESSES:</span>
                        <p className="text-white font-medium">{ep.dominantProcesses}</p>
                      </div>
                      <div>
                        <span className="text-white/40">DIAGNOSTIC MINERALS:</span>
                        <p className="text-amber-300 font-medium">{ep.keyMinerals}</p>
                      </div>
                      <div>
                        <span className="text-white/40">CRATER DENSITY:</span>
                        <p className="text-white/70">{ep.craterDensity}</p>
                      </div>
                      <div>
                        <span className="text-white/40">KEY GEOLOGICAL LOCALES:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {ep.representativeRegions.map((region) => (
                            <span
                              key={region}
                              className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/90"
                            >
                              {region}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: TERRAIN PHYSICS & DEM */}
        {activeIntelTab === 'terrain' && (
          <div role="tabpanel" className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Laser Altimetry & Terrain Physics
              </h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Elevation and slope models are derived through planetary laser altimetry and stereo photogrammetric parallax across Mars 2000 geodetic datum.
              </p>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-rose-200 uppercase font-mono tracking-wide">
                  REGIONAL SCALE NOTICE
                </span>
                <p className="text-white/80 mt-1 leading-relaxed">
                  {terrainPhysics.disclaimer}
                </p>
              </div>
            </div>

            {/* Sensor Specifications Grid */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 text-xs font-mono">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wide">
                ALTIMETRY SPECIFICATIONS
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-white/40">PRIMARY SENSORS:</span>
                  <p className="text-white font-semibold">{terrainPhysics.primarySensors}</p>
                </div>
                <div>
                  <span className="text-white/40">WAVELENGTH:</span>
                  <p className="text-white font-semibold">{terrainPhysics.laserWavelength}</p>
                </div>
                <div>
                  <span className="text-white/40">VERTICAL ACCURACY:</span>
                  <p className="text-white font-semibold">{terrainPhysics.verticalPrecision}</p>
                </div>
                <div>
                  <span className="text-white/40">HORIZONTAL RESOLUTION:</span>
                  <p className="text-white font-semibold">{terrainPhysics.horizontalResolution}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-white/40">SLOPE DERIVATION ALGORITHM:</span>
                  <p className="text-white font-semibold">{terrainPhysics.slopeAlgorithm}</p>
                </div>
              </div>
            </div>

            {/* Slope Gradient Classifications Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide">
                Regional Slope Gradient Categories & Mobility Envelope
              </h4>
              <div className="space-y-2.5">
                {terrainPhysics.slopeCategories.map((s) => (
                  <div
                    key={s.category}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-emerald-300">{s.category} ({s.range})</span>
                    </div>
                    <p className="text-white/70 text-[11px] leading-relaxed">{s.description}</p>
                    <p className="text-amber-400/90 text-[11px] font-mono pt-1">
                      <strong>Mobility Risk:</strong> {s.risk}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ROUTE TRAVERSAL SCIENCE */}
        {activeIntelTab === 'routes' && (
          <div role="tabpanel" className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                A* Cost Formulation & Traversability Physics
              </h3>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Surface paths are evaluated across a discrete geodetic lattice on the Mars 2000 ellipsoid using multi-factor terrain penalties.
              </p>
            </div>

            {/* Cost Equation Box */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono">
              <span className="text-rose-400 font-bold uppercase tracking-wide">
                A* EDGE TRAVERSAL COST EQUATION:
              </span>
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-emerald-300 text-xs overflow-x-auto">
                <code>{routeScience.costFormulaLatex}</code>
              </div>
              <p className="text-white/70 text-[11px] leading-relaxed pt-1">
                {routeScience.costExplanation}
              </p>
            </div>

            {/* Vehicle Capability Profiles */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide">
                Vehicle Mobility Constraints
              </h4>
              <div className="space-y-3">
                {routeScience.vehicleProfiles.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <h5 className="font-bold text-white text-xs">{v.name}</h5>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30">
                        Max {v.maxSlopeDegrees}° Slope
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-mono text-white/60">
                      <span>SPEED: {v.speedMetersPerSol} m/sol</span>
                    </div>
                    <p className="text-white/70 text-[11px] leading-relaxed">
                      {v.engineeringCharacteristics}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Route Rationale */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wide">
                Candidate Generation Trade-offs
              </h4>
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
                <span className="font-bold text-emerald-300 font-mono">🟢 SAFEST ROUTE:</span>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  {routeScience.candidateRationale.safest}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1">
                <span className="font-bold text-cyan-300 font-mono">🌐 BALANCED RECONNAISSANCE:</span>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  {routeScience.candidateRationale.balanced}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
                <span className="font-bold text-amber-300 font-mono">🟡 DIRECT DISTANCE:</span>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  {routeScience.candidateRationale.direct}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ScientificIntelDrawer;
