import React from 'react';
import { 
  LayoutDashboard, 
  Wind, 
  Zap, 
  Car, 
  Trash2, 
  Droplet, 
  AlertTriangle, 
  BrainCircuit, 
  MessageSquareShare 
} from 'lucide-react';

interface SidebarProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onModuleChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'air-quality', label: 'Air Quality', icon: Wind },
    { id: 'electricity', label: 'Electricity', icon: Zap },
    { id: 'traffic', label: 'Traffic Control', icon: Car },
    { id: 'waste', label: 'Smart Waste', icon: Trash2 },
    { id: 'water', label: 'Water Systems', icon: Droplet },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle, badge: true },
    { id: 'predictive', label: 'Predictive AI', icon: BrainCircuit },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquareShare },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-slate-950/20 backdrop-blur-md min-h-[calc(100vh-76px)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">City Domains</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full text-left flex items-center justify-between rounded-lg px-4 py-2.5 transition-all duration-200 ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-white/5 text-[11px] text-gray-500">
        <p>© 2026 ASCIP Inc.</p>
        <p>Operational Dashboard</p>
      </div>
    </aside>
  );
};
