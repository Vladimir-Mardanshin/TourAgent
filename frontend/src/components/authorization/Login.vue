<template>
  <div class="text-center mt-4" style="padding-top: 20px;">
    <h4 class="text-center mt-2" style="font-family: Comic Sans MS, cursive;">Вход в систему</h4>
    <div class="d-flex justify-content-center">
      <form name="form" @submit="handleLogin" class="form-inline">
        <div class="form-group mb-3">
          <input type="email" class="form-control text-center wide-input mt-3" name="email" placeholder="E-mail" v-model="user.email" required>
        </div>
        <div class="form-group mb-3">
          <input type="password" class="form-control text-center wide-input" name="password" placeholder="Пароль" v-model="user.password" required>
        </div>
        <div class="form-group mb-3">
          <button class="btn btn-primary btn-block mt-2" style="font-family: Comic Sans MS, cursive;" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Войти</span>
          </button>
        </div>
      </form>
    </div>
    <p class="text-center" style="font-family: Comic Sans MS, cursive;">
      Нет аккаунта?
      <router-link to="/register">Зарегистрироваться</router-link>
    </p>
    <div v-if="message" class="alert alert-danger mt-3">{{ message }}</div>
  </div>
</template>



<script>
export default {
  name: 'LoginUser',
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      loading: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      const message = this.$route.params.message;
      if (message) {
        this.message = message;
      }
    }
  },
  methods: {
    handleLogin(e) {
      e.preventDefault();
      this.loading = true;
      this.$store.dispatch("auth/login", this.user)
        .then(() => {
          window.location.href = '/';
        })
        .catch(e => {
          this.loading = false;
          this.message = e.response.data.message;
        });
    }
  }
};
</script>

<style>
.wide-input {
  width: 100%;
}
</style>


