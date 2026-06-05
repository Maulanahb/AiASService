import { useState, useEffect } from 'react';

export interface UserSettings {
  name: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  name: 'User',
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('ai_finance_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
  }, []);

  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('ai_finance_settings', JSON.stringify(newSettings));
    
    // Dispatch event so other components (like Sidebar) can listen to changes
    window.dispatchEvent(new Event('settingsUpdated'));
  };

  return { settings, saveSettings };
}
