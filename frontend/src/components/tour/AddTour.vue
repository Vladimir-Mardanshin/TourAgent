<template>
  <div class="text-center mt-4" style="padding-top: 20px;">
    <h4 class="mx-auto mt-4">Добавление тура</h4>
    <div v-if="!submitted">
      <form @submit.prevent="addTour" class="needs-validation">
        <div class="mb-3">
          <label for="name" class="form-label">Название</label>
          <input type="text" id="name" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите название" v-model="tour.name" required>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Описание</label>
          <input type="text" id="description" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите описание" v-model="tour.description" required>
        </div>
        <div class="mb-3">
          <label for="cost" class="form-label">Стоимость</label>
          <input type="number" id="cost" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите стоимость тура" v-model="tour.cost" required>
        </div>
        <div class="mb-3">
          <label for="start_date" class="form-label">Дата начала тура</label>
          <input type="datetime-local" id="start_date" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите дату начала тура" v-model="tour.start_date" required>
        </div>
        <div class="mb-3">
          <label for="end_date" class="form-label">Дата окончания тура</label>
          <input type="datetime-local" id="end_date" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите дату окончания тура" v-model="tour.end_date" required>
        </div>
        <button type="submit" class="btn btn-primary">Добавить</button>
      </form>
    </div>
    <div v-else>
      <h4 style="margin-top: 20px;" class="alert alert-success">Вы успешно добавили запись</h4>
      <div>
        <button v-on:click="newTour" class="btn btn-primary" style="margin-top: 10px;">Добавить новый тур</button>
      </div>
      <div class="mb-3">
        <router-link to="/listTours" style="margin-top: 20px;" class="btn btn-secondary">Вернуться к списку туров</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../../http-common";
export default {
  name: "AddTour",
  data() {
    return {
      tour: {
        id: null,
        name: "",
        description: "",
        cost: "",
        start_date: "",
        end_date: ""
      },
      submitted: false
    };
  },
  methods: {
    addTour(e) {
      e.preventDefault();
      var data = {
        name: this.tour.name,
        description: this.tour.description,
        cost: this.tour.cost,
        start_date: this.tour.start_date,
        end_date: this.tour.end_date
      };
      console.log(data);
      http
        .post("/addTour", data)
        .then((response) => {
          // запрос выполнился успешно
          this.tour.id = response.data.id;
          this.submitted = true;
        })
        .catch((e) => {
          // при выполнении запроса возникли ошибки
          console.log(e);
        });
    },
    newTour() {
      this.submitted = false;
      this.tour = {
        id: null,
        name: "",
        description: "",
        cost: "",
        start_date: "",
        end_date: ""
      };
    }
  }
};
</script>
