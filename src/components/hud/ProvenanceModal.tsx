import React from 'react';
import { Modal } from '../ui/Modal.tsx';
import { Badge } from '../ui/Badge.tsx';
import { ShieldCheck, Database, Info } from 'lucide-react';

export interface ProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProvenanceModal: React.FC<ProvenanceModalProps> = ({ isOpen, onClose }) => {
  const datasets = [
    {
      id: 'mars-viking-mdim21',
      name: 'Viking MDIM 2.1 Color Mosaic',
      mission: 'Viking Orbiters 1 & 2',
      provider: 'NASA / USGS Astrogeology',
      classification: 'OBSERVED' as const,
      resolution: '232 m/px',
      coverage: 'Global (100%)',
      protocol: 'NASA Mars Trek WMTS',
      description: 'Orthorectified digital image mosaic combining clear, red, and violet filters for planetary color accuracy.',
    },
    {
      id: 'mars-mola-clrshade',
      name: 'MOLA Color Shaded Relief',
      mission: 'Mars Global Surveyor (MGS)',
      provider: 'NASA / GSFC Altimeter Team',
      classification: 'DERIVED' as const,
      resolution: '463 m/px (128 px/deg)',
      coverage: 'Global (100%)',
      protocol: 'NASA Mars Trek WMTS',
      description: 'Gridded planetary digital elevation model colorized with a hypsometric elevation palette.',
    },
    {
      id: 'mars-hrsc-mola-blend',
      name: 'HRSC–MOLA Blended DEM Shaded Relief',
      mission: 'Mars Express & MGS',
      provider: 'ESA / DLR / USGS Astrogeology',
      classification: 'DERIVED' as const,
      resolution: '200 m/px',
      coverage: 'Global (100%)',
      protocol: 'USGS Planetary WMS',
      description: 'Controlled blend merging High Resolution Stereo Camera stereogrammetry with MOLA altimetry.',
    },
    {
      id: 'mars-themis-ir-day',
      name: 'THEMIS IR Day 100m Global Mosaic',
      mission: '2001 Mars Odyssey',
      provider: 'Arizona State University / NASA',
      classification: 'OBSERVED' as const,
      resolution: '100 m/px',
      coverage: 'Global (>95%)',
      protocol: 'USGS Planetary WMS',
      description: 'Daytime thermal infrared surface emissions highlighting rock abundance and thermal inertia variations.',
    },
    {
      id: 'mars-geologic-quads',
      name: 'USGS Geologic Map of Mars',
      mission: 'Planetary Geologic Mapping Program',
      provider: 'USGS Astrogeology Science Center',
      classification: 'DERIVED' as const,
      resolution: '1:5,000,000 Scale',
      coverage: 'Global Quad Charts',
      protocol: 'USGS Planetary WMS',
      description: 'Stratigraphic geologic mapping synthesizing Viking, MGS, Odyssey, and MRO remote sensing data.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ARES Planetary Scientific Data Catalog"
      subtitle="Traceable Scientific Datasets, Calibration & Planetary Geodesy"
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col gap-4 text-xs font-mono text-slate-300">
        {/* Integrity Callout */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="font-sans text-xs">
            <h4 className="font-semibold text-slate-100 font-mono">SCIENTIFIC DATA INTEGRITY POLICY</h4>
            <p className="text-slate-400 mt-1 leading-relaxed">
              ARES strictly ingests verified, traceable planetary datasets from NASA, USGS, ESA, and the Planetary Data System (PDS).
              All layers are explicitly labeled by classification: <strong>Observed</strong> (raw or calibrated instrument frames),
              <strong> Derived</strong> (elevation models and mosaic hillshades), or <strong>Modeled</strong>.
              Fabrication of rover positions or measurements is strictly prohibited.
            </p>
          </div>
        </div>

        {/* Datasets Table */}
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-[11px] text-slate-400 border-b border-slate-800">
                  <th className="py-2.5 px-3 font-semibold">Dataset</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Provider</th>
                  <th className="py-2.5 px-3 font-semibold">Resolution</th>
                  <th className="py-2.5 px-3 font-semibold">Access Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-[11px]">
                {datasets.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-100">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{d.mission}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant={d.classification}>{d.classification}</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{d.provider}</td>
                    <td className="py-2.5 px-3 text-ares-cyan font-bold">{d.resolution}</td>
                    <td className="py-2.5 px-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Database className="w-3 h-3 text-ares-rust" />
                        <span>{d.protocol}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geodetic Reference Box */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-ares-cyan" />
            <span>Datum: <strong>D_Mars_2000</strong> | Spheroid Radius: <strong>3,396,190.0 m</strong> (WKID 104905)</span>
          </div>
          <span className="text-slate-500 font-mono">IAU 2000 Standard</span>
        </div>
      </div>
    </Modal>
  );
};
