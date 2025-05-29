import {ApiClient} from "./ApiClient.js";

/**
 * Функция, обработчик события, при котором происходит переход на страницу регистрации
 *
 * @listens click
 * @return {void}
 */
document.getElementById('registration-button').addEventListener('click',function() {
    localStorage.setItem("actionType", "registration");
    window.location.href = "front/html/registration.html";
});

/**
 * Функция, вызывающая обработчик отправки формы после загрузки страницы
 *
 * @listens DOMContentLoaded
 * @return {void}
 */
document.addEventListener("DOMContentLoaded", function() {

    /**
     * Функция, обработчик события отправки формы авторизации
     *
     * @async
     * @listens submit
     * @param {object} e - объект события
     * @return {void}
     */
    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const ERROR_DIV = document.getElementById("error-message");
        ERROR_DIV.textContent = "";

        const LOGIN = document.getElementById("login");
        const PASSWORD = document.getElementById("password");

        const USER_DATA = {
            login: LOGIN.value.trim(),
            password: PASSWORD.value.trim()
        };

        const API = new ApiClient("back/endpoint/login.php");
        const RESULT = await API.post(USER_DATA);

        if (RESULT.success) {
            localStorage.setItem("currentUser", JSON.stringify(RESULT.user));
            localStorage.setItem("visits", JSON.stringify(RESULT.user.visits));
            window.location.href = "front/html/cabinet.html";
        } else {
            document.getElementById("error-message").textContent = RESULT.message || "Неверный логин или пароль";
        }
    });
});

/**
 *  Функция, обрабатывающая нажатие кнопки "показать пароль" при вводе
 *
 *  @returns {void}
 */
document.querySelector('.toggle-password').addEventListener('click', function() {
    const PASSWORD_INPUT = document.getElementById('password');
    const EYE_ICON = this.querySelector('.eye-icon');

    if (PASSWORD_INPUT.type === 'password') {
        PASSWORD_INPUT.type = 'text';
        EYE_ICON.textContent = '🙈';
    } else {
        PASSWORD_INPUT.type = 'password';
        EYE_ICON.textContent = '👁️';
    }
});