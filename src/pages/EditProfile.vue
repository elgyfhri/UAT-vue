<template>
  <div class="edit-profile-container max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-bold mb-6 text-gray-900">Edit Profile</h1>
    <form @submit.prevent="updateProfile" class="space-y-6">
      <!-- Profile Photo Upload -->
      <div class="form-group">
        <label for="photo" class="block text-sm font-medium text-gray-700">Profile Photo</label>
        <input type="file" id="photo" ref="photo" @change="handleFileChange" class="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"/>
        <img v-if="previewPhoto" :src="previewPhoto" alt="Profile Preview" class="mt-2 w-32 h-32 object-cover rounded-full border-2 border-gray-300"/>
      </div>

      <!-- Name Input -->
      <div class="form-group">
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input v-model="profile.name" type="text" id="name" placeholder="Enter your name"
               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"/>
      </div>

      <!-- Email Input -->
      <div class="form-group">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="profile.email" type="email" id="email" placeholder="Enter your email"
               class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"/>
      </div>

      <!-- Bio Input -->
      <div class="form-group">
        <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
        <textarea v-model="profile.bio" id="bio" placeholder="Tell us about yourself"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"></textarea>
      </div>

      <!-- Form Actions -->
      <div class="form-actions flex justify-end space-x-4">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Save Changes</button>
        <button @click="$router.push({ name: 'Profile' })" type="button" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditProfile',
  data() {
    return {
      profile: {
        name: '',
        email: '',
        role: 'user',
        bio: '',
        profile_image: ''
      },
      previewPhoto: null,
      photoFile: null,
    };
  },
  async created() {
    await this.fetchProfileData();
  },
  methods: {
    async fetchProfileData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        const response = await axios.get('https://pklwikrama1.4vmapps.com/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        this.profile = response.data;
        if (this.profile.profile_image) {
          this.previewPhoto = `https://pklwikrama1.4vmapps.com/${this.profile.profile_image}`;
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        alert('Failed to load profile data.');
        this.$router.push({ name: 'Login' });
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.previewPhoto = e.target.result;
        };
        reader.readAsDataURL(file);
        this.photoFile = file;
        this.removePhotoFlag = false; // Reset remove photo flag
      }
    },
    async updateProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');

        // Prepare JSON payload
        const payload = {
          name: this.profile.name || '',
          email: this.profile.email || '',
          role: this.profile.role || 'user',
          bio: this.profile.bio || '',
          // If photo is removed, set profile_image to null, else set base64 or keep current path
          profile_image: this.removePhotoFlag ? null : (this.photoFile ? await this.convertFileToBase64(this.photoFile) : this.profile.profile_image),
        };

        await axios.put('https://pklwikrama1.4vmapps.com/users/profile', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        alert('Profile updated successfully.');
        this.$router.push({ name: 'Profile' });
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Failed to update profile:', errorMessage);
        alert('Failed to update profile. Check the console for details.');
      }
    },
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }
}
</script>

<style scoped>
.edit-profile-container {
  max-width: 600px;
  margin: 0 auto;
}
.form-group {
  margin-bottom: 1.5rem;
}
textarea {
  min-height: 120px;
}
input[type="file"] {
  padding: 0;
}
</style>
