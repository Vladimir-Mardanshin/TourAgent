<template>
  <div class="text-center mt-2">
    <div>
      <img src="/aviasales.png" alt="Example Image" style="height: 200px;">
    </div>
    <h4 class="text-center" style="font-family: Comic Sans MS, cursive;">Вход в систему</h4>
    <div class="d-flex justify-content-center">
      <form name="form" @submit.prevent="handleLogin" class="form-inline" ref="loginForm">
        <div class="form-group mb-3" :class="{ 'move-left': submitted, 'move-right': submitted }">
          <input type="email" class="form-control text-center wide-input mt-3" name="email" placeholder="E-mail" v-model="user.email" required :disabled="submitted">
        </div>
        <div class="form-group mb-3" :class="{ 'move-right': submitted, 'move-left': submitted }">
          <input type="password" class="form-control text-center wide-input" name="password" placeholder="Пароль" v-model="user.password" required :disabled="submitted">
        </div>
        <div class="form-group mb-3">
          <button class="btn btn-primary btn-block mt-2" style="font-family: Comic Sans MS, cursive;" :disabled="loading || submitted">
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
      message: '',
      submitted: false
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
  this.submitted = true;
  this.loading = true;

  this.$store.dispatch("auth/login", this.user)
    .then(() => {
      this.loading = false;
      window.location.href = '/';
    })
    .catch(e => {
      this.loading = false;
      this.message = e.response.data.message;
      this.submitted = false;
    });
}

  }
};
</script>

<style>
.wide-input {
  width: 100%;
}

.move-left {
  animation: move-left-animation 0.5s ease;
}

.move-right {
  animation: move-right-animation 0.5s ease;
}

@keyframes move-left-animation {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes move-right-animation {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>


