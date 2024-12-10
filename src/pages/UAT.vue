<template>
  <div class="p-6">
    <div class="flex justify-between items-center py-2">
      <h3 class="text-2xl font-bold text-left">Data UAT</h3>
      <router-link to="/app/add-uat">
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>Input Data UAT
        </button>
      </router-link>
    </div>

    <!-- Kolom Pencarian -->
    <div class="mt-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari berdasarkan nama project"
        class="w-full border border-gray-300 rounded-md px-4 py-2"
      />
    </div>

    <!-- Tabel Data UAT -->
    <div class="card-body mt-4">
      <table class="min-w-full bg-white border border-gray-300">
        <thead
          class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
        >
          <tr>
            <th class="py-3 px-6 text-left border border-gray-300">
              Nama Project
            </th>
            <th class="py-3 px-6 text-left border border-gray-300">
              Perusahaan
            </th>
            <th class="py-3 px-6 text-left border border-gray-300">Client</th>
            <th class="py-3 px-6 text-left border border-gray-300">
              Progress Project
            </th>
            <th class="py-3 px-6 text-center border border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm font-light">
          <tr
            v-for="uat in paginatedUat"
            :key="uat.id"
            class="border-b border-gray-300 hover:bg-gray-100"
          >
            <td class="py-3 px-6 text-left border border-gray-300">
              {{ uat.project_name }}
            </td>
            <td class="py-3 px-6 text-left border border-gray-300">
              {{ uat.perusahaan ? uat.perusahaan.name : "-" }}
            </td>
            <td class="py-3 px-6 text-left border border-gray-300">
              {{ uat.client ? uat.client.name : "-" }}
            </td>
            <td class="py-3 px-6 text-left border border-gray-300">
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div
                  class="bg-blue-500 h-4 rounded-full"
                  :style="{ width: `${uat.progress_percentage}%` }"
                ></div>
              </div>
              <p>{{ uat.progress_percentage }}%</p>
            </td>
            <td class="py-3 px-6 text-left border border-gray-300">
              <div class="flex justify-start gap-2">
                <router-link
                  :to="`/app/adduat2/${uat.id}`"
                  class="no-underline"
                >
                  <button class="action-btn bg-yellow-500 hover:bg-yellow-600">
                    <i class="fas fa-cogs mr-2"></i>Aksi UAT
                  </button>
                </router-link>
                <router-link
                  :to="`/app/edit-uat/${uat.id}`"
                  class="no-underline"
                >
                  <button class="action-btn bg-green-500 hover:bg-green-600">
                    <i class="fas fa-edit mr-2"></i>Edit
                  </button>
                </router-link>
                <router-link
                  :to="`/app/uatdetail/${uat.id}`"
                  class="no-underline"
                >
                  <button class="action-btn bg-blue-500 hover:bg-blue-600">
                    <i class="fas fa-eye mr-2"></i>Detail
                  </button>
                </router-link>
                <button
                  @click="confirmDelete(uat.id)"
                  class="action-btn bg-red-500 hover:bg-red-600"
                >
                  <i class="fas fa-trash-alt mr-2"></i>Hapus
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedUat.length === 0">
            <td colspan="5" class="text-center py-4 border border-gray-300">
              Tidak ada UAT project yang ditemukan
            </td>
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
  name: "DataUat",
  data() {
    return {
      result: [],
      searchQuery: "",
      currentPage: 1, // Halaman saat ini
      itemsPerPage: 5, // Jumlah data per halaman
    };
  },
  computed: {
    // Filter data berdasarkan pencarian
    filteredUat() {
      if (this.searchQuery) {
        return this.result.filter((uat) =>
          uat.project_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      }
      return this.result;
    },
    // Ambil data untuk halaman tertentu berdasarkan pagination
    paginatedUat() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUat.slice(start, end);
    },
    // Hitung total halaman
    totalPages() {
      return Math.ceil(this.filteredUat.length / this.itemsPerPage);
    },
  },
  created() {
    this.loadUat();
  },
  methods: {
    loadUat() {
      // Menampilkan SweetAlert loading
      Swal.fire({
        title: "Memuat data...",
        text: "Mohon tunggu sebentar.",
        icon: "info",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      // Mengambil data dari API
      axios
        .get("http://pklwikrama1.4vmapps.com/uats")
        .then(({ data }) => {
          this.result = data;
          Swal.close(); // Menutup loading setelah data dimuat
        })
        .catch((error) => {
          console.error("There was an error!", error);
          Swal.close(); // Menutup loading jika ada error
          Swal.fire("Error", "Terjadi kesalahan saat memuat data.", "error");
        });
    },
    confirmDelete(id) {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Data UAT ini akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteUat(id);
        }
      });
    },
    deleteUat(id) {
      axios
        .delete(`http://pklwikrama1.4vmapps.com/uats/${id}`)
        .then(() => {
          this.result = this.result.filter((uat) => uat.id !== id);
          Swal.fire("Dihapus!", "Data UAT berhasil dihapus.", "success");
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
/* Additional styles for a cleaner table look */
.table th,
.table td {
  padding: 12px 15px;
  border: 1px solid #e2e8f0; /* Light gray border for separation */
}

/* Add responsiveness to action buttons */
@media (max-width: 768px) {
  .table td .flex {
    flex-direction: column; /* Stack buttons vertically on smaller screens */
  }

  .table td .flex button {
    margin-bottom: 8px; /* Space between buttons */
  }
}

.action-btn {
  width: 120px; /* Lebar tombol seragam */
  text-align: center; /* Text rata tengah */
  padding: 8px 12px; /* Padding tombol */
  border-radius: 6px; /* Rounded corners */
  font-size: 14px; /* Ukuran font */
  font-weight: 500; /* Tebal font */
  color: white; /* Warna teks */
  display: flex; /* Flexbox */
  align-items: center; /* Rata vertikal */
  justify-content: center; /* Rata horizontal */
}
.action-btn i {
  margin-right: 4px; /* Spasi antara ikon dan teks */
}
.flex {
  flex-wrap: wrap; /* Jika tombol banyak, akan beralih ke baris berikutnya */
  gap: 8px; /* Jarak antar tombol */
}
</style>
