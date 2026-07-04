import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Zap, BatteryCharging, RefreshCw, Sparkles } from 'lucide-react';

interface GridReading {
  zone_id: string;
  demand_gw: number;
  capacity_gw: number;
  renewable_percentage: number;
  status: string;
  timestamp: string;
}

export const ElectricityPage: React.FC = () => {
  const [readings, setReadings] = useState<GridReading[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulatedLoad, setSimulatedLoad] = useState(false);

  const fetchGridData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/electricity/latest');
      const sumRes = await fetch('/api/v1/electricity/summary');
      if (res.ok && sumRes.ok) {
        let data = await res.json();
        let sumData = await sumRes.json();
        if (simulatedLoad) {
          data = data.map((d: GridReading) => {
            if (d.zone_id.includes("Commercial") || d.zone_id.includes("Downtown")) {
              const newDemand = round(d.demand_gw + 1.2, 2);
              return { ...d, demand_gw: newDemand, status: newDemand > d.capacity_gw ? "Overload" : "High Load" };
            }
            return d;
          });
          sumData = {
            ...sumData,
            total_demand_gw: round(sumData.total_demand_gw + 2.4, 2),
            grid_status: "Critical Load"
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

  const round = (num: number, decimalPlaces: number) => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
  };

  useEffect(() => {
    fetchGridData();
  }, [simulatedLoad]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="text-yellow-400" /> Power Grid Command
          </h2>
          <p className="text-sm text-gray-400">Balancing power supply, demand, and renewable integration in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSimulatedLoad(!simulatedLoad)}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition border ${
              simulatedLoad 
                ? 'bg-red-500/20 border-red-500 text-red-400' 
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            {simulatedLoad ? "Deactivate Grid Stress Test" : "Trigger Grid Stress Test"}
          </button>
          <button onClick={fetchGridData} className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Grid Load">
          <div className="text-center py-4">
            <span className="text-5xl font-extrabold text-white">{summary?.total_demand_gw || 8.4} GW</span>
            <p className="text-xs text-gray-400 mt-2">Nominal Capacity: 15.0 GW</p>
          </div>
        </Card>

        <Card title="Renewable Penetration">
          <div className="text-center py-4">
            <span className="text-5xl font-extrabold text-emerald-400">{summary?.avg_renewable_percentage || 32}%</span>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-emerald-400">
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>Grid Decarbonization Active</span>
            </div>
          </div>
        </Card>

        <Card title="Grid Status">
          <div className="text-center py-4">
            <span className={`text-4xl font-extrabold ${summary?.grid_status === 'Critical Load' ? 'text-red-400' : 'text-emerald-400'}`}>
              {summary?.grid_status || "Nominal"}
            </span>
            <p className="text-xs text-gray-400 mt-2">{summary?.active_outages || 0} Active Outages Reported</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Telemetry per Sector">
          <div className="space-y-4">
            {readings.map((r) => {
              const loadPercent = Math.min(100, Math.round((r.demand_gw / r.capacity_gw) * 100));
              return (
                <div key={r.zone_id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300">{r.zone_id}</span>
                    <span className="text-white">{r.demand_gw} / {r.capacity_gw} GW ({loadPercent}%)</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        loadPercent > 90 ? 'bg-red-500' : loadPercent > 70 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`} 
                      style={{ width: `${loadPercent}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Energy Mix Distribution">
          <div className="space-y-4">
            {readings.map((r) => (
              <div key={r.zone_id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300">{r.zone_id}</span>
                  <span className="text-emerald-400">{r.renewable_percentage}% Green Mix</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${r.renewable_percentage}%` }} 
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
