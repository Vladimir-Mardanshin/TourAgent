<template>
  <div class="text-center mt-4" style="padding-top: 20px;">
    <h4 class="mx-auto mt-4">Регистрация администратора</h4>
    <form name="form" @submit="handleRegister">
      <div v-if="!successful">
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
          <input type="text" class="form-control text-center mt-3" name="lastname" placeholder="Фамилия" v-model="user.lastname" required/>
        </div>
      </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
          <input type="text" class="form-control text-center" name="firstname" placeholder="Имя" v-model="user.firstname" required/>
        </div>
      </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
          <input type="text" class="form-control text-center" name="patronymic" placeholder="Отчество" v-model="user.patronymic" required/>
        </div>
      </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
          <input type="text" class="form-control text-center" name="phone" placeholder="Номер телефона" v-model="user.phone" required/>
        </div>
      </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
          <input type="email" class="form-control text-center" name="email" placeholder="Электронная почта" v-model="user.email" required/>
        </div>
      </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
          <input type="password" class="form-control text-center" name="password" placeholder="Пароль" v-model="user.password" required/>
        </div>
      </div>
        <div class="row justify-content-center">
          <div class="form-group mb-3 col-md-3">
          <button class="btn btn-primary">Зарегистрировать</button>
        </div>
        </div>
      </div>
      <div class="form-group mb-3" style="margin-top: 50px;">
        <div v-if="successMessage" class="alert alert-success" role="alert">{{ successMessage }}</div>
      </div>
      <div class="form-group mb-3" style="margin-top: 50px;">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterAdmin',
  data() {
    return {
      user: {
        lastname: '',
        firstname: '',
        patronymic: '',
        phone: '',
        email: '',
        password: ''
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
  methods: {
    handleRegister(e) {
      e.preventDefault();
      this.successMessage = '';
      this.errorMessage = '';
      this.$store
        .dispatch('auth/registerAdmin', this.user)
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
