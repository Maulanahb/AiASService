<?php
namespace App\Controllers;

use App\Repositories\BudgetRepository;
use Exception;

class BudgetController {
    private $budgetRepo;

    public function __construct(BudgetRepository $budgetRepo) {
        $this->budgetRepo = $budgetRepo;
    }

    public function getBudgets() {
        $month = $_GET['month'] ?? date('Y-m');
        try {
            $budgets = $this->budgetRepo->getBudgetsWithActuals($month);
            $this->jsonResponse([
                'status' => 'success',
                'data' => $budgets
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Gagal mengambil data anggaran', 'details' => $e->getMessage()], 500);
        }
    }

    public function saveBudget() {
        $inputData = json_decode(file_get_contents('php://input'), true);
        
        if (empty($inputData['category']) || empty($inputData['amount']) || empty($inputData['month'])) {
            $this->jsonResponse(['error' => 'Kategori, nominal, dan bulan tidak boleh kosong'], 400);
            return;
        }

        try {
            $savedData = $this->budgetRepo->saveBudget(
                $inputData['category'],
                $inputData['amount'],
                $inputData['month']
            );
            $this->jsonResponse([
                'status' => 'success',
                'message' => 'Anggaran berhasil disimpan',
                'data' => $savedData
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Gagal menyimpan anggaran', 'details' => $e->getMessage()], 400);
        }
    }

    public function deleteBudget() {
        $id = $_GET['id'] ?? '';
        if (empty($id)) {
            $this->jsonResponse(['error' => 'ID anggaran tidak valid'], 400);
            return;
        }

        try {
            $this->budgetRepo->deleteBudget($id);
            $this->jsonResponse([
                'status' => 'success',
                'message' => 'Anggaran berhasil dihapus'
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Gagal menghapus anggaran', 'details' => $e->getMessage()], 500);
        }
    }

    private function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit();
    }
}
