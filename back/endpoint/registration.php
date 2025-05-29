<?php

header("Content-Type: application/json");
require_once '../engine/JsonRepository.php';
require_once '../engine/Validator.php';

// Получение данных
$data = json_decode(file_get_contents("php://input"), true);
$usersRepository = new JsonRepository("../database/users.json");

// Валидация данных
$errors = Validator::validateAll($data, $usersRepository);
if (!empty($errors)) {
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
}

// Сохранение данных пользователя
$userData = [
    'login' => $data['login'],
    'password' => $data['password']
];
$user = $usersRepository->save($userData);

// Сохранение заявки пользователя
$application = [
    'husbandName' => $data['husbandName'],
    'wifeName' => $data['wifeName'],
    'contactNumber' => $data['contactNumber'],
    'login' => $data['login'],
    'marriagePlace' => $data['marriagePlace']
];
$usersRepository->addApplication($user['id'], $application);

// Отправка ответа
echo json_encode(["success" => true, "message" => "Успешная регистрация"]);