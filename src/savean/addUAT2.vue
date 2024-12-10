<template>
  <div class="container mt-4">
    <h3 class="mb-3">Aksi UAT</h3>
    <form @submit.prevent="submitEditData">
      <div class="row">
        <!-- Card 1: Project Name, Client, Perusahaan -->
<div class="col-md-4 mb-3">
  <div class="card shadow-sm h-100">
    <div class="card-header">
      <h5 class="mb-0">Informasi Proyek</h5>
    </div>
    <div class="card-body">
        <p><strong>Project Name:</strong> {{ form.project_name }}</p>
        <p> <strong>Klien:</strong> {{ clients.find(client => client.id === form.client_id)?.name || '-' }} </p>
        <p><strong>Perusahaan:</strong> {{ perusahaans.find(perusahaan => perusahaan.id === form.perusahaan_id)?.name || '-' }}</p>
      </div>
    </div>
  </div>

<!-- Card 2: Nomor Dokumen, No Rev, Tgl mulai, Tgl selesai -->
<div class="col-md-4 mb-3">
  <div class="card shadow-sm h-100">
    <div class="card-header">
      <h5 class="mb-0">Detail Dokumen</h5>
    </div>
    <div class="card-body">       
        <p><strong>No Dokumen:</strong> {{ form.config_document }}</p>    
        <p><strong>No Rev:</strong> {{ form.revision_number }}</p>
        <p><strong>Tgl Mulai:</strong> {{ form.start_date }}</p>
        <p><strong>Tgl Akhir:</strong> {{ form.end_date }}</p>
    </div>
  </div>
</div>

<!-- Card 3: Username, Password -->
<div class="col-md-4 mb-3">
  <div class="card shadow-sm h-100">
    <div class="card-header">
      <h5 class="mb-0">User Default</h5>
    </div>
    <div class="card-body">
        <p ><strong>Username:</strong> {{ form.user_info.username }}</p>
        <p ><strong>Password:</strong>{{ form.user_info.password }}</p>
  </div>
</div>
</div>
</div>

     <div>
  <!-- Header dan Pencarian -->
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h3 class="text-left mb-0">Tabel UAT</h3>
  </div>

  <input
    type="text"
    class="form-control mb-3"
    v-model="searchQuery"
    placeholder="Cari berdasarkan nama halaman"
  />

  <div class="table-responsive">
  <table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th>No</th>
        <th>Skenario</th>
        <th>Aksi</th>
        <th>Ekspektasi</th>
        <th>Test Result</th>
        <th>Hasil</th>
        <th>Note</th>
        <th>Note Gambar</th>
      </tr>
    </thead>
    <tbody>
      <!-- Tampilkan pesan jika tidak ada data -->
      <template v-if="filteredPages.length === 0">
        <tr>
          <td colspan="8" class="text-center py-4">
            Tidak ada halaman yang ditemukan
          </td>
        </tr>
      </template>

      <!-- Loop untuk halaman -->
      <template v-for="(page, pageIndex) in filteredPages" :key="'page-' + pageIndex">
        <tr class="row-page">
          <td>{{ pageIndex + 1 }}</td>
          <td colspan="7">
            <span>{{ page.pages }}</span>
          </td>
        </tr>

        <!-- Loop untuk section -->
        <template v-for="(section, sectionIndex) in page.sections" :key="'section-' + pageIndex + '-' + sectionIndex">
          <tr class="row-section">
            <td>{{ section.section_number }}</td>
            <td><span>{{ section.section_description }}</span></td>
            <td><span>{{ section.url }}</span></td>
            <td><span>{{ section.cms_admin_panel }}</span></td>
            <td>
              <button
                type="button"
                class="btn btn-success"
                :style="{ opacity: section.test_result === '1' ? 1 : 0.5 }"
                :class="{ 'disabled-btn': section.test_result === '1', 'btn-muted': section.test_result !== '1' }"
                @click="setTestResult(pageIndex, sectionIndex, null, 'checked')"
              >
                ✔️
              </button>
              <button
                type="button"
                class="btn btn-danger"
                :style="{ opacity: section.test_result === '0' ? 1 : 0.5 }"
                :class="{ 'disabled-btn': section.test_result === '0', 'btn-muted': section.test_result !== '0' }"
                @click="setTestResult(pageIndex, sectionIndex, null, 'unchecked')"
              >
                ❌
              </button>
            </td>
            <td>
              <input type="text" class="form-control" v-model="section.result" placeholder="Result" />
            </td>
            <td>
              <input type="text" class="form-control" v-model="section.note" placeholder="Note" />
            </td>
            <td>
  <!-- Input gambar -->
  <input
    type="file"
    class="form-control"
    @change="handleImageUpload($event, pageIndex, sectionIndex)"
  />

  <!-- Pratinjau gambar -->
  <div v-if="section.current_image">
    <img
      :src="section.current_image"
      alt="Preview"
      class="img-thumbnail mt-2"
      style="max-width: 100px; max-height: 100px; cursor: pointer;"
      @click="showLargeImage(section.current_image)"
    />
    <!-- Tombol hapus gambar -->
    <button
      type="button"
      class="btn btn-danger mt-2"
      @click="removeImage(pageIndex, sectionIndex)"
    >
      Hapus Gambar
    </button>
  </div>
  <!-- Modal untuk menampilkan gambar besar -->
