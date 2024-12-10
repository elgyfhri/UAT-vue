<template>
  <div class="hold-transition login-page">
    <div class="login-box">
      <div class="card card-outline card-primary">
        <div class="card-header text-center">
          <a href="../../index2.html" class="h1"><b>UAT</b>WEB</a>
        </div>
        <div class="card-body">
          <p class="login-box-msg">Sign in to start your session</p>
          <form @submit.prevent="loginData">
            <div class="input-group mb-3">
              <input
                type="email"
                id="email"
                v-model="user.email"
                class="form-control"
                placeholder="Email"
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-envelope"></span>
                </div>
              </div>
            </div>
            <div class="input-group mb-3">
              <input
                type="password"
                id="password"
                v-model="user.password"
                class="form-control"
                placeholder="Password"
              />
              <div class="input-group-append">
                <div class="input-group-text">
                  <span class="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-4">
                <button type="submit" class="btn btn-primary btn-block">
                  Sign In
                </button>
              </div>
            </div>
          </form>
          <p class="mb-0">
            <router-link to="/register" class="text-center"
              >Create Account</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  created() {
    if (localStorage.getItem("token")) {
      this.$router.push({ name: "Dashboard" });
    }
  },
  methods: {
    async loginData() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/login", {
          email: this.user.email,
          password: this.user.password,
        });

        if (response.data.status) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userRole", response.data.user.role);
          localStorage.setItem("userImage", response.data.user.profile_image);

          this.$router.push({ name: "Dashboard" });
        } else {
          console.error("Login failed:", response.data.message);
          alert("Login gagal: " + response.data.message);
        }
      } catch (error) {
        console.error(
          "Login request failed:",
          error.response?.data || error.message
        );
        alert(
          "Login gagal: " + (error.response?.data.message || error.message)
        );
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.login-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.form-control {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.btn-primary {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.additional-links {
  margin-top: 20px;
}

.forgot-password,
.create-account {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover,
.create-account:hover {
  color: #0056b3;
}
</style>
