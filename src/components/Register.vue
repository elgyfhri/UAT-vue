<template>
  <div class="hold-transition register-page">
    <div class="register-box">
      <div class="card card-outline card-primary">
        <div class="card-header text-center">
          <a href="../../index2.html" class="h1"><b>UAT</b>WEB</a>
        </div>
        <div class="card-body">
          <p class="login-box-msg">Create Account</p>
          <form @submit.prevent="saveData">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" v-model="user.name" id="name" class="form-control" placeholder="Enter your full name" required />
            </div>

            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" v-model="user.username" id="username" class="form-control" placeholder="Enter your username" required />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" v-model="user.email" id="email" class="form-control" placeholder="Enter your email" required />
            </div>

            <div class="form-group password-field">
              <label for="password">Password</label>
              <input :type="passwordVisible ? 'text' : 'password'" v-model="user.password" id="password" class="form-control" placeholder="Enter your new password" required />
              <span class="toggle-password" @click="togglePasswordVisibility"></span>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Register</button>
          </form>
          <p class="mb-0">
            <router-link to="/login" class="text-center">Already have an account? Sign In</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'Register',
  data() {
    return {
      user: {
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'user'
      },
      passwordVisible: false,
      userId: null,
    }
  },
  created() {
    // Cek apakah pengguna sudah login
    if (localStorage.getItem("token")) {
      this.$router.push({ name: "Dashboard" });
    }
  },
  methods: {
    saveData() {
      axios.post("https://pklwikrama1.4vmapps.com/register", this.user)
        .then(({ data }) => {
          if (data.userId) {
            this.userId = data.userId;
            this.registrationMessage(data.userId);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: 'User ID not returned.',
            });
          }
        })
        .catch(error => {
          console.error('Error:', error.response ? error.response.data : error.message);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Something went wrong.',
          });
        });
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
    registrationMessage(userId) {
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Please wait for admin approval.',
        didClose: () => {
          this.startCheckingApproval(userId);
        }
      });
    },
    startCheckingApproval(userId) {
      Swal.fire({
        title: 'Checking for Admin Approval...',
        html: 'Please wait while we check your registration status.',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const interval = setInterval(() => {
        this.checkApprovalStatus(userId, interval);
      }, 5000);
    },
    checkApprovalStatus(userId, interval) {
      axios.get(`https://pklwikrama1.4vmapps.com/check-approval/${userId}`)
        .then(({ data }) => {
          if (data.approved) {
            clearInterval(interval);
            Swal.close(); // Close the loading modal
            Swal.fire({
              icon: 'success',
              title: 'Registration Approved',
              text: 'Your registration has been approved by the admin. You can now log in.',
              confirmButtonText: 'Go to Login',
            }).then(() => {
              this.$router.push('/login');
            });
          }
        })
        .catch(error => {
          console.error('Error checking approval:', error);
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Approval Check Failed',
            text: 'An error occurred while checking the approval status.',
          });
        });
    },
  }
}
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
