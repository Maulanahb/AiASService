<?php

/**
 * File ini menangani semua rute API layaknya web.php atau api.php di Laravel
 * Instance $controller di-inject dari public/index.php
 */

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && $action === 'history') {
    $controller->getHistory();
} elseif ($method === 'POST' && $action === 'process') {
    $controller->processTransaction();
} elseif ($method === 'DELETE' && $action === 'delete') {
    $controller->deleteTransaction();
} elseif ($method === 'GET' && $action === 'savings') {
    $savingsController->getSavings();
} elseif ($method === 'POST' && $action === 'savings_create') {
    $savingsController->createGoal();
} elseif ($method === 'POST' && $action === 'savings_add_fund') {
    $savingsController->addFund();
} elseif ($method === 'DELETE' && $action === 'savings_delete') {
    $savingsController->deleteGoal();
} elseif ($method === 'GET' && $action === 'budgets') {
    $budgetController->getBudgets();
} elseif ($method === 'POST' && $action === 'budget_save') {
    $budgetController->saveBudget();
} elseif ($method === 'DELETE' && $action === 'budget_delete') {
    $budgetController->deleteBudget();
} elseif ($method === 'POST' && $action === 'chat') {
    $chatController->handleChat();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint API tidak ditemukan']);
}
