<template>
  <div class="p-6">
    <div class="flex justify-between items-center py-2">
      <h3 class="text-2xl font-bold text-left">Data User</h3>
      <div class="flex space-x-2"> 
      <router-link to="/app/admindashboard" class="no-underline">
          <button class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
            <i class="fas fa-check mr-2"></i>Izin User
          </button>
        </router-link>
      <!-- Menambahkan container untuk tombol dengan space antar tombol -->
        <router-link to="/app/add-user" class="no-underline">
          <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center">
            <i class="fas fa-plus mr-2"></i>Tambah Data User
          </button>
        </router-link>
       
      </div>
    </div>

    <!-- Kolom Pencarian -->
    <div class="mt-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari berdasarkan nama pengguna"
        class="w-full border border-gray-300 rounded-md px-4 py-2"
      />
    </div>

    <!-- Tabel Data Pengguna -->
    <div class="card-body mt-4">
      <table class="min-w-full bg-white border border-gray-300">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6 text-left border border-gray-300">Nama Pengguna</th>
            <th class="py-3 px-6 text-left border border-gray-300">Email</th>
            <th class="py-3 px-6 text-left border border-gray-300">Role</th>
            <th class="py-3 px-6 text-center border border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm font-light">
          <tr v-for="user in paginatedUsers" :key="user.id" class="border-b border-gray-300 hover:bg-gray-100">
            <td class="py-3 px-6 text-left border border-gray-300">{{ user.name }}</td>
            <td class="py-3 px-6 text-left border border-gray-300">{{ user.email }}</td>
            <td class="py-3 px-6 text-left border border-gray-300">{{ user.role }}</td>
            <td class="py-3 px-6 text-center border border-gray-300">
              <div class="flex justify-start gap-2">
                <router-link :to="`/edit-user/${user.id}`" class="no-underline">
                  <button class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex items-center">
                    <i class="fas fa-edit mr-2"></i>Edit
                  </button>
                </router-link>
                <router-link :to="`/user/${user.id}`" class="no-underline">
                  <button class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center">
                    <i class="fas fa-eye mr-2"></i>Detail

                </button>
              </router-link>
                <button @click="confirmDelete(user.id)" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center">
                  <i class="fas fa-trash-alt mr-2"></i>Hapus
                </button>
                
              </div>
            </td>
          </tr>
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="4" class="text-center py-4 border border-gray-300">Tidak ada pengguna yang ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4">
      <button
        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        :disabled="currentPage === 1"
        @click="previousPage"
      >
        Previous
      </button>
      <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <button
        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "DataUser",
  data() {
    return {
      result: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
      userRole: null, // Role pengguna yang login
      userId: null, // ID pengguna yang login
    };
  },
  computed: {
  filteredUsers() {
    let users = this.result;

    // Jika yang login adalah super admin, tampilkan hanya pengguna dengan role 'admin' dan 'user'
    if (this.userRole === "superadmin") {
      users = users.filter((user) => user.role === "admin" || user.role === "user");
    }
    // Jika yang login adalah admin, tampilkan hanya pengguna dengan role 'user'
    else if (this.userRole === "admin") {
      users = users.filter((user) => user.role === "user");
    }

    // Hilangkan data pengguna yang sedang login dari tampilan
    users = users.filter((user) => user.id !== this.userId);

    // Urutkan pengguna, dengan 'admin' muncul lebih dulu dari 'user'
    users.sort((a, b) => {
      const roleOrder = { admin: 1, user: 2 }; // Tentukan urutan berdasarkan role
      return roleOrder[a.role] - roleOrder[b.role];
    });

    // Pencarian berdasarkan nama
    if (this.searchQuery) {
      users = users.filter((user) =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    return users;
  },
  paginatedUsers() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsers.slice(start, end);
  },
  totalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  },

  },
  created() {
    this.loadUserData(); // Memuat role dan ID pengguna yang login
    this.loadUsers();
  },
  methods: {
    loadUserData() {
      // Ambil role dan ID dari localStorage
      this.userRole = localStorage.getItem("userRole");
      this.userId = parseInt(localStorage.getItem("userId")); // Pastikan tipe datanya integer
    },
    loadUsers() {
      Swal.fire({
        title: "Memuat data...",
        text: "Harap tunggu sebentar.",
        icon: "info",
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      axios
        .get("http://127.0.0.1:8000/users")
        .then(({ data }) => {
          this.result = data;
          Swal.close();
        })
        .catch((error) => {
          console.error("There was an error!", error);
          Swal.close();
        });
    },
    confirmDelete(id) {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data pengguna ini akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUser(id);
        }
      });
    },
    deleteUser(id) {
      axios
        .delete(`http://127.0.0.1:8000/users/${id}`)
        .then(() => {
          this.result = this.result.filter((user) => user.id !== id);
          Swal.fire("Dihapus!", "Data pengguna berhasil dihapus.", "success");
        })
        .catch((error) => {
          console.error("There was an error!", error);
          Swal.fire("Error", "Terjadi kesalahan saat menghapus data.", "error");
        });
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>



<style scoped>
/* Styling for the table and pagination */
.table th,
.table td {
  padding: 12px 15px;
  border: 1px solid #e2e8f0; /* Light gray border for separation */
}

.table td .flex {
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .table td .flex {
    flex-direction: column;
  }
}
</style>
