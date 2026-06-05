<?php
require __DIR__ . '/../app/Core/Database.php';
$pdo = \App\Core\Database::getConnection();
$stmt = $pdo->query("SELECT transaction_date FROM transactions LIMIT 10");
echo json_encode(['db_dates' => $stmt->fetchAll(PDO::FETCH_ASSOC), 'php_date' => date('Y-m-d'), 'mysql_date' => $pdo->query("SELECT CURDATE()")->fetchColumn()]);
