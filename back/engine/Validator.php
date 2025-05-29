<?php

/**
 * Класс валидации
 */
class Validator
{
    /**
     * Валидация логина пользователя
     *
     * @param string $login Логин
     * @param JsonRepository $usersRepository Хранилище данных
     * @return bool
     */
    public static function validateLogin(string $login, JsonRepository $usersRepository): bool
    {
        if ($usersRepository->findByLogin($login)) {
            return false;
        }
        return true;
    }

    /**
     * Валидация номера телефона
     *
     * @param string $phoneNumber Номер телефона
     * @return bool
     */
    public static function validatePhone(string $phoneNumber): bool
    {
        return preg_match("/^\+?\d{1,3}[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/", $phoneNumber);
    }

    /**
     * Валидация пароля
     *
     * @param string $password Пароль
     * @return bool
     */
    public static function validatePassword(string $password): bool
    {
        if ($password)
        {
            return preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/", $password);
        }
        return true;
    }

    /**
     * Валидация заявки
     *
     * @param array $newApplication Новая заявка
     * @param JsonRepository $usersRepository Хранилище данных
     * @return string
     */
    public static function validateApplication(array $newApplication, JsonRepository $usersRepository): string
    {
        if ($usersRepository->findByLogin($newApplication['login'])) {
            $currentUser = $usersRepository->findByLogin($newApplication['login']);
            foreach ($currentUser['applications'] as $application) {
                if (
                    $application['husbandName'] == $newApplication['husbandName'] &&
                    $application['wifeName'] == $newApplication['wifeName'] &&
                    $application['contactNumber'] == $newApplication['contactNumber'] &&
                    $application['marriagePlace'] == $newApplication['marriagePlace']
                ) {
                    $id = $application['id'];
                    return $id;
                }
            }
        }
        return 0;
    }

    /**
     * Валидация всех полей
     *
     * @param array $data Данные пользователя
     * @param JsonRepository $usersRepository Хранилище данных
     * @return array
     */
    public static function validateAll(array $data, JsonRepository $usersRepository): array
    {
        $errors = [];
        if (!self::validateLogin($data['login'], $usersRepository)) {
            $id = $usersRepository->findByLogin($data['login'])['id'];
            $errors['login'] = 'Пользователь с таким логином уже существует. ID ' . $id;
        }
        if (!self::validatePhone($data['contactNumber'])) {
            $errors['contactNumber'] = 'Номер телефона должен быть в формате +7(XXX)XXX-XX-XX';
        }
        if (!self::validatePassword($data['password'])) {
            $errors['password'] = '
                Пароль должен содержать минимум 6 символов, включая цифры, заглавные и строчные буквы
            ';
        }
        if (self::validateApplication($data, $usersRepository)) {
            $id = self::validateApplication($data, $usersRepository);
            $errors['registration'] = 'Такая заявка уже существует. ID ' . $id;
        }

        return $errors;
    }
}