<div class="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="imageModalLabel" aria-hidden="true" @click="closeModal">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="imageModalLabel">Pratinjau Gambar</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click.stop="closeModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <img :src="largeImage" alt="Large Preview" class="img-fluid" />
      </div>
    </div>
  </div>
</div>
</td>






          </tr>
        </template>
      </template>
    </tbody>
  </table>
</div>

  </div>
      <!-- Progress Bar -->
      <div class="progress mt-3" style="height: 20px; background-color: #f5f5f5; border: 1px solid #ddd; position: relative;">
  <div
    class="progress-bar"
    role="progressbar"
    :style="{
      width: form.progress_percentage + '%',
      fontSize: '16px',
      color: form.progress_percentage > 0 ? 'white' : 'black',
      backgroundColor: form.progress_percentage > 0 ? '#007bff' : 'transparent',
    }"
    :aria-valuenow="form.progress_percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <!-- Teks hanya mengikuti progress jika progress > 0 -->
    <p
      v-if="form.progress_percentage > 0"
      style="margin: 0; text-align: center; line-height: 20px;"
    >
      {{ form.progress_percentage }}%
    </p>
  </div>
  <!-- Teks tambahan saat progress 0% -->
  <p
    v-if="form.progress_percentage === 0"
    style="margin: 0; position: absolute; width: 100%; text-align: center; line-height: 20px; color: black;"
  >
    Progress: 0%
  </p>
