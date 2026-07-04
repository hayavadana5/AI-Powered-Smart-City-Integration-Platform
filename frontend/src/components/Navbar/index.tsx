import React, { useEffect, useState } from 'react';
import { Activity, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-cyan-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
          <Cpu className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            ASCIP
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              v1.0-PROTOTYPE
            </span>
          </h1>
          <p className="text-xs text-gray-400">AI-Powered Smart City Integration Platform</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* System Health */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>All Systems Nominal</span>
        </div>

        {/* Dynamic Clock */}
        <div className="text-right">
          <p className="text-sm font-semibold text-white">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-[10px] text-gray-400">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </header>
  );
};
