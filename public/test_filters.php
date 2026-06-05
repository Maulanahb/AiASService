<?php
$periods = ['all', 'bulanan', 'mingguan', 'harian'];
$results = [];
foreach ($periods as $p) {
    $ch = curl_init("http://localhost/AiASService/public/index.php?action=history&period=$p");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $data = json_decode($response, true);
    if ($data && isset($data['data'])) {
        $results[$p] = count($data['data']['transactions']);
    } else {
        $results[$p] = "Error: " . substr($response, 0, 100);
    }
    curl_close($ch);
}
echo json_encode($results);
