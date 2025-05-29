<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';

// Получение данных
$data = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");

// Сохранение Id заявки в отдельную переменную
$applicationId = $data["applicationId"];
unset($data["applicationId"]);

// Отправка ответа
if ($usersRepository->editApplication($applicationId, $data)) {
    echo json_encode(["success" => true, "message" => "Заявка отредактирована"]);
} else {
    echo json_encode(["success" => false, "message" => "Произошла ошибка при изменении заявки"]);
}