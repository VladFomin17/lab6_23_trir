<?php

/**
 * Интерфейс репозитория
 *
 * Определяет стандартный набор операций для работы с хранилищем
 */
interface Repository
{
    /**
     * Получить все записи из хранилища
     *
     * @return array
     */
    public function findAll(): array;

    /**
     * Получить элемент по id
     *
     * @param string $id Id
     * @return array|null
     */
    public function findById(string $id): ?array;

    /**
     * Получить элемент по логину
     *
     * @param string $email Логин
     * @return array|null
     */
    public function findByLogin(string $email): ?array;

    /**
     * Сохранить данные в хранилище
     *
     * @param array $data Данные
     * @return array
     */
    public function save(array $data): array;

    /**
     * Обновить данные по идентификатору
     *
     * @param string $id Id
     * @param array $data Новые данные
     * @return array
     */
    public function update(string $id, array $data): array;

    /**
     * Удалить данные по идентификатору
     *
     * @param string $id Идентификатор
     * @return bool
     */
    public function delete(string $id): bool;
}