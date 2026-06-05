import React, { useEffect, useState } from 'react';
import { useSettings } from '../../features/settings/hooks/useSettings';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

export function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const { settings } = useSettings();
  const [greetingName, setGreetingName] = useState(settings.name);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const saved = localStorage.getItem('ai_finance_settings');
      if (saved) {
        setGreetingName(JSON.parse(saved).name);
      }
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  const menus = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'transactions', label: 'Transaksi', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'reports', label: 'Statistik', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'tabungan', label: 'Tabungan', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'budgets', label: 'Anggaran', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z' },
    { id: 'ai-assistant', label: 'AI Konsultan', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'settings', label: 'Pengaturan', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

  return (
    <aside className="w-64 h-screen bg-white/60 backdrop-blur-xl border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-ai-primary to-ai-secondary flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-ai-primary to-ai-secondary flex items-center justify-center text-white text-xs">AI</span>
          Finance
        </h1>
        <div className="mt-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ai-primary/10 flex items-center justify-center text-ai-primary font-bold text-sm">
            {greetingName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-ai-text-muted">Halo,</p>
            <p className="text-sm font-bold text-ai-text-primary leading-tight truncate w-36">{greetingName}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-1">
        {menus.map(menu => {
          const isActive = activeMenu === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => setActiveMenu(menu.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-semibold tracking-wide w-full text-left group
                ${isActive 
                  ? 'bg-slate-100 text-ai-primary shadow-sm border border-slate-200/50' 
                  : 'text-ai-text-muted hover:text-ai-text-primary hover:bg-slate-50'
                }`}
            >
              <svg className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-ai-primary' : 'text-ai-text-muted group-hover:text-ai-text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={menu.icon} />
              </svg>
              {menu.label}
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ai-primary shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden relative group">
            <span className="text-lg">🤖</span>
            <div className="absolute inset-0 bg-ai-primary/10 mix-blend-overlay animate-pulse"></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-ai-text-primary">AI Core 4.0</p>
            <p className="text-[10px] text-ai-text-muted uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
