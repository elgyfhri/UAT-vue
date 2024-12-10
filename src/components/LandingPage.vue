<template>
    <div>
      <!-- Navbar -->
      <nav class="bg-gray-700 bg-opacity-50 backdrop-blur-lg text-white p-4 fixed w-full top-0 left-0 z-50">
        <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div class="relative flex items-center justify-between h-16">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <!-- Mobile menu button-->
              <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" x="0" y="0" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            <div class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex-shrink-0 text-xl font-bold">
                {{ editPage.navbar_title }}
              </div>
            </div>
            <div class="hidden sm:block sm:ml-6">
              <div class="flex space-x-4">
                <a href="#section1" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{{ editPage.navbar_menu1 }}</a>
                <a href="#section2" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{{ editPage.navbar_menu2 }}</a>
                <a href="#section3" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{{ editPage.navbar_menu3 }}</a>
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
          <!-- Card with Image on the Left -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden w-64 md:w-80 border border-gray-300">
            <div class="p-4">
              <img src="../assets/uat.jpg" alt="Card Image" class="w-full h-48 object-cover rounded-lg" />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800">{{ editPage.card_hero_title}}</h3>
              <div :class="{ 'overflow-y-auto h-24': isTextOverflow, 'h-auto': !isTextOverflow }" class="text-gray-600">
                {{ editPage.card_hero_text }}
              </div>
              <div :class="{ 'mt-4': isTextOverflow, 'mt-2': !isTextOverflow }">
                <button @click="scrollToSection2" class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Learn More
                </button>
              </div>
            </div>
          </div>
  
          <!-- Content Sections -->
          <div class="text-left space-y-4 ml-8">
            <h1 class="text-4xl font-bold mb-4">{{ editPage.hero_title }}</h1>
            <p class="text-lg max-w-md">
              {{ editPage.hero_text }}
            </p>
          </div>
        </div>
      </section>
  
      <section id="section1" class="bg-white py-20">
        <div class="max-w-7xl mx-auto text-center">
          <h2 class="text-3xl font-semibold mb-4">Section 2</h2>
          <p class="text-lg">Curabitur vel sem euismod, malesuada enim id, accumsan orci.</p>
        </div>
      </section>
  
      <section id="section2" class="bg-gray-100 h-screen flex items-center justify-center">
  <div class="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8 w-full max-w-7xl justify-center px-4 py-16">
    <div class="text-left space-y-4 md:w-1/2">
      <h1 class="text-4xl font-bold mb-4">{{ editPage.title_section2[currentIndex] }}</h1>
      <p class="text-lg max-w-md">{{ editPage.text_section2[currentIndex] }}</p>
    </div>
    <div class="relative w-full md:w-1/2 h-full flex items-center justify-center">
      <img :src="'../assets/uat.jpg'" alt="Image" class="w-full h-auto md:h-full object-cover rounded-lg border border-gray-300" />
      <button @click="prevSlide" class="absolute left-0 ml-4 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 focus:outline-none">‹</button>
      <button @click="nextSlide" class="absolute right-0 mr-4 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 focus:outline-none">›</button>
    </div>
  </div>
</section>

  
      <section id="section3" class="bg-white py-20">
        <div class="max-w-7xl mx-auto text-center">
          <h2 class="text-3xl font-semibold mb-4">Section 3</h2>
          <p class="text-lg">Aenean eget enim vitae libero congue tincidunt.</p>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
  name: "LandingPage",
  data() {
    return {
      editPage: {
        navbar_title: '',
        navbar_menu1: '',
        navbar_menu2: '',
        navbar_menu3: '',
        card_hero_title: '',
        card_hero_text: '',
        hero_title: '',
        hero_text: '',
        title_section2: ['', '', ''],
        text_section2: ['', '', ''],
      },
      isTextOverflow: false,
      currentIndex: 0,
    };
  },
  created() {
    this.fetchEditPageData();
  },
  mounted() {
    this.checkTextOverflow();
  },
 methods: {
  fetchEditPageData() {
    axios.get('http://pklwikrama1.4vmapps.com/edit-page')
      .then(({ data }) => {
        this.editPage = { ...data };
        // Set titles and texts for section2
        this.editPage.title_section2 = [data.title1_section2, data.title2_section2, data.title3_section2];
        this.editPage.text_section2 = [data.text1_section2, data.text2_section2, data.text3_section2];
      })
      .catch(error => {
        console.error('Gagal mengambil data:', error);
      });
  },
  nextSlide() {
    // Menggunakan editPage.title_section2.length untuk menghitung jumlah slide
    this.currentIndex = (this.currentIndex + 1) % this.editPage.title_section2.length;
  },
  prevSlide() {
    // Menggunakan editPage.title_section2.length untuk menghitung jumlah slide
    this.currentIndex = (this.currentIndex - 1 + this.editPage.title_section2.length) % this.editPage.title_section2.length;
  },
  checkTextOverflow() {
    const textDiv = this.$el.querySelector(".text-gray-600");
    this.isTextOverflow = textDiv.scrollHeight > textDiv.clientHeight;
  },
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
  