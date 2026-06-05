<?php
require __DIR__ . '/../app/Core/Database.php';
$pdo = \App\Core\Database::getConnection();

// Get all transactions
$stmt = $pdo->query("SELECT id FROM transactions ORDER BY created_at ASC");
$transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($transactions) >= 3) {
    // Set first one to 2 months ago
    $id1 = $transactions[0]['id'];
    $twoMonthsAgo = date('Y-m-d', strtotime('-2 months'));
    $pdo->exec("UPDATE transactions SET transaction_date = '$twoMonthsAgo' WHERE id = '$id1'");

    // Set second one to 2 weeks ago
    $id2 = $transactions[1]['id'];
    $twoWeeksAgo = date('Y-m-d', strtotime('-14 days'));
    $pdo->exec("UPDATE transactions SET transaction_date = '$twoWeeksAgo' WHERE id = '$id2'");

    // Set third one to 3 days ago
    $id3 = $transactions[2]['id'];
    $threeDaysAgo = date('Y-m-d', strtotime('-3 days'));
    $pdo->exec("UPDATE transactions SET transaction_date = '$threeDaysAgo' WHERE id = '$id3'");
    
    echo "Successfully updated 3 transactions to past dates to simulate filter differences.";
} else {
    echo "Not enough transactions to modify.";
}
