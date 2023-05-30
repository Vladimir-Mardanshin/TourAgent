<template>
  <div class="text-center mt-2">
    <div>
      <img src="/aviasales.png" alt="Example Image" style="height: 200px;">
    </div>
    <h4 class="mx-auto">Регистрация пользователя</h4>
    <form name="form" @submit="handleRegister">
      <div v-if="!successful">
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
            <input type="text" class="form-control text-center mt-3" name="lastname" placeholder="Фамилия" v-model="user.lastname" required>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
            <input type="text" class="form-control text-center" name="firstname" placeholder="Имя" v-model="user.firstname" required>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
            <input type="text" class="form-control text-center" name="patronymic" placeholder="Отчество" v-model="user.patronymic" required>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
            <input type="text" class="form-control text-center" name="phone" placeholder="Номер телефона" v-model="user.phone" required>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
            <input type="email" class="form-control text-center" name="email" placeholder="Электронная почта" v-model="user.email" required>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
            <input type="password" class="form-control text-center" name="password" placeholder="Пароль" v-model="user.password" required>
          </div>
        </div>
        <div class="row justify-content-center mt-2">
          <div class="form-group mb-3 col-md-3">
            <button class="btn btn-primary" type="submit">Зарегистрировать</button>
          </div>
        </div>
      </div>
      <div class="form-group mb-3" style="margin-top: 50px;">
        <div v-if="successMessage" class="alert alert-success" role="alert">{{ successMessage }}</div>
      </div>
      <div class="form-group mb-3">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
      </div>
    </form>
  </div>
</template>





  <script>
  export default {
    name: 'RegisterUser',
    data() {
      return {
        user: {
          lastname: "",
          firstname: "",
          patronymic: "",
          phone: "",
          email: "",
          password: ""
        },
        successful: false,
        successMessage: '',
        errorMessage: ''
      };
    },
    computed: {
      loggedIn() {
        return this.$store.state.auth.status.loggedIn;
      }
    },
    mounted() {
      if (this.loggedIn) {
        // Авторизация прошла успешно, переходим к главной странице.
        // Используем такую конструкцию, а не this.$router.push, так как требуется перезагрузить страницу для обновления локального хранилища
        window.location.href = '/';
      }
    },
    methods: {
      handleRegister(e) {
        e.preventDefault();
        this.successMessage = '';
        this.errorMessage = '';
        this.$store.dispatch("auth/registerUser", this.user) // обращаемся к методу register, который определён в auth.service.js
            .then(data => {
              this.successMessage = data.message;
              this.successful = true;
            })
            .catch(e => {
              this.errorMessage = e.response.data.message;
            });
      }
    }
  };
  </script>