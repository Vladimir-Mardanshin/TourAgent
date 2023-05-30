<template>
  <div class="text-center mt-4" style="padding-top: 20px;">
      
    <h4 class="mx-auto">Редактирование тура</h4>
    <div v-if="tour">
      <form @submit="updateTour">
        <div class="mb-3">
          <label for="name" class="form-label">Название</label>
          <input type="text" style="width: 450px;" class="form-control text-center mx-auto" id="name" placeholder="Введите название" v-model="tour.name" required>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Описание</label>
          <input type="text" style="width: 450px;" class="form-control text-center mx-auto" id="description" placeholder="Введите описание" v-model="tour.description" required>
        </div>
        <div class="mb-3">
          <label for="cost" class="form-label">Стоимость</label>
          <input type="number" style="width: 450px;" class="form-control text-center mx-auto" id="cost" placeholder="Введите стоимость тура" v-model="tour.cost" required>
        </div>
        <div class="mb-3">
          <label for="start_date" class="form-label">Дата начала тура</label>
          <input type="datetime-local" style="width: 450px;" class="form-control text-center mx-auto" id="start_date" placeholder="Введите дату начала тура" v-model="tour.start_date" required>
        </div>
        <div class="mb-3">
          <label for="end_date" class="form-label">Дата окончания тура</label>
          <input type="datetime-local" style="width: 450px;" class="form-control text-center mx-auto" id="end_date" placeholder="Введите дату окончания тура" v-model="tour.end_date" required>
        </div>

        <button type="submit" style="margin-right: 10px; margin-bottom: 50px;" class="btn btn-primary">Обновить</button>
        <button type="button" style="margin-left: 10px; margin-bottom: 50px;" class="btn btn-danger" v-on:click="deleteTour">Удалить</button>
      </form>
    </div>
    <div v-else>
      <p>Выберите тур</p>
    </div>
  </div>
</template>

<script>
import http from "../../http-common";
export default {
  name: "TourDetails",
  props: ['id'], // входные параметры
  data() {
    return {
      tour: null
    };
  },
  methods: {
    getTour() {
      http
        .get("/tour/" + this.id)
        .then(response => {
          this.tour = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateTour(e) {
      e.preventDefault();
      var data = {
        name: this.tour.name,
        description: this.tour.description,
        cost: this.tour.cost,
        start_date: this.tour.start_date,
        end_date: this.tour.end_date
      };

      http
        .post("/updateTour/" + this.id, data)
        .then(() => {
          this.$router.push('/listTours');
        })
        .catch(e => {
          console.log(e);
        });
    },
    deleteTour() {
      http
        .post("/deleteTour/" + this.tour.id)
        .then(() => {
          this.$router.push('/listTours');
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.getTour();
  }
};
</script>
