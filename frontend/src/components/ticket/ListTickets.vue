<template>
  <div>
    <h2 style="margin-left: 15px; margin-top: 15px; font-family: Comic Sans MS, cursive;">Список билетов</h2>
    <div class="row mb-3" style="margin-top: 15px;">
      <div class="col-md-3" style="width: 200px; margin-left: 30px;">
        <label for="departureCity">Город отправления:</label>
        <input class="form-control" style="margin-top: 10px;" type="text" id="departureCity" v-model="departureCity" @input="applyFilters" />
      </div>
      <div class="col-md-3" style="width: 200px;">
        <label for="arrivalCity">Город прибытия:</label>
        <input class="form-control" style="margin-top: 10px;" type="text" id="arrivalCity" v-model="arrivalCity" @input="applyFilters" />
      </div>
      <div class="col-md-3">
        <label for="minPrice">Диапазон стоимости:</label>
        <div class="input-group" style="margin-top: 10px;">
          <input class="form-control" type="number" id="minPrice" v-model.number="minPrice" @input="applyFilters" placeholder="Мин" />
          <span class="input-group-text">-</span>
          <input class="form-control" type="number" v-model.number="maxPrice" @input="checkMaxPrice" placeholder="Макс" />
        </div>
      </div>
      <div class="col-md-3">
        <label for="departureDate">Дата вылета:</label>
        <input class="form-control" style="margin-top: 10px;" type="date" id="departureDate" v-model="departureDate" @change="applyFilters" />
      </div>
    </div>

    <div class="centered-container">
    <table class="table" style="width: 93%; margin-top: 10px;">
  <thead>
    <tr>
      <th>Номер рейса</th>
      <th>Город вылета</th>
      <th>Город прибытия</th>
      <th>Цена</th>
      <th>Количество билетов</th>
      <th>Дата отправления</th>
      <th>Время отправления</th>
      <th>Дата прибытия</th>
      <th>Время прибытия</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(ticket, index) in filteredTickets" :key="index">
      <template v-if="isAdmin">
          <td>
            <router-link :to="{ name: 'ticket-details', params: { id: ticket.id }}">
            {{ ticket.flight_number }}
            </router-link>
          </td>
          <td>{{ ticket.departure_city }}</td>
          <td>{{ ticket.arrival_city }}</td>
          <td>{{ ticket.cost }} руб.</td>
          <td>{{ ticket.count }}</td>
          <td>{{ formatDate(ticket.departure_date) }}</td>
          <td>{{ formatTime(ticket.departure_time) }}</td>
          <td>{{ formatDate(ticket.arrival_date) }}</td>
          <td>{{ formatTime(ticket.arrival_time) }}</td>
      </template>
      <template v-else>
        <td>{{ ticket.flight_number }}</td>
        <td>{{ ticket.departure_city }}</td>
        <td>{{ ticket.arrival_city }}</td>
        <td>{{ ticket.cost }} руб.</td>
        <td>{{ ticket.count }}</td>
        <td>{{ formatDate(ticket.departure_date) }}</td>
        <td>{{ formatTime(ticket.departure_time) }}</td>
        <td>{{ formatDate(ticket.arrival_date) }}</td>
        <td>{{ formatTime(ticket.arrival_time) }}</td>
      </template>
      <td v-if="!isAdmin">
        <button v-if="ticket.count > 0" @click="buyTicket(ticket)" class="btn btn-primary">
          Купить
        </button>
      </td>
    </tr>
  </tbody>
</table>
</div>



    <router-link v-if="isAdmin" class="btn btn-primary" style="margin-left: 30px; margin-top: 10px; font-family: Comic Sans MS, cursive;" to="/addTicket">
      Добавить билет
    </router-link>
    <p :class="purchaseMessageClass" style="text-align: center;">{{ purchaseMessage }}</p>
  </div>
</template>

<script>
import moment from 'moment';
import dayjs from 'dayjs';
import http from "../../http-common";

