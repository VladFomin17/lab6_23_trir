<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

// Получение данных
$applicationId = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");

// Получение нужной заявки
$application = $usersRepository->getApplicationById($applicationId);

// Отправка ответа
echo json_encode([
    "success" => true,
    "application" => $application ?? []
]);