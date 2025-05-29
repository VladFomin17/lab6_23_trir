<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';
require_once '../engine/Validator.php';

// Получение данных из формы
$data = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");

// Валидация данных
$errors = Validator::validateAll($data, $usersRepository);
unset($errors['login']);
if (!empty($errors)) {
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
}

// Создание заявки
$user = $usersRepository->findByLogin($data['login']);
$application = [
    'husbandName' => $data['husbandName'],
    'wifeName' => $data['wifeName'],
    'contactNumber' => $data['contactNumber'],
    'login' => $data['login'],
    'marriagePlace' => $data['marriagePlace']
];
$usersRepository->addApplication($user['id'], $application);

echo json_encode(["success" => true, "message" => "Заявка отправлена"]);