export default {
  name: "ListTickets",
  data() {
    return {
      tickets: [],
      purchaseMessage: "",
      departureCity: "",
      arrivalCity: "",
      minPrice: null,
      maxPrice: null,
      departureDate: null,
      filteredTickets: [],
      currentTime: null
    };
  },
  methods: {
    fetchTickets() {
      http.get("/listTickets")
        .then(response => {
          this.tickets = response.data;
          this.currentTime = new Date();
          this.applyFilters();
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkMaxPrice() {
      if (this.maxPrice === "") {
        this.maxPrice = null;
      }
      this.applyFilters();
    },
    buyTicket(ticket) {
      if (!this.currentUser) {
        const message = "Извините, для покупки билета мы хотим, чтобы вы зарегистрировались";
        this.$router.push({ path: '/login', query: { message } });
        return;
      }

      if (!this.currentUser) {
        // Пользователь не авторизован, перенаправляем на страницу "/login"
        this.$router.push('/login');
        return;
      }

      if ((this.currentUser.balance - ticket.cost) < 0) {
        this.purchaseMessage = 'На вашем счете недостаточно средств';
        this.purchaseMessageClass = 'alert alert-danger';
        return;
      }

      const saleData = {
        user_id: this.currentUser.id,
        ticket_id: ticket.id,
        order_date: new Date(),
        cost: ticket.cost,
        amount: ticket.cost,
      };

      http.post("/createSaleT", saleData)
        .then(response => {
          const result = response.data;
          this.currentUser.balance = result.user.balance;
          this.purchaseMessage = "Покупка успешна";
          this.purchaseMessageClass = 'alert alert-success';
          // this.$router.go(0);
          this.fetchTickets();
        })
        .catch((error) => {
          console.error(error);
          this.purchaseMessage = "Покупка не удалась";
        });
    },
    formatDate(date) {
      return dayjs(date).format('DD.MM.YYYY');
    },
    formatTime(time) {
      return moment(time, 'HH:mm:ss').format('HH:mm');
    },
    applyFilters() {
      const filteredTickets = this.tickets.filter(ticket => {
        const matchesDepartureCity = !this.departureCity || ticket.departure_city.toLowerCase().includes(this.departureCity.toLowerCase());
        const matchesArrivalCity = !this.arrivalCity || ticket.arrival_city.toLowerCase().includes(this.arrivalCity.toLowerCase());
        const matchesPriceRange = (this.minPrice === null || ticket.cost >= this.minPrice) && (this.maxPrice === null || ticket.cost <= this.maxPrice);
        const matchesDepartureDate = !this.departureDate || dayjs(ticket.departure_date).format('YYYY-MM-DD') === this.departureDate;
        if (this.isAdmin) {
          return matchesDepartureCity && matchesArrivalCity && matchesPriceRange && matchesDepartureDate;
        }
        const departureDateTime = moment(`${ticket.departure_date} ${ticket.departure_time}`, 'YYYY-MM-DD HH:mm:ss');
        const currentDateTime = moment();
        const isDepartureDateTimeValid = departureDateTime.isAfter(currentDateTime);
        const isTwoHoursBeforeDeparture = departureDateTime.diff(currentDateTime, 'hours') >= 2;
        return matchesDepartureCity && matchesArrivalCity && matchesPriceRange && isDepartureDateTimeValid && matchesDepartureDate && isTwoHoursBeforeDeparture; 
      });

      this.filteredTickets = filteredTickets;
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    isAdmin() {
      if (this.currentUser && this.currentUser.role === 'Администратор') {
        return true;
      }
      return false;
    }
  },
  created() {
    this.fetchTickets();
  },
};
</script>

<style>

  .table td, .table th {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center; /* Центрирование данных */
  }

  .table tr:hover {
    background-color: #f5f5f5;
  }

  /* Стили для заголовков таблицы */
  .table thead th {
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
    vertical-align: middle;
    padding: 10px;
    text-align: center;
  }

  /* Стили для ячеек таблицы */
  .table tbody td {
    vertical-align: middle;
    padding: 10px;
  }

  /* Стили для кнопки "Купить" */
  .btn-primary {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }

  /* Стили для ссылок в ячейках таблицы */
  .table tbody td a {
    color: #007bff;
    text-decoration: none;
  }

  .centered-container {
    display: flex;
    justify-content: center;
  }


</style>

