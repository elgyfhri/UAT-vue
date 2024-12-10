<template>
  <div class="card card-mono">
    <div class="card-header">
      <h5 class="mb-0">Edit Pengguna</h5>
    </div>
    <!-- Form start -->
    <form @submit.prevent="updateUser">
      <div class="card-body">
        <div class="row">
          <!-- Nama Pengguna -->
          <div class="col-md-6">
            <div class="form-group">
              <label for="name">Nama Pengguna</label>
              <input
                v-model="user.name"
                class="form-control"
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div class="col-md-6">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                v-model="user.email"
                class="form-control"
                id="email"
                type="email"
                placeholder="Masukkan email"
                required
              />
            </div>
          </div>

          <!-- Role -->
          <div class="col-md-6">
            <div class="form-group">
              <label for="role">Role</label>
              <select v-model="user.role" id="role" class="form-control">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <!-- Foto Profil -->
          <div class="col-md-6">
            <div class="form-group">
              <label for="profile_image">Foto Profil</label>
              <input
                type="file"
                id="profile_image"
                @change="handleImageUpload"
                class="form-control-file"
              />
            </div>
          </div>
          <div v-if="previewImage" class="preview-container">
            <img :src="previewImage" alt="Preview" class="preview-image" />
          </div>
        </div>
      </div>

      <!-- /.card-body -->
      <div class="card-footer text-right">
        <button type="submit" class="btn btn-primary btn-block">Update</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'EditUser',
  data() {
    return {
      user: {
        name: '',
        email: '',
        role: '',
        profile_image: null
      },
      originalData: {}, // Menyimpan data asli pengguna
      previewImage: null // Untuk preview gambar
    };
  },
  created() {
    this.loadUser();
  },
  methods: {
    loadUser() {
      const id = this.$route.params.id;

      // Show loading alert
      Swal.fire({
        title: 'Loading...',
        text: 'Mengambil data pengguna...',
        icon: 'info',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      axios.get(`http://pklwikrama1.4vmapps.com/users/${id}`)
        .then(({ data }) => {
          this.user = data;
          this.originalData = { ...data }; // Menyimpan data asli untuk perbandingan
          if (this.user.profile_image) {
            this.previewImage = `http://pklwikrama1.4vmapps.com/${this.user.profile_image}`;
          }
        })
        .catch(error => {
          console.error('Error loading user data!', error);
        })
        .finally(() => {
          // Close the loading alert when data is loaded
          Swal.close();
        });
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.user.profile_image = file;

      // Tampilkan preview gambar
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    },
    updateUser() {
      const updatedFields = {}; // Object untuk menyimpan field yang diubah

      // Memeriksa setiap field dan hanya menambahkan yang berubah ke updatedFields
      if (this.user.name !== this.originalData.name) updatedFields.name = this.user.name;
      if (this.user.email !== this.originalData.email) updatedFields.email = this.user.email;
      if (this.user.role !== this.originalData.role) updatedFields.role = this.user.role;

      // Cek jika ada file baru yang diunggah
      if (this.user.profile_image && this.user.profile_image instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          updatedFields.profile_image = e.target.result; // Tambah profile_image dengan base64 jika diubah
          this.sendUpdateRequest(updatedFields); // Kirim request dengan data yang diperbarui saja
        };
        reader.readAsDataURL(this.user.profile_image);
      } else if (this.user.profile_image !== this.originalData.profile_image) {
        // Jika tidak ada gambar baru, tetap gunakan path asli jika berbeda
        updatedFields.profile_image = this.user.profile_image;
        this.sendUpdateRequest(updatedFields);
      } else {
        // Jika tidak ada perubahan gambar, kirim hanya updatedFields
        this.sendUpdateRequest(updatedFields);
      }
    },
    sendUpdateRequest(updatedFields) {
  axios.put(`http://pklwikrama1.4vmapps.com/users/${this.$route.params.id}`, updatedFields)
    .then(response => {
      // Tampilkan sweetalert2 jika update berhasil
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data pengguna telah diperbarui.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect setelah klik 'OK' di alert
        this.$router.push('/datauser');
      });
    })
    .catch(error => {
      // Tampilkan sweetalert2 jika terjadi kesalahan
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal mengupdate pengguna. ' + JSON.stringify(error.response.data.errors),
        icon: 'error',
        confirmButtonText: 'Coba lagi'
      });
    });
}

  }
}
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

.card-footer {
  padding: 10px;
  border-top: 1px solid #ccc;
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
</style>
