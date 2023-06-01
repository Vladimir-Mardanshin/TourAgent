<template>
  <div>
    <h2 style="margin-left: 15px; margin-top: 15px; font-family: Comic Sans MS, cursive;">Список туров</h2>
    <div class="centered-container">
    <table class="table" style="width: 93%; margin-top: 15px;">
  <thead>
    <tr>
      <th>Название</th>
      <th>Описание</th>
      <th>Стоимость</th>
      <th>Дата начала</th>
      <th>Дата окончания</th>
      <th v-if="!isAdmin">Действия</th>
      <th colspan="5">Отзывы и изображения</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(tour, index) in filteredTours" :key="index">
      <template v-if="isAdmin">
        <td>
          <router-link :to="{ name: 'tour-details', params: { id: tour.id }}">
            {{ tour.name }}
          </router-link>
        </td>
        <td>{{ tour.description }}</td>
        <td>{{ tour.cost }} руб.</td>
        <td>{{ formatDate(tour.start_date) }}</td>
        <td>{{ formatDate(tour.end_date) }}</td>
      </template>
      <template v-else>
        <td>{{ tour.name }}</td>
        <td>{{ tour.description }}</td>
        <td>{{ tour.cost }} руб.</td>
        <td>{{ formatDate(tour.start_date) }}</td>
        <td>{{ formatDate(tour.end_date) }}</td>
      </template>
      <td v-if="!isAdmin">
        <button @click="buyTour(tour)" class="btn btn-primary">
          Купить
        </button>
      </td>
      <td colspan="5">
        <div v-for="review in tour.reviews" :key="review.id" class="mt-3">
          <p><strong>Время:</strong> {{ formatDate(review.date) }}</p>
          <p><strong>Отзыв:</strong> {{ review.description }}</p>
          <p><strong>Рейтинг:</strong> {{ review.rating }}</p>
          <p><strong>Email пользователя:</strong> {{ review['sale.user.email'] }}</p>
        </div>


        <div class="adaptivny-slayder">
    <input type="radio" name="kadoves" :id="'slaid' + (index + 1)" v-for="(img, index) in tour.tour_imgs" :key="index" :checked="index === currentSlide">
    
    <div class="kadoves">
      <label :for="'slaid' + (index + 1)" v-for="(img, index) in tour.tour_imgs" :key="index"></label>
    </div>
    
    <div class="adaptivny-slayder-lasekun">
      <div class="abusteku-deagulus">
        <img :src="serverUrl + img.link" alt="Изображение" class="img-fluid" :key="index" v-for="(img, index) in tour.tour_imgs">
      </div>
    </div>
  </div>


      </td>
    </tr>
  </tbody>
</table>
</div>

    <router-link v-if="isAdmin" to="/addTour" style="margin-left: 30px; margin-bottom: 10px; margin-top: 10px; font-family: Comic Sans MS, cursive;" class="btn btn-primary">
      Добавить тур
    </router-link>
    <router-link v-if="isAdmin" to="/addTourImg" style="margin-left: 20px; margin-bottom: 10px; margin-top: 10px; font-family: Comic Sans MS, cursive;" class="btn btn-primary">
      Добавить изображение тура
    </router-link>
    <p :class="purchaseMessageClass" style="text-align: center;">{{ purchaseMessage }}</p>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import http from '../../http-common';
import variables from '../../global.variables';

export default {
  name: 'ListTours',
  data() {
    return {
      tours: [],
      serverUrl: variables.serverUrl,
      purchaseMessage: '',
    };
  },
  methods: {
    fetchTours() {
      http.get('/listTours')
        .then((response) => {
          this.tours = response.data;
          this.fetchReviews();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    isTourExpired(tour) {
      const currentDate = new Date();
      const tourStartDate = new Date(tour.start_date);
      return tourStartDate < currentDate;
    },
    deleteImage(imageId) {
      console.log(imageId);
      http.post('/deleteImg/' + imageId)
        .then(() => {
          this.fetchTours();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    buyTour(tour) {
      if (!this.currentUser) {
        const message = 'Извините, для покупки билета мы хотим, чтобы вы зарегистрировались';
        this.$router.push({ path: '/login', query: { message } });
        return;
      }

      if ((this.currentUser.balance - tour.cost) < 0) {
        this.purchaseMessage = 'На вашем счете недостаточно средств';
        this.purchaseMessageClass = 'alert alert-danger';
        return;
      }

      console.log(this.currentUser.balance);
      const saleData = {
        user_id: this.currentUser.id,
        tour_id: tour.id,
        order_date: new Date(),
        cost: tour.cost,
        amount: tour.cost, // Отправляем стоимость тура в качестве отрицательного значения для уменьшения баланса
      };

      http.post('/createSale', saleData)
        .then((response) => {
          const result = response.data;
          // Успешно создана запись в таблице Sale и обновлен баланс пользователя на сервере
          this.currentUser.balance = result.user.balance; // Обновляем баланс пользователя на клиентской стороне
          this.purchaseMessage = 'Покупка успешна';
          this.purchaseMessageClass = 'alert alert-success';
        })
        .catch((error) => {
          console.error(error);
          this.purchaseMessage = 'Покупка не удалась';
        });
    },
    fetchReviews() {
      this.tours.forEach((tour) => {
        const tourId = tour.id; // Получаем идентификатор текущего тура
        http.get('/review/' + tourId)
          .then((response) => {
            const reviews = response.data;
            tour.reviews = reviews; // Присваиваем полученные отзывы для текущего тура
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
    formatDate(date) {
      return dayjs(date).format('DD.MM.YYYY HH:mm');
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
    },
    filteredTours() {
      if (this.isAdmin) {
        return this.tours; // Display all tours for the admin
      } else {
        const currentDate = new Date();
        return this.tours.filter((tour) => {
          const tourStartDate = new Date(tour.start_date);
          return tourStartDate >= currentDate; // Filter out expired tours for non-admin users
        });
      }
    },
  },
  created() {
    this.fetchTours();
  },
};
</script>

<style>
.centered-container {
  display: flex;
  justify-content: center;
}

.adaptivny-slayder {
  position: relative;
  max-width: 680px;
  margin: 50px auto;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.75);
}

.adaptivny-slayder input[name="kadoves"] {
  display: none;
}

.kadoves {
  position: absolute;
  left: 0;
  bottom: -40px;
  text-align: center;
  width: 100%;
}

.kadoves label {
  display: inline-block;
  width: 8px;
  height: 8px;
  cursor: pointer;
  margin: 0 3px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, .8);
  border-radius: 50%;
  border: 5px solid #2f363c;
  background-color: #738290;
}

#slaid1:checked~.kadoves label[for="slaid1"] {
  background-color: white;
}

#slaid2:checked~.kadoves label[for="slaid2"] {
  background-color: white;
}

#slaid3:checked~.kadoves label[for="slaid3"] {
  background-color: white;
}

.adaptivny-slayder-lasekun {
  overflow: hidden;
   
}

.abusteku-deagulus {
  display: flex;
  width: 100%;
  transition: all 0.5s;
}

.abusteku-deagulus img {
  width: 100%;
  flex-shrink:0;
}

#slaid1:checked~adaptivny-slayder-lasekun abusteku-deagulus {
  transform: translate(0);
}

#slaid2:checked~.adaptivny-slayder-lasekun .abusteku-deagulus {
  transform: translateX(-100%);
}

#slaid3:checked~.adaptivny-slayder-lasekun .abusteku-deagulus {
  transform: translateX(-200%);
}
</style>
