<template>
  <div class="card card-mono">
    <div class="card-header">
      <h3 class="card-title">Tambah Data Client</h3>
    </div>
    <!-- Form start -->
    <form @submit.prevent="submitClient">
      <div class="card-body">
        <div class="form-group">
          <label for="name">Nama Client</label>
          <input v-model="client.name" class="form-control" id="name" type="text" placeholder="Nama Client" required />
        </div>
        <div class="form-group">
          <label for="short_name">Nama Singkatan</label>
          <input v-model="client.short_name" class="form-control" id="short_name" type="text" placeholder="Nama Singkatan" required />
        </div>
        <div class="form-group">
          <label for="address">Alamat</label>
          <input v-model="client.address" class="form-control" id="address" type="text" placeholder="Alamat" required />
        </div>
        <div class="form-group">
          <label for="logo">Logo</label>
          <div class="input-group">
            <div class="custom-file">
              <input ref="fileInput" @change="onFileChange" class="custom-file-input" id="logo" type="file" accept="image/*" />
              <label class="custom-file-label" for="logo">Pilih Gambar</label>
            </div>
          </div>
          <div v-if="client.logoPreview" class="preview-container">
            <img :src="client.logoPreview" alt="Preview Logo" class="preview-image" />
          </div>
          <div v-else class="no-preview">Preview Logo</div>
        </div>
      </div>
      <!-- /.card-body -->

      <div class="card-footer text-right">
        <button type="submit" class="btn btn-mono">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddClient',
  data() {
    return {
      client: {
        name: '',
        short_name: '',
        address: '',
        logo: null,
        logoPreview: null
      }
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.client.logo = reader.result; // Base64 string
          this.client.logoPreview = reader.result; // Preview
        };
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    submitClient() {
      axios.post('http://pklwikrama1.4vmapps.com/clients', {
        name: this.client.name,
        short_name: this.client.short_name,
        address: this.client.address,
        logo: this.client.logo
      })
      .then(response => {
        console.log(response.data);
        this.$router.push({ name: 'DataClient' });
      })
      .catch(error => {
        console.error('Error creating client:', error.response.data);
      });
    }
  }
};
</script>

<style scoped>
.card-mono {
  background-color: #f7f7f7;
  color: #333;
  border: 1px solid #ddd;
  margin: 20px;
}

.card-header {
  background-color: #e0e0e0;
  border-bottom: 1px solid #ccc;
  padding: 15px;
}

.btn-mono {
  background-color: #333;
  color: #fff;
  border: none;
}

.custom-file-label {
  background-color: #ddd;
  color: #555;
  cursor: pointer;
}

.custom-file-label:hover {
  background-color: #bbb;
}

.form-control {
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  color: #333;
  margin-bottom: 10px;
}

.form-control:focus {
  border-color: #555;
  background-color: #e0e0e0;
}

.card-footer {
  padding: 10px;
  border-top: 1px solid #ccc;
}

.preview-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.preview-image {
  height: 150px;
  width: 150px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.no-preview {
  margin-top: 15px;
  text-align: center;
  color: #999;
}

.text-right {
  text-align: right;
}
</style>
