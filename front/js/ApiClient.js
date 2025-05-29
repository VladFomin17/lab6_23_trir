/**
 * Класс, отправляющий запросы на бэк через JSLib
 *
 * @class
 */
export class ApiClient {
    /**
     * Создает экземпляр ApiClient
     *
     * @constructor
     * @param {string} apiUrl - адрес бэкэнда
     */
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    /**
     * Отправляет POST-запрос
     *
     * @param {object} userData - данные пользователя
     * @returns {object} - результат выполнения запроса
     */
    post(userData) {
        return $.ajax({
            url: this.apiUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(userData),
            dataType: "json"
        });
    }

    /**
     * Отправляет GET-запрос
     *
     * @returns {object} - результат выполнения запроса
     */
    get() {
        return $.ajax({
            url: this.apiUrl,
            type: "GET",
            dataType: "json"
        });
    }
}