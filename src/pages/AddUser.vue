<template>
  <div class="card card-mono">
    <div class="card-header">
      <h5 class="mb-0">Tambah User</h5>
    </div>
    <!-- Form start -->
    <form @submit.prevent="saveData">
      <div class="card-body">
        <div class="row">
          <!-- Nama User -->
          <div class="col-md-6">
            <div class="form-group">
              <label for="name">Nama Lengkap</label>
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

          <!-- Password -->
          <div class="col-md-6">
            <div class="form-group">
              <label for="password">Password</label>
              <input
                :type="passwordVisible ? 'text' : 'password'"
                v-model="user.password"
                id="password"
                class="form-control"
                placeholder="Masukkan password"
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
                <option v-if="userRole === 'superadmin'" value="admin">Admin</option>
                <option v-if="userRole === 'superadmin'" value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>

          <!-- Profile Photo -->
          <div class="col-md-12">
            <div class="form-group">
              <label for="profile_image">Foto Profil</label>
              <input
                type="file"
                id="profile_image"
                ref="profile_image"
                @change="handleFileChange"
                class="form-control-file"
              />
              <div v-if="previewPhoto" class="preview-container">
                <img :src="previewPhoto" alt="Profile Preview" class="preview-image" />
              </div>
              <div v-else-if="user.profile_image" class="preview-container">
                <img :src="profileImageUrl" alt="User Profile" class="preview-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /.card-body -->

      <div class="card-footer text-right">
        <button type="submit" class="btn btn-primary btn-block">Tambah User</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'AddUser',
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        role: 'user',
        profile_image: null,
        is_active: '1',
        is_approved: '1'
      },
      previewPhoto: null,
      passwordVisible: false,
      userRole: 'user'
    };
  },
  computed: {
    profileImageUrl() {
      return this.user.profile_image ? `data:image/jpeg;base64,${this.user.profile_image}` : '';
    }
  },
  created() {
    this.userRole = localStorage.getItem("userRole") || 'user';
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.previewPhoto = e.target.result;
          this.user.profile_image = e.target.result.split(',')[1];
        };
        reader.readAsDataURL(file);
      }
    },
    async saveData() {
      try {
        // Kirim data ke server
        const response = await axios.post('http://pklwikrama1.4vmapps.com/add-user', this.user, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Response data:', response.data);

        // Tampilkan SweetAlert sukses setelah data berhasil disimpan
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'User berhasil ditambahkan.'
        });

        // Setelah SweetAlert ditutup, pindah ke halaman 'DataUser'
        this.$router.push({ name: 'DataUser' });

      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);

        // Menangani kesalahan dan menampilkan pesan dengan SweetAlert
        const errorMessages = [];
        if (error.response && error.response.data.errors) {
          for (const field in error.response.data.errors) {
            errorMessages.push(`${field}: ${error.response.data.errors[field].join(', ')}`);
          }
        }

        // Tampilkan SweetAlert jika terjadi kesalahan
        await Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          html: errorMessages.join('<br>') // Menampilkan pesan kesalahan
        });
      }
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
