const API_BASE_URL = 'http://localhost/AiASService/public/index.php';

export const apiService = {
  getHistory: async () => {
    const response = await fetch(`${API_BASE_URL}?action=history`);
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
  }
};
