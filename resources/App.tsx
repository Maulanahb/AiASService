import { useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { Savings } from './pages/Savings';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('overview');

  return (
    <DashboardLayout activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
      {activeMenu === 'overview' && <Dashboard />}
      {activeMenu === 'transactions' && <Transactions />}
      {activeMenu === 'reports' && <Reports />}
      {activeMenu === 'tabungan' && <Savings />}
      {activeMenu === 'budgets' && <Budgets />}
      {activeMenu === 'ai-assistant' && <AIAssistant />}
      {activeMenu === 'settings' && <Settings />}
    </DashboardLayout>
  );
}
