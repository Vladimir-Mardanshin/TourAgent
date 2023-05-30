import { createWebHistory, createRouter } from "vue-router";
// импорт компонентов
import ListUsers from "./components/user/ListUsers";
import Login from "./components/authorization/Login";
import Profile from "./components/authorization/Profile";
import Register from "./components/authorization/Register";
import RegisterAdmin from "./components/authorization/RegisterAdmin";
import AddTour from "./components/tour/AddTour";
import ListTours from "./components/tour/ListTours";
import AddTourImg from "./components/tour/AddTourImg";
import Tour from "./components/tour/Tour";
import ListTickets from "./components/ticket/ListTickets";
import Ticket from "./components/ticket/Ticket";
import AddTicket from "./components/ticket/AddTicket";
// определяем маршруты
const routes = [
    {
        path: "/listUsers", // указание маршрута, по которому будем переходить к списку абитуриентов
        name: "users", // имя маршрута
        alias: "/users", // указание дополнительного маршрута
        component: ListUsers, // компонент, на основании которого будет отрисовываться страница
        meta: {
            title: "Список Пользователей"
        }
    },
    {
        path: "/login",
        name: "login-user",
        component: Login,
        meta: {
            title: "Вход в систему"
        }
    },
    {
        path: "/register",
        name: "register-user",
        component: Register,
        meta: {
            title: "Регистрация"
        }
    },
    {
        path: "/registerAdmin",
        name: "register-admin",
        component: RegisterAdmin,
        meta: {
            title: "Регистрация администратора"
        }
    },
    {
        path: "/profile",
        name: "profile-user",
        component: Profile,
        meta: {
            title: "Профиль пользователя",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
            requiredAuth: true
        }
    },
    {
        path: "/addTour",
        name: "addTour",
        component: AddTour,
        meta: {
            title: "Добавление тура",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
            requiredAuth: true
        }
    },
    {
        path: "/listTours",
        name: "listTours",
        component: ListTours,
        meta: {
            title: "Туры",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
        }
    },
    {
        path: "/addTourImg",
        name: "addTourImg",
        component: AddTourImg,
        meta: {
            title: "Добавление изображений для тура",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
            requiredAuth: true
        }
    },
    {
        path: "/tour/:id",
        name: "tour-details",
        component: Tour,
        props: true,
        meta: {
            title: "Подробная информация о туре",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
            requiredAuth: true
        }
    },
    {
        path: "/listTickets",
        name: "listTickets",
        component: ListTickets,
        meta: {
            title: "Билеты",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
        }
    },
    {
        path: "/ticket/:id",
        name: "ticket-details",
        component: Ticket,
        props: true,
        meta: {
            title: "Подробная информация о билете",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
            requiredAuth: true
        }
    },
    {
        path: "/addTicket",
        name: "addTicket",
        component: AddTicket,
        meta: {
            title: "Добавление билета",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
            requiredAuth: true
        }
    },
];

const router = createRouter({
    history: createWebHistory(), // указываем, что будет создаваться история посещений веб-страниц
    routes // подключаем маршрутизацию
});


import store from "./store/index";

// указание заголовка компонентам (тега title), заголовки определены в meta
router.beforeEach(async (to, from, next) => {
    // для тех маршрутов, для которых не определены компоненты, подключается только App.vue
    // поэтому устанавливаем заголовком по умолчанию название "Главная страница"
    document.title = to.meta.title || 'Главная страница';

    // проверяем наличие токена и срок его действия
    const auth = await store.getters["auth/isTokenActive"];
    if (auth) {
        return next();
    }
    // если токена нет или его срок действия истёк, а страница доступна только авторизованному пользователю,
    // то переходим на страницу входа в систему (ссылка на /login)
    else if (!auth && to.meta.requiredAuth) {
        const user = JSON.parse(localStorage.getItem("user"));
        await store.dispatch("auth/refreshToken", user)
            .then(() => {
                return next();
            })
            .catch(() => {
                return next({path: "/login"});
            });
        return next({ path: "/login" });
    }
    return next();
});
export default router;