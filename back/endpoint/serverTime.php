<?php

header('Content-Type: application/json');

// Отправка времени сервера
echo json_encode([
    'success' => true,
    'serverTime' => date('Y-m-d H:i:s'),
    'timezone' => date_default_timezone_get()
]);
