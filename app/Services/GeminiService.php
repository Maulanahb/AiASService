<?php
namespace App\Services;

use Exception;

class GeminiService {
    private $apiKey;
    private $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public function __construct($apiKey) {
        if (!$apiKey || $apiKey === 'your_gemini_api_key_here') {
            throw new Exception("Gemini API Key belum dikonfigurasi.");
        }
        $this->apiKey = $apiKey;
    }

    public function parseTransaction($userInput) {
        $today = date('Y-m-d');
        $systemPrompt = "Kamu adalah API parser keuangan. Ekstrak teks transaksi pengguna menjadi objek JSON murni.
Aturan wajib:
- Response hanya JSON murni, tanpa markdown (hilangkan ```json).
- Key wajib: \"kategori\", \"nominal\", \"deskripsi\", \"jenis\", \"tanggal\".
- \"jenis\" hanya boleh: \"pemasukan\" atau \"pengeluaran\".
- \"nominal\" harus bilangan bulat positif.
- \"tanggal\" format ISO 8601 (YYYY-MM-DD). Jika tidak ada, gunakan tanggal hari ini. Untuk referensi relatif (misal: kemarin), hitung dari tanggal hari ini.
- \"kategori\" harus salah satu dari: Makanan & Minuman, Transportasi, Hiburan, Tagihan & Utilitas, Belanja, Kesehatan, Pendapatan, Lainnya.
Tanggal hari ini: $today.";

        $payload = [
            "contents" => [
                ["role" => "user", "parts" => [["text" => $systemPrompt . "\n\nTeks transaksi: \"" . $userInput . "\""]]]
            ],
            "generationConfig" => [
                "responseMimeType" => "application/json",
                "temperature" => 0.1
            ]
        ];

        $ch = curl_init($this->apiUrl . "?key=" . $this->apiKey);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $response = curl_exec($ch);
        
        if (curl_errno($ch)) {
            $error_msg = curl_error($ch);
            curl_close($ch);
            throw new Exception("Timeout atau error koneksi ke AI API: " . $error_msg);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception("Layanan AI merespons dengan HTTP Code: " . $httpCode);
        }

        $geminiData = json_decode($response, true);
        $aiText = $geminiData['candidates'][0]['content']['parts'][0]['text'] ?? '';
        
        $parsedData = json_decode(trim($aiText), true);
        
        if (!$parsedData || !isset($parsedData['nominal']) || !isset($parsedData['jenis'])) {
            throw new Exception("AI gagal merespons dengan format JSON yang valid. Raw: " . $aiText);
        }

        if ($parsedData['nominal'] <= 0) {
            throw new Exception("Nominal tidak valid. Pastikan jumlah uang disebutkan dengan jelas.");
        }

        return $parsedData;
    }
}
