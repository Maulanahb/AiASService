<?php
namespace App\Controllers;

use App\Services\GeminiService;
use App\Repositories\TransactionRepository;
use App\Repositories\SavingsRepository;
use App\Repositories\BudgetRepository;
use Exception;

class ChatController {
    private $geminiService;
    private $transactionRepo;
    private $savingsRepo;
    private $budgetRepo;

    public function __construct(
        GeminiService $geminiService,
        TransactionRepository $transactionRepo,
        SavingsRepository $savingsRepo,
        BudgetRepository $budgetRepo
    ) {
        $this->geminiService = $geminiService;
        $this->transactionRepo = $transactionRepo;
        $this->savingsRepo = $savingsRepo;
        $this->budgetRepo = $budgetRepo;
    }

    public function handleChat() {
        $inputData = json_decode(file_get_contents('php://input'), true);
        $userMessage = $inputData['message'] ?? '';
        
        if (empty($userMessage)) {
            $this->jsonResponse(['error' => 'Pesan tidak boleh kosong'], 400);
            return;
        }

        try {
            // Mengumpulkan konteks keuangan
            $summary = $this->transactionRepo->getSummary('bulanan');
            $savings = $this->savingsRepo->getAllActive();
            $budgets = $this->budgetRepo->getBudgetsWithActuals(date('Y-m'));

            $contextData = [
                'periode_berjalan' => date('F Y'),
                'total_pemasukan_bulan_ini' => $summary['total_pemasukan'],
                'total_pengeluaran_bulan_ini' => $summary['total_pengeluaran'],
                'saldo_bersih_bulan_ini' => $summary['saldo_bersih'],
                'tabungan' => array_map(function($g) {
                    return [
                        'nama' => $g['title'],
                        'target' => $g['target_amount'],
                        'terkumpul' => $g['current_amount']
                    ];
                }, $savings),
                'anggaran_bulan_ini' => array_map(function($b) {
                    return [
                        'kategori' => $b['category'],
                        'batas_anggaran' => $b['amount'],
                        'terpakai' => $b['actual']
                    ];
                }, $budgets)
            ];

            $aiResponse = $this->geminiService->askConsultant($userMessage, $contextData);
            
            $this->jsonResponse([
                'status' => 'success',
                'data' => [
                    'reply' => $aiResponse
                ]
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Gagal menghubungi AI Konsultan', 'details' => $e->getMessage()], 500);
        }
    }

    private function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit();
    }
}
