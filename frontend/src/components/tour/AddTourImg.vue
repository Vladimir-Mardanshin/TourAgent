<template>
  <div class="text-center mt-2">
    <h4 class="mx-auto" style="margin-top: 30px; margin-bottom: 30px;">Добавление изображения</h4>
    <form @submit.prevent="addImg" @dragover.prevent @dragleave.prevent @drop.prevent="handleDrop">
      <div class="container">
  <div class="row">
    <div class="col-md-6 offset-md-3">
      <div class="form-group">
        <select class="form-control text-center" name="tour_id" v-model="tour.tour_id" required>
          <option value="" disabled selected>Выберите тур</option>
          <option v-for="item in tours" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
    </div>
  </div>
</div>

      <div class="drop-area-container">
      <div class="form-group drop-area" @dragover.prevent @dragenter.prevent @dragleave.prevent @drop.prevent="handleDrop" :class="{ 'drag-over': isDragOver }">
        <input class="form-control" type="file" id="file" ref="file" style="display: none" @change="handleFileUpload" />
          <img :src="imagePreview" alt="Изображение" v-if="imagePreview" class="preview-image" />
        <label class="text-center" for="file" v-else>
          <span>Перетащите файл сюда</span><br class="mt-2">
          или<br>
          <button type="button" class="btn btn-secondary mt-2" @click="selectFile">Выберите файл</button>
        </label>
      </div>
    </div>
      <div>
        <button type="submit" class="btn btn-primary">Добавить</button>
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
      file: null,
      tours: [],
      isDragOver: false
    };
  },

  computed: {
    imagePreview() {
      return this.file ? URL.createObjectURL(this.file) : null;
    }
  },

  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    
    handleDrop(event) {
      this.isDragOver = false;
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.file = files[0];
      }
    },

    selectFile() {
      this.$refs.file.click();
    },
    
    addImg() {
      if (!this.file || !this.tour.tour_id) {
        return; // Проверяем наличие выбранного изображения и выбранного тура
      }
      
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('tour_id', this.tour.tour_id);
      
      http.post("/addTourImg", formData, {
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

.drop-area-container {
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drop-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 350px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
}

.drop-area.drag-over {
  background-color: #e1e1e1;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  margin-bottom: 10px;
}
</style>
