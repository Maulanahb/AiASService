<?php
require __DIR__ . '/app/Core/Database.php';
use App\Core\Database;
try {
    $pdo = Database::getConnection();
    
    // Drop table if exists to reset properly
    $pdo->exec("DROP TABLE IF EXISTS savings_goals;");

    $sql = "
CREATE TABLE savings_goals (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    target_amount BIGINT NOT NULL CHECK (target_amount > 0),
    current_amount BIGINT NOT NULL DEFAULT 0,
    deadline DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
CREATE INDEX idx_savings_goals_deleted ON savings_goals(deleted_at);
    ";
    
    // Split by ';' and execute
    $statements = explode(';', $sql);
    foreach ($statements as $stmt) {
        if (trim($stmt)) {
            $pdo->exec($stmt);
        }
    }
    echo "savings_goals created successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
