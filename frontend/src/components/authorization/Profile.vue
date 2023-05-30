<template>
  <div class="container">
    <header>
      <h3>
        Профиль <strong>{{ currentUser.email }}</strong>
      </h3>
    </header>
    <table class="table-blue" style="margin-top: 30px;">
  <tr>
    <td><strong>Логин:</strong></td>
    <td>{{ currentUser.email }}</td>
  </tr>
  <tr>
    <td><strong>ФИО:</strong></td>
    <td>{{ currentUser.lastname }} {{ currentUser.firstname }} {{ currentUser.patronymic }}</td>
  </tr>
  <tr v-if="currentUser.role !== 'Администратор'">
    <td><strong>На вашем счету:</strong></td>
    <td>{{ Number(currentUser.balance) }}</td>
  </tr>
  <tr v-if="currentUser.role !== 'Администратор'">
    <td><strong>Роль:</strong></td>
    <td>{{ currentUser.role }}</td>
  </tr>
</table>

    <p v-if="currentUser.role !== 'Администратор'">
      <button class="btn btn-primary" style="margin-top: 20px; font-family: Comic Sans MS, cursive;" @click="openUpdateBalanceModal">Пополнить счет</button>
    </p>
    <div class="modal" :class="{ 'show': isUpdateBalanceModalOpen, 'd-block': isUpdateBalanceModalOpen }" v-if="currentUser.role !== 'Администратор'">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Новый баланс</h5>
            <button type="button" class="btn-close" @click="closeUpdateBalanceModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Укажите сумму для ввода</label>
              <input class="form-control" type="number" v-model="newBalance">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="updateBalance">Подтвердить</button>
          </div>
        </div>
      </div>
    </div>

    <div>
  <h4 v-if="currentUser.role !== 'Администратор'" style="font-family: Comic Sans MS, cursive;">История заказов</h4>
  <table class="order-history-table" style="margin-top: 20px;" v-if="currentUser.role !== 'Администратор'">
    <tr>
      <th>Тур/Билет</th>
      <th>Цена</th>
      <th>Дата начала</th>
      <th>Дата окончания</th>
      <th>Действия</th>
    </tr>
    <tr v-for="order in orderHistory" :key="order.id" :style="{ color: isOrderExpired(order) ? 'rgba(255, 0, 0, 0.5)' : 'inherit' }">
      <td>
        <template v-if="order.tour_id">
          <div>
            <strong>Тур:</strong><br>
            {{ order.tour_name }}
          </div>
        </template>
        <template v-else-if="order.ticket_id">
          <div>
            <strong>Билет:</strong><br>
            {{ order.flight_number }}
          </div>
        </template>
      </td>
      <td>
        {{ order.tour_cost || order.sale_cost }}
      </td>
      <td>
        {{ formatDateTime(order.start_date) }}
      </td>
      <td>
        {{ formatDateTime(order.end_date) }}
      </td>
      <td>
        <button v-if="showReviewButton(order) && !order.reviewed" class="btn btn-primary" @click="openReviewModal(order)">Добавить отзыв</button>
      </td>
    </tr>
  </table>
</div>

<div class="modal" :class="{ 'show': isReviewModalOpen, 'd-block': isReviewModalOpen }" v-if="currentUser.role !== 'Администратор'">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">
<h5 class="modal-title">Добавить отзыв</h5>
<button type="button" class="btn-close" @click="closeReviewModal"></button>
</div>
<div class="modal-body">
<div class="mb-3">
<label class="form-label">Рейтинг</label>
<input class="form-control" type="number" v-model="reviewData.rating">
</div>
<div class="mb-3">
<label class="form-label">Описание</label>
<textarea class="form-control" v-model="reviewData.description" placeholder="Мы ценим ваши эмоции, поэтому у вас не будет возможности изменить или удалить ответ:) (Первое слово дороже второго)"></textarea>
</div>
</div>
<div class="modal-footer">
<button class="btn btn-primary" @click="submitReview">Отправить</button>
</div>
</div>
</div>
</div>

  </div>
</template>
           


<script>
import moment from 'moment';
import dayjs from 'dayjs';
import http from "../../http-common";

