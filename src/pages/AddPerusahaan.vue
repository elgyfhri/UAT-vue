<template>
  <div class="card card-mono">
    <div class="card-header">
      <h5 class="mb-0">Tambah Data Perusahaan</h5>
    </div>
    <!-- Form start -->
    <form @submit.prevent="submitForm">
      <div class="card-body">
        <div class="row">
          <!-- Nama Perusahaan -->
          <div class="col-md-3">
            <div class="form-group">
              <label for="name">Nama Perusahaan</label>
              <input
                v-model="perusahaan.name"
                class="form-control"
                id="name"
                type="text"
                placeholder="Nama Perusahaan"
                required
              />
            </div>
          </div>

          <!-- Nama Singkatan -->
          <div class="col-md-3">
            <div class="form-group">
              <label for="short_name">Nama Singkatan</label>
              <input
                v-model="perusahaan.short_name"
                class="form-control"
                id="short_name"
                type="text"
                placeholder="Nama Singkatan"
                required
              />
            </div>
          </div>

          <!-- Website -->
          <div class="col-md-3">
            <div class="form-group">
              <label for="website">Website</label>
              <input
                v-model="perusahaan.website"
                class="form-control"
                id="website"
                type="url"
                placeholder="Website"
              />
            </div>
          </div>

          <!-- Alamat -->
          <div class="col-md-3">
            <div class="form-group">
              <label for="address">Alamat</label>
              <input
                v-model="perusahaan.address"
                class="form-control"
                id="address"
                type="text"
                placeholder="Alamat"
                required
              />
            </div>
          </div>
        </div>

        <!-- Config Document -->
        <div class="form-group">
          <label>Config Document</label>
          <div class="input-group">
            <input
              v-model="configPrefix"
              id="config_prefix"
              type="text"
              class="form-control"
              placeholder="Prefix"
            />
            <input
              type="text"
              :value="formattedDisplayConfigDocument"
              disabled
              class="form-control"
            />
          </div>
        </div>

        <!-- Logo -->
        <div class="form-group">
          <label for="logo">Logo</label>
          <div class="input-group">
            <div class="custom-file">
              <input
                ref="fileInput"
                @change="handleFileChange"
                class="custom-file-input"
                id="logo"
                type="file"
                accept="image/*"
              />
              <label class="custom-file-label" for="logo">Pilih Gambar</label>
            </div>
          </div>
          <div v-if="logoPreview" class="preview-container">
            <img :src="logoPreview" alt="Preview Logo" class="preview-image" />
          </div>
          <div v-else class="no-preview">Preview Logo</div>
        </div>
      </div>
      <!-- /.card-body -->

      <div class="card-footer text-right">
        <button type="submit" class="btn btn-primary btn-block">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  name: "AddPerusahaan",
  data() {
    return {
      perusahaan: {
        name: "",
        short_name: "",
        website: "",
        address: "",
        config_document: "",
        logo: null,
      },
      configPrefix: "",
      logoPreview: null,
      currentMonthRoman: "",
      currentYear: "",
    };
  },
  computed: {
    formattedDisplayConfigDocument() {
      return `${this.configPrefix}/.../...`;
    },
    formattedConfigDocument() {
      return `${this.configPrefix}/${this.currentMonthRoman}/${this.currentYear}`;
    },
  },
  created() {
    const now = new Date();
    const monthNamesRoman = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
      "XI",
      "XII",
    ];
    this.currentMonthRoman = monthNamesRoman[now.getMonth()];
    this.currentYear = now.getFullYear().toString();
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.logoPreview = URL.createObjectURL(file);
        this.perusahaan.logo = file;
      }
    },
    submitForm() {
    const formData = new FormData();
    formData.append("name", this.perusahaan.name);
    formData.append("short_name", this.perusahaan.short_name);
    formData.append("website", this.perusahaan.website);
    formData.append("address", this.perusahaan.address);
    formData.append("config_document", this.formattedConfigDocument);

    if (this.perusahaan.logo) {
      formData.append("logo", this.perusahaan.logo);
    }

    axios
      .post("https://pklwikrama1.4vmapps.com/perusahaan", formData)
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: "Company added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          this.$router.push({ name: "DataPerusahaan" });
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error.response.data.message || "There was an error adding the company.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  },
  },
};
</script>

<style scoped>
/* Tambahkan CSS berikut untuk memastikan layout menjadi 4 kolom */
.card-mono {
  background-color: #f7f7f7;
  color: #333;
  border: 1px solid #ddd;
  margin: 20px;
}

.card-header {
  background-color: #e0e0e0;
  border-bottom: 1px solid #ccc;
  padding: 15px;
}

.btn-mono {
  background-color: #333;
  color: #fff;
  border: none;
}

.custom-file-label {
  background-color: #ddd;
  color: #555;
  cursor: pointer;
}

.custom-file-label:hover {
  background-color: #bbb;
}

.form-control {
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  color: #333;
  margin-bottom: 10px;
}

.form-control:focus {
  border-color: #555;
  background-color: #e0e0e0;
}

.card-footer {
  padding: 10px;
  border-top: 1px solid #ccc;
}

.preview-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.preview-image {
  height: 150px;
  width: 150px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.no-preview {
  margin-top: 15px;
  text-align: center;
  color: #999;
}

.text-right {
  text-align: right;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.col-md-3 {
  flex: 0 0 25%; /* Membagi 4 kolom */
  padding: 10px;
}
</style>