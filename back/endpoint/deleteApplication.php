<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

// Получение данных
$user = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");

// Удаление заявки
$isDeleted = $usersRepository->delApplication($user);

// Отправка ответа
if ($isDeleted) {
    echo json_encode(["success" => true, "message" => "Application deleted"]);
} else {
    echo json_encode(["success" => false, "message" => "Application not deleted"]);
}