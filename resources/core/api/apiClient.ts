const API_BASE_URL = 'http://localhost:8000/index.php'; // Updated to point to public/index.php

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}?action=${endpoint}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Gagal mengambil data dari API');
    }
    return data.data;
  },

  post: async (endpoint: string, body: any) => {
    const response = await fetch(`${API_BASE_URL}?action=${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Gagal mengirim data ke API');
    }
    return data;
  }
};
