<template>
    <div class="text-center mt-4" style="padding-top: 20px;">
      <h4 class="mx-auto mt-4">Редактирование билета</h4>
      <div v-if="ticket">
        <form @submit="updateTicket" class="ticket-form">
          <div class="mb-3">
            <label for="flight_number" class="form-label">Номер рейса</label>
            <input type="text" id="flight_number" class="form-control text-center mx-auto" placeholder="Введите номер рейса" v-model="ticket.flight_number" required>
          </div>
          <div class="mb-3">
            <label for="departure_city" class="form-label">Место вылета</label>
            <input type="text" id="departure_city" class="form-control text-center mx-auto" placeholder="Введите место вылета" v-model="ticket.departure_city" required>
          </div>
          <div class="mb-3">
            <label for="arrival_city" class="form-label">Место прибытия</label>
            <input type="text" id="arrival_city" class="form-control text-center mx-auto" placeholder="Введите место прибытия" v-model="ticket.arrival_city" required>
          </div>
          <div class="mb-3">
            <label for="cost" class="form-label">Стоимость</label>
            <input type="number" id="cost" class="form-control text-center mx-auto" placeholder="Введите стоимость" v-model="ticket.cost" required>
          </div>
          <div class="mb-3">
            <label for="count" class="form-label">Количество</label>
            <input type="number" id="count" class="form-control text-center mx-auto" placeholder="Введите количество" v-model="ticket.count" required>
          </div>
          <div class="mb-3">
            <label for="departure_date" class="form-label">Дата отправления</label>
            <input type="date" id="departure_date" class="form-control text-center mx-auto" :min="getCurrentDate()" placeholder="Введите дату отправления" v-model="ticket.departure_date" required>
          </div>
          <div class="mb-3">
            <label for="departure_time" class="form-label">Время отправления</label>
            <input type="time" id="departure_time" class="form-control text-center mx-auto" placeholder="Введите время отправления" v-model="ticket.departure_time" required>
          </div>
          <div class="mb-3">
            <label for="arrival_date" class="form-label">Дата прибытия</label>
            <input type="date" id="arrival_date" class="form-control text-center mx-auto" :min="getCurrentDate()" placeholder="Введите дату прибытия" v-model="ticket.arrival_date" required>
          </div>
          <div class="mb-3">
            <label for="arrival_time" class="form-label">Время прибытия</label>
            <input type="time" id="arrival_time" class="form-control text-center mx-auto" placeholder="Введите время прибытия" v-model="ticket.arrival_time" required>
          </div>
          <button type="submit" style="margin-right: 10px; margin-bottom: 50px;" class="btn btn-primary">Обновить</button>
          <button type="button" style="margin-left: 10px; margin-bottom: 50px;" @click="deleteTicket()" class="btn btn-danger">Удалить</button>
        </form>
      </div>
      <div v-else>
        <p>Выберите билет</p>
      </div>
    </div>
  </template>
  
  <script>
  import http from "../../http-common";
  export default {
    name: "TicketDetails",
    props: ["id"], // входные параметры
    data() {
      return {
        ticket: null
      };
    },
    methods: {
      getTicket() {
        http
          .get("/ticket/" + this.id)
          .then(response => {
            this.ticket = response.data;
          })
          .catch(e => {
            console.log(e);
          });
      },
      getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Форматирование даты в формат, принимаемый атрибутом `min`
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  },
      updateTicket(e) {
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
          .post("/updateTicket/" + this.id, data)
          .then(() => {
            this.$router.push("/listTickets");
          })
          .catch(e => {
            console.log(e);
          });
      },
      deleteTicket() {
        http
          .post("/deleteTicket/" + this.ticket.id)
          .then(() => {
            this.$router.push("/listTickets");
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    mounted() {
      this.getTicket();
    }
  };
  </script>
  
  <style scoped>
  .ticket-form {
    max-width: 400px;
    margin: 0 auto;
  }
  </style>
  