<template>
  <div class="p-6">
    <div class="flex justify-between items-center py-2">
      <h3 class="text-2xl font-bold text-left">Data Perusahaan</h3>
      <router-link to="/app/add-perusahaan">
        <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center">
          <i class="fas fa-plus mr-2"></i>Tambah Data Perusahaan
        </button>
      </router-link>
    </div>

    <!-- Kolom Pencarian -->
    <div class="mt-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari berdasarkan nama perusahaan"
        class="w-full border border-gray-300 rounded-md px-4 py-2"
      />
    </div>

    <!-- Tabel Data Perusahaan -->
    <div class="card-body mt-4">
      <table class="min-w-full bg-white border border-gray-300">
        <thead class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6 text-left border border-gray-300">Nama Perusahaan</th>
            <th class="py-3 px-6 text-left border border-gray-300">Alamat</th>
            <th class="py-3 px-6 text-left border border-gray-300">Website</th>
            <th class="py-3 px-6 text-center border border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm font-light">
          <tr v-for="perusahaan in paginatedPerusahaan" :key="perusahaan.id" class="border-b border-gray-300 hover:bg-gray-100">
            <td class="py-3 px-6 text-left border border-gray-300">{{ perusahaan.name }}</td>
            <td class="py-3 px-6 text-left border border-gray-300">{{ perusahaan.address }}</td>
            <td class="py-3 px-6 text-left border border-gray-300">{{ perusahaan.website }}</td>
            <td class="py-3 px-6 text-center border border-gray-300">
              <div class="flex justify-start gap-2">
                <router-link :to="`/app/edit-perusahaan/${perusahaan.id}`" class="no-underline">
                  <button class="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex items-center">
                    <i class="fas fa-edit mr-2"></i>Edit
                  </button>
                </router-link>
                <router-link :to="{ name: 'PerusahaanDetail', params: { id: perusahaan.id } }"  class="no-underline">
                <button class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center">
                  <i class="fas fa-eye mr-2"></i>Details
                </button>
              </router-link>
                <button @click="confirmDelete(perusahaan.id)" class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 flex items-center">
                  <i class="fas fa-trash-alt mr-2"></i>Hapus
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="paginatedPerusahaan.length === 0">
            <td colspan="4" class="text-center py-4 border border-gray-300">Tidak ada perusahaan yang ditemukan</td>
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
  name: "DataPerusahaan",
  data() {
    return {
      result: [],
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 5,
    };
  },
  computed: {
    filteredPerusahaan() {
      if (this.searchQuery) {
        return this.result.filter((perusahaan) =>
          perusahaan.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return this.result;
    },
    paginatedPerusahaan() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPerusahaan.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredPerusahaan.length / this.itemsPerPage);
    },
  },
  created() {
    this.loadPerusahaan();
  },
  methods: {
    loadPerusahaan() {
    // Menampilkan SweetAlert loading
    Swal.fire({
      title: 'Memuat data...',
      text: 'Mohon tunggu sebentar.',
      icon: 'info',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
      axios
        .get("https://pklwikrama1.4vmapps.com/perusahaan")
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
        text: "Data perusahaan ini akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deletePerusahaan(id);
        }
      });
    },
    deletePerusahaan(id) {
      axios
        .delete(`https://pklwikrama1.4vmapps.com/perusahaan/${id}`)
        .then(() => {
          this.result = this.result.filter((perusahaan) => perusahaan.id !== id);
          Swal.fire("Dihapus!", "Data perusahaan berhasil dihapus.", "success");
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
