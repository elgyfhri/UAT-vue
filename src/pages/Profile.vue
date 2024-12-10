<template>
  <div class="profile-container">
    <div class="header">
      <h3 class="profile-title">Profile</h3>
      <div class="action-buttons">
        <button @click="goToEditProfile" class="edit-button">Edit Profile</button>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </div>

    <div class="profile-card">
      <div class="profile-header">
        <img
          :src="profile.photoUrl"
          alt="Profile Photo"
          class="profile-photo"
          @click="openModal"
        />
        <div class="profile-info">
          <h2 class="profile-name">{{ profile.name }}</h2>
          <p class="profile-email">{{ profile.email }}</p>
        </div>
      </div>

      <div class="profile-body">
        <h3 class="bio-title">Bio</h3>
        <p class="profile-bio">{{ profile.bio }}</p>
        <p class="profile-role">{{ profile.role }}</p>
      </div>
    </div>

    <!-- Modal for displaying the enlarged image -->
    <div v-if="isModalOpen" class="modal" @click="closeModal">
      <img :src="profile.photoUrl" alt="Enlarged Profile Photo" class="modal-image" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default {
  name: 'Profile',
  data() {
    return {
      profile: {
        photoUrl: '',
        name: '',
        email: '',
        role: '',
        bio: ''
      },
      isModalOpen: false, // State for modal visibility
      defaultPhoto: 'path/to/default/photo.png' // Ganti dengan path gambar default
    };
  },
  async created() {
    await this.fetchProfileData();
  },
  methods: {
    async fetchProfileData() {
      try {
        // Tampilkan SweetAlert2 loading
        Swal.fire({
          title: 'Loading...',
          text: 'Fetching profile data...',
          icon: 'info',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Tampilkan loading
          }
        });

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get('https://pklwikrama1.4vmapps.com/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.profile = response.data;

        // Mengatur foto profil atau gambar default jika tidak ada
        this.profile.photoUrl = this.profile.profile_image 
          ? `https://pklwikrama1.4vmapps.com/${this.profile.profile_image}` 
          : '/public/asset/dist/img/default-avatar.png';

        // Setelah data berhasil di-fetch, tutup loading
        Swal.close();

      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        alert('Failed to load profile data.');
        this.$router.push({ name: 'Login' });

        // Tutup loading jika terjadi error
        Swal.close();
      }
    },
    async handleLogout() {
      try {
        await axios.post('https://pklwikrama1.4vmapps.com/logout', {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed.');
      }
    },
    goToEditProfile() {
      this.$router.push({ name: 'EditProfile' });
    },
    openModal() {
      this.isModalOpen = true; // Show modal
    },
    closeModal() {
      this.isModalOpen = false; // Hide modal
    }
  }
}
</script>

  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Above other content */
  }

  .modal-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 10px; /* Optional: for rounded corners */
  }

  .profile-container {
    max-width: 600px;
    margin: 50px auto;
    position: relative;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .profile-title {
    font-size: 24px;
    font-weight: bold;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
  }

  .edit-button,
  .logout-button {
    background-color: #007BFF;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .edit-button:hover {
    background-color: #0056b3;
  }

  .logout-button {
    background-color: #FF4B4B;
  }

  .logout-button:hover {
    background-color: #d13939;
  }

  .profile-card {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .profile-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 20px;
    border: 3px solid #007BFF;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
  }

  .profile-name {
    font-size: 26px;
    font-weight: bold;
    margin: 0;
    color: #333;
  }

  .profile-email {
    font-size: 16px;
    color: #666; /* Use a color that fits with your design */
    background: none; /* Remove background */
    padding: 0; /* Remove padding */
    border-radius: 0; /* Remove border-radius */
    font-weight: normal; /* Remove bold weight */
    text-transform: none; /* Remove uppercase transformation */
    display: block; /* Default display setting */
    margin-bottom: 10px; /* Margin for spacing */
  }

  .profile-body {
    margin-top: 20px;
  }

  .bio-title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }

  .profile-bio {
    font-size: 16px;
    color: #444;
    line-height: 1.6;
  }

  .profile-role {
    font-size: 16px;
    color: #007BFF; /* Blue color for text */
    font-weight: bold;
    text-transform: uppercase;
    border: 2px solid #007BFF; /* Border matching the text color */
    padding: 5px 10px; /* Padding inside the border */
    border-radius: 5px; /* Rounded corners */
    background-color: transparent; /* No background color */
    margin-top: 20px;
    display: inline-block; /* Keeps the border fit the text */
  }
  </style>
