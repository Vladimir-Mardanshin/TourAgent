<template>
  <div class="text-center mt-4" style="padding-top: 20px;">
    <h4 class="mx-auto mt-4">Добавление билета</h4>
    <div v-if="!submitted">
      <form @submit.prevent="addTicket" class="my-4">
        <div class="mb-3">
          <label for="flight_number" class="form-label">Номер рейса</label>
          <input type="text" id="flight_number" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите номер рейса" v-model="ticket.flight_number" required>
        </div>
        <div class="mb-3">
          <label for="departure_city" class="form-label">Место вылета</label>
          <input type="text" id="departure_city" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите место вылета" v-model="ticket.departure_city" required>
        </div>
        <div class="mb-3">
          <label for="arrival_city" class="form-label">Место прибытия</label>
          <input type="text" id="arrival_city" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите место прибытия" v-model="ticket.arrival_city" required>
        </div>
        <div class="mb-3">
          <label for="cost" class="form-label">Стоимость</label>
          <input type="number" id="cost" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите стоимость" v-model="ticket.cost" required>
        </div>
        <div class="mb-3">
          <label for="count" class="form-label">Количество</label>
          <input type="number" id="count" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите количество" v-model="ticket.count" required>
        </div>
        <div class="mb-3">
          <label for="departure_date" class="form-label">Дата отправления</label>
          <input type="date" id="departure_date" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите дату отправления" v-model="ticket.departure_date" required>
        </div>
        <div class="mb-3">
          <label for="departure_time" class="form-label">Время отправления</label>
          <input type="time" id="departure_time" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите время отправления" v-model="ticket.departure_time" required>
        </div>
        <div class="mb-3">
          <label for="arrival_date" class="form-label">Дата прибытия</label>
          <input type="date" id="arrival_date" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите дату прибытия" v-model="ticket.arrival_date" required>
        </div>
        <div class="mb-3">
          <label for="arrival_time" class="form-label">Время прибытия</label>
          <input type="time" id="arrival_time" class="form-control text-center mx-auto" style="width: 400px;" placeholder="Введите время прибытия" v-model="ticket.arrival_time" required>
        </div>
        <button type="submit" class="btn btn-primary">Добавить</button>
      </form>
    </div>
    <div v-else>
      <div style="margin-top: 20px;" class="alert alert-success">Вы успешно добавили запись</div>
      <div>
        <button @click="newTicket" class="btn btn-primary" style="margin-top: 10px;">Добавить новый билет</button>
      </div>
      <div>
        <router-link to="/listTickets" style="margin-top: 20px;" class="btn btn-secondary">Вернуться к списку билетов</router-link>
      </div>
    </div>
    <p :class="purchaseMessageClass" style="text-align: center;">{{ purchaseMessage }}</p>
  </div>
</template>

<script>
import http from "../../http-common";

export default {
  name: "AddTicket",
  data() {
    return {
      ticket: {
        id: "",
        flight_number: "",
        departure_city: "",
        arrival_city: "",
        cost: "",
        count: "",
        departure_date: "",
        departure_time: "",
        arrival_date: "",
        arrival_time: ""
      },
      submitted: false,
      purchaseMessage: ""
    };
  },
  methods: {
    addTicket(e) {
      e.preventDefault();
      var data = {
        flight_number: this.ticket.flight_number,
        departure_city: this.ticket.departure_city,
        arrival_city: this.ticket.arrival_city,
        cost: this.ticket.cost,
        count: this.ticket.count,
        departure_date: this.ticket.departure_date,
        departure_time: this.ticket.departure_time,
        arrival_date: this.ticket.arrival_date,
        arrival_time: this.ticket.arrival_time
      };

      http
        .post("/addTicket", data)
        .then(response => {
          this.ticket.id = response.data.id;
          this.submitted = true;
        })
        .catch(e => {
          if (e.response && e.response.status === 400) {
            this.purchaseMessage = "Такой номер рейса уже существует";
            this.purchaseMessageClass = 'alert alert-danger';
          } else {
            console.log(e);
          }
        });
    },
    newTicket() {
      this.submitted = false;
      this.ticket = {
        id: null,
        flight_number: "",
        departure_city: "",
        arrival_city: "",
        cost: "",
        count: "",
        departure_date: "",
        departure_time: "",
        arrival_date: "",
        arrival_time: ""
      };
      this.purchaseMessage = "";
    }
  }
};
</script>
