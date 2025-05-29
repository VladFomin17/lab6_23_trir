import { ApiClient } from "./ApiClient.js";

/**
 * Функция, редактирующая форму в зависимости от того, какой тип действия выбран пользователем.
 *
 * @listens {DOMContentLoaded}
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", function () {
    const ACTION_TYPE = localStorage.getItem("actionType");
    if (ACTION_TYPE === "addApplication") changeToApplication();
    if (ACTION_TYPE === "editApplication") changeToEdit();
    if (ACTION_TYPE === "editApplication") {
        const APPLICATION_ID = localStorage.getItem("applicationId");
        fillForm(APPLICATION_ID);
    }

    /**
     * Функция, отправляющая форму на сервер при нажатии на кнопку регистрации
     *
     * @Listens {click}
     * @param {MouseEvent} e
     * @returns {void}
     */
    document.getElementById("registration-button").addEventListener("click", async (e) => {
        e.preventDefault();

        if (!isFormFilled()) {
            document.getElementById("registration-error").textContent = "Все поля должны быть заполнены";
            return;
        }

        const USER_DATA = createUser();
        const API = new ApiClient();

        switch (ACTION_TYPE) {
            case "addApplication":
                USER_DATA.login = JSON.parse(localStorage.getItem("currentUser")).login;
                API.apiUrl = "../../back/endpoint/addApplication.php";
                break;
            case "editApplication":
                API.apiUrl = "../../back/endpoint/editApplication.php";
                USER_DATA.applicationId = localStorage.getItem("applicationId");
                break;
            default:
                API.apiUrl = "../../back/endpoint/registration.php";
                break;
        }

        const RESULT = await API.post(USER_DATA);

        if (!RESULT.success) {
            showErrorMessages(RESULT);
            if (!document.getElementById("registration-error").textContent) {
                document.getElementById("registration-error").textContent = RESULT.message;
            }
        } else {
            if (ACTION_TYPE === "registration") {
                window.location.href = "../../index.html";
            } else {
                window.location.href = "cabinet.html";
            }
        }
    });
});

/**
 * Функция, создающая пользователя на основе данных из формы.
 *
 * @returns {object} Объект с данными пользователя
 */
function createUser() {
    const USER_DATA = {
        husbandName: document.getElementById("husband-name").value,
        wifeName: document.getElementById("wife-name").value,
        contactNumber: document.getElementById("contact-number").value,
        login: document.getElementById("login").value,
        password: document.getElementById("password").value,
        marriagePlace: document.getElementById("marriage-place").value
    };

    return USER_DATA;
}

/**
 * Функция, меняющая страницу для отправления новой заявки
 *
 * @returns {void}
 */
function changeToApplication() {
    const FORM_TITLE = document.getElementById("form-title");
    FORM_TITLE.textContent = "Заявка на регистрацию брака";

    const REGISTRATION_BUTTON = document.getElementById("registration-button");
    REGISTRATION_BUTTON.textContent = "Отправить заявку";

    changeFormFields();
}

/**
 * Функция, меняющая страницу для редактирования заявки
 *
 * @returns {void}
 */
function changeToEdit() {
    const FORM_TITLE = document.getElementById("form-title");
    FORM_TITLE.textContent = "Редактирование заявки";

    const REGISTRATION_BUTTON = document.getElementById("registration-button");
    REGISTRATION_BUTTON.textContent = "Изменить заявку";

    changeFormFields();
}

/**
 * Функция, меняющая форму для отправки заявки или редактирования заявки
 *
 * @returns {void}
 */
function changeFormFields() {
    const LOGIN_FIELD = document.getElementById("login").closest(".form-group");
    LOGIN_FIELD.style.display = "none";
    document.getElementById("login").required = false;

    const PASSWORD_FIELD = document.getElementById("password").closest(".form-group");
    PASSWORD_FIELD.style.display = "none";
    document.getElementById("password").required = false;

    const LOGIN_LINK_CONTAINER = document.querySelector(".login-link-container");
    LOGIN_LINK_CONTAINER.style.display = "none";

    addExitButton();
}

/**
 * Функция, добавляющая кнопку выхода из формы регистрации
 *
 * @returns {void}
 */
function addExitButton() {
    const EXIT_BUTTON = document.createElement('button');
    EXIT_BUTTON.id = "exit-button";
    EXIT_BUTTON.textContent = "Назад";
    const CONTAINER = document.querySelector(".container");
    CONTAINER.append(EXIT_BUTTON);

    exitButtonListener(EXIT_BUTTON);
}

/**
 * Функция, обрабатывающая событие нажатия на кнопку выхода из формы регистрации.
 *
 * @param {HTMLElement} exitButton Кнопка выхода из формы регистрации.
 * @returns {void}
 */
function exitButtonListener(exitButton) {
    exitButton.addEventListener("click", function () {
       window.location.href = "cabinet.html";
    });
}

/**
 * Функция отображения сообщений об ошибках ввода данных.
 *
 * @param {Object} result Объект с результатом валидации данных.
 * @returns {void}
 */
function showErrorMessages(result) {
    if (result.errors) {
        for (const [FIELD, MESSAGE] of Object.entries(result.errors)) {
            const ERROR_CONTAINER = document.getElementById(`${FIELD}-error`);
            if (ERROR_CONTAINER) ERROR_CONTAINER.textContent = MESSAGE;
        }
    }
}

/**
 * Функция, проверяющая, заполнены ли все поля формы регистрации.
 *
 * @returns {boolean} Возвращает true, если все поля заполнены, иначе false.
 */
function isFormFilled() {
    const SELECTORS = ["#husband-name", "#wife-name", "#contact-number", "#login", "#password"];
    for (const SELECTOR of SELECTORS) {
        const FIELD = document.querySelector(SELECTOR);
        if (FIELD.required && !FIELD.value.trim()) {
            return false;
        }
    }
    return true;
}

/**
 * Функция, заполняющая форму данными заявки при её редактировании.
 *
 * @param {number} applicationId Идентификатор заявки.
 * @returns {void}
 */
async function fillForm(applicationId) {
    const API = new ApiClient("../../back/endpoint/getApplication.php");
    const RESULT = await API.post(applicationId);

    const APPLICATION = RESULT.application;

    document.getElementById("husband-name").value = APPLICATION.husbandName;
    document.getElementById("wife-name").value = APPLICATION.wifeName;
    document.getElementById("contact-number").value = APPLICATION.contactNumber;
    document.getElementById("marriage-place").value = APPLICATION.marriagePlace;
}

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

/**
 * Функция, обработчик события, при котором происходит переход на страницу входа
 *
 * @returns {void}
 */
document.getElementById("login-button").addEventListener("click", function(){
    window.location.href="../../index.html";
});
