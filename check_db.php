<?php
require __DIR__ . '/app/Core/Database.php';

use App\Core\Database;

try {
    $pdo = Database::getConnection();
    $stmt = $pdo->query("SHOW TABLES;");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables: \n" . print_r($tables, true) . "\n";
    
    if (in_array('savings_goals', $tables)) {
        $stmt = $pdo->query("DESCRIBE savings_goals;");
        $cols = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "Columns: \n" . print_r($cols, true) . "\n";
    } else {
        echo "savings_goals table NOT FOUND\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
