import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Car, RefreshCw, ShieldAlert, TrafficCone } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TrafficReading {
  zone_id: string;
  avg_speed_kmh: number;
  congestion_index: number;
  active_signals: number;
  smart_signals: number;
  timestamp: string;
}

export const TrafficPage: React.FC = () => {
  const [readings, setReadings] = useState<TrafficReading[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulatedIncident, setSimulatedIncident] = useState(false);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/traffic/latest');
      const sumRes = await fetch('/api/v1/traffic/summary');
      if (res.ok && sumRes.ok) {
        let data = await res.json();
        let sumData = await sumRes.json();
        if (simulatedIncident) {
          data = data.map((d: TrafficReading) => {
            if (d.zone_id.includes("Downtown")) {
              return { ...d, congestion_index: 98, avg_speed_kmh: 8.5 };
            }
            return d;
          });
          sumData = {
            ...sumData,
            citywide_avg_speed: 34.2,
            active_incidents: sumData.active_incidents + 1
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
    fetchTrafficData();
  }, [simulatedIncident]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Car className="text-indigo-400" /> Traffic Operations Control
          </h2>
          <p className="text-sm text-gray-400">Monitoring intersection flows, average speeds, and coordinating smart signal loops.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSimulatedIncident(!simulatedIncident)}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition border ${
              simulatedIncident 
                ? 'bg-red-500/20 border-red-500 text-red-400' 
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <TrafficCone className="w-4 h-4 text-amber-500" />
            {simulatedIncident ? "Clear Downtown Accident Simulation" : "Simulate Downtown Accident"}
          </button>
          <button onClick={fetchTrafficData} className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Avg Traffic Speed">
          <div className="text-center py-4">
            <span className="text-5xl font-extrabold text-white">{summary?.citywide_avg_speed || 42} km/h</span>
            <p className="text-xs text-gray-400 mt-2">Optimal Design Speed: 50 km/h</p>
          </div>
        </Card>

        <Card title="Traffic Incidents">
          <div className="text-center py-4">
            <span className={`text-5xl font-extrabold ${summary?.active_incidents > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {summary?.active_incidents || 0}
            </span>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-gray-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Rescue Dispatchers Standby</span>
            </div>
          </div>
        </Card>

        <Card title="Peak Sector Congestion">
          <div className="text-center py-4">
            <span className="text-3xl font-extrabold text-white truncate max-w-[200px] block mx-auto">
              {summary?.peak_congestion_zone?.split(' ')[0] || "Downtown"}
            </span>
            <p className="text-xs text-red-400 mt-2">Critical Load Threshold Detected</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Congestion Level per Sector (%)">
          <div className="h-64 mt-2">
            {readings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={readings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="zone_id" tickFormatter={(v) => v.split(' ')[0]} stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                  <Bar dataKey="congestion_index" name="Congestion" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">Loading charts...</div>
            )}
          </div>
        </Card>

        <Card title="Intersection Intelligent Controls">
          <div className="space-y-4">
            {readings.map((r) => {
              const efficiency = Math.round((r.smart_signals / r.active_signals) * 100);
              return (
                <div key={r.zone_id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-white">{r.zone_id}</p>
                    <p className="text-xs text-gray-400">{r.smart_signals} of {r.active_signals} Intersections optimized</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    {efficiency}% Dynamic
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
