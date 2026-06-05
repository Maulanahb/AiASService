<?php
namespace App\Controllers;

use App\Repositories\SavingsRepository;
use App\Repositories\TransactionRepository;
use Exception;

class SavingsController {
    private $savingsRepo;
    private $transactionRepo;

    public function __construct(SavingsRepository $savingsRepo, TransactionRepository $transactionRepo = null) {
        $this->savingsRepo = $savingsRepo;
        $this->transactionRepo = $transactionRepo;
    }

    public function getSavings() {
        try {
            $goals = $this->savingsRepo->getAllActive();
            $this->jsonResponse([
                'status' => 'success',
                'data' => $goals
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Gagal mengambil data tabungan', 'details' => $e->getMessage()], 500);
        }
    }

    public function createGoal() {
        $inputData = json_decode(file_get_contents('php://input'), true);
        
        if (empty($inputData['title']) || empty($inputData['target_amount'])) {
            $this->jsonResponse(['error' => 'Nama target dan nominal target tidak boleh kosong'], 400);
            return;
        }

        try {
            $savedData = $this->savingsRepo->create($inputData);
            $this->jsonResponse([
                'status' => 'success',
                'message' => 'Target tabungan berhasil dibuat',
                'data' => $savedData
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    public function addFund() {
        $inputData = json_decode(file_get_contents('php://input'), true);
        
        if (empty($inputData['id']) || empty($inputData['amount'])) {
            $this->jsonResponse(['error' => 'ID tabungan dan nominal dana tidak boleh kosong'], 400);
            return;
        }

        try {
            $title = $this->savingsRepo->addFund($inputData['id'], $inputData['amount']);
            
            // Otomatis catat sebagai pengeluaran (Transfer ke Tabungan)
            if ($this->transactionRepo) {
                $transactionData = [
                    'tanggal' => date('Y-m-d'),
                    'kategori' => 'Transfer ke Tabungan',
                    'deskripsi' => 'Alokasi dana untuk target: ' . $title,
                    'nominal' => $inputData['amount'],
                    'jenis' => 'pengeluaran'
                ];
                $this->transactionRepo->create($transactionData, 'Menabung untuk ' . $title);
            }

            $this->jsonResponse([
                'status' => 'success',
                'message' => 'Dana berhasil ditambahkan ke tabungan'
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    public function deleteGoal() {
        $id = $_GET['id'] ?? '';
        if (empty($id)) {
            $this->jsonResponse(['error' => 'ID tabungan tidak valid'], 400);
            return;
        }

        try {
            $this->savingsRepo->delete($id);
            $this->jsonResponse([
                'status' => 'success',
                'message' => 'Target tabungan berhasil dihapus'
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Gagal menghapus target tabungan', 'details' => $e->getMessage()], 500);
        }
    }

    private function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit();
    }
}
