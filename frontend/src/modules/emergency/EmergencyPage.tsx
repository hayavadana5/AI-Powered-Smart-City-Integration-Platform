import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { AlertTriangle, ShieldAlert, CheckCircle, RefreshCw, Send } from 'lucide-react';

interface AlertModel {
  id: string;
  title: string;
  severity: string;
  zone_id: string;
  description: string;
  status: string;
  timestamp: string;
}

export const EmergencyPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('Warning');
  const [zoneId, setZoneId] = useState('Zone 1 (Downtown)');
  const [description, setDescription] = useState('');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://ai-powered-smart-city-integration.onrender.com/api/v1/alerts/active')
      if (res.ok) {
        setAlerts(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await fetch('https://ai-powered-smart-city-integration.onrender.com/api/v1/alerts/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, severity, zone_id: zoneId, description })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        fetchAlerts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`https://ai-powered-smart-city-integration.onrender.com/api/v1/alerts/resolve/${id}`, {
  method: 'POST'
});
      if (res.ok) {
        fetchAlerts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="text-red-500" /> Emergency Alerts Dispatch
          </h2>
          <p className="text-sm text-gray-400">Broadcasting critical notifications and managing emergency incident response logs.</p>
        </div>
        <button onClick={fetchAlerts} className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Active Incidents Queue" icon={<ShieldAlert className="text-red-500" />}>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          a.severity === 'Critical' ? 'bg-red-500/10 border border-red-500/30 text-red-400' :
                          a.severity === 'Warning' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                          'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                        }`}>
                          {a.severity}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(a.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{a.title}</h4>
                      <p className="text-xs text-gray-400">{a.description}</p>
                      <span className="text-xs text-cyan-400 block font-semibold">{a.zone_id}</span>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-start">
                      {a.status === 'Active' ? (
                        <button 
                          onClick={() => handleResolve(a.id)}
                          className="px-3 py-1.5 flex items-center gap-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">No active incidents queued.</div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Emergency Dispatcher Console">
            <form onSubmit={handleDispatch} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Incident Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chemical Spill" 
                  className="w-full text-sm bg-white/5 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500" 
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Severity Level</label>
                <select 
                  value={severity} 
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full text-sm bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>Critical</option>
                  <option>Warning</option>
                  <option>Info</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Sector Location</label>
                <select 
                  value={zoneId} 
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full text-sm bg-slate-900 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>Zone 1 (Downtown)</option>
                  <option>Zone 2 (Industrial)</option>
                  <option>Zone 3 (Residential)</option>
                  <option>Zone 4 (Suburbs)</option>
                  <option>Zone 5 (Commercial)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Incident Details</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide incident briefing details..." 
                  className="w-full text-sm bg-white/5 border border-white/10 rounded-lg p-2.5 text-white h-24 focus:outline-none focus:border-cyan-500 resize-none" 
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition"
              >
                <Send className="w-4 h-4" /> Broadcast Dispatch
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
