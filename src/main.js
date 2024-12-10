import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '../src/style.css';
import axios from 'axios';

// Import BootstrapVue 3 dan Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'admin-lte/dist/css/adminlte.min.css'
import 'admin-lte/dist/js/adminlte.min.js'


const app = createApp(App)
  .use(router)
  .use(BootstrapVue3);

// Mount aplikasi ke elemen dengan ID 'app'
app.mount('#app');

// Konfigurasi axios untuk mendapatkan CSRF token
axios.get('/sanctum/csrf-cookie').then(response => {
  // Handle the response jika diperlukan
}).catch(error => {
  console.error('Error fetching CSRF token:', error);
});

// Fungsi untuk mengambil dan mengatur CSRF token
async function setCsrfToken() {
  try {
    const response = await axios.get('http://127.0.0.1:8000csrf-token');
    const csrfToken = response.data.csrf_token;
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

axios.default.baseURL = "http://127.0.0.1"

// Panggil fungsi untuk mengatur CSRF token
setCsrfToken();
