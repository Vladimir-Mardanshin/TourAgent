<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li v-if="currentUser" class="nav-item">
            <router-link to="/listUsers" class="nav-link" v-if="currentUser.role === 'Администратор'">
              Пользователи
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/listTours" class="nav-link">
              Туры
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/listTickets" class="nav-link">
              Билеты
            </router-link>
          </li>
          <li v-if="currentUser" class="nav-item">
            <router-link to="/registerAdmin" class="nav-link" v-if="currentUser.role === 'Администратор'">
              Регистрация администратора
            </router-link>
          </li>
        </ul>

        <div v-if="currentUser" class="ms-auto">
          <div class="d-flex align-items-center">
            <router-link to="/profile" class="nav-link">
              <span class="email-container">{{ currentUser.email }}</span>
            </router-link>
            <span class="but-container">
              <button class="btn btn-light" @click.prevent="logOut">
                Выйти
              </button>
            </span>
          </div>
        </div>

        <div v-else class="ms-auto">
          <div class="nav-links">
            <router-link to="/login" class="nav-link">
              Войти
            </router-link>
            <router-link to="/register" class="nav-link">
              Регистрация
            </router-link>
          </div>
        </div>

      </div>
    </nav>
  </div>
</template>

  
<script>
export default {
    name: "NavBar",
    data() {
        return {};

    },
    computed: { // вычисляемые свойства
        currentUser() {
            return this.$store.state.auth.user;
        }
    },
    methods: {
        logOut() {
            this.$store.dispatch('auth/logout'); // обращаемся к методу logout, который определён в auth.service.js
            window.location.href = '/login'; // // Используем такую конструкцию, а не this.$router.push, так как требуется перезагрузить страницу для обновления локального хранилища
        }
    }
};
</script>
  
  <style scoped>
    .nav-link {
      font-size: 20px; /* Увеличьте размер шрифта по вашему усмотрению */
      color: white;
      font-family: "Comic Sans MS", cursive;
      /* Дополнительные стили, если необходимо */
    }

    .ms-auto {
      padding-right: 18px;
    }

    .nav-link:hover {
      color: #00FFFF;
    }

    .nav-links {
      display: flex;
      align-items: center; /* Выравнивание элементов по вертикали */
    }

    .nav-link {
      margin-right: 15px; /* Отступ между элементами */
    }
    .but-container {
      padding-right: 15px; /* Измените значение, чтобы получить нужный отступ */
      color: white;
      font-family: "Comic Sans MS", cursive;
      font-size: 18px; /* Размер шрифта */
    }
    .navbar-nav{
      padding-left: 30px;
    }
    .ml-auto{
      margin-left: auto;
    }
    .navbar-brand{
      font-size: 12pt !important;
    }
    .navbar-brand-button{
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
    .bg-custom {
        background-color: #F9B5D0;
    }
  </style>