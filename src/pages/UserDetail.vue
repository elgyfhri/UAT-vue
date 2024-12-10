<template>
  <div class="user-detail-container">
    <div class="header">
      <h3 class="user-detail-title">User Details</h3>
    </div>

    <div class="user-detail-card">
      <div class="user-detail-header">
        <img :src="user.photoUrl" alt="User Photo" class="user-photo" @click="openPhotoModal" />
        <div class="user-info">
          <h2 class="user-name">{{ user.name }}</h2>
          <p class="user-email">{{ user.email }}</p>
          <p class="user-role">{{ user.role }}</p>
        </div>
      </div>

      <div class="user-detail-body">
        <h3 class="bio-title">Bio</h3>
        <p class="user-bio">{{ user.bio }}</p>
      </div>
    </div>

    <!-- Modal untuk menampilkan gambar yang diperbesar -->
    <div v-if="isPhotoModalOpen" class="photo-modal" @click="closePhotoModal">
      <img :src="user.photoUrl" alt="User Photo" class="photo-modal-content" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserDetail',
  data() {
    return {
      user: {
        photoUrl: '',
        name: '',
        email: '',
        role: '',
        bio: ''
      },
      isPhotoModalOpen: false // Data untuk modal foto
    };
  },
  async created() {
    await this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = this.$route.params.id;
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get(`http://pklwikrama1.4vmapps.com/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.user = response.data;

        // Construct the full URL for the user image

        this.user.photoUrl = this.user.profile_image 
          ? `http://pklwikrama1.4vmapps.com/${this.user.profile_image}`
          : '/public/asset/dist/img/default-avatar.png';
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        alert('Failed to load user data.');
        this.$router.push({ name: 'UserList' });
      }
    },
    openPhotoModal() {
      this.isPhotoModalOpen = true;
    },
    closePhotoModal() {
      this.isPhotoModalOpen = false;
    }
  }
};
</script>

<style scoped>
.user-detail-container {
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

.user-detail-title {
  font-size: 24px;
  font-weight: bold;
}

.user-detail-card {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
  border: 3px solid #007BFF;
  cursor: pointer; /* Tunjukkan bahwa foto bisa diklik */
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 26px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.user-email {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.user-role {
  font-size: 16px;
  color: #007BFF;
  font-weight: bold;
  text-transform: uppercase;
  border: 2px solid #007BFF;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: transparent;
  margin-top: 10px;
  display: inline-block;
}

.user-detail-body {
  margin-top: 20px;
}

.bio-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.user-bio {
  font-size: 16px;
  color: #444;
  line-height: 1.6;
}

/* Modal untuk memperbesar foto */
.photo-modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo-modal-content {
  max-width: 80%;
  max-height: 80%;
  border-radius: 10px;
  object-fit: contain;
}

.photo-modal-content:hover {
  cursor: pointer;
}

</style>
