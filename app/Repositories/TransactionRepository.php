<?php
namespace App\Repositories;

use PDO;

class TransactionRepository {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function getAllActive() {
        $stmt = $this->pdo->query("SELECT * FROM transactions WHERE deleted_at IS NULL ORDER BY transaction_date DESC, created_at DESC LIMIT 100");
        return $stmt->fetchAll();
    }

    public function getMonthlySummary($yearMonth) {
        $stmt = $this->pdo->prepare("
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) as total_pemasukan,
                COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) as total_pengeluaran
            FROM transactions 
            WHERE DATE_FORMAT(transaction_date, '%Y-%m') = ? AND deleted_at IS NULL
        ");
        $stmt->execute([$yearMonth]);
        $summary = $stmt->fetch();
        $summary['saldo_bersih'] = $summary['total_pemasukan'] - $summary['total_pengeluaran'];
        
        return $summary;
    }

    private function generateUuid() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    public function create($data, $rawInput) {
        $id = $this->generateUuid();
        $stmt = $this->pdo->prepare("
            INSERT INTO transactions (id, transaction_date, category, description, amount, type, raw_input) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $cleanDesc = htmlspecialchars(strip_tags($data['deskripsi'] ?? ''), ENT_QUOTES, 'UTF-8');
        $transactionDate = $data['tanggal'] ?? date('Y-m-d');
        $category = $data['kategori'] ?? 'Lainnya';
        
        $stmt->execute([
            $id,
            $transactionDate,
            $category,
            $cleanDesc,
            $data['nominal'],
            $data['jenis'],
            $rawInput
        ]);
        
        return [
            'id' => $id,
            'transaction_date' => $transactionDate,
            'category' => $category,
            'description' => $cleanDesc,
            'amount' => $data['nominal'],
            'type' => $data['jenis'],
            'raw_input' => $rawInput
        ];
    }
}
