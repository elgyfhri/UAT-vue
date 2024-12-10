<template>
  <div class="max-w-xl mx-auto py-4">
    <h3 class="text-2xl font-bold text-left mb-4">Edit Client</h3>
    <form @submit.prevent="updateClient">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
          Nama Client
        </label>
        <input v-model="client.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Nama Client" required>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="short_name">
          Nama Singkatan
        </label>
        <input v-model="client.short_name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="short_name" type="text" placeholder="Nama Singkatan" required>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="address">
          Alamat
        </label>
        <input v-model="client.address" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="address" type="text" placeholder="Alamat" required>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="logo">
          Logo
        </label>
        <div class="mb-2">
          <!-- Tampilkan pratayang logo jika ada -->
          <img v-if="imagePreview || client.logoUrl" :src="imagePreview || client.logoUrl" alt="Logo" class="h-32 w-32 object-cover">
        </div>
        <input ref="fileInput" @change="handleFileChange" class="hidden" id="logo" type="file" accept="image/*">
        <button type="button" @click="triggerFileInput" class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Pilih Gambar</button>
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditClient',
  data() {
    return {
      client: {
        name: '',
        short_name: '',
        address: '',
        logo: null, // File logo baru yang di-upload
        logoUrl: null // URL dari logo yang tersimpan di server
      },
      imagePreview: null // Preview logo yang baru diupload
    };
  },
  created() {
    this.getClientData();
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validasi tipe file
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
          alert('File harus berupa gambar dengan tipe: jpeg, png, jpg, gif, svg.');
          return;
        }

        this.client.logo = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.imagePreview = null;
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    getClientData() {
      const clientId = this.$route.params.id;
      axios.get(`https://pklwikrama1.4vmapps.com/clients/${clientId}`)
        .then(response => {
          this.client = response.data;
          this.client.logoUrl = this.client.logo.startsWith('http') ? this.client.logo : `https://pklwikrama1.4vmapps.com/storage/${this.client.logo}`;
          this.imagePreview = null; // Hapus preview jika data diambil dari server
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    },
    updateClient() {
      // Validasi form terlebih dahulu
      if (!this.client.name || !this.client.short_name || !this.client.address) {
        alert('Semua field wajib diisi.');
        return;
      }

      const formData = {
        name: this.client.name,
        short_name: this.client.short_name,
        address: this.client.address
      };

      // Jika ada gambar baru, tambahkan ke formData
      if (this.client.logo && this.client.logo instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          formData.logo = reader.result; // Base64 encoded image
          axios.put(`https://pklwikrama1.4vmapps.com/clients/${this.$route.params.id}`, formData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            console.log(response.data); // Cek response dari server
            this.$router.push('/app/dataclient');
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Gagal mengupdate client. ' + JSON.stringify(error.response.data.errors));
          });
        };
        reader.readAsDataURL(this.client.logo);
      } else {
        axios.put(`https://pklwikrama1.4vmapps.com/clients/${this.$route.params.id}`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log(response.data); // Cek response dari server
          this.$router.push('/app/dataclient');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Gagal mengupdate client. ' + JSON.stringify(error.response.data.errors));
        });
      }
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