export default {
  name: 'ProfileUser',
  data() {
    return {
      isUpdateBalanceModalOpen: false,
      newBalance: 0,
      orderHistory: [],
      selectedOrder: null,
      isReviewModalOpen: false,
      reviewData: {
        rating: 0,
        description: ''
      }
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  beforeMount() {
    if (!this.currentUser) {
      this.$router.push('/login');
    } else {
      this.getUserData();
      this.getUserOrderHistory();
    }
  },
  methods: {
    getUserData() {
      const userId = this.currentUser.id;
      http
        .get("/user/" + userId)
        .then(response => {
          const updatedUser = response.data;
          this.currentUser.balance = updatedUser.balance;
          Object.assign(this.currentUser, updatedUser);
        })
        .catch(error => {
          console.log(error);
        });
    },
    openUpdateBalanceModal() {
      this.isUpdateBalanceModalOpen = true;
    },
    closeUpdateBalanceModal() {
      this.isUpdateBalanceModalOpen = false;
      this.newBalance = 0;
    },
    updateBalance() {
      const userId = this.currentUser.id;
      const amount = this.newBalance;
      const data = {
        userId: userId,
        amount: amount,
      };
      http
        .put('/updateBalance', data)
        .then(response => {
          const updatedUser = response.data.user;
      this.currentUser.balance = updatedUser.balance;
      Object.assign(this.currentUser, updatedUser);
      this.closeUpdateBalanceModal();
    })
    .catch(error => {
      console.log(error);
    });
},

getUserOrderHistory() {
  const userId = this.currentUser.id;
  http
    .get("/findAllSales/" + userId)
    .then(response => {
      const orderHistory = response.data;
      this.orderHistory = orderHistory;

      // Получение информации об отзывах пользователя
      http
        .get("/findAllReviews/" + userId)
        .then(response => {
          const userReviews = response.data;
          // Добавление информации об отзывах к каждому заказу
          this.orderHistory.forEach(order => {
            const review = userReviews.find(review => review.sale_id === order.id);
            if (review) {
              order.reviewed = true;
            } else {
              order.reviewed = false;
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      console.log(error);
    });
},

isOrderExpired(order) {
  if (order.start_date && order.departure_date) {
    const currentDate = new Date();
    const startDate = new Date(order.start_date);
    const departureDate = new Date(order.departure_date);
    const departureTime = order.departure_time ? new Date(`1970-01-01T${order.departure_time}`) : null;

    if (startDate < currentDate || (departureDate < currentDate && (!departureTime || departureTime < currentDate))) {
      return true;
    }
  }

  return false;
},
formatDate(date) {
  return dayjs(date).format('DD.MM.YYYY');
},
formatTime(time) {
  return moment(time, 'HH:mm:ss').format('HH:mm');
},
formatDateTime(date) {
  return dayjs(date).format('DD.MM.YYYY HH:mm');
},
showReviewButton(order) {
  return !order.reviewed; // Show review button only if the order has not been reviewed
},
openReviewModal(order) {
  this.selectedOrder = order;
  this.isReviewModalOpen = true;
},
closeReviewModal() {
  this.selectedOrder = null;
  this.isReviewModalOpen = false;
  this.reviewData = {
    rating: 0,
    description: ''
  };
},
submitReview() {
  const userId = this.currentUser.id;
  const saleId = this.selectedOrder.id;
  const data = {
    user_id: userId,
    sale_id: saleId,
    rating: this.reviewData.rating,
    description: this.reviewData.description,
    date: new Date().toISOString()
  };
  http
    .post('/addReview', data)
    .then(response => {
      console.log(response.data);
      this.selectedOrder.reviewed = true;
      this.closeReviewModal();
    })
    .catch(error => {
      console.log(error);
    });
}
}
};
</script>

<style>

.table-blue {
  border-collapse: collapse;
  width: 40%;
}

.table-blue td, .table-blue th {
  border: 1.5px solid #c1d7ff;
  padding: 8px;
}

.table-blue th {
  background-color: #e1ecff;
  text-align: left;
}


.order-history-table {
  width: 100%;
  border-collapse: collapse;
}

.order-history-table th,
.order-history-table td {
  border: 1px solid #ccc;
  padding: 8px;
}

.order-history-table th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: left;
}

.order-history-table tr:hover {
  background-color: #f9f9f9;
}

header {
    font-family: "Comic Sans MS", cursive;
    margin-top: 30px;
  }
</style>
