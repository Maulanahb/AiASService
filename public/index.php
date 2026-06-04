<?php
// CORS Headers
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple manual autoloader
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/../app/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

use App\Core\Database;
use App\Services\GeminiService;
use App\Repositories\TransactionRepository;
use App\Controllers\TransactionController;

try {
    $pdo = Database::getConnection();
    $geminiService = new GeminiService(getenv('GEMINI_API_KEY'));
    $transactionRepo = new TransactionRepository($pdo);
    $controller = new TransactionController($geminiService, $transactionRepo);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Inisialisasi sistem gagal', 'details' => $e->getMessage()]);
    exit();
}

// Memuat routing API yang bersih
require __DIR__ . '/../routes/api.php';
