import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Card } from './components/Card';
import { 
  Wind, Zap, Car, Trash2, Droplet, AlertTriangle, Cpu 
} from 'lucide-react';
import { AirQualityPage } from './modules/air-quality/AirQualityPage';
import { ElectricityPage } from './modules/electricity/ElectricityPage';
import { TrafficPage } from './modules/traffic/TrafficPage';
import { WastePage } from './modules/waste/WastePage';
import { WaterPage } from './modules/water/WaterPage';
import { EmergencyPage } from './modules/emergency/EmergencyPage';
import { PredictivePage } from './modules/predictive/PredictivePage';
import { ChatPage } from './modules/chat/ChatPage';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState('dashboard');

  const renderContent = () => {
    switch (currentModule) {
      case 'air-quality':
        return <AirQualityPage />;
      case 'electricity':
        return <ElectricityPage />;
      case 'traffic':
        return <TrafficPage />;
      case 'waste':
        return <WastePage />;
      case 'water':
        return <WaterPage />;
      case 'alerts':
        return <EmergencyPage />;
      case 'predictive':
        return <PredictivePage />;
      case 'chat':
        return <ChatPage />;
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Hero / Greeting Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/80 to-slate-950/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Smart City Command Operations</h2>
                <p className="text-sm text-gray-400">Real-time telemetry, predictive analytics, and emergency dispatch control center.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCurrentModule('predictive')}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg text-sm transition shadow-lg shadow-cyan-500/20"
                >
                  View Predictive AI forecasts
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="Air Quality" icon={<Wind className="w-5 h-5 text-cyan-400" />}>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-3xl font-extrabold text-white">48 AQI</p>
                    <p className="text-xs text-emerald-400 font-medium">● Good (Satisfactory)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">PM2.5: 11.2 µg/m³</p>
                    <p className="text-xs text-gray-400">PM10: 22.4 µg/m³</p>
                  </div>
                </div>
              </Card>

              <Card title="Power Grid" icon={<Zap className="w-5 h-5 text-yellow-400" />}>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-3xl font-extrabold text-white">8.4 GW</p>
                    <p className="text-xs text-gray-400">Total Consumption</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-400 font-medium">Peak Demand Zone 4</p>
                    <p className="text-xs text-emerald-400">32% Renewable Mix</p>
                  </div>
                </div>
              </Card>

              <Card title="Traffic Flow" icon={<Car className="w-5 h-5 text-indigo-400" />}>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-3xl font-extrabold text-white">42 km/h</p>
                    <p className="text-xs text-gray-400">Avg Citywide Speed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-400 font-medium">92 Active Signals</p>
                    <p className="text-xs text-amber-400">Moderate Load Zone 2</p>
                  </div>
                </div>
              </Card>

              <Card title="Smart Waste" icon={<Trash2 className="w-5 h-5 text-purple-400" />}>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-3xl font-extrabold text-white">62.8%</p>
                    <p className="text-xs text-gray-400">Avg Bins Fill Level</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-400 font-medium">14 Collection Routes</p>
                    <p className="text-xs text-emerald-400">98% Collection Rate</p>
                  </div>
                </div>
              </Card>

              <Card title="Water System" icon={<Droplet className="w-5 h-5 text-blue-400" />}>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-3xl font-extrabold text-white">14.2 MLD</p>
                    <p className="text-xs text-gray-400">Daily Flow Rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-400 font-medium">Normal Pressure</p>
                    <p className="text-xs text-emerald-400">0 Active Leaks Detected</p>
                  </div>
                </div>
              </Card>

              <Card title="Emergency Alerts" icon={<AlertTriangle className="w-5 h-5 text-red-500" />}>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-3xl font-extrabold text-white">1</p>
                    <p className="text-xs text-amber-400 font-medium">Active Alert</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Last alert: Just now</p>
                    <p className="text-xs text-gray-400">Dispatcher standby</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px] border border-white/5 bg-slate-950/20 backdrop-blur-sm rounded-2xl p-8">
            <Cpu className="w-12 h-12 text-cyan-500 mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-white mb-2">Module Offline</h3>
            <p className="text-sm text-gray-400 text-center max-w-md">
              The {currentModule.replace('-', ' ')} module is currently under construction. Select a nominal system component from the navigation sidebar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} />
        <main className="flex-1 p-6 md:p-8 bg-gradient-to-b from-transparent to-dark-bg/40 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
