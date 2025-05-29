<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

// Получение данных
$data = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");

// Поиск пользователя
$user = $usersRepository->findById($data['userId']);
if (!$user) {
    echo json_encode(["success" => false, "message" => "Пользователь не найден"]);
    exit;
}

// Отправка ответа
echo json_encode([
    "success" => true,
    "applications" => $user['applications'] ?? []
]);
