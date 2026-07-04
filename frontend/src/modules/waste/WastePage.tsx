import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Trash2, RefreshCw, Truck } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface WasteReading {
  zone_id: string;
  fill_level_percent: number;
  bin_count: number;
  overfilled_bins: number;
  timestamp: string;
}

export const WastePage: React.FC = () => {
  const [readings, setReadings] = useState<WasteReading[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [routeOptimized, setRouteOptimized] = useState(false);

  const fetchWasteData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/waste/latest');
      const sumRes = await fetch('/api/v1/waste/summary');
      if (res.ok && sumRes.ok) {
        let data = await res.json();
        let sumData = await sumRes.json();
        if (routeOptimized) {
          data = data.map((d: WasteReading) => {
            // Simulate that trucks have collected waste, lowering fill levels
            return {
              ...d,
              fill_level_percent: Math.max(10, Math.round(d.fill_level_percent * 0.3)),
              overfilled_bins: 0
            };
          });
          sumData = {
            ...sumData,
            avg_fill_level: 18.5,
            pending_pickups: 0,
            collection_efficiency: 99.8
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
    fetchWasteData();
  }, [routeOptimized]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Trash2 className="text-purple-400" /> Smart Waste Logistics
          </h2>
          <p className="text-sm text-gray-400">Monitoring smart bin capacities and generating optimized collection truck routes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setRouteOptimized(!routeOptimized)}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition border ${
              routeOptimized 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                : 'bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-500'
            }`}
          >
            <Truck className="w-4 h-4" />
            {routeOptimized ? "Reset Bin Fill Level Simulation" : "Dispatch Trucks & Clear Bins"}
          </button>
          <button onClick={fetchWasteData} className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Bins Average Fill">
          <div className="text-center py-4">
            <span className="text-4xl font-extrabold text-white">{summary?.avg_fill_level || 62}%</span>
            <p className="text-xs text-gray-400 mt-2">Nominal Capacity threshold: 80%</p>
          </div>
        </Card>

        <Card title="Overfilled Bins">
          <div className="text-center py-4">
            <span className={`text-4xl font-extrabold ${summary?.pending_pickups > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {summary?.pending_pickups || 0}
            </span>
            <p className="text-xs text-gray-400 mt-2">Requires Immediate Dispatch</p>
          </div>
        </Card>

        <Card title="Logistics Rate">
          <div className="text-center py-4">
            <span className="text-4xl font-extrabold text-emerald-400">{summary?.collection_efficiency || 96.4}%</span>
            <p className="text-xs text-gray-400 mt-2">Target optimization: 98%</p>
          </div>
        </Card>

        <Card title="Bins Monitored">
          <div className="text-center py-4">
            <span className="text-4xl font-extrabold text-white">{summary?.total_bins_monitored || 250} Bins</span>
            <p className="text-xs text-gray-400 mt-2">Ultrasonic IoT Connected</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Average Bin Fill level per Sector (%)">
          <div className="h-64 mt-2">
            {readings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={readings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="zone_id" tickFormatter={(v) => v.split(' ')[0]} stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                  <Bar dataKey="fill_level_percent" name="Fill level" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">Loading charts...</div>
            )}
          </div>
        </Card>

        <Card title="Collection Priority Status">
          <div className="space-y-4">
            {readings.map((r) => {
              const priority = r.fill_level_percent > 75 ? "CRITICAL" : r.fill_level_percent > 55 ? "MODERATE" : "LOW";
              return (
                <div key={r.zone_id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div>
                    <span className="text-sm font-semibold text-white">{r.zone_id}</span>
                    <p className="text-xs text-gray-400">{r.overfilled_bins} bins exceeding 85% capacity</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                    priority === 'CRITICAL' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                    priority === 'MODERATE' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
                    'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  }`}>
                    {priority}
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
