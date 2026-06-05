<?php
namespace App\Repositories;

use PDO;

class SavingsRepository {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function getAllActive() {
        $sql = "SELECT * FROM savings_goals WHERE deleted_at IS NULL ORDER BY created_at DESC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );

        $stmt = $this->pdo->prepare("
            INSERT INTO savings_goals (id, title, target_amount, deadline) 
            VALUES (?, ?, ?, ?)
        ");
        
        $title = htmlspecialchars(strip_tags($data['title'] ?? ''), ENT_QUOTES, 'UTF-8');
        $targetAmount = $data['target_amount'] ?? 0;
        $deadline = !empty($data['deadline']) ? $data['deadline'] : null;
        
        $stmt->execute([$id, $title, $targetAmount, $deadline]);
        
        return [
            'id' => $id,
            'title' => $title,
            'target_amount' => $targetAmount,
            'current_amount' => 0,
            'deadline' => $deadline
        ];
    }

    public function addFund($id, $amount) {
        // Fetch current to ensure it exists
        $stmt = $this->pdo->prepare("SELECT title, current_amount FROM savings_goals WHERE id = ? AND deleted_at IS NULL");
        $stmt->execute([$id]);
        $goal = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$goal) {
            throw new \Exception("Target tabungan tidak ditemukan");
        }

        $stmtUpdate = $this->pdo->prepare("UPDATE savings_goals SET current_amount = current_amount + ? WHERE id = ?");
        $stmtUpdate->execute([$amount, $id]);
        
        return $goal['title']; // Return title for logging
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("UPDATE savings_goals SET deleted_at = NOW() WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
