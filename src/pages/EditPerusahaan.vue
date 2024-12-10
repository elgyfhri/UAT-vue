<template>
  <div class="max-w-lg mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-5">Edit Perusahaan</h2>
    <form @submit.prevent="updatePerusahaan">
      <!-- Nama Perusahaan -->
      <div class="mb-4">
        <label for="name" class="block text-gray-700">Nama Perusahaan</label>
        <input v-model="perusahaan.name" id="name" type="text" class="w-full p-2 border border-gray-300 rounded mt-1" required />
      </div>

      <!-- Nama Singkatan -->
      <div class="mb-4">
        <label for="short_name" class="block text-gray-700">Nama Singkatan</label>
        <input v-model="perusahaan.short_name" id="short_name" type="text" class="w-full p-2 border border-gray-300 rounded mt-1" required />
      </div>

      <!-- Website -->
      <div class="mb-4">
        <label for="website" class="block text-gray-700">Website</label>
        <input v-model="perusahaan.website" id="website" type="url" class="w-full p-2 border border-gray-300 rounded mt-1" />
      </div>

      <!-- Alamat -->
      <div class="mb-4">
        <label for="address" class="block text-gray-700">Alamat</label>
        <input v-model="perusahaan.address" id="address" type="text" class="w-full p-2 border border-gray-300 rounded mt-1" />
      </div>

      <!-- Config Document -->
      <div class="mb-4">
        <label class="block text-gray-700">Config Document</label>
        <div class="flex space-x-4">
          <!-- Prefix Input -->
          <input v-model="configPrefix1" id="config_prefix1" type="text" class="flex-1 p-2 border border-gray-300 rounded mt-1" placeholder="Prefix 1" required />
          <input v-model="configPrefix2" id="config_prefix2" type="text" class="flex-1 p-2 border border-gray-300 rounded mt-1" placeholder="Prefix 2" required />
        </div>
        <div class="flex space-x-4 mt-2">
        </div>
        <input type="text" :value="formattedConfigDocument" disabled class="mt-2 w-full p-2 border border-gray-300 rounded" />
      </div>

      <!-- Image -->
      <div class="mb-4">
        <label for="logo" class="block text-gray-700">Image</label>
        <div class="mb-2">
          <img v-if="imagePreview" :src="imagePreview" alt="Preview Image" class="w-32 h-32 object-cover border border-gray-300 rounded" />
          <div v-else>Preview Image</div>
        </div>
        <input ref="fileInput" @change="handleFileChange" id="logo" type="file" accept="image/*" class="hidden" />
        <button type="button" @click="triggerFileInput" class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">Pilih Gambar</button>
      </div>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-5">Update</button>
      <router-link :to="{ name: 'DataPerusahaan' }">
        <button class="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600">Kembali</button>
      </router-link>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditPerusahaan',
  data() {
    return {
      perusahaan: {
        name: '',
        short_name: '',
        website: '',
        address: '',
        config_document: '',
        logo: null
      },
      configPrefix1: '',
      configPrefix2: '',
      imagePreview: null,
      currentMonth: '',
      currentYear: ''
    };
  },
  computed: {
    formattedConfigDocument() {
      // Return in the format: Prefix1/Prefix2/month/year
      return `${this.configPrefix1}/${this.configPrefix2}/${this.currentMonth}/${this.currentYear}`;
    }
  },
  created() {
    const now = new Date();
    this.currentMonth = (now.getMonth() + 1).toString().padStart(2, '0'); // Get the current month (01-12)
    this.currentYear = now.getFullYear().toString(); // Get the current year
    this.loadPerusahaan();
  },
  methods: {
    loadPerusahaan() {
      const id = this.$route.params.id;
      axios.get(`http://127.0.0.1:8000/perusahaan/${id}`)
        .then(({ data }) => {
          this.perusahaan = data;
          const [prefix1, prefix2, month, year] = data.config_document.split('/');
          this.configPrefix1 = prefix1 || '';
          this.configPrefix2 = prefix2 || '';
          this.currentMonth = month || this.currentMonth;
          this.currentYear = year || this.currentYear;

          this.imagePreview = data.logo ? `http://127.0.0.1:8000/storage/${data.logo}` : null;
        })
        .catch(error => {
          console.error('Error loading data!', error);
        });
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
          alert('File harus berupa gambar dengan tipe: jpeg, png, jpg, gif, svg.');
          return;
        }
        
        this.perusahaan.logo = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },

    triggerFileInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click();
      } else {
        console.error('File input reference is not available.');
      }
    },

    updatePerusahaan() {
      // Validate form first
      if (!this.perusahaan.name || !this.perusahaan.short_name || !this.configPrefix1 || !this.configPrefix2) {
        alert('Semua field wajib diisi.');
        return;
      }

      const formData = {
        name: this.perusahaan.name,
        short_name: this.perusahaan.short_name,
        website: this.perusahaan.website || '',
        address: this.perusahaan.address || '',
        config_document: this.formattedConfigDocument,
      };

      // Include image data if it exists
      if (this.perusahaan.logo && this.perusahaan.logo instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          formData.logo = reader.result; // Base64 encoded image
          axios.put(`http://127.0.0.1:8000/perusahaan/${this.$route.params.id}`, formData, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            console.log(response.data); // Check server response
            this.$router.push('/dataperusahaan');
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Gagal mengupdate perusahaan. ' + JSON.stringify(error.response.data.errors));
          });
        };
        reader.readAsDataURL(this.perusahaan.logo);
      } else {
        axios.put(`http://127.0.0.1:8000/perusahaan/${this.$route.params.id}`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log(response.data); // Check server response
          this.$router.push('/app/dataperusahaan');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Gagal mengupdate perusahaan. ' + JSON.stringify(error.response.data.errors));
        });
      }
    }

    
  }
};
</script>
