<template>
    <div>
      <h1>Edit Page</h1>
      <form @submit.prevent="updatePage">
        <div>
          <label>Navbar Title:</label>
          <input v-model="form.navbar_title" type="text" required />
        </div>
        <div>
          <label>Navbar Menu 1:</label>
          <input v-model="form.navbar_menu1" type="text" required />
        </div>
        <div>
          <label>Navbar Menu 2:</label>
          <input v-model="form.navbar_menu2" type="text" required />
        </div>
        <div>
          <label>Navbar Menu 3:</label>
          <input v-model="form.navbar_menu3" type="text" required />
        </div>
        <div>
          <label>Card Hero Title:</label>
          <input v-model="form.card_hero_title" type="text" required />
        </div>
        <div>
          <label>Card Hero Text:</label>
          <input v-model="form.card_hero_text" type="text" required />
        </div>
        <div>
          <label>Hero Title:</label> <!-- New field for hero_title -->
          <input v-model="form.hero_title" type="text" required />
        </div>
        <div>
          <label>Hero Text:</label> <!-- New field for hero_title -->
          <input v-model="form.hero_text" type="text" required />
        </div>
        <div>
        <label for="card_hero_image">Card Hero Image</label>
        <input type="file" @change="handleImageChange" />
        <div v-if="form.card_hero_image">
          <img :src="form.card_hero_image" alt="Card Hero Preview" width="100" />
        </div>
      </div>
        <button type="submit">Save Changes</button>
      </form>
    </div> 
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        form: {
          navbar_title: '',
          navbar_menu1: '',
          navbar_menu2: '',
          navbar_menu3: '',
          card_hero_title: '',
          card_hero_text: '',
          hero_title: '', // New field in data model
          hero_text: '', // New field in data model
          card_hero_image: null, // Used to store the image in base64 format
        },
      };
    },
    created() {
      this.fetchPageData();
    },
    methods: {
        handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.card_hero_image = reader.result; // Set the image as base64 string
      };
      reader.readAsDataURL(file); // Read the file as a base64 encoded string
    }
  },

  fetchPageData() {
    axios.get('https://pklwikrama1.4vmapps.com/api/edit-page')
      .then(response => {
        const data = response.data;
        Object.assign(this.form, data);

        // If there's an existing image, check if it's base64 or a URL
        if (data.card_hero_image && !data.card_hero_image.startsWith('data:image/')) {
          // If it's a URL, set the image path to the image URL
          this.form.card_hero_image = '/storage/images/' + data.card_hero_image;
        }
      })
      .catch(error => {
        console.error("Failed to fetch page data:", error);
      });
  },

  updatePage() {
    // Prepare the payload for the API request
    const payload = {
      navbar_title: this.form.navbar_title,
      navbar_menu1: this.form.navbar_menu1,
      navbar_menu2: this.form.navbar_menu2,
      navbar_menu3: this.form.navbar_menu3,
      card_hero_title: this.form.card_hero_title,
      card_hero_text: this.form.card_hero_text,
      hero_title: this.form.hero_title,
      hero_text: this.form.hero_text,
      card_hero_image: this.form.card_hero_image, // Send the base64 encoded image or URL
    };

    // Send the data to the server using Axios
    axios
      .put('https://pklwikrama1.4vmapps.com/api/edit-page', payload)
      .then(response => {
        alert('Page updated successfully');
      })
      .catch(error => {
        console.error('There was an error updating the page:', error);
      });
  }
    },
    
  };
  </script>
  
  <style scoped>
  /* Add any styles for your form */
  </style>
  