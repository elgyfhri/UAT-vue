<template>
  <div>
    <div class="flex justify-between items-center py-2">
      <h3 class="text-2xl font-bold text-left">Manage Users</h3>
      <div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan nama"
          class="border border-gray-300 rounded-md px-4 py-2 mr-4"
        />
      </div>
    </div>

    <!-- Tabel Data Pengguna -->
    <div class="card-body">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Nama Pengguna</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.is_active ? 'Active' : 'Suspended' }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button
                v-if="user.is_active"
                @click="suspendUser(user.id)"
                class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 mr-2"
              >
                Suspend
              </button>
              <button
                v-else
                @click="activateUser(user.id)"
                class="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
              >
                Activate
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="text-center py-4">Tidak ada pengguna yang ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      users: [], 
      currentUserRole: '', 
      searchQuery: '' // Query pencarian
    };
  },
  computed: {
    filteredUsers() {
      // Mengurutkan dan memfilter data pengguna berdasarkan role dan pencarian
      const sortedUsers = this.sortUsersByRole(this.users);
      let result = sortedUsers;
      
      // Filter pengguna hanya dengan role 'user' jika yang login adalah admin
      if (this.currentUserRole === 'admin') {
        result = result.filter(user => user.role === 'user' );
      }

      // Filter berdasarkan nama
      if (this.searchQuery) {
        result = result.filter(user => 
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      return result;
    }
  },
  created() {
    this.loadCurrentUserRole(); // Memuat role pengguna saat ini
    if (this.currentUserRole === 'user') {
      this.$router.push('/dashboard'); // Arahkan ke dashboard jika role adalah 'user'
    } else {
      this.fetchUsers(); // Memuat data pengguna jika admin atau superadmin
    }
  },
  methods: {
    fetchUsers() {
      axios.get("http://pklwikrama1.4vmapps.com/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        this.users = response.data;
      })
      .catch(error => {
        console.error('Terjadi kesalahan saat memuat data pengguna:', error);
      });
    },
    loadCurrentUserRole() {
      const userRole = localStorage.getItem("userRole");
      this.currentUserRole = userRole || '';
    },
    suspendUser(userId) {
      axios.patch(`http://pklwikrama1.4vmapps.com/users/${userId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(() => {
        this.fetchUsers(); // Refresh data setelah berhasil suspend
        alert('User suspended successfully!');
      })
      .catch(error => {
        console.error('Terjadi kesalahan saat menangguhkan pengguna:', error);
        alert('Gagal menangguhkan pengguna.');
      });
    },
    activateUser(userId) {
      axios.patch(`http://pklwikrama1.4vmapps.com/users/${userId}/activate`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(() => {
        this.fetchUsers(); // Refresh data setelah berhasil aktivasi
        alert('User account activated successfully!');
      })
      .catch(error => {
        console.error('Terjadi kesalahan saat mengaktifkan pengguna:', error);
        alert('Gagal mengaktifkan pengguna.');
      });
    },
    sortUsersByRole(users) {
      const roleOrder = { superadmin: 1, admin: 2, user: 3 };
      return users.slice().sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
    }
  }
};
</script>
