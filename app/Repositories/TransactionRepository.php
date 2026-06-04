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
            WHERE TO_CHAR(transaction_date, 'YYYY-MM') = ? AND deleted_at IS NULL
        ");
        $stmt->execute([$yearMonth]);
        $summary = $stmt->fetch();
        $summary['saldo_bersih'] = $summary['total_pemasukan'] - $summary['total_pengeluaran'];
        
        return $summary;
    }

    public function create($data, $rawInput) {
        $stmt = $this->pdo->prepare("
            INSERT INTO transactions (transaction_date, category, description, amount, type, raw_input) 
            VALUES (?, ?, ?, ?, ?, ?) RETURNING id, transaction_date, category, description, amount, type, raw_input
        ");
        
        $cleanDesc = htmlspecialchars(strip_tags($data['deskripsi'] ?? ''), ENT_QUOTES, 'UTF-8');
        
        $stmt->execute([
            $data['tanggal'] ?? date('Y-m-d'),
            $data['kategori'] ?? 'Lainnya',
            $cleanDesc,
            $data['nominal'],
            $data['jenis'],
            $rawInput
        ]);
        
        return $stmt->fetch();
    }
}
