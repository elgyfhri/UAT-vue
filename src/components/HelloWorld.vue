<template>
  <div class="container mt-4">
    <!-- Form Utama -->
    <form @submit.prevent="submitForm">
      <div class="row mb-4">
        <!-- Card Pertama -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">UAT Details</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="perusahaan" class="form-label">Perusahaan:</label>
                <select v-model="selectedPerusahaan" id="perusahaan" class="form-select" @change="updateDocNumber">
                  <option v-for="perusahaan in perusahaanList" :key="perusahaan.id" :value="perusahaan">
                    {{ perusahaan.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="client" class="form-label">Client:</label>
                <select v-model="selectedClient" id="client" class="form-select">
                  <option v-for="client in clientList" :key="client.id" :value="client.id">
                    {{ client.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="project_name" class="form-label">Nama Project:</label>
                <input type="text" v-model="project_name" id="project_name" class="form-control" required>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Kedua -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">Document Details</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="doc_number" class="form-label">Nomor Dokumen:</label>
                <input type="text" v-model="doc_number" id="doc_number" class="form-control" readonly>
              </div>
              <div class="mb-3">
                <label for="revision_number" class="form-label">Nomor Revisi:</label>
                <input type="text" v-model="revision_number" id="revision_number" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="start_date" class="form-label">Tanggal Mulai:</label>
                <input type="date" v-model="start_date" id="start_date" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="end_date" class="form-label">Tanggal Akhir:</label>
                <input type="date" v-model="end_date" id="end_date" class="form-control" required>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Ketiga -->
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">Authentication Details</div>
            <div class="card-body">
              <div class="mb-3">
                <label for="username" class="form-label">Username:</label>
                <input type="text" v-model="username" id="username" class="form-control" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password:</label>
                <input type="password" v-model="password" id="password" class="form-control" required>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabel UAT -->
      <div class="mb-4">
        <h3 class="mb-3">Tabel UAT</h3>
        <button @click="addRegularRow" class="btn btn-primary mb-3">Tambah Tabel Biasa</button>

        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Pages</th>
              <th>Section On Pages</th>
              <th>Sub Section</th>
              <th>URL</th>
              <th>CMS Admin Panel (Backend)</th>
              <th>Test Result</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in uatRows" :key="index">
              <td>{{ getRowNumber(index) }}</td>
              <td>
                <input 
                  v-model="row.pages" 
                  type="text" 
                  class="form-control" 
                  :disabled="!row.isRegular || (index === 2 && !row.isRegular)">
              </td>
              <td>
                <input 
                  v-model="row.sectionOnPages" 
                  type="text" 
                  class="form-control" 
                  :disabled="row.isDisabled">
              </td>
              <td><input v-model="row.subSection" type="text" class="form-control"></td>
              <td><input v-model="row.url" type="text" class="form-control"></td>
              <td><input v-model="row.cmsAdminPanel" type="text" class="form-control"></td>
              <td>
                <button @click="setTestResult(index, true)" class="btn btn-success">✔</button>
                <button @click="setTestResult(index, false)" class="btn btn-danger">✖</button>
              </td>
              <td><input v-model="row.note" type="text" class="form-control"></td>
              <td>
                <button type="button" v-if="shouldShowAddButton(index)" @click="addRow(index)" class="btn btn-info">➕</button>
                <button type="button" v-if="shouldShowAddSubButton(index)" @click="addSubRow(index)" class="btn btn-info">➕</button>
              </td>
            </tr>
            <tr>
              <td colspan="8">
                <label class="form-label">Progres Development (%):</label>
                <input v-model="progressDevelopment" type="range" min="0" max="100" class="form-range">
                <span>{{ progressDevelopment }}%</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button type="submit" class="btn btn-primary">Simpan Semua</button>
    </form>
  </div>
</template>



<script>
import axios from 'axios';

export default {
  data() {
    return {
      perusahaanList: [],
      clientList: [],
      selectedPerusahaan: null,
      selectedClient: null,
      project_name: '',
      doc_number: '',
      revision_number: '',
      start_date: '',
      end_date: '',
      username: '',
      password: '',
      uatRows: [
        { 
          pages: '', 
          sectionOnPages: '', 
          subSection: '', 
          url: '', 
          cmsAdminPanel: '',
          testResult: null, 
          note: '', 
          isRegular: true, 
          isDisabled: false, 
          canAddSubRow: true 
        }
      ],
      progressDevelopment: 0,
    };
  },
  mounted() {
    this.fetchPerusahaan();
    this.fetchClients();
  },
  methods: {
    addRegularRow() {
      this.uatRows.push({
        pages: '',
        sectionOnPages: '',
        subSection: '',
        url: '',
        cmsAdminPanel: '',
        testResult: null,
        note: '',
        isRegular: true,
        isDisabled: false,
        canAddSubRow: true,
      });
    },
    getRowNumber(index) {
      const regularRows = this.uatRows.filter(row => row.isRegular);
      const row = this.uatRows[index];
      return row.isRegular ? regularRows.indexOf(row) + 1 : '';
    },
hasSubSection(index) {
    const baseSection = this.uatRows[index].sectionOnPages;
    return this.uatRows.some((row, i) => i > index && row.sectionOnPages.startsWith(`${baseSection}.`));
  },
  async fetchPerusahaan() {
  try {
    const response = await axios.get('/api/perusahaan');
    this.perusahaanList = response.data;
    console.log(this.perusahaanList);
  } catch (error) {
    console.error('Error fetching perusahaan:', error);
  }
},
    async fetchClients() {
      try {
        const response = await axios.get('/api/clients');
        this.clientList = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },
    updateDocNumber() {
      if (this.selectedPerusahaan) {
        console.log("Selected Perusahaan:", this.selectedPerusahaan);
        this.doc_number = this.selectedPerusahaan.config_document || ''; 
      } else {
        this.doc_number = '';
      }
    },
    addRow(index) {
      const currentRowNumber = this.getRowNumber(index);
      const highestSectionOnPages = this.getHighestSectionOnPages(currentRowNumber);
      const newSectionOnPages = this.incrementSectionOnPages(highestSectionOnPages);

      let insertIndex = index + 1;
      for (let i = index + 1; i < this.uatRows.length; i++) {
        const row = this.uatRows[i];
        if (row.isRegular && this.getRowNumber(i) !== currentRowNumber) {
          insertIndex = i;
          break;
        }
        if (!row.isRegular && row.sectionOnPages && row.sectionOnPages.startsWith(`${currentRowNumber}.`)) {
          insertIndex = i + 1;
        }
      }

      this.uatRows.splice(insertIndex, 0, {
        pages: '',
        sectionOnPages: newSectionOnPages,
        subSection: '',
        url: '',
        cmsAdminPanel: '',
        testResult: null,
        note: '',
        isRegular: false,
        isDisabled: false,
        canAddSubRow: true,
      });
    },
    addSubRow(index) {
  const currentSectionOnPages = this.uatRows[index].sectionOnPages;

  // Menentukan sub-section baru
  const lastSubSection = this.getLastSubSectionForRow(currentSectionOnPages);
  const newSubSection = lastSubSection 
    ? this.incrementSubSection(lastSubSection) 
    : `${currentSectionOnPages}.1`;

  // Menambahkan baris baru setelah baris saat ini
  this.uatRows.splice(index + 1, 0, {
    pages: '',
    sectionOnPages: '',
    subSection: newSubSection,
    url: '',
    cmsAdminPanel: '',
    testResult: null,
    note: '',
    isRegular: false,
    isDisabled: true,
    canAddSubRow: true,
  });


  if (this.uatRows[index].subSection) {
    this.uatRows[index].canAddSubRow = false;
  }
},

  getLastSubSectionNumber(index) {
    let baseSection = this.uatRows[index].sectionOnPages;
    let subSections = this.uatRows
      .slice(index + 1)
      .filter(row => row.subSection.startsWith(`${baseSection}.`))
      .map(row => parseInt(row.subSection.split('.').pop(), 10));
    return subSections.length ? Math.max(...subSections) : 0;
  },
  getHighestSectionOnPages(rowNumber) {
      const rowsWithCurrentPrefix = this.uatRows.filter(row => row.sectionOnPages.startsWith(`${rowNumber}.`));
      const lastRow = rowsWithCurrentPrefix[rowsWithCurrentPrefix.length - 1];
      return lastRow ? lastRow.sectionOnPages : `${rowNumber}.0`;
    },
    incrementSectionOnPages(sectionOnPages) {
      const parts = sectionOnPages.split('.');
      const lastPart = parseInt(parts[parts.length - 1], 10);
      parts[parts.length - 1] = (lastPart + 1).toString();
      return parts.join('.');
    },
    getLastSubSectionForRow(currentSectionOnPages) {
      const subSections = this.uatRows
        .filter(row => !row.isRegular && row.sectionOnPages === currentSectionOnPages)
        .map(row => row.subSection)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      return subSections.length ? subSections[subSections.length - 1] : '';
    },
    incrementSubSection(subSection) {
      const parts = subSection.split('.');
      const lastPart = parseInt(parts[parts.length - 1], 10);
      parts[parts.length - 1] = (lastPart + 1).toString();
      return parts.join('.');
    },
  
  countSubSections(index) {
    let baseSection = this.uatRows[index].sectionOnPages;
    let count = 0;
    for (let i = index + 1; i < this.uatRows.length; i++) {
      if (this.uatRows[i].sectionOnPages.startsWith(`${baseSection}.`)) {
        count++;
      } else {
        break;
      }
    }
    return count;
  },
    removeRow(index) {
      this.uatRows.splice(index, 1);
    },
    setTestResult(index, result) {
      this.uatRows[index].testResult = result;
    },
    shouldShowAddButton(index) {
      return this.uatRows[index].isRegular && !this.uatRows[index].subSection;
    },
    shouldShowAddSubButton(index) {
    // Tampilkan tombol tambah sub-bagian jika baris saat ini bukan baris reguler dan bisa menambah sub-bagian
    return !this.uatRows[index].isRegular && this.uatRows[index].canAddSubRow;
  },
    submitTable() {
      console.log('UAT Rows:', this.uatRows);
      console.log('Progress Development:', this.progressDevelopment);
    },
    submitForm() {
  if (!this.project_name) {
    console.error("Missing project_name");
  }
  if (!this.doc_number) {
    console.error("Missing doc_number");
  }
  if (!this.revision_number) {
    console.error("Missing revision_number");
  }
  if (!this.start_date) {
    console.error("Missing start_date");
  }
  if (!this.end_date) {
    console.error("Missing end_date");
  }
  if (!this.username) {
    console.error("Missing username");
  }
  if (!this.password) {
    console.error("Missing password");
  }


  if (!this.project_name || !this.doc_number || !this.revision_number || 
      !this.start_date || !this.end_date || !this.username || !this.password) {
    console.error("Missing required fields");
    return; 
  }

  let formattedStartDate = new Date(this.start_date).toISOString().split('T')[0];
  let formattedEndDate = new Date(this.end_date).toISOString().split('T')[0];

  const payload = {
  project_name: this.project_name,
  client_id: this.selectedClient,
  doc_number: this.doc_number,
  revision_number: this.revision_number,
  start_date: this.start_date,
  end_date: this.end_date,
  username: this.username,
  password: this.password,
  pages: this.pages, // atau struktur data yang sesuai
  section_on_pages: this.section_on_pages,
  sub_section: this.sub_section,
  url: this.url,
  cms_admin_panel: this.cms_admin_panel,
  test_result: this.test_result,
  note: this.note,
  parent_id: this.parent_id, // jika ada
  uatRows: this.uatRows.map(row => ({
    pages: row.pages,
    section_on_pages: row.sectionOnPages,
    sub_section: row.subSection,
    url: row.url,
    cms_admin_panel: row.cmsAdminPanel,
    test_result: row.testResult,
    note: row.note,
    parent_id: row.parentId // jika ada
  }))
};

  console.log("Payload:", payload);
  console.log('UAT Rows before submitting:', this.uatRows);

  axios.post('http://localhost:8000/uats', payload)
    .then(response => {
      console.log("Form submitted successfully:", response.data);
      this.$router.push({ name: 'UAT' });
    })
    .catch(error => {
      console.error("Error submitting form:", error.response.data);
    });
}




  }
}
</script>



<style scoped>
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.main-form {
  display: flex;
  flex-direction: column;
}

.card {
  height: 100%; /* Memastikan tinggi kartu sama */
}

.uat-table {
  margin-top: 24px;
}

.uat-table table {
  width: 100%;
  border-collapse: collapse;
}

.uat-table th, .uat-table td {
  text-align: center;
}

.uat-table button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
}

.uat-table button:hover {
  color: #007bff;
}
</style>

<style scoped>
</style>