<template>
  <div>
    <h2 style="margin-left: 15px; margin-top: 15px; font-family: Comic Sans MS, cursive;">Список пользователей</h2>
    <input type="text" v-model="searchEmail" @input="searchUsers" class="form-control" placeholder="Введите email" style="margin-top: 15px;
    width: 300px; margin-left: 30px;">
    <ul class="list-group" style="margin-top: 15px; margin-left: 30px; width: 1000px;">
      <!-- Вывод списка пользователей -->
      <li v-for="(user, index) in filteredUsers" :key="index" class="list-group-item">
        {{ user.firstname }} {{ user.lastname }} (email: {{ user.email }})

        <!-- Вывод соответствующих комментариев пользователя -->
        <button @click="toggleComments(user)" class="btn btn-primary btn-sm" style="margin-right: 30px; margin-left: 30px;">Показать/Скрыть комментарии</button>
        <button @click="toggleSales(user)" class="btn btn-primary btn-sm">Показать/Скрыть заказы</button>
        <ul v-if="user.showComments" style="margin-top: 20px;">
          <li v-for="comment in user.comments" :key="comment.id" style="margin-bottom: 20px;">
            {{ comment.description }} (rating: {{ comment.rating }})
            <button @click="deleteComment(comment.id)" class="btn btn-danger btn-sm">Удалить</button>
          </li>
        </ul>
        <ul v-if="user.showSales" style="margin-top: 20px;">
          <li v-for="sale in user.sales" :key="sale.id" style="margin-bottom: 10px;">
              Заказ №{{ sale.id }}: {{ sale.tour_name ? sale.tour_name : sale.flight_number }} (стоимость: {{ sale.sale_cost }})
          </li>
        </ul>
      </li>
      <p v-if="filteredUsers.length === 0">OOOOPPPPS, да у нас тут призрак, вызывайте охотников!</p>
    </ul>
  </div>
</template>

<script>
import http from "../../http-common"; // подключение объекта, который позволяет отправлять запросы серверу

export default {
  name: "ListUsers",
  data() {
    return {
      users: [],
      searchEmail: ""
    };
  },
  computed: {
    filteredUsers() {
      if (this.searchEmail === "") {
        return this.users;
      } else {
        return this.users.filter(user =>
          user.email.toLowerCase().includes(this.searchEmail.toLowerCase())
        );
      }
    }
  },
  methods: {
    getUsers() {
      http
        .get("/users") // обращаемся к серверу для получения списка пользователей
        .then(response => {
          this.users = response.data;
          this.getCommentsAndSalesByUser(); // Загрузка комментариев после получения списка пользователей
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCommentsAndSalesByUser() {
      this.users.forEach(user => {
        http
          .get("/findUserComments/"+user.id) // Запрос на сервер для получения комментариев пользователя по его user_id
          .then(response => {
            user.comments = response.data;
            this.getSalesByUser(user.id); // Загрузка заказов после получения комментариев пользователя
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    getSalesByUser(userId) {
      http
        .get("/findAllSales/"+userId) // Запрос на сервер для получения заказов пользователя по его user_id
        .then(response => {
          const sales = response.data;
          this.users.find(user => user.id === userId).sales = sales;
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteComment(commentId) {
      http
        .post("/deleteReview/"+commentId) // Отправка запроса на удаление комментария по его ID
        .then(() => {
          this.getCommentsAndSalesByUser();
          
        })
        .catch(error => {
          console.log(error);
        });
    },
    toggleComments(user) {
      user.showComments = !user.showComments; // Переключение флага для отображения/скрытия комментариев
    },
    toggleSales(user) {
      user.showSales = !user.showSales; // Переключение флага для отображения/скрытия заказов
    },
    searchUsers() {
      // Обновление списка пользователей при изменении значения в поле поиска
      this.getUsers();
    }
  },
  mounted() {
    this.getUsers(); // загрузка пользователей при монтировании компонента
  }
};
</script>

<style>
/* стилизация списка */
.list-group-item {
  cursor: pointer;
}
</style>
