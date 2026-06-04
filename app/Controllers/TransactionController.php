<?php
namespace App\Controllers;

use App\Services\GeminiService;
use App\Repositories\TransactionRepository;
use Exception;

class TransactionController {
    private $geminiService;
    private $transactionRepo;

    public function __construct(GeminiService $geminiService, TransactionRepository $transactionRepo) {
        $this->geminiService = $geminiService;
        $this->transactionRepo = $transactionRepo;
    }

    public function getHistory() {
        try {
            $transactions = $this->transactionRepo->getAllActive();
            $summary = $this->transactionRepo->getMonthlySummary(date('Y-m'));

            $this->jsonResponse([
                'status' => 'success',
                'data' => [
                    'transactions' => $transactions,
                    'summary' => $summary
                ]
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Gagal mengambil data', 'details' => $e->getMessage()], 500);
        }
    }

    public function processTransaction() {
        $inputData = json_decode(file_get_contents('php://input'), true);
        $userInput = $inputData['text'] ?? '';

        if (empty(trim($userInput))) {
            $this->jsonResponse(['error' => 'Teks transaksi tidak boleh kosong'], 400);
            return;
        }

        if (strlen($userInput) > 500) {
            $this->jsonResponse(['error' => 'Teks transaksi maksimal 500 karakter'], 400);
            return;
        }

        try {
            $parsedData = $this->geminiService->parseTransaction($userInput);
            $savedData = $this->transactionRepo->create($parsedData, $userInput);

            $this->jsonResponse([
                'status' => 'success',
                'message' => 'Transaksi berhasil diproses',
                'data' => $savedData
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        }
    }

    private function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit();
    }
}