</div>

      
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>
  <script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      form: {
        project_name: "",
        user_info: {
          username: "",
          password: "",
        },
        client_id: null,
        perusahaan_id: null,
        config_document: "",
        pages: [],

        progress_percentage: 0,
        // Menyimpan data pages, sections, dan sub-sections
      },
      clients: [],
      perusahaans: [],
      configDocumentPlaceholder: "",
      submitted: false, // Customizable placeholder for config document
      searchQuery: "",
      largeImage: '', // Untuk menyimpan URL gambar besar
    };
  },
  created() {
  this.loadUATData();
  this.loadClientsAndPerusahaans();
  if (this.form.pages && this.form.pages.length > 0) {
    this.splitSectionOnPages();
  }
},

  computed: {
    progressPercentage() {
  const totalRows = this.countTotalRows();
  const checkedRows = this.countCheckedRows();
  return totalRows > 0 ? Math.round((checkedRows / totalRows) * 100) : 0;
},
    filteredPages() {
      if (!this.searchQuery) return this.form.pages;
      const lowerSearch = this.searchQuery.toLowerCase();

      return this.form.pages.filter((page) => {
        // Periksa apakah nama page mengandung kata kunci pencarian
        if (page.pages.toLowerCase().includes(lowerSearch)) return true;
      });
    },
    
  },
  mounted() {
    // Jika user_info adalah string JSON, ubah menjadi objek
    if (typeof this.form.user_info === "string") {
      try {
        this.form.user_info = JSON.parse(this.form.user_info);
      } catch (e) {
        console.error("Gagal mengubah user_info menjadi objek:", e);
      }
    }
  },
  methods: {
    showLargeImage(imageUrl) {
    this.largeImage = imageUrl;
    $('#imageModal').modal('show'); // Menampilkan modal menggunakan jQuery
  },
  
  // Fungsi untuk menutup modal
  closeModal() {
    $('#imageModal').modal('hide'); // Menutup modal menggunakan jQuery
  },
    handleImageUpload(event, pageIndex, sectionIndex) {
  const file = event.target.files[0];
  const section = this.form.pages[pageIndex].sections[sectionIndex];

  if (file && file.type.startsWith("image/")) {
    // Jika ada file baru yang dipilih
    const imageUrl = URL.createObjectURL(file);
    section.current_image = imageUrl; // Set gambar untuk pratinjau
    section.note_image = file; // Simpan file gambar baru untuk dikirim

    // Hapus gambar asli (original_image) jika ada gambar baru
    section.original_image = null; // Gambar asli tidak digunakan jika gambar baru ada
  } else if (!file) {
    // Jika tidak ada file (misalnya gambar dihapus)
    // Kembalikan gambar ke original_image yang ada sebelumnya
    section.current_image = section.original_image || null; // Kembalikan gambar asli atau null
    section.note_image = null; // Tidak kirim gambar baru jika tidak ada perubahan
  }
},



removeImage(pageIndex, sectionIndex) {
  const section = this.form.pages[pageIndex].sections[sectionIndex];

  console.log("Menghapus gambar...");

  // Periksa apakah ada gambar yang ditampilkan, jika ada, hapus gambar tersebut
  if (section.current_image) {
    section.current_image = null; // Hapus pratinjau gambar
  }

  if (section.original_image) {
    section.original_image = null; // Hapus gambar asli jika ada
  }

  section.note_image = null; // Hapus file gambar dari data yang akan dikirim

  console.log("Gambar setelah dihapus:", section.current_image);
  console.log("Gambar yang akan dikirim:", section.note_image);
},
      splitSectionOnPages() {
  // Memisahkan section_on_pages menjadi section_number dan section_description
  this.form.pages.forEach(page => {
    page.sections.forEach(section => {
      if (section.section_on_pages) {
        // Mencocokkan bagian nomor dan teks menggunakan regex
        const regex = /(\d+(\.\d+)*)(.*)/; // Pola regex untuk memisahkan nomor dan teks
        const match = section.section_on_pages.match(regex);
        
        if (match) {
          section.section_number = match[1]; // Bagian nomor seperti '1.2'
          section.section_description = match[3].trim() || ''; // Bagian teks setelah nomor
        } else {
          // Jika tidak ada kecocokan, gunakan nilai asli
          section.section_number = section.section_on_pages;
          section.section_description = '';
        }
      }
    });
  });
},
    // Mengelola logika pilih semua
async loadUATData() {
  Swal.fire({
    title: "Memuat data...",
    text: "Tunggu sebentar, data sedang dimuat.",
    icon: "info",
    showConfirmButton: false,
    allowOutsideClick: false,
    willOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/uats/${this.$route.params.id}`
    );
    this.form = response.data;
    if (this.form.pages && this.form.pages.length > 0) {
      this.splitSectionOnPages();
    }

    if (this.form.pages && this.form.pages.length > 0) {
      this.form.pages.forEach((page) => {
        if (page.sections) {
          page.sections.forEach((section) => {
            // Menyimpan gambar yang sudah ada
            section.original_image = section.note_image_url || null; // Gambar asli yang ada sebelumnya
            section.current_image = section.note_image_url || null; // Gambar untuk pratinjau saat edit
          });
        }
      });
    }

    if (typeof this.form.user_info === "string") {
      try {
        this.form.user_info = JSON.parse(this.form.user_info);
      } catch (e) {
        console.error("Gagal mengubah user_info menjadi objek:", e);
      }
    }

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data berhasil dimuat.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Gagal memuat data:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Terjadi kesalahan saat memuat data.",
    });
  } finally {
    Swal.close();
  }
},




    loadClientsAndPerusahaans() {
      axios.get("http://127.0.0.1:8000/clients").then((response) => {
        this.clients = response.data;
      });
      axios.get("http://127.0.0.1:8000/perusahaan").then((response) => {
        this.perusahaans = response.data;
      });
    },

    updateSectionNumbers(pageIndex) {
      const page = this.form.pages[pageIndex];
      page.sections.forEach((section, index) => {
        section.section_on_pages = `${pageIndex + 1}.${index + 1}`;
      });
    },
    updateSubSectionNumbers(pageIndex, sectionIndex) {
      const section = this.form.pages[pageIndex].sections[sectionIndex];
      section.sub_sections.forEach((subSection, index) => {
        subSection.sub_section = `${section.section_on_pages}.${index + 1}`;
      });
    },
    updateAllSectionNumbers() {
      this.form.pages.forEach((page, pageIndex) => {
        this.updateSectionNumbers(pageIndex);
        page.sections.forEach((section, sectionIndex) => {
          this.updateSubSectionNumbers(pageIndex, sectionIndex);
        });
      });
    },
    updateProgressPercentage() {
      const totalItems = this.countTotalRows();
      const checkedItems = this.countCheckedRows();
      this.form.progress_percentage =
        totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);
    },

    countTotalRows() {
  let total = 0;
  this.form.pages.forEach((page) => {
    page.sections.forEach((section) => {
      if (section.section_on_pages) { // Hanya hitung section yang memiliki section_on_pages
        total += 1; // Hitung section
      }
    });
  });
  return total;
},

countCheckedRows() {
  let checked = 0;
  this.form.pages.forEach((page) => {
    page.sections.forEach((section) => {
      if (section.section_on_pages && section.test_result === "1") { // Cek section_on_pages dan test_result
        checked += 1;
      }
    });
  });
  return checked;
},

    setTestResult(pageIndex, sectionIndex, subSectionIndex, status) {
      const page = this.form.pages[pageIndex];
      const result = status === "checked" ? "1" : "0";

      if (sectionIndex !== null && subSectionIndex !== null) {
        page.sections[sectionIndex].sub_sections[subSectionIndex].test_result =
          result;
      } else if (sectionIndex !== null) {
        page.sections[sectionIndex].test_result = result;
      } else {
        page.test_result = result;
      }

      this.updateProgressPercentage();
    },
    
    updateConfigDocument() {
      const selectedPerusahaan = this.perusahaans.find(
        (perusahaan) => perusahaan.id === this.form.perusahaan_id
      );
      if (selectedPerusahaan) {
        this.configDocumentPlaceholder = selectedPerusahaan.config_document;
        this.form.config_document = this.configDocumentPlaceholder;
      }
    },
    async submitEditData() {
  this.submitted = true; // Menandakan form sudah dikirim

  // Validasi nama proyek
  if (!this.form.project_name) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Nama proyek harus diisi!",
    });
    console.error("Project Name is required");
    return;
  }

  // Validasi field Pages
  const invalidPages = this.form.pages.some((page) => !page.pages);
  if (invalidPages) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: 'Pastikan semua field "Pages" telah diisi.',
    });
    console.warn("Terdapat field Pages yang kosong. Harap lengkapi semua field Pages.");
    return;
  }

  // Konversi gambar baru menjadi Base64 jika diperlukan
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  try {
    // Proses gambar
    for (const page of this.form.pages) {
      for (const section of page.sections) {
        // Jika ada file baru, konversikan ke Base64
        if (section.note_image instanceof File) {
          section.note_image = await convertToBase64(section.note_image);
        } else if (section.original_image) {
          // Jika tidak ada file baru, gunakan original_image
          section.note_image = section.original_image;
        }
        // Jika tidak ada gambar baru atau lama, note_image tetap null
      }
    }

    // Gabungkan kembali section_number dan section_description menjadi section_on_pages
    this.form.pages.forEach((page) => {
      page.sections.forEach((section) => {
        section.section_on_pages = `${section.section_number} ${section.section_description}`;
      });
    });

    // Siapkan data yang akan dikirim
    const dataToSend = {
      ...this.form,
      user_info: {
        username: this.form.user_info.username,
        password: this.form.user_info.password,
      },
    };

    console.log("Data yang akan dikirim:", dataToSend);

    // Kirim data ke server
    await axios.put(
      `http://127.0.0.1:8000/uats/${this.$route.params.id}`,
      dataToSend
    );

    // Tampilkan pesan sukses
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data UAT berhasil diperbarui.",
    }).then(() => {
      this.$router.push({ name: "UAT" });
    });
  } catch (error) {
    console.error(
      "Error updating UAT:",
      error.response ? error.response.data : error.message
    );

    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Terjadi kesalahan saat memperbarui data UAT.",
    });
  }
}





  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .progress-bar {
    font-size: 14px; /* Ukuran font tetap */
  }
}

.progress {
  margin-bottom: 10px; /* Menambahkan jarak antara progress bar dan tombol submit */
}

.btn-primary {
  margin-top: 10px; /* Menambahkan jarak di atas tombol submit */
}

.btn-primary {
  width: 100%; /* Membuat tombol mengisi lebar penuh dari kontainer */
}

.progress-bar {
  background-color: green; /* Warna kuning untuk progress bar */
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 500;
}

.row-page {
  background-color: #f8f9fa; /* Warna abu-abu muda */
  font-weight: bold;
  font-size: 1.1em;
}

/* Gaya untuk baris Section */
.row-section {
  background-color: #ffffff; /* Warna putih */
  border-left: 5px solid #007bff; /* Garis biru di kiri */
  padding-left: 15px;
}
.btn-success:disabled,
.btn-danger:disabled {
  background-color: inherit; /* Tetap gunakan warna default */
  opacity: 0.7; /* Atur tingkat transparansi */
  cursor: not-allowed; /* Indikasikan tombol tidak dapat diklik */
}
.modal-backdrop.show {
  background-color: rgba(0, 0, 0, 0.5); /* Memberikan efek buram */
}

</style>