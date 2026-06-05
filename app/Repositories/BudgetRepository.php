<?php
namespace App\Repositories;

use PDO;
use Exception;

class BudgetRepository {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
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

    public function getBudgetsWithActuals($month) {
        // Fetch all budgets for the given month
        $stmt = $this->pdo->prepare("SELECT * FROM budgets WHERE month = :month ORDER BY category ASC");
        $stmt->execute(['month' => $month]);
        $budgets = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch actual expenses for the month grouped by category
        $stmtActuals = $this->pdo->prepare("
            SELECT category, SUM(amount) as actual_amount 
            FROM transactions 
            WHERE type = 'pengeluaran' 
              AND DATE_FORMAT(transaction_date, '%Y-%m') = :month 
              AND deleted_at IS NULL
            GROUP BY category
        ");
        $stmtActuals->execute(['month' => $month]);
        $actualsRaw = $stmtActuals->fetchAll(PDO::FETCH_ASSOC);
        
        $actualsMap = [];
        foreach ($actualsRaw as $row) {
            $actualsMap[$row['category']] = (int)$row['actual_amount'];
        }

        // Combine
        $result = [];
        foreach ($budgets as $budget) {
            $category = $budget['category'];
            $result[] = [
                'id' => $budget['id'],
                'category' => $category,
                'amount' => (int)$budget['amount'],
                'actual' => $actualsMap[$category] ?? 0,
                'month' => $budget['month']
            ];
        }

        return $result;
    }

    public function saveBudget($category, $amount, $month) {
        $id = $this->generateUuid();
        // MySQL ON DUPLICATE KEY UPDATE
        $stmt = $this->pdo->prepare("
            INSERT INTO budgets (id, category, amount, month)
            VALUES (:id, :category, :amount, :month)
            ON DUPLICATE KEY UPDATE 
            amount = VALUES(amount), updated_at = CURRENT_TIMESTAMP
        ");
        
        $stmt->execute([
            'id' => $id,
            'category' => $category,
            'amount' => $amount,
            'month' => $month
        ]);
        
        return [
            'category' => $category,
            'amount' => $amount,
            'month' => $month
        ];
    }

    public function deleteBudget($id) {
        $stmt = $this->pdo->prepare("DELETE FROM budgets WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
