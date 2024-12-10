<template>
  <!-- Form Inputan Informasi UAT -->
  <div class="container mt-4">
    <h3 class="mb-3">Add Tabel UAT</h3>
    <form @submit.prevent="submitData">
      <div class="row">
        <!-- Card 1: Project Name, Client, Perusahaan -->
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm h-100">
            <div class="card-header">
              <h5 class="mb-0">Informasi Proyek</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label for="project_name" class="form-label"
                  >Project Name</label
                >
                <input
                  type="text"
                  id="project_name"
                  class="form-control form-control-sm"
                  v-model="form.project_name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="client" class="form-label">Client</label>
                <select
                  id="client"
                  class="form-select form-select-sm"
                  v-model="form.client_id"
                >
                  <option value="">-</option>
                  <option
                    v-for="client in clients"
                    :key="client.id"
                    :value="client.id"
                  >
                    {{ client.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="perusahaan" class="form-label">Perusahaan</label>
                <select
                  id="perusahaan"
                  class="form-select form-select-sm"
                  v-model="form.perusahaan_id"
                  @change="updateConfigDocument"
                >
                  <option value="">-</option>
                  <option
                    v-for="perusahaan in perusahaans"
                    :key="perusahaan.id"
                    :value="perusahaan.id"
                  >
                    {{ perusahaan.name }}
                  </option>
                </select>
              </div>
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
              <div class="mb-3">
                <label for="config_document" class="form-label"
                  >Nomor Dokumen</label
                >
                <input
                  type="text"
                  id="config_document"
                  class="form-control form-control-sm"
                  v-model="form.config_document"
                  :placeholder="configDocumentPlaceholder"
                />
              </div>
              <div class="mb-3">
                <label for="revision_number" class="form-label">No Rev</label>
                <input
                  type="text"
                  id="revision_number"
                  class="form-control form-control-sm"
                  v-model="form.revision_number"
                />
              </div>
              <div class="mb-3">
                <label for="start_date" class="form-label">Tgl mulai</label>
                <input
                  type="date"
                  id="start_date"
                  class="form-control form-control-sm"
                  v-model="form.start_date"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="end_date" class="form-label">Tgl selesai</label>
                <input
                  type="date"
                  id="end_date"
                  class="form-control form-control-sm"
                  v-model="form.end_date"
                />
              </div>
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
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  class="form-control form-control-sm"
                  v-model="form.user_info.username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="text"
                  id="password"
                  class="form-control form-control-sm"
                  v-model="form.user_info.password"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel UAT Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="text-left">Tabel UAT</h3>
        <button type="button" class="btn btn-primary mb-3" @click="addPageRow">
          Tambah Halaman
      </button>
      </div>

      <input
        type="text"
        class="form-control mb-3"
        v-model="searchQuery"
        placeholder="Cari berdasarkan nama halaman"
      />

      
        
      <!-- Tombol untuk Menghapus Banyak Halaman -->
      <button
          type="button"
          class="btn btn-danger btn-sm mb-3"
          @click="deleteSelectedItems"
          :disabled="selectedItems.length === 0"
        >
          Hapus Item Terpilih
        </button>

      <!-- TABEL UAT -->
      <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>
                <input
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="isAllSelected"
                />
              </th>
            <th>Pages</th>
            <th>Section On Pages</th>
            <th>Sub Section</th>
            <th>URL</th>
            <th>CMS Admin Panel</th>
            <th>Test Result</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="filteredPages.length === 0">
            <tr>
              <td colspan="9" class="text-center py-4">
                Tidak ada halaman yang ditemukan
              </td>
            </tr>
          </template>
          <template
            v-for="(page, pageIndex) in filteredPages"
            :key="'page-' + pageIndex"
          >
            <tr>
              <td>
                  <input
                    type="checkbox"
                    :value="`page-${pageIndex}`"
                    @change="toggleSelection(`page-${pageIndex}`)"
                    :checked="selectedItems.includes(`page-${pageIndex}`)"
                  />
                </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  v-model="page.pages"
                  placeholder="Pages"
                  :class="{ 'is-invalid': submitted && !page.pages }"
                />
              </td>
              <td></td>
              <td></td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  v-model="page.url"
                  placeholder="URL"
                />
              </td>
              <td>
                <input
                  type="text"
                  class="form-control"
                  v-model="page.cms_admin_panel"
                  placeholder="CMS Admin Panel"
                />
              </td>
              <td class="d-flex justify-content-between gap-2">
                <template v-if="page.test_result === true">
                  <!-- Jika test_result ceklis, hanya tampilkan silang -->
                  <button
                    type="button"
                    class="btn btn-danger "
                    @click="setTestResult(pageIndex, null, null, 'unchecked')"
                  >
                    ❌
                  </button>
                </template>

                <template v-if="page.test_result === false">
                  <!-- Jika test_result disilang, tampilkan ceklis -->
                  <button
                    type="button"
                    class="btn btn-success "
                    @click="setTestResult(pageIndex, null, null, 'checked')"
                  >
                    ✔️
                  </button>
                </template>

                <template
                  v-if="
                    page.test_result === null || page.test_result === undefined
                  "
                >
                  <!-- Jika test_result belum diisi, tampilkan kedua tombol -->
                  <button
                    type="button"
                    class="btn btn-success"
                    @click="setTestResult(pageIndex, null, null, 'checked')"
                  >
                    ✔️
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="setTestResult(pageIndex, null, null, 'unchecked')"
                  >
                    ❌
                  </button>
                </template>
              </td>

              <td>
                <input
                  type="text"
                  class="form-control"
                  v-model="page.note"
                  placeholder="Note"
                />
              </td>
              <td class="d-flex justify-content-between gap-2">
                <button
                  type="button"
                  class="btn btn-info btn-sm"
                  @click="addSection(pageIndex)"
                >
                  ➕ Section
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="removePage(pageIndex)"
                >
                  ❌
                </button>
              </td>
            </tr>

            <template
              v-for="(section, sectionIndex) in page.sections"
              :key="'section-' + pageIndex + '-' + sectionIndex"
            >
              <tr>
                <td>
                    <input
                      type="checkbox"
                      :value="`section-${pageIndex}-${sectionIndex}`"
                      @change="
                        toggleSelection(`section-${pageIndex}-${sectionIndex}`)
                      "
                      :checked="
                        selectedItems.includes(
                          `section-${pageIndex}-${sectionIndex}`
                        )
                      "
                    />
                  </td>
                <td></td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    v-model="section.section_on_pages"
                    :placeholder="`Section ${page.pages}`"
                    :class="{ 'is-invalid': !section.section_on_pages }"
                  />
                </td>
                <td></td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    v-model="section.url"
                    placeholder="URL"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    v-model="section.cms_admin_panel"
                    placeholder="CMS Admin Panel"
                  />
                </td>
                <td class="d-flex justify-content-between gap-2">
                  <template v-if="section.test_result === true">
                    <!-- Jika test_result ceklis, hanya tampilkan silang -->
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="
                        setTestResult(
                          pageIndex,
                          sectionIndex,
                          subSectionIndex,
                          'unchecked'
                        )
                      "
                    >
                      ❌
                    </button>
                  </template>
                  <template v-if="section.test_result === false">
                    <!-- Jika test_result disilang, tampilkan ceklis -->
                    <button
                      type="button"
                      class="btn btn-success"
                      @click="
                        setTestResult(
                          pageIndex,
                          sectionIndex,
                          subSectionIndex,
                          'checked'
                        )
                      "
                    >
                      ✔️
                    </button>
                  </template>
                  <template v-if="section.test_result === null">
                    <!-- Jika test_result belum diisi, tampilkan kedua tombol -->
                    <button
                      type="button"
                      class="btn btn-success"
                      @click="
                        setTestResult(
                          pageIndex,
                          sectionIndex,
                          subSectionIndex,
                          'checked'
                        )
                      "
                    >
                      ✔️
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="
                        setTestResult(
                          pageIndex,
                          sectionIndex,
                          subSectionIndex,
                          'unchecked'
                        )
                      "
                    >
                      ❌
                    </button>
                  </template>
                </td>
                <td>
                  <input
                    type="text"
                    class="form-control"
                    v-model="section.note"
                    placeholder="Note"
                  />
                </td>
                <td class="d-flex justify-content-between gap-2">
                  <button
                    type="button"
                    class="btn btn-info btn-sm"
                    @click="addSubSection(pageIndex, sectionIndex)"
                  >
                    ➕ Sub Section
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeSection(pageIndex, sectionIndex)"
                  >
                    ❌
                  </button>
                </td>
              </tr>

              <template
                v-for="(subSection, subSectionIndex) in section.sub_sections"
                :key="
                  'sub-section-' +
                  pageIndex +
                  '-' +
                  sectionIndex +
                  '-' +
                  subSectionIndex
                "
              >
                <tr>
                  <td>
                      <input
                        type="checkbox"
                        :value="`sub-section-${pageIndex}-${sectionIndex}-${subSectionIndex}`"
                        @change="
                          toggleSelection(
                            `sub-section-${pageIndex}-${sectionIndex}-${subSectionIndex}`
                          )
                        "
                        :checked="
                          selectedItems.includes(
                            `sub-section-${pageIndex}-${sectionIndex}-${subSectionIndex}`
                          )
                        "
                      />
                    </td>
                  <td></td>
                  <td></td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="subSection.sub_section"
                      :placeholder="`Sub Section ${section.section_on_pages}`"
                      :class="{ 'is-invalid': !subSection.sub_section }"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="subSection.url"
                      placeholder="URL"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="subSection.cms_admin_panel"
                      placeholder="CMS Admin Panel"
                    />
                  </td>
                  <td class="d-flex justify-content-between gap-2">
                    <template v-if="subSection.test_result === true">
                      <!-- Jika test_result ceklis, hanya tampilkan silang -->
                      <button
                        type="button"
                        class="btn btn-danger"
                        @click="
                          setTestResult(
                            pageIndex,
                            sectionIndex,
                            subSectionIndex,
                            'unchecked'
                          )
                        "
                      >
                        ❌
                      </button>
                    </template>
                    <template v-if="subSection.test_result === false">
                      <!-- Jika test_result disilang, tampilkan ceklis -->
                      <button
                        type="button"
                        class="btn btn-success "
                        @click="
                          setTestResult(
                            pageIndex,
                            sectionIndex,
                            subSectionIndex,
                            'checked'
                          )
                        "
                      >
                        ✔️
                      </button>
                    </template>
                    <template v-if="subSection.test_result === null">
                      <!-- Jika test_result belum diisi, tampilkan kedua tombol -->
                      <button
                        type="button"
                        class="btn btn-success "
                        @click="
                          setTestResult(
                            pageIndex,
                            sectionIndex,
                            subSectionIndex,
                            'checked'
                          )
                        "
                      >
                        ✔️
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger "
                        @click="
                          setTestResult(
                            pageIndex,
                            sectionIndex,
                            subSectionIndex,
                            'unchecked'
                          )
                        "
                      >
                        ❌
                      </button>
                    </template>
                  </td>
                  <td>
                    <input
                      type="text"
                      class="form-control"
                      v-model="subSection.note"
                      placeholder="Note"
                    />
                  </td>
                  <td class="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="
                        removeSubSection(
                          pageIndex,
                          sectionIndex,
                          subSectionIndex
                        )
                      "
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              </template>
            </template>
          </template>
        </tbody>
      </table>
    </div>

      <!-- Progress Bar -->
      <div class="progress mt-3" style="height: 20px">
        <!-- Membuat progress bar lebih besar -->
        <div
          class="progress-bar"
          role="progressbar"
          :style="{
            width: progressPercentage + '%',
            position: 'relative',
            fontSize: '18px',
          }"
          :aria-valuenow="progressPercentage"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <p
            style="
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translateX(-50%) translateY(50%);
              white-space: nowrap;
              font-size: 15px;
              color: white;
            "
          >
            Progress: {{ progressPercentage }}%
          </p>
        </div>
      </div>

      <div class="mt-3">
        <button type="submit" class="btn btn-primary w-100">Submit</button>
      </div>
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
        revision_number: "",
        start_date: "",
        end_date: "",
        pages: [],
      },
      clients: [], // Daftar client
      perusahaans: [], // Daftar perusahaan
      configDocumentPlaceholder: "",
      submitted: false,
      searchQuery: "",
      selectAll: false, // Untuk checkbox di header
      selectedItems: [],// Untuk menyimpan indeks halaman yang dipilih
      searchQuery: "",
    };
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
        return page.pages.toLowerCase().includes(lowerSearch);
      });
    },
    isAllSelected() {
      // Jika semua item sudah dipilih, maka nilai ini akan true
      const allIds = this.getAllIds();
      return (
        allIds.length > 0 &&
        allIds.every((id) => this.selectedItems.includes(id))
      );
    },
  },
  mounted() {
    this.fetchClients();
    this.fetchPerusahaans();
  },
  methods: {
    getAllIds() {
      const ids = [];
      this.form.pages.forEach((page, pageIndex) => {
        ids.push(`page-${pageIndex}`);
        page.sections.forEach((section, sectionIndex) => {
          ids.push(`section-${pageIndex}-${sectionIndex}`);
          section.sub_sections.forEach((subSection, subSectionIndex) => {
            ids.push(
              `sub-section-${pageIndex}-${sectionIndex}-${subSectionIndex}`
            );
          });
        });
      });
      return ids;
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        // Jika semua dipilih, maka kosongkan selectedItems
        this.selectedItems = [];
      } else {
        // Jika belum semua dipilih, tambahkan semua ID ke selectedItems
        this.selectedItems = this.getAllIds();
      }
    },
    deleteSelectedItems() {
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Item yang dipilih akan dihapus!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      this.form.pages = this.form.pages.filter((page, pageIndex) => {
        if (this.selectedItems.includes(`page-${pageIndex}`)) return false;

        page.sections = page.sections.filter((section, sectionIndex) => {
          if (this.selectedItems.includes(`section-${pageIndex}-${sectionIndex}`))
            return false;

          section.sub_sections = section.sub_sections.filter(
            (subSection, subSectionIndex) =>
              !this.selectedItems.includes(
                `sub-section-${pageIndex}-${sectionIndex}-${subSectionIndex}`
              )
          );

          return true;
        });

        return true;
      });

      this.selectedItems = []; // Reset pilihan setelah penghapusan

      // Memastikan tampilan di-refresh
      this.$nextTick(() => {
        this.updateProgressPercentage();
      });

      Swal.fire("Dihapus!", "Item yang dipilih telah dihapus.", "success");
    }
  });
},

    toggleSelection(id) {
      const index = this.selectedItems.indexOf(id);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(id);
      }
    },
    addPageRow() {
  if (this.searchQuery) {
    alert("Tidak dapat menambah halaman saat mencari");
    return; // Cegah penambahan saat mencari
  }
  const pageNumber = this.form.pages.length + 1;
  this.form.pages.push({
    pages: "",
    sections: [],
    url: "",
    cms_admin_panel: "",
    test_result: null,
    note: "",
    pageNumber: pageNumber,
  });
  this.updateProgress(); // Update progress after adding a page
},

