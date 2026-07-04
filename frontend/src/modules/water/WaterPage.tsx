import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Droplet, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';


interface WaterReading {
  zone_id: string;
  flow_rate_mld: number;
  pressure_psi: number;
  ph_level: number;
  turbidity_ntu: number;
  timestamp: string;
}

export const WaterPage: React.FC = () => {
  const [readings, setReadings] = useState<WaterReading[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leakSimulated, setLeakSimulated] = useState(false);

  const fetchWaterData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/water/latest');
      const sumRes = await fetch('/api/v1/water/summary');
      if (res.ok && sumRes.ok) {
        let data = await res.json();
        let sumData = await sumRes.json();
        if (leakSimulated) {
          data = data.map((d: WaterReading) => {
            if (d.zone_id.includes("Industrial")) {
              return { ...d, pressure_psi: 24.5, flow_rate_mld: d.flow_rate_mld * 1.5 };
            }
            return d;
          });
          sumData = {
            ...sumData,
            leakages_detected: 1,
            quality_compliance: 94.2
          };
        }
        setReadings(data);
        setSummary(sumData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, [leakSimulated]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Droplet className="text-blue-400" /> Water Supply & Quality
          </h2>
          <p className="text-sm text-gray-400">Monitoring grid pressures, volumetric flow rates, and chemical safety standards.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLeakSimulated(!leakSimulated)}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition border ${
              leakSimulated 
                ? 'bg-red-500/20 border-red-500 text-red-400' 
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            {leakSimulated ? "Reset Industrial Leakage Simulation" : "Simulate Industrial Main Leakage"}
          </button>
          <button onClick={fetchWaterData} className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="City Flow Rate">
          <div className="text-center py-4">
            <span className="text-4xl font-extrabold text-white">{summary?.total_flow_rate_mld || 14.2} MLD</span>
            <p className="text-xs text-gray-400 mt-2">Million Liters per Day</p>
          </div>
        </Card>

        <Card title="Mean Pressure">
          <div className="text-center py-4">
            <span className="text-4xl font-extrabold text-white">{summary?.avg_pressure_psi || 52} PSI</span>
            <p className="text-xs text-gray-400 mt-2">Target operating pressure: 50 PSI</p>
          </div>
        </Card>

        <Card title="Leaks Logged">
          <div className="text-center py-4">
            <span className={`text-4xl font-extrabold ${summary?.leakages_detected > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {summary?.leakages_detected || 0}
            </span>
            <p className="text-xs text-gray-400 mt-2">Acoustic Sensors Active</p>
          </div>
        </Card>

        <Card title="Chemical Compliance">
          <div className="text-center py-4">
            <span className="text-4xl font-extrabold text-emerald-400">{summary?.quality_compliance || 99.8}%</span>
            <p className="text-xs text-gray-400 mt-2">EPA Quality Index standards</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Water Quality Standards">
          <div className="space-y-4">
            {readings.map((r) => {
              const compliance = r.ph_level >= 7.0 && r.ph_level <= 7.6;
              return (
                <div key={r.zone_id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div>
                    <span className="text-sm font-semibold text-white">{r.zone_id}</span>
                    <p className="text-xs text-gray-400">Turbidity: {r.turbidity_ntu} NTU | pH Level: {r.ph_level}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {compliance ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        <ShieldCheck className="w-3.5 h-3.5" /> Optimal
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        <AlertTriangle className="w-3.5 h-3.5" /> Out of Spec
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Flow Rate & Line Pressure">
          <div className="space-y-4">
            {readings.map((r) => (
              <div key={r.zone_id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300">{r.zone_id}</span>
                  <span className="text-white">{r.flow_rate_mld} MLD | {r.pressure_psi} PSI</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      r.pressure_psi < 30 ? 'bg-red-500' : 'bg-cyan-500'
                    }`} 
                    style={{ width: `${(r.flow_rate_mld / 8) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
