<?php
namespace App\Repositories;

use PDO;

class TransactionRepository {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function getAllActive($period = 'all') {
        $sql = "SELECT * FROM transactions WHERE deleted_at IS NULL";
        
        $today = date('Y-m-d');
        $thisMonth = date('Y-m');
        $sevenDaysAgo = date('Y-m-d', strtotime('-7 days'));

        if ($period === 'harian') {
            $sql .= " AND DATE(transaction_date) = '{$today}'";
        } elseif ($period === 'mingguan') {
            $sql .= " AND DATE(transaction_date) >= '{$sevenDaysAgo}'";
        } elseif ($period === 'bulanan') {
            $sql .= " AND DATE_FORMAT(transaction_date, '%Y-%m') = '{$thisMonth}'";
        }
        
        $sql .= " ORDER BY transaction_date DESC, created_at DESC LIMIT 200";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getSummary($period = 'all') {
        $sql = "
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) as total_pemasukan,
                COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) as total_pengeluaran
            FROM transactions 
            WHERE deleted_at IS NULL
        ";

        $today = date('Y-m-d');
        $thisMonth = date('Y-m');
        $sevenDaysAgo = date('Y-m-d', strtotime('-7 days'));

        if ($period === 'harian') {
            $sql .= " AND DATE(transaction_date) = '{$today}'";
        } elseif ($period === 'mingguan') {
            $sql .= " AND DATE(transaction_date) >= '{$sevenDaysAgo}'";
        } elseif ($period === 'bulanan') {
            $sql .= " AND DATE_FORMAT(transaction_date, '%Y-%m') = '{$thisMonth}'";
        }

        $stmt = $this->pdo->query($sql);
        $summary = $stmt->fetch(PDO::FETCH_ASSOC);
        $summary['saldo_bersih'] = $summary['total_pemasukan'] - $summary['total_pengeluaran'];
        
        return $summary;
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("UPDATE transactions SET deleted_at = NOW() WHERE id = ?");
        return $stmt->execute([$id]);
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
