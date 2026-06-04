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
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint API tidak ditemukan']);
}
