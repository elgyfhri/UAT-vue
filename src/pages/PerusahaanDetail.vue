<template>
  <div class="max-w-xl mx-auto py-4">
    <h3 class="text-2xl font-bold text-left mb-4">Detail Perusahaan</h3>
    <div class="bg-white p-4 rounded-lg shadow-md">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Nama Perusahaan:</label>
        <p class="text-gray-900">{{ perusahaan.name }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Nama Singkatan:</label>
        <p class="text-gray-900">{{ perusahaan.short_name }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Alamat:</label>
        <p class="text-gray-900">{{ perusahaan.address }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Website:</label>
        <a 
          :href="perusahaan.website.startsWith('http') ? perusahaan.website : `http://${perusahaan.website}`" 
          class="text-blue-600 hover:underline" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {{ perusahaan.website }}
        </a>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Config Document:</label>
        <p class="text-gray-900">{{ formattedConfigDocument }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Logo:</label>
        <img v-if="perusahaan.logo" :src="perusahaan.logoUrl" alt="Logo" class="h-32 w-32 object-cover">
      </div>
      <router-link :to="{ name: 'DataPerusahaan' }">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Kembali</button>
      </router-link>
    </div>
  </div>
</template>

    
    <script>
    import axios from 'axios';
    
    export default {
      name: 'PerusahaanDetail',
      data() {
        return {
          perusahaan: {
            name: '',
            short_name: '',
            address: '',
            website: '',
            config_document: '',
            logo: null,
            logoUrl: null
          }
        };
      },
      computed: {
        formattedConfigDocument() {
          const parts = this.perusahaan.config_document.split('/');
          if (parts.length === 5) {
            const [prefix1, prefix2, day, month, year] = parts;
            return `${prefix1}/${prefix2}/${day}/${month}/${year}`;
          }
          return this.perusahaan.config_document; // fallback if format is not as expected
        }
      },
      created() {
        this.loadPerusahaan();
      },
      methods: {
        loadPerusahaan() {
          const id = this.$route.params.id;
          axios.get(`https://pklwikrama1.4vmapps.com/perusahaan/${id}`)
            .then(({ data }) => {
              this.perusahaan = data;
              this.perusahaan.logoUrl = this.perusahaan.logo 
                ? this.perusahaan.logo.startsWith('http')
                  ? this.perusahaan.logo 
                  : `https://pklwikrama1.4vmapps.com/storage/${this.perusahaan.logo}`
                : null;
            })
            .catch(error => {
              console.error('There was an error loading the company data!', error);
            });
        }
      }
    };
    </script>
    
    <style scoped>
    /* Tambahkan gaya jika diperlukan */
    </style>
    