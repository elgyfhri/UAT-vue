<template>
  <div class="wrapper">
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <!-- Left navbar links -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button">
            <i class="fas fa-bars"></i>
          </a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <RouterLink to="/app/dashboard" class="nav-link">Dashboard</RouterLink>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <a href="#" class="nav-link">Contact</a>
        </li>
      </ul>

      <!-- Right navbar links -->
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" data-widget="fullscreen" href="#" role="button">
            <i class="fas fa-expand-arrows-alt"></i>
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            data-widget="control-sidebar"
            data-slide="true"
            href="#"
            role="button"
          >
            <i class="fas fa-th-large"></i>
          </a>
        </li>
      </ul>
    </nav>
    <!-- /.navbar -->

    <!-- Main Sidebar Container -->
    <aside class="main-sidebar bg-black-900 sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <a href="index3.html" class="brand-link">
        <img
          src="/public/asset/dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          class="brand-image img-circle elevation-3"
          style="opacity: 0.8"
        />
        <span class="brand-text font-weight-light">WebUAT</span>
      </a>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
          <div class="image" v-if="userImage">
            <img :src="userImage" alt="Profile Photo" class="profile-photo" />
          </div>
          <div class="no-image" v-else>
            <div class="initials">{{ userInitials }}</div>
            <!-- Tampilkan inisial -->
          </div>
          <div class="info">
            <router-link to="/app/profile" class="nav-link">Profile</router-link>
          </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul
            class="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li class="nav-item">
              <router-link to="/app/dashboard" class="nav-link">
                <i class="nav-icon fas fa-home"></i>
                <p>Dashboard</p>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/app/uat" class="nav-link">
                <i class="nav-icon fas fa-file"></i>
                <p>UAT</p>
              </router-link>
            </li>
            <li class="nav-item" v-if="isAdminOrSuperadmin">
              <router-link to="/app/datauser" class="nav-link">
                <i class="nav-icon fas fa-users"></i>
                <p>Data User</p>
              </router-link>
            </li>

            <li class="nav-item">
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-folder"></i>
                <p>
                  Data Master
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/app/dataperusahaan" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Data Perusahaan</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/app/dataclient" class="nav-link">
                    <i class="far fa-circle nav-icon"></i>
                    <p>Data Client</p>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Content Wrapper -->
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid"></div>
      </div>
      <router-view></router-view>
    </div>

    <!-- Control Sidebar -->
    <aside class="control-sidebar control-sidebar-dark">
      <div class="p-3">
        <h5>Title</h5>
        <p>Sidebar content</p>
      </div>
    </aside>

    <!-- Main Footer -->
    <footer class="main-footer">
    </footer>
  </div>
</template>

<script>
import { RouterLink } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2"; // Pastikan SweetAlert2 di-import

export default {
  name: "AdminLayout",
  data() {
    return {
      isAdminOrSuperadmin: false, // Periksa peran admin atau superadmin
      profile: {
        name: "",
        email: "",
        profile_image: "",
      },
    };
  },
  computed: {
    userImage() {
      return this.profile.profile_image
        ? `http://127.0.0.1:8000/${this.profile.profile_image}`
        : "/public/asset/dist/img/default-avatar.png"; // Gambar avatar orang default
    },
  },
  mounted() {
    const userRole = localStorage.getItem("userRole");
    console.log("User role from localStorage:", userRole); // Debug log
    this.isAdminOrSuperadmin =
      userRole === "admin" || userRole === "superadmin";
  },
  methods: {
    async fetchProfileData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data); // Tambahkan ini untuk cek respons
        this.profile = response.data;

        if (this.profile.profile_image) {
          console.log(`Profile image path: ${this.profile.profile_image}`);
          this.profile.photoUrl = `http://127.0.0.1:8000/${this.profile.profile_image}`;
        }

        if (this.profile.is_active === 0) {
          // Ganti dengan SweetAlert
          Swal.fire({
            icon: "warning",
            title: "Akses Ditolak",
            text: "Anda tidak diberi izin oleh admin untuk mengakses aplikasi ini.",
            confirmButtonText: "OK",
          }).then(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            this.$router.push({ name: "Login" });
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);

        // Ganti dengan SweetAlert
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data Profil",
          text: "Silakan login kembali.",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          this.$router.push({ name: "Login" });
        });
      }
    },
    async handleLogout() {
      try {
        await axios.post(
          "http://127.0.0.1:8000/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.$router.push({ name: "Login" });
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed.");
      }
    },
  },
  created() {
    this.fetchProfileData();
  },
};
</script>


<style scoped>
img.profile-photo {
  width: 50px; /* Sesuaikan lebar */
  height: 50px; /* Sesuaikan tinggi */
  border-radius: 50%; /* Membuat gambar bulat */
  object-fit: cover; /* Memastikan gambar terpotong dengan baik */
}

.no-image {
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Bulat */
  background-color: #f0f0f0; /* Warna latar default jika tidak ada gambar */
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-image .initials {
  font-size: 18px;
  font-weight: bold;
  color: #555;
}

.user-panel {
  display: flex;
  align-items: center; /* Menengahkan secara vertikal */
}

.info {
  display: flex;
  align-items: center; /* Menengahkan secara vertikal */
  justify-content: center; /* Menengahkan secara horizontal */
  height: 50px; /* Sesuaikan dengan tinggi yang diinginkan */
  padding-left: 10px; /* Jarak antara gambar dan tulisan */
}

/* Pastikan sidebar tidak bisa di-scroll dan pas dengan layar */
/* Sidebar */
.main-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; /* Pastikan sidebar mengisi seluruh tinggi layar */
  width: 250px; /* Ukuran sidebar */
  z-index: 1030; /* Pastikan sidebar berada di atas konten */
  /* Menghilangkan overflow agar sidebar tidak bisa digulir */
  overflow: hidden; 
}

/* Konten utama yang bisa digulir */
.content-wrapper {
  margin-left: 250px; /* Memberikan ruang agar konten tidak tertutup sidebar */
  height: 100vh; /* Konten mengikuti tinggi layar */
  overflow-y: auto; /* Konten utama bisa digulir jika lebih panjang dari layar */
  padding: 20px; /* Padding untuk konten */
}


/* Menyembunyikan overflow di seluruh halaman jika diperlukan */
body, html {
  height: 100%;
  margin: 0;
  overflow: hidden; /* Menyembunyikan scroll di seluruh halaman */
}

/* Jika diperlukan, tambahkan gaya tambahan di sini untuk menyamakan tampilan dengan menu lainnya */
</style>