import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { BrainCircuit, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastPoint {
  timestamp: string;
  predicted_value: number;
  lower_bound: number;
  upper_bound: number;
}

interface DomainPrediction {
  domain: string;
  forecasts: ForecastPoint[];
  model_name: string;
  accuracy_metric: string;
}

export const PredictivePage: React.FC = () => {
  const [predictions, setPredictions] = useState<DomainPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForecasts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/predictions/forecasts');
      if (res.ok) {
        setPredictions(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="text-cyan-400" /> Predictive AI Forecasting
          </h2>
          <p className="text-sm text-gray-400">Time-series forecasting models predicting telemetry peaks and potential supply/demand anomalies.</p>
        </div>
        <button onClick={fetchForecasts} className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map((p) => {
          const formatted = p.forecasts.map((f) => ({
            time: new Date(f.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            prediction: f.predicted_value,
            low: f.lower_bound,
            high: f.upper_bound
          }));

          return (
            <Card 
              key={p.domain} 
              title={p.domain}
              headerAction={
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 block mb-1">
                    {p.model_name}
                  </span>
                  <span className="text-[9px] text-gray-500 block">{p.accuracy_metric}</span>
                </div>
              }
            >
              <div className="h-48 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formatted}>
                    <defs>
                      <linearGradient id={`grad-${p.domain}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={9} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                    <Area type="monotone" dataKey="prediction" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill={`url(#grad-${p.domain})`} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
