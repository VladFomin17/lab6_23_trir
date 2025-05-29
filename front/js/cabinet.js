import {ApiClient} from "./ApiClient.js";

/**
 * Функция для обработки нажатия кнопки "Выйти".
 *
 * @listens click
 * @return {void}
 */
document.getElementById("exit-button").addEventListener("click", function() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("visits");
    window.location.href = "../../index.html";
});

/**
 * Функция, вызывающая функции добавления информации о пользователе при загрузке страницы.
 *
 * @listens DOMContentLoaded
 * @return {void}
 */
document.addEventListener("DOMContentLoaded", function() {
    addVisits();
    addUsername();
});

/**
 * Функция, добавляющая имя пользователя на страницу.
 *
 * @return {void}
 */
function addUsername() {
    const USERNAME_CONTAINER = document.getElementById("username-container");
    const USERNAME = JSON.parse(localStorage.getItem("currentUser")).login;
    USERNAME_CONTAINER.textContent = "Личный кабинет: " + USERNAME;
}

/**
 * Функция, добавляющая количество посещений пользователя на страницу.
 *
 * @return {void}
 */
function addVisits() {
    const VISITS_CONTAINER = document.getElementById("visits-container");
    const VISITS = JSON.parse(localStorage.getItem("visits"));
    VISITS_CONTAINER.textContent = "Посещения: " + VISITS.toString();
}

/**
 * Функция, вызывающая функцию загрузки данных с сервера при загрузке страницы.
 *
 * @listens DOMContentLoaded
 * @return {void}
 */
document.addEventListener("DOMContentLoaded", function() {
    const CURRENT_USER = JSON.parse(localStorage.getItem("currentUser"));
    if (!CURRENT_USER?.id) {
        window.location.href = "../../index.html";
        return;
    }
    loadData(CURRENT_USER.id);
});

/**
 * Функция, получающая данные с сервера.
 *
 * @async
 * @param {number} userId - Идентификатор пользователя.
 * @return {Promise<void>}
 */
async function loadData(userId) {
    const API = new ApiClient("../../back/endpoint/cabinet.php");
    const RESULT = await API.post({userId});

    if (RESULT.success) {
        displayData(RESULT.applications);
    } else {
        console.error("Error loading data:", RESULT.message);
        window.location.href = "../../index.html";
    }
}

/**
 * Функция, отображающая полученные данные в таблице.
 *
 * @param {Array<Object>} applications - Массив объектов с данными.
 * @return {void}
 */
function displayData(applications) {
    const TABLE = document.querySelector("table");
    while (TABLE.rows.length > 1) {
        TABLE.deleteRow(1);
    }

    applications.forEach((application) => {
        const ROW = TABLE.insertRow(-1);
        ROW.innerHTML = `
            <td>${application.id}</td>
            <td>${application.husbandName}</td>
            <td>${application.wifeName}</td>
            <td>${application.contactNumber}</td>
            <td>${application.marriagePlace}</td>
            <td>
                <button class="edit-button" data-id="${application.id}">Р</button>
                <button class="delete-button" data-id="${application.id}">Y</button>
            </td>
        `;
    });

    addEditButtonListeners();
    addDeleteButtonListeners();
}

/**
 * Функция, добавляющая обработчики событий для кнопок "Редактировать".
 *
 * @return {void}
 */
function addEditButtonListeners() {
    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", function () {
            const APPLICATION_ID = this.getAttribute("data-id");
            localStorage.setItem("actionType", "editApplication");
            localStorage.setItem("applicationId", APPLICATION_ID);
            window.location.href = "registration.html";
        });
    });
}

/**
 * Функция, добавляющая обработчики событий для кнопок "Удалить".
 *
 * @return {void}
 */
function addDeleteButtonListeners() {
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", async function () {
            const CURRENT_USER = JSON.parse(localStorage.getItem("currentUser"));
            const APPLICATION_ID = this.getAttribute("data-id");
            CURRENT_USER.applicationId = APPLICATION_ID;
            const API = new ApiClient("../../back/endpoint/deleteApplication.php");
            const RESULT = await API.post(CURRENT_USER);
            if (RESULT.success) {
                location.reload();
            } else {
                console.log(RESULT.message);
            }
        });
    });
}

/**
 * Функция, запрашивающая время сервера и отображающая его на странице.
 *
 * @async
 * @return {void}
 */
async function updateServerTime() {
    const API = new ApiClient("../../back/endpoint/serverTime.php");
    const DATA = await API.get();

    if (DATA.success) {
        document.getElementById('server-time-display').textContent = DATA.serverTime;
        document.getElementById('server-timezone').textContent = `Часовой пояс: ${DATA.timezone}`;
    }
}

/**
 * Функция, вызывающая функцию запроса времени сервера каждую секунду.
 *
 * @listens DOMContentLoaded
 * @return {void}
 */
document.addEventListener('DOMContentLoaded', () => {
    updateServerTime();
    setInterval(updateServerTime, 1000);
});

/**
 * Функция, обрабатывающая нажатие кнопки "Добавить заявку".
 *
 * @listens click
 * @return {void}
 */
document.getElementById("addApplication").addEventListener("click", function() {
    localStorage.setItem("actionType", "addApplication");
    window.location.href = "registration.html";
});