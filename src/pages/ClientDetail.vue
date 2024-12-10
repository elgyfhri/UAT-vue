<template>
  <div class="max-w-xl mx-auto py-4">
    <h3 class="text-2xl font-bold text-left mb-4">Detail Client</h3>
    <div class="bg-white p-4 rounded-lg shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Nama Client:</label>
        <p class="text-gray-900">{{ client.name }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Nama Singkatan:</label>
        <p class="text-gray-900">{{ client.short_name }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Alamat:</label>
        <p class="text-gray-900">{{ client.address }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Logo:</label>
        <!-- Tampilkan logo jika ada --> 
        <img v-if="client.logo" :src="client.logoUrl" alt="Logo" class="h-32 w-32 object-cover">
      </div>
      <router-link :to="{ name: 'DataClient' }">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Kembali</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientDetail',
  data() {
    return {
      client: {
        name: '',
        short_name: '',
        address: '',
        logo: null, // Logo yang disimpan di database
        logoUrl: null // URL lengkap untuk ditampilkan di frontend
      }
    };
  },
  created() {
    this.loadClient();
  },
  methods: {
    loadClient() {
  const id = this.$route.params.id;
  axios.get(`http://127.0.0.1:8000/clients/${id}`)
    .then(({ data }) => {
      this.client = data;
      console.log("Logo URL:", this.client.logo); // Log to check logo URL

      // Check if logo exists and is a string before using startsWith
      this.client.logoUrl = this.client.logo && typeof this.client.logo === 'string' && this.client.logo.startsWith('http')
        ? this.client.logo
        : `http://127.0.0.1:8000/storage/${this.client.logo}`;
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
}

  }
};
</script>

<style scoped>
/* Tambahkan gaya jika diperlukan */
</style>
