<template>
  <div>
    <h4>Добавление изображения</h4>
    <form @submit="addImg">
      <div class="mb-3">
        <select class="form-select" name="tour_id" v-model="tour.tour_id" required>
          <option value="" disabled selected>Выберите тур</option>
          <option v-for="item in tours" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
      <div class="col mt-2">
        <div class="dropzone" @dragover.prevent @drop="handleFileDrop">
          <img :src="imageUrl" v-if="imageUrl" alt="Выбранное изображение" style="max-width: 200px;">
          <p v-else>Перетащите файл сюда или щелкните, чтобы выбрать файл</p>
        </div>
        <input class="form-control" type="file" id="file" ref="file" required @change="handleFileUpload"/>
      </div>
      <div>
        <input type="submit" class="btn btn-primary" value="Добавить">
      </div>
    </form>
  </div>
</template>

<script>
import http from "../../http-common";

export default {
  name: "AddTour",
  data() {
    return {
      tour: {
        tour_id: ""
      },
      file: '',
      tours: [],
      imageUrl: null
    };
  },

  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.imageUrl = URL.createObjectURL(this.file); // Отображение выбранного изображения
    },
    handleFileDrop(event) {
      event.preventDefault();
      this.file = event.dataTransfer.files[0];
      this.imageUrl = URL.createObjectURL(this.file); // Отображение выбранного изображения
    },
    addImg(e) {
      e.preventDefault();
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('tour_id', this.tour.tour_id);
      console.log(this.file);
      console.log(this.tour.tour_id);
      http
        .post("/addTourImg", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          this.$router.push('/listTours');
        })
        .catch(e => {
          console.log(e);
        });
    },
    fetchTours() {
      http.get("/listTours")
        .then(response => {
          this.tours = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.fetchTours();
  },
};
</script>

<style>
.dropzone {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
</style>
