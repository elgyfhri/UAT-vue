<template>
  <div class="container mt-4">
    <h3 class="mb-3">Edit Tabel UAT</h3>
    <form @submit.prevent="submitEditData">
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
        <h3 class="text-left mb-0">Tabel UAT</h3>
      </div>

      <input
        type="text"
        class="form-control mb-3"
        v-model="searchQuery"
        placeholder="Cari berdasarkan nama halaman"
      />

      <div class="d-flex justify-content-between align-items-center mb-3">
        <!-- Tombol untuk Menghapus Banyak Halaman -->
        <button
          type="button"
          class="btn btn-danger btn-sm mb-3"
          @click="deleteSelectedItems"
          :disabled="selectedItems.length === 0"
        >
          Hapus Item Terpilih
        </button>

        <!-- Tombol untuk Menambah Halaman -->
        <button
          type="button"
          class="btn btn-primary btn-sm mb-3 w-auto"
          @click="addPageRow"
        >
          Tambah Halaman
        </button>
      </div>

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
            <!-- Loop untuk halaman, section, dan sub-section -->
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
                  <template v-if="page.test_result === null">
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
                  <template v-else-if="page.test_result === '0'">
                    <button
                      type="button"
                      class="btn btn-success"
                      @click="setTestResult(pageIndex, null, null, 'checked')"
                    >
                      ✔️
                    </button>
                  </template>
                  <template v-else-if="page.test_result === '1'">
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
                  <!-- Tombol Section (Tambah) di kiri -->
                  <button
                    type="button"
                    class="btn btn-info btn-sm"
                    @click="addSection(pageIndex)"
                  >
                    ➕ Section
                  </button>

                  <!-- Tombol Hapus Halaman di kanan -->
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
                      placeholder="Section"
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
                    <template v-if="section.test_result === null">
                      <button
                        type="button"
                        class="btn btn-success"
                        @click="
                          setTestResult(
                            pageIndex,
                            sectionIndex,
                            null,
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
                            null,
                            'unchecked'
                          )
                        "
                      >
                        ❌
                      </button>
                    </template>
                    <template v-else-if="section.test_result === '0'">
                      <button
                        type="button"
                        class="btn btn-success"
                        @click="
                          setTestResult(
                            pageIndex,
                            sectionIndex,
                            null,
                            'checked'
                          )
                        "
                      >
                        ✔️
                      </button>
                    </template>
                    <template v-else-if="section.test_result === '1'">
                      <button
                        type="button"
                        class="btn btn-danger"
                        @click="
                          setTestResult(
                            pageIndex,
                            sectionIndex,
                            null,
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
                    <!-- Tombol Sub Section (Tambah) di kiri -->
                    <button
                      type="button"
                      class="btn btn-info btn-sm"
                      @click="addSubSection(pageIndex, sectionIndex)"
                    >
                      ➕ Sub Section
                    </button>

                    <!-- Tombol Hapus Section di kanan -->
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
                        placeholder="Sub Section"
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
                      <template v-if="subSection.test_result === null">
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
                      <template v-else-if="subSection.test_result === '0'">
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
                      <template v-else-if="subSection.test_result === '1'">
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
                        v-model="subSection.note"
                        placeholder="Note"
                      />
                    </td>
                    <td class="d-flex justify-content-end gap-2">
                      <!-- Tombol Hapus Sub Section di kanan -->
                      <button
                        type="button"
                        class="btn btn-danger btn-sm"
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
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: form.progress_percentage + '%', fontSize: '16px' }"
          :aria-valuenow="form.progress_percentage"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <p style="margin: 0">Progress: {{ form.progress_percentage }}%</p>
        </div>
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
      selectedItems: [],
      selectAll: false,
    };
  },
  created() {
    this.loadUATData();
    this.loadClientsAndPerusahaans();
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
    // Mengelola logika pilih semua
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
    showAlertOnSelect(pageId) {
      const isSelected = this.selectedPages.includes(pageId);
      const action = isSelected ? "dipilih" : "dihapus";
      alert(`Halaman dengan ID ${pageId} ${action}.`);
    },
    async loadUATData() {
      // Menampilkan tampilan loading
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
          `http://pklwikrama1.4vmapps.com/uats/${this.$route.params.id}`
        );
        this.form = response.data;

        // Jika user_info adalah string, ubah menjadi objek
        if (typeof this.form.user_info === "string") {
          try {
            this.form.user_info = JSON.parse(this.form.user_info);
          } catch (e) {
            console.error("Gagal mengubah user_info menjadi objek:", e);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat memuat data.",
        });
      } finally {
        // Menutup tampilan loading setelah data selesai dimuat
        Swal.close();
      }
    },
    loadClientsAndPerusahaans() {
      axios.get("http://pklwikrama1.4vmapps.com/clients").then((response) => {
        this.clients = response.data;
      });
      axios.get("http://pklwikrama1.4vmapps.com/perusahaan").then((response) => {
        this.perusahaans = response.data;
      });
    },
    addPageRow() {
      if (this.searchQuery) {
        alert("Tidak dapat menambah halaman saat mencari");
        return; // Cegah penambahan saat mencari
      }
      const pageNumber = this.form.pages.length + 1;
      this.form.pages.push({
        pages: "",
        url: "",
        cms_admin_panel: "",
        test_result: null,
        note: "",
        sections: [],
        pageNumber: pageNumber,
      });

      // Update persentase setelah menambah halaman
      this.updateProgressPercentage();
    },

    addSection(pageIndex) {
      const sections = this.form.pages[pageIndex].sections;
      const nextSectionNumber = sections.length + 1;
      const pageSectionPrefix = pageIndex + 1;

      const sectionOnPages = `${pageSectionPrefix}.${nextSectionNumber}.`;

      this.form.pages[pageIndex].sections.push({
        section_on_pages: sectionOnPages,
        sub_sections: [],
        url: "",
        cms_admin_panel: "",
        test_result: null,
        note: "",
      });

      // Update persentase setelah menambah section
      this.updateProgressPercentage();
    },

    addSubSection(pageIndex, sectionIndex) {
      const section = this.form.pages[pageIndex].sections[sectionIndex];
      const subSections = section.sub_sections;

      const nextSubSectionNumber = subSections.length + 1;
      const sectionNumber = section.section_on_pages.replace(/[^\d.]/g, "");

      section.sub_sections.push({
        sub_section: `${sectionNumber}${nextSubSectionNumber}.`,
        url: "",
        cms_admin_panel: "",
        test_result: null,
        note: "",
      });

      // Update persentase setelah menambah sub-section
      this.updateProgressPercentage();
    },

    removePage(index) {
      // Cek jika halaman memiliki sections
      if (
        this.form.pages[index].sections &&
        this.form.pages[index].sections.length > 0
      ) {
        Swal.fire({
          icon: "warning",
          title: "Halaman tidak bisa dihapus",
          text: "Halaman ini memiliki section, jadi tidak bisa dihapus.",
        });
        return;
      }

      // Konfirmasi penghapusan
      Swal.fire({
        icon: "warning",
        title: "Konfirmasi Penghapusan",
        text: "Apakah Anda yakin ingin menghapus halaman ini?",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          this.form.pages.splice(index, 1);
          Swal.fire("Dihapus!", "Halaman telah dihapus.", "success");

          // Update persentase setelah menghapus halaman
          this.updateProgressPercentage();
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
          icon: "warning",
          title: "Section tidak bisa dihapus",
          text: "Section ini memiliki sub-section, jadi tidak bisa dihapus.",
        });
        return;
      }

      // Konfirmasi penghapusan
      Swal.fire({
        icon: "warning",
        title: "Konfirmasi Penghapusan",
        text: "Apakah Anda yakin ingin menghapus section ini?",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          this.form.pages[pageIndex].sections.splice(sectionIndex, 1);
          Swal.fire("Dihapus!", "Section telah dihapus.", "success");

          // Update persentase setelah menghapus section
          this.updateProgressPercentage();
        }
      });
    },

    removeSubSection(pageIndex, sectionIndex, subSectionIndex) {
      // Konfirmasi penghapusan
      Swal.fire({
        icon: "warning",
        title: "Konfirmasi Penghapusan",
        text: "Apakah Anda yakin ingin menghapus sub-section ini?",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          this.form.pages[pageIndex].sections[sectionIndex].sub_sections.splice(
            subSectionIndex,
            1
          );
          Swal.fire("Dihapus!", "Sub-section telah dihapus.", "success");

          // Update persentase setelah menghapus sub-section
          this.updateProgressPercentage();
        }
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
        total += 1; // Hitung halaman
        page.sections.forEach((section) => {
          total += 1; // Hitung section
          section.sub_sections.forEach(() => {
            total += 1; // Hitung sub-section
          });
        });
      });
      return total;
    },

    countCheckedRows() {
      let checked = 0;
      this.form.pages.forEach((page) => {
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

      // Cek apakah ada field Pages yang kosong
      const invalidPages = this.form.pages.some((page) => !page.pages);
      if (invalidPages) {
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

      console.log("Form data:", this.form);

      // Siapkan data yang akan dikirim
      const dataToSend = {
        ...this.form,
        user_info: {
          username: this.form.user_info.username,
          password: this.form.user_info.password,
        },
      };

      try {
        await axios.put(
          `http://pklwikrama1.4vmapps.com/uats/${this.$route.params.id}`,
          dataToSend
        );

        // Menampilkan SweetAlert2 sukses sebelum navigasi
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data UAT berhasil diperbarui.",
        }).then(() => {
          // Setelah SweetAlert ditutup, pindah ke halaman berikutnya
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
    },
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
</style>