addSection(pageIndex) {
  const sections = this.form.pages[pageIndex].sections;

  // Hitung nomor section berikutnya
  const nextSectionNumber = sections.length + 1;

  // Ambil nomor halaman (pageIndex) untuk section baru
  const pageSectionPrefix = pageIndex + 1;

  // Buat section_on_pages baru dengan titik di akhir
  const sectionOnPages = `${pageSectionPrefix}.${nextSectionNumber}.`;

  // Tambahkan section baru
  this.form.pages[pageIndex].sections.push({
    section_on_pages: sectionOnPages, // Nomor section dengan titik di akhir
    sub_sections: [],
    url: "",
    cms_admin_panel: "",
    test_result: null,
    note: "",
  });
  this.updateProgress(); // Update progress after adding a section
},

addSubSection(pageIndex, sectionIndex) {
  const section = this.form.pages[pageIndex].sections[sectionIndex];
  const subSections = section.sub_sections;

  const nextSubSectionNumber = subSections.length + 1;

  // Ambil bagian nomor dari section_on_pages, misalnya "1.1" dari "1.1."
  const sectionNumber = section.section_on_pages.replace(/[^\d.]/g, "");

  // Tambahkan sub-section dengan angka bagian section dan titik di akhir
  this.form.pages[pageIndex].sections[sectionIndex].sub_sections.push({
    sub_section: `${sectionNumber}${nextSubSectionNumber}.`, // Tambahkan titik di akhir sub-section
    url: "",
    cms_admin_panel: "",
    test_result: null,
    note: "",
  });
  this.updateProgress(); // Update progress after adding a sub-section
},

