import { useState, useEffect } from 'react';
import { useSettings } from '../features/settings/hooks/useSettings';

export function Settings() {
  const { settings, saveSettings } = useSettings();
  const [name, setName] = useState(settings.name);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setName(settings.name);
  }, [settings]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings({ name });
    setToast('Pengaturan berhasil disimpan');
  };

  return (
    <div className="animate-[slideIn_0.3s_ease-out]">
      {toast && (
        <div className="fixed top-6 right-6 z-50 ai-glass-panel !bg-ai-surface/90 border-ai-teal/50 px-6 py-4 font-semibold text-ai-text-primary shadow-[0_0_20px_rgba(0,245,196,0.2)] flex items-center gap-3">
          <span className="text-ai-teal">●</span> {toast}
        </div>
      )}

      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ai-text-primary mb-2">Pengaturan</h2>
          <p className="text-sm text-ai-text-muted">Sesuaikan preferensi aplikasi Anda.</p>
        </div>
      </header>

      <div className="max-w-2xl bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="text-xl font-bold text-ai-text-primary mb-6 border-b border-slate-100 pb-4">Profil Pengguna</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-ai-text-primary mb-2">Nama Panggilan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-ai-text-primary focus:outline-none focus:ring-2 focus:ring-ai-primary/20 focus:border-ai-primary transition-all font-medium"
              required
            />
            <p className="text-xs text-ai-text-muted mt-2">Nama ini akan digunakan untuk menyapa Anda di aplikasi dan AI Konsultan.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-ai-primary hover:bg-ai-primary/90 text-white rounded-xl px-6 py-3 font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
