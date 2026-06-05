import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  setActiveMenu: (m: string) => void;
}

export function DashboardLayout({ children, activeMenu, setActiveMenu }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-mesh text-ai-text-primary overflow-hidden selection:bg-ai-teal/30 selection:text-white">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-ai-surface/80 backdrop-blur-md sticky top-0 z-50">
          <h1 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-ai-teal to-ai-purple">
            AI Finance
          </h1>
          <div className="flex gap-2">
            <button onClick={() => setActiveMenu('overview')} className={`text-xs px-3 py-1.5 rounded-lg border ${activeMenu === 'overview' ? 'border-ai-teal text-ai-teal' : 'border-white/10 text-ai-text-muted'}`}>Overview</button>
            <button onClick={() => setActiveMenu('reports')} className={`text-xs px-3 py-1.5 rounded-lg border ${activeMenu === 'reports' ? 'border-ai-teal text-ai-teal' : 'border-white/10 text-ai-text-muted'}`}>Statistik</button>
          </div>
        </div>
        
        <div className="p-4 md:p-10 max-w-6xl mx-auto w-full pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