removePage(index) {
  // Cek jika halaman memiliki sections
  if (
    this.form.pages[index].sections &&
    this.form.pages[index].sections.length > 0
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Halaman ini tidak bisa dihapus karena memiliki section.",
    });
    return;
  }

  // Konfirmasi penghapusan menggunakan SweetAlert2
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Halaman ini akan dihapus!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      this.form.pages.splice(index, 1);
      this.updateProgress(); // Update progress after removing a page
      Swal.fire("Dihapus!", "Halaman telah dihapus.", "success");
    }
  });
},

removeSection(pageIndex, sectionIndex) {
  // Cek jika section memiliki sub-sections
  if (
    this.form.pages[pageIndex].sections[sectionIndex].sub_sections &&
    this.form.pages[pageIndex].sections[sectionIndex].sub_sections.length >
      0
  ) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Section ini tidak bisa dihapus karena memiliki sub-section.",
    });
    return;
    
  }

  // Konfirmasi penghapusan menggunakan SweetAlert2
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Section ini akan dihapus!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      this.form.pages[pageIndex].sections.splice(sectionIndex, 1);
      this.updateProgress(); // Update progress after removing a section
      Swal.fire("Dihapus!", "Section telah dihapus.", "success");
    }
  });
},

removeSubSection(pageIndex, sectionIndex, subSectionIndex) {
  // Konfirmasi penghapusan menggunakan SweetAlert2
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Sub-section ini akan dihapus!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      this.form.pages[pageIndex].sections[sectionIndex].sub_sections.splice(
        subSectionIndex,
        1
      );
      this.updateProgress(); // Update progress after removing a sub-section
      Swal.fire("Dihapus!", "Sub-section telah dihapus.", "success");
    }
  });
},

