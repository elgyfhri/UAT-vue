<template>
  <div class="container mt-4">
    <!-- Flexbox untuk tombol edit dan judul -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="mb-0">Detail UAT</h3>
      <div class="flex space-x-2"> 
      <router-link :to="`/app/edit-uat/${uat.id}`" class="no-underline">
        <button
          class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center"
        >
          <i class="fas fa-edit mr-2"></i>Edit
        </button>
      </router-link>
      <router-link :to="`/app/adduat2/${uat.id}`" class="no-underline">
        <button
          class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 flex items-center"
        >
          <i class="fas fa-cogs mr-2"></i>Edit
        </button>
      </router-link>
    </div>
    </div>

    <!-- Informasi Proyek -->
    <div class="row">
      <!-- Card untuk Informasi Proyek -->
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm h-100">
          <div class="card-header">
            <h5 class="mb-0">Informasi Proyek</h5>
          </div>
          <div class="card-body">
            <p><strong>Nama Proyek:</strong> {{ uat.project_name || "-" }}</p>
            <p><strong>Perusahaan:</strong> {{ uat.perusahaan_name || "-" }}</p>
            <p><strong>Klien:</strong> {{ uat.client_name || "-" }}</p>
          </div>
        </div>
      </div>

      <!-- Card untuk Detail Dokumen -->
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm h-100">
          <div class="card-header">
            <h5 class="mb-0">Detail Dokumen</h5>
          </div>
          <div class="card-body">
            <p><strong>No Dokumen:</strong> {{ uat.config_document || "-" }}</p>
            <p><strong>No Rev:</strong> {{ uat.revision_number || "-" }}</p>
            <p><strong>Tgl Mulai:</strong> {{ uat.start_date || "-" }}</p>
            <p><strong>Tgl Akhir:</strong> {{ uat.end_date || "-" }}</p>
          </div>
        </div>
      </div>

      <!-- Card untuk Informasi User -->
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm h-100">
          <div class="card-header">
            <h5 class="mb-0">User Default</h5>
          </div>
          <div class="card-body">
            <p>
              <strong>Username:</strong> {{ uat.user_info.username || "-" }}
            </p>
            <p>
              <strong>Password:</strong> {{ uat.user_info.password || "-" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
    <!-- Tabel untuk Halaman UAT -->
    <h4 class="mb-3">Halaman UAT</h4>
    <button
      @click="generatePDF"
      class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
    >
      Ekspor ke PDF
    </button>
  </div>

  <div class="mb-3">
      <input
        type="text"
        v-model="searchQuery"
        class="form-control"
        placeholder="Cari berdasarkan nama Pages"
      />
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="thead-light">
          <tr>
            <th>No</th>
            <th>Skenario</th>
            <th>Aksi</th>
            <th>Ekspektasi</th>
            <th>Test Result</th>
            <th>Hasil</th>
            <th>Note</th>
            <th>Note Image</th>
          </tr>
        </thead>
        <tbody>
          <!-- Looping untuk Halaman -->
          <template
            v-for="(page, pageIndex) in filteredPages"
            :key="'page-' + pageIndex"
          >
            <tr tr class="row-pages">
              <td>{{ pageIndex + 1 }}</td>
              <td colspan="7">
                <span>{{ page.pages }}</span>
                <!-- Tampilkan teks, bukan input -->
              </td>
            </tr>

            <!-- Looping untuk Section -->
            <template
              v-for="(section, sectionIndex) in page.sections"
              :key="'section-' + pageIndex + '-' + sectionIndex"
            >
              <tr class="row-section">
                <td>
                  <span>{{
                    splitSectionOnPages(section.section_on_pages).sectionNumber
                  }}</span>
                </td>
                <td>
                  <span>{{
                    splitSectionOnPages(section.section_on_pages).sectionText
                  }}</span>
                </td>
                <td>
                  <span v-if="section.url" target="_blank">{{
                    section.url
                  }}</span>
                  <span v-else>-</span>
                </td>
                <td>{{ section.cms_admin_panel || "-" }}</td>
                <td>
  <span v-if="section.test_result === '1'">✔️</span>
  <span v-else-if="section.test_result === '0'">❌</span>
  <span v-else>-</span>
</td>
<td>{{ section.result || "-" }}</td>
<td>{{ section.note || "-" }}</td>
<td>
  <!-- Kolom untuk menampilkan gambar -->
  <div v-if="section.note_image">
    <img
      v-if="section.note_image_url"
      :src="section.note_image_url"
      class="img-thumbnail"
      style="max-width: 100px; max-height: 100px; cursor: pointer;"
      @click="showLargeImage(section.note_image_url)"
    />
  </div>
  <div v-else>-</div>
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

<!-- Modal untuk menampilkan gambar lebih besar -->


  
</tr>
</template>
</template>

        </tbody>
      </table>
    </div>
    <!-- Progress Bar -->
    <div class="progress mt-4" style="height: 20px; position: relative;">
  <div
    class="progress-bar progress-bar-striped progress-bar-animated"
    role="progressbar"
    :style="{
      width: uat.progress_percentage + '%',
      backgroundColor: uat.progress_percentage > 0 ? '#007bff' : 'transparent',
      color: uat.progress_percentage > 0 ? 'white' : 'black',
    }"
    aria-valuenow="uat.progress_percentage"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <!-- Teks di dalam progress bar untuk progress > 0 -->
    <span v-if="uat.progress_percentage > 0" style="line-height: 20px;">Progress: {{ uat.progress_percentage }}%</span>
  </div>
  <!-- Teks tambahan untuk progress 0% -->
  <span
    v-if="uat.progress_percentage === 0"
    style="position: absolute; width: 100%; text-align: center; line-height: 20px; color: black;"
  >
    Progress: 0%
  </span>
</div>

  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Untuk dukungan tabel jika dibutuhkan

export default {
  data() {
    return {
      searchQuery: "",
      uat: {
        project_name: "",
        user_info: {
          username: "",
          password: "",
        },
        pages: [],
        perusahaan_name: "",
        client_name: "",
      },
      isModalOpen: false,
      largeImage: '', // Untuk menyimpan URL gambar besar
    };
  },
  computed: {
    filteredPages() {
      // Memfilter halaman berdasarkan query pencarian
      return this.uat.pages.filter((page) => {
        return (
          page.pages &&
          page.pages.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });
    },
  },
  created() {
    this.loadUatDetails();
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
    async generatePDF() {
      const doc = new jsPDF(); // Initialize jsPDF
      // Margin dan ukuran halaman
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - 2 * margin;

      // Header: Nama Proyek di Tengah
const projectName = "User Acceptance Testing (UAT)";
doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.text(projectName, pageWidth / 2, margin + 10, { align: "center" });

      // Garis bawah header
      doc.setLineWidth(0.5);
      doc.line(margin, margin + 12, pageWidth - margin, margin + 12);

      let currentY = margin + 20;

      // Informasi Proyek (Kiri) dan Detail Dokumen (Kanan)
      const columnGap = 8;
      const columnWidth = contentWidth / 2 - columnGap / 2;

      // Kolom Kiri: Informasi Proyek
      doc.setFont("helvetica", "bold"); // Ubah font ke bold
      doc.setFontSize(12);
      doc.text("Informasi Proyek", margin, currentY);

      doc.setFont("helvetica", "normal");
      currentY += 6;
      doc.setFontSize(10);
      doc.text(
        `Nama Proyek: ${this.uat.project_name || "-"}`,
        margin,
        currentY
      );
      currentY += 6;
      doc.text(
        `Perusahaan: ${this.uat.perusahaan_name || "-"}`,
        margin,
        currentY
      );
      currentY += 6;
      doc.text(`Klien: ${this.uat.client_name || "-"}`, margin, currentY);

      // Reset posisi Y untuk kolom kanan
      currentY = margin + 20;

      // Kolom Kanan: Detail Dokumen
      const rightColumnX = margin + columnWidth + columnGap;
      doc.setFont("helvetica", "bold"); // Ubah font ke bold
      doc.setFontSize(12);
      doc.text("Detail Dokumen", rightColumnX, currentY);

      doc.setFont("helvetica", "normal");
      currentY += 6;
      doc.setFontSize(10);
      doc.text(
        `No Dokumen: ${this.uat.config_document || "-"}`,
        rightColumnX,
        currentY
      );
      currentY += 6;
      doc.text(
        `No Rev: ${this.uat.revision_number || "-"}`,
        rightColumnX,
        currentY
      );
      currentY += 6;
      doc.text(
        `Tgl Mulai: ${this.uat.start_date || "-"}`,
        rightColumnX,
        currentY
      );
      currentY += 6;
      doc.text(
        `Tgl Akhir: ${this.uat.end_date || "-"}`,
        rightColumnX,
        currentY
      );
     // User Info
currentY += 7; // Tambahkan jarak lebih besar sebelum User Info
doc.setFont("helvetica", "bold"); // Ubah font ke bold
doc.setFontSize(12);
doc.text("User Info", margin, currentY);
doc.setFont("helvetica", "normal");
currentY += 6;
doc.setFontSize(10);
const passwordMasked = this.uat.user_info.password ? this.uat.user_info.password.replace(/./g, '•') : "-"; // Ganti dengan titik
doc.text(`Username: ${this.uat.user_info.username || "-"}`, margin, currentY);
currentY += 6;
doc.text(`Password: ${passwordMasked}`, margin, currentY);
currentY += 10;


      // Garis pemisah antara bagian atas dan tabel
      currentY = Math.max(currentY, margin + 60);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 7;

      // Progress
      const progressText = `Progress: ${this.uat.progress_percentage || 0}%`;
      doc.text(progressText, 14, currentY);
      currentY += 3;

      // Add a table for UAT pages
      // Add a table for UAT pages
// Add a table for UAT pages
const tableData = [];
this.filteredPages.forEach((page, pageIndex) => {
  const pageNumber = `${pageIndex + 1}`;
  const pageName = page.pages || "-";

  // Add a row for pageName
  tableData.push([
    { content: pageNumber, styles: { fontSize: 10, fontStyle: "bold" } },
    { content: pageName, styles: { fontSize: 10, fontStyle: "bold" } },
  ]);

  page.sections.forEach((section) => {
    let testResult = String(section.test_result).trim();
    testResult = testResult.replace(/[^\x20-\x7E]/g, "");
    
    let resultSymbol;
    if (testResult === "1") {
      resultSymbol = "OK";
    } else if (testResult === "0") {
      resultSymbol = "NOK";
    } else {
      resultSymbol = "-";
    }

    const sectionRow = [
      this.splitSectionOnPages(section.section_on_pages).sectionNumber,
      this.splitSectionOnPages(section.section_on_pages).sectionText,
      section.url || "-",
      section.cms_admin_panel || "-",
      resultSymbol,
      section.result || "-",
      section.note || "-",
    ];

    if (section.note_image_base64) {
      const imgData = section.note_image_base64;
      const imgWidth = 50;  // Adjust this value to match the desired column width
      const imgHeight = 50; // Adjust this value to maintain the aspect ratio

      sectionRow.push({
        content: "",
        image: imgData,
        width: imgWidth,
        height: imgHeight,
        styles: { cellPadding: 3 },
      });
    } else {
      sectionRow.push("-");
    }

    tableData.push(sectionRow);
  });
});

const tableColumns = [
  "No",
  "Skenario",
  "Aksi",
  "Ekspektasi",
  "Test Result",
  "Hasil",
  "Note",
  "Note Image",
];

doc.autoTable({
  head: [tableColumns],
  body: tableData,
  startY: currentY,
  theme: "grid",
  margin: { top: 40, bottom: 48 },
  styles: { fontSize: 10, cellPadding: 3 },
  headStyles: {
    fillColor: "#4A90E2",  // Warna biru elegan
    textColor: "#FFFFFF",  // Warna teks putih pada header
    fontStyle: "bold",     // Gaya font tebal untuk header
    halign: "center",      // Rata tengah untuk teks header
  },
  columnStyles: {
    0: { cellWidth: 15 },  // Lebar kolom No
    1: { cellWidth: 25 },  // Lebar kolom Skenario
    2: { cellWidth: 20 },  // Lebar kolom Aksi
    3: { cellWidth: 30 },  // Lebar kolom Ekspektasi
    4: { cellWidth: 23 },  // Lebar kolom Test Result
    5: { cellWidth: 20 },  // Lebar kolom Hasil
    6: { cellWidth: 20 },  // Lebar kolom Note
    7: { cellWidth: 30 },  // Lebar kolom Note Image
  },
  didDrawCell: (data) => {
    if (data.column.index === 7 && data.cell.raw && data.cell.raw.image) {
      const img = data.cell.raw.image;
      const x = data.cell.x + 1; // Adjust x position slightly for better alignment
      const y = data.cell.y + 1; // Adjust y position slightly for better alignment
      const width = data.cell.width - 2; // Adjust width to fit cell better
      const height = data.cell.height - 2; // Adjust height to fit cell better

      doc.addImage(img, 'PNG', x, y, width, height);
    }
  },
  rowPageBreak: 'auto', // Make the table break across pages
  bodyStyles: { minCellHeight: 20 }, // Minimum height for each cell
});


      // Tambahkan tempat tanda tangan di bagian bawah
const pageHeight = doc.internal.pageSize.getHeight(); // Tinggi halaman
const signXLeft = margin; // Posisi X untuk tanda tangan kiri
const signXRight = pageWidth - margin - 60; // Posisi X untuk tanda tangan kanan
const signY = pageHeight - margin - 40; // Posisi Y untuk tanda tangan (sedikit di atas margin bawah)

// Tampilkan tanggal di kiri
const currentDate = new Date();
const formattedDate = `${currentDate.getDate()}/${
  currentDate.getMonth() + 1
}/${currentDate.getFullYear()}`;
doc.setFont("helvetica", "normal");
doc.setFontSize(10);

// Tanggal kiri
doc.text(`......, ${formattedDate}`, signXLeft, signY);

// Tanggal kanan
doc.text(`......, ${formattedDate}`, signXRight, signY);

// Kolom kosong untuk tanda tangan (tanpa garis di tengah)

// Tanda tangan kiri
const signatureY = signY + 10;
const nameYLeft = signatureY + 10; // Posisi teks nama tanda tangan kiri
const lineYLeft = nameYLeft + 1; // Posisi garis sedikit di bawah teks kiri

doc.text("Nama:", signXLeft, nameYLeft); // Teks Nama untuk kiri
doc.setDrawColor(0); // Hitam
doc.setLineWidth(0.2); // Garis tipis untuk nama
doc.line(signXLeft, lineYLeft, signXLeft + 40, lineYLeft); // Garis horizontal untuk nama kiri

// Tanda tangan kanan
const nameYRight = signatureY + 10; // Posisi teks nama tanda tangan kanan
const lineYRight = nameYRight + 1; // Posisi garis sedikit di bawah teks kanan

doc.text("Nama:", signXRight, nameYRight); // Teks Nama untuk kanan
doc.line(signXRight, lineYRight, signXRight + 40, lineYRight); // Garis horizontal untuk nama kanan





      // Finalize the document and download
      doc.save("UAT_Detail.pdf");
    },

    splitSectionOnPages(sectionOnPages) {
      // Memisahkan bagian nomor dan teks
      const regex = /(\d+(\.\d+)*)(.*)/; // Mencocokkan pola angka (nomor) dan teks setelahnya
      const match = sectionOnPages.match(regex);

      if (match) {
        return {
          sectionNumber: match[1], // Bagian nomor seperti '1.2'
          sectionText: match[3].trim(), // Bagian teks setelah nomor
        };
      }

      // Jika tidak ada match, kembalikan nilai asli
      return {
        sectionNumber: sectionOnPages,
        sectionText: "",
      };
    },

    async loadUatDetails() {
  try {
    Swal.fire({
      title: "Loading...",
      text: "Memuat detail UAT...",
      icon: "info",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const uatId = this.$route.params.id;
    const { data } = await axios.get(`http://pklwikrama1.4vmapps.com/uats/${uatId}`);

    // Proses pages dan sections untuk memastikan gambar dapat diakses
    data.pages.forEach((page) => {
      page.sections.forEach((section) => {
        if (section.note_image) {
          // Validasi atau proses URL gambar jika diperlukan
          section.note_image = section.note_image;
        }
      });
    });

    data.user_info = JSON.parse(data.user_info);
    this.uat = data;
     // Load nama perusahaan dan klien
     await this.loadCompanyName(data.perusahaan_id);
    await this.loadClientName(data.client_id);
    Swal.close();
  } catch (error) {
    console.error("Error fetching UAT details:", error);
    Swal.fire({
      icon: "error",
      title: "Terjadi Kesalahan",
      text: "Gagal memuat data UAT. Coba lagi nanti.",
    });
  }
},
    async loadCompanyName(perusahaanId) {
      try {
        const { data } = await axios.get(
          `http://pklwikrama1.4vmapps.com/perusahaan/${perusahaanId}`
        );
        this.uat.perusahaan_name = data.name;
      } catch (error) {
        console.error("Error fetching company name:", error);
      }
    },
    async loadClientName(clientId) {
      try {
        const { data } = await axios.get(
          `http://pklwikrama1.4vmapps.com/clients/${clientId}`
        );
        this.uat.client_name = data.name;
      } catch (error) {
        console.error("Error fetching client name:", error);
      }
    },
    calculateProgress() {
      const totalItems = this.countTotalRows();
      const checkedItems = this.countCheckedRows();
      return totalItems === 0
        ? 0
        : Math.round((checkedItems / totalItems) * 100);
    },
    countTotalRows() {
      let total = 0;
      this.uat.pages.forEach((page) => {
        total += 1; // Halaman
        page.sections.forEach((section) => {
          total += 1; // Section
          section.sub_sections.forEach(() => {
            total += 1; // Sub-section
          });
        });
      });
      return total;
    },
    countCheckedRows() {
      let checked = 0;
      this.uat.pages.forEach((page) => {
        if (page.test_result === "1") checked += 1;
        page.sections.forEach((section) => {
          if (section.test_result === "1") checked += 1;
          section.sub_sections.forEach((subSection) => {
            if (subSection.test_result === "1") checked += 1;
          });
        });
      });
      return checked;
    },
  },
};
</script>

<style scoped>
.progress-bar {
  background-color: #28a745;
}
.row-pages {
  background-color: #f8f9fa; /* Warna abu-abu muda */
  font-weight: bold; /* Teks tebal */
}

/* Gaya untuk baris Section */
.row-section {
  background-color: #ffffff; /* Warna putih */
  border-left: 5px solid #007bff; /* Garis biru di sebelah kiri */
}

.modal-backdrop.show {
  background-color: rgba(0, 0, 0, 0.5); /* Memberikan efek buram */
}


</style>
