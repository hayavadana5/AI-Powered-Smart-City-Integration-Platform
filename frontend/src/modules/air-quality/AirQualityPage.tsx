import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Wind, ShieldAlert, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AQIReading {
  zone_id: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  co2: number;
  o3: number;
  timestamp: string;
}

export const AirQualityPage: React.FC = () => {
  const [readings, setReadings] = useState<AQIReading[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("Zone 1 (Downtown)");
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulatedPollution, setSimulatedPollution] = useState(false);

  const fetchAQIData = async () => {
    try {
      setLoading(true);
      // Fetch latest readings
      const latestRes = await fetch('https://ai-powered-smart-city-integration.onrender.com/api/v1/air-quality/latest');
      if (latestRes.ok) {
        let data = await latestRes.json();
        if (simulatedPollution) {
          data = data.map((d: AQIReading) => {
            if (d.zone_id.includes("Industrial")) {
              return { ...d, aqi: d.aqi + 70, pm25: d.pm25 + 35, pm10: d.pm10 + 60, co2: d.co2 + 150 };
            }
            return { ...d, aqi: d.aqi + 15, co2: d.co2 + 30 };
          });
        }
        setReadings(data);
      }

      // Fetch historical for selected zone
      const histRes = await fetch(`https://ai-powered-smart-city-integration.onrender.com/api/v1/air-quality/historical/${encodeURIComponent(selectedZone)}`);
      if (histRes.ok) {
        const data = await histRes.json();
        const formatted = data.readings.map((r: AQIReading) => ({
          time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aqi: simulatedPollution && selectedZone.includes("Industrial") ? r.aqi + 70 : r.aqi,
          pm25: simulatedPollution && selectedZone.includes("Industrial") ? r.pm25 + 35 : r.pm25,
          co2: simulatedPollution && selectedZone.includes("Industrial") ? r.co2 + 150 : r.co2
        }));
        setHistoricalData(formatted);
      }
    } catch (err) {
      console.error("Error fetching AQI:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAQIData();
    const interval = setInterval(fetchAQIData, 10000);
    return () => clearInterval(interval);
  }, [selectedZone, simulatedPollution]);

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 };
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", icon: AlertTriangle };
    return { label: "Unhealthy", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: ShieldAlert };
  };

  const getAvgAQI = () => {
    if (readings.length === 0) return 0;
    return Math.round(readings.reduce((acc, curr) => acc + curr.aqi, 0) / readings.length);
  };

  return (
    <div className="space-y-6">
      {/* Header and simulation panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wind className="text-cyan-400" /> Air Quality Telemetry
          </h2>
          <p className="text-sm text-gray-400">Monitoring fine particulates, gaseous emissions, and air quality index across city sectors.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setSimulatedPollution(!simulatedPollution)}
            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold transition border ${
              simulatedPollution 
                ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' 
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            <Play className="w-4 h-4" />
            {simulatedPollution ? "Disable Industry Peak Simulation" : "Simulate Industrial Peak Load"}
          </button>
          <button 
            onClick={fetchAQIData}
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main stats layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Average Citywide AQI">
          <div className="text-center py-4">
            <span className="text-6xl font-extrabold text-white">{getAvgAQI()}</span>
            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getAQIStatus(getAvgAQI()).color}`}>
              {React.createElement(getAQIStatus(getAvgAQI()).icon, { className: "w-3.5 h-3.5" })}
              {getAQIStatus(getAvgAQI()).label}
            </div>
          </div>
        </Card>

        <Card title="Highest Impact Area">
          {readings.length > 0 ? (
            (() => {
              const maxZone = [...readings].sort((a, b) => b.aqi - a.aqi)[0];
              return (
                <div className="space-y-2 py-2">
                  <p className="text-lg font-semibold text-white">{maxZone.zone_id}</p>
                  <p className="text-3xl font-extrabold text-red-400">{maxZone.aqi} AQI</p>
                  <p className="text-xs text-gray-400">PM2.5: {maxZone.pm25} µg/m³ | CO2: {maxZone.co2} ppm</p>
                </div>
              );
            })()
          ) : (
            <p className="text-sm text-gray-400">Loading data...</p>
          )}
        </Card>

        <Card title="Zone Selection">
          <div className="flex flex-col gap-2">
            {readings.map((r) => (
              <button
                key={r.zone_id}
                onClick={() => setSelectedZone(r.zone_id)}
                className={`text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center transition border ${
                  selectedZone === r.zone_id 
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{r.zone_id}</span>
                <span className="font-bold">{r.aqi} AQI</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={`${selectedZone} - 12h AQI Trend`}>
          <div className="h-64 mt-2">
            {historicalData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 'dataMax + 20']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                    labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                  />
                  <Area type="monotone" dataKey="aqi" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#aqiGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">Loading charts...</div>
            )}
          </div>
        </Card>

        <Card title="Gaseous & Particulate Distribution (Latest)">
          <div className="h-64 mt-2">
            {readings.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={readings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="zone_id" tickFormatter={(v) => v.split(' ')[0]} stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <Bar dataKey="pm25" name="PM2.5" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pm10" name="PM10" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">Loading charts...</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