updateProgress() {
  const totalRows = this.countTotalRows();
  const checkedRows = this.countCheckedRows();
  this.progress = totalRows > 0 ? Math.round((checkedRows / totalRows) * 100) : 0;
},

    countTotalRows() {
      let total = 0;
      this.form.pages.forEach((page) => {
        total += 1; // Hitung baris untuk halaman
        page.sections.forEach((section) => {
          total += 1; // Hitung baris untuk section
          section.sub_sections.forEach(() => {
            total += 1; // Hitung baris untuk sub-section
          });
        });
      });
      return total;
    },
    countCheckedRows() {
      let checked = 0;
      this.form.pages.forEach((page) => {
        if (page.test_result === true) {
          checked += 1;
        }
        page.sections.forEach((section) => {
          if (section.test_result === true) {
            checked += 1;
          }
          section.sub_sections.forEach((subSection) => {
            if (subSection.test_result === true) {
              checked += 1;
            }
          });
        });
      });
      return checked;
    },
    submitData() {
  this.submitted = true;

  // Validasi field utama, tapi abaikan client_id dan perusahaan_id
  if (!this.form.project_name) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: 'Pastikan field "Project Name" telah diisi.',
    });
    return;
  }

  // Validasi Pages
  const invalidFields = this.form.pages.filter((page) => !page.pages);
  if (invalidFields.length) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: 'Pastikan semua field "Pages" telah diisi.',
    });
    console.warn(
      "Terdapat field Pages yang kosong. Harap lengkapi semua field Pages."
    );
    return;
  }

  // Menyusun data untuk dikirim
  const formDataWithProgress = {
    ...this.form,
    progress_percentage: this.progressPercentage,
  };

  // Mengirim data ke server
  axios
    .post("https://pklwikrama1.4vmapps.com/uats", formDataWithProgress)
    .then((response) => {
      console.log("Data berhasil dikirim:", response.data);
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "UAT added successfully",
        willClose: () => {
          // Mengarahkan setelah SweetAlert ditutup
          this.$router.push({ name: "UAT" });
        },
      });
    })
    .catch((error) => {
      console.error("Gagal mengirim data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data.",
      });
    });
},
    setTestResult(
      pageIndex,
      sectionIndex = null,
      subSectionIndex = null,
      value
    ) {
      const page = this.form.pages[pageIndex];

      if (sectionIndex === null && subSectionIndex === null) {
        // Update test_result for page
        if (page) {
          page.test_result = value === "checked"; // true jika ceklis, false jika silang
        }
      } else if (sectionIndex !== null && subSectionIndex === null) {
        // Update test_result for section
        const section = page?.sections[sectionIndex];
        if (section) {
          section.test_result = value === "checked";
        }
      } else if (sectionIndex !== null && subSectionIndex !== null) {
        // Update test_result for sub-section
        const section = page?.sections[sectionIndex];
        const subSection = section?.sub_sections[subSectionIndex];
        if (subSection) {
          subSection.test_result = value === "checked";
        }
      }
    },

    async fetchClients() {
      try {
        const response = await axios.get("https://pklwikrama1.4vmapps.com/clients");
        this.clients = response.data;
      } catch (error) {
        console.error("Gagal mengambil data client:", error);
      }
    },
    async fetchPerusahaans() {
      try {
        const response = await axios.get("https://pklwikrama1.4vmapps.com/perusahaan");
        this.perusahaans = response.data;
      } catch (error) {
        console.error("Gagal mengambil data perusahaan:", error);
      }
    },
    async updateConfigDocument() {
      const selectedPerusahaan = this.perusahaans.find(
        (perusahaan) => perusahaan.id === this.form.perusahaan_id
      );
      if (selectedPerusahaan) {
        this.configDocumentPlaceholder = selectedPerusahaan.config_document;
        this.form.config_document = this.configDocumentPlaceholder;
      }
    },
  },
};
</script>

<style scoped>
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
.progress-bar {
  background-color: green; /* Warna kuning untuk progress bar */
}
</style>