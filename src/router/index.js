import { createRouter, createWebHistory } from 'vue-router';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import UAT from '../pages/UAT.vue';
import DataPerusahaan from '../pages/DataPerusahaan.vue';
import DataClient from '../pages/DataClient.vue';
import AddClient from '../pages/AddClient.vue';
import EditClient from '../pages/EditClient.vue';
import ClientDetail from '../pages/ClientDetail.vue';
import Profile from '../pages/Profile.vue';
import EditPerusahaan from '../pages/EditPerusahaan.vue';
import PerusahaanDetail from '../pages/PerusahaanDetail.vue';
import AddPerusahaan from '../pages/AddPerusahaan.vue';
import EditProfile from '../pages/EditProfile.vue';
import AddUAT from '../pages/AddUAT.vue';
import DataUser from '../pages/DataUser.vue';
import EditUser from '../pages/EditUser.vue';
import Navbar from '../layouts/Navbar.vue';
import AddUser from '../pages/AddUser.vue';
import UserDetail from '../pages/UserDetail.vue';
import EditUAT from '../pages/EditUAT.vue';
import Dashboard from '../pages/Dashboard.vue';
import UATDetail from '../pages/UATDetail.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import LandingPage from '../components/LandingPage.vue';
import EditPage from '../pages/EditPage.vue';
import addUAT1 from '../savean/addUAT1.vue';
import addUAT2 from '../savean/addUAT2.vue';
import editUAT1 from '../savean/editUAT1.vue';
import 'admin-lte/dist/css/adminlte.min.css';
import 'admin-lte/dist/js/adminlte.min.js';

const routes = [
  {
    path: '/app',
    name: 'Navbar',
    component: Navbar,
    redirect: '/app/dashboard', // Redirect otomatis ke dashboard
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'uat', name: 'UAT', component: UAT },
      { path: 'dataperusahaan', name: 'DataPerusahaan', component: DataPerusahaan },
      { path: 'dataclient', name: 'DataClient', component: DataClient },
      { path: 'add-client', name: 'AddClient', component: AddClient },
      { path: 'edit-client/:id', name: 'EditClient', component: EditClient, props: true },
      { path: 'clients/:id', name: 'ClientDetail', component: ClientDetail, props: true },
      { path: 'profile', name: 'Profile', component: Profile },
      { path: 'edit-perusahaan/:id', name: 'EditPerusahaan', component: EditPerusahaan },
      { path: 'perusahaan/:id', name: 'PerusahaanDetail', component: PerusahaanDetail },
      { path: 'add-perusahaan', name: 'AddPerusahaan', component: AddPerusahaan },
      { path: 'edit-profile', name: 'EditProfile', component: EditProfile },
      { path: 'add-uat', name: 'AddUAT', component: AddUAT },
      { path: 'datauser', name: 'DataUser', component: DataUser },
      { path: 'edit-user/:id', name: 'EditUser', component: EditUser, props: true },
      { path: 'add-user', name: 'AddUser', component: AddUser, props: true },
      { path: 'user/:id', name: 'UserDetail', component: UserDetail },
      { path: 'uatdetail/:id', name: 'UATDetail', component: UATDetail },
      { path: 'edit-uat/:id', name: 'EditUAT', component: EditUAT, props: true },
      { path: 'editpage', name: 'EditPage', component: EditPage },
      { path: 'adduat1', name: 'addUAT1', component: addUAT1 },
      { path: 'adduat2/:id', name: 'addUAT2', component: addUAT2, props: true },
      { path: 'edituat1/:id', name: 'editUAT1', component: editUAT1, props: true },

      { path: 'admindashboard', name: 'AdminDashboard', component: AdminDashboard, props: true },
    ]
  },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  { path: '/', name: 'LandingPage', component: LandingPage },
];

// Fungsi untuk memeriksa apakah pengguna sudah login
const isAuthenticated = () => {
  // Ganti dengan logika yang sesuai untuk memeriksa autentikasi
  return !!localStorage.getItem('token'); // Misalnya, memeriksa token yang disimpan di localStorage
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Menambahkan global before guard
router.beforeEach((to, from, next) => {
  // Cek jika rute tujuan memerlukan autentikasi
  if (to.name !== 'Login' && to.name !== 'Register'  && to.name !== 'LandingPage' && !isAuthenticated()) {
    // Jika belum login, arahkan ke halaman login
    next({ name: 'Login' });
  } else {
    // Jika sudah login atau tujuan tidak memerlukan autentikasi
    next();
  }
});

export default router;
