<template>
  <div>
    <!-- Navbar -->
    <nav class="bg-gray-700 bg-opacity-50 backdrop-blur-lg text-white p-4 fixed w-full top-0 left-0 z-50">
      <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Tombol menu untuk mobile-->
            <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span class="sr-only">Buka menu utama</span>
              <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" x="0" y="0" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div class="flex-shrink-0 text-xl font-bold">
              webUAT
            </div>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-4">
              <a href="#section1" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Apa itu UAT?</a>
              <a href="#section2" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Fitur UAT</a>
              <a href="#section3" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dokumentasi</a>
              <router-link to="/login">
                <button type="submit" class="btn btn-primary btn-block">Login</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section (Landing Page) -->
    <section class="bg-blue-600 text-white min-h-screen flex items-center justify-center">
      <div class="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8 w-full max-w-7xl justify-center pt-32 pb-32">
        <!-- Kartu dengan Gambar di Kiri -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden w-64 md:w-80 border border-gray-300">
          <div class="p-4">
            <img src="../assets/uat.jpg" alt="Gambar Kartu" class="w-full h-48 object-cover rounded-lg" />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800">Selamat datang di webUAT</h3>
            <div class="text-gray-600">
              UAT (User Acceptance Testing) memastikan perangkat lunak Anda siap untuk diproduksi dengan mengujinya bersama pengguna nyata.
            </div>
            <div class="mt-4">
              <button @click="scrollToSection2" class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>

        <!-- Konten Sections -->
        <div class="text-left space-y-4 ml-8">
          <h1 class="text-4xl font-bold mb-4">User Acceptance Testing (UAT)</h1>
          <p class="text-lg max-w-md">
            UAT adalah langkah terakhir sebelum perangkat lunak Anda siap diluncurkan. Uji ini dilakukan untuk memastikan bahwa sistem memenuhi persyaratan bisnis, dapat digunakan dengan baik, dan berfungsi seperti yang diharapkan di dunia nyata.
          </p>
        </div>
      </div>
    </section>

    <!-- Section 1 - Penjelasan tentang UAT -->
    <section id="section1" class="bg-white py-20">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-3xl font-semibold mb-4">Apa itu UAT?</h2>
        <p class="text-lg">
          User Acceptance Testing (UAT) adalah proses di mana pengguna akhir menguji perangkat lunak untuk memverifikasi apakah perangkat lunak tersebut memenuhi persyaratan bisnis. UAT merupakan fase penting dalam siklus hidup pengembangan perangkat lunak untuk memastikan bahwa sistem berfungsi dengan baik dan siap untuk diluncurkan.
        </p>
      </div>
    </section>

    <!-- Section 2 - Fitur UAT -->
    <section id="section2" class="bg-gray-100 h-screen flex items-center justify-center">
  <div class="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8 w-full max-w-7xl justify-center px-4 py-16">
    <div class="text-left space-y-4 md:w-1/2">
      <h1 class="text-4xl font-bold mb-4">chsb</h1>
      <p class="text-lg max-w-md">bkdjk</p>
    </div>
    <div class="relative w-full md:w-1/2 h-full flex items-center justify-center">
      <img  alt="Image" class="w-full h-auto md:h-full object-cover rounded-lg border border-gray-300" />
      <button  class="absolute left-0 ml-4 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 focus:outline-none">‹</button>
      <button  class="absolute right-0 mr-4 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 focus:outline-none">›</button>
    </div>
  </div>
</section>

    <!-- Section 3 - Dokumentasi UAT dan Sumber Daya Lainnya -->
    <section id="section3" class="bg-white py-20">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-3xl font-semibold mb-4">Dokumentasi dan Sumber Daya UAT</h2>
        <p class="text-lg">
          Semua dokumentasi yang diperlukan, kasus uji, dan umpan balik pengguna terkait dengan uji UAT dapat ditemukan di bagian ini. Dokumentasi ini sangat penting bagi pengguna yang terlibat dalam pengujian untuk memastikan mereka memahami fungsionalitas sistem dan hasil yang diharapkan.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    scrollToSection2() {
      const section2 = document.getElementById("section2");
      if (section2) {
        window.scrollTo({
          top: section2.offsetTop - 50,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style scoped>
/* Tambahkan gaya tambahan jika diperlukan */
</style>
