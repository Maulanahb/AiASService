const API_BASE_URL = 'http://localhost/AiASService/public/index.php';

export const apiService = {
  getHistory: async (period = 'all') => {
    const response = await fetch(`${API_BASE_URL}?action=history&period=${period}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Gagal mengambil data riwayat');
    }
    return data.data;
  },

  processTransaction: async (text: string) => {
    const response = await fetch(`${API_BASE_URL}?action=process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Gagal memproses transaksi');
    }
    return data;
  },

  deleteTransaction: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}?action=delete&id=${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Gagal menghapus transaksi');
    }
    return data;
  }
};
