<template>
  <div>
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <!-- Kartu Total Perusahaan -->
          <div class="col-lg-6 col-md-5">
            <div class="small-box bg-white card-height">
              <div class="inner">
                <h3>{{ totalPerusahaan }}</h3>
                <p>Total Perusahaan</p>
              </div>
              <div class="icon">
                <i class="fa fa-bar-chart"></i>
              </div>
              <router-link to="/app/dataperusahaan" class="small-box-footer">
                More info <i class="fa fa-arrow-circle-right"></i>
              </router-link>
            </div>
          </div>

          <!-- Kartu Total Client -->
          <div class="col-lg-6 col-md-5">
            <div class="small-box bg-white card-height">
              <div class="inner">
                <h3>{{ totalClient }}</h3>
                <p>Total Client</p>
              </div>
              <div class="icon">
                <i class="fa fa-user-plus"></i>
              </div>
              <router-link to="/app/dataclient" class="small-box-footer">
                More info <i class="fa fa-arrow-circle-right"></i>
              </router-link>
            </div>
          </div>

          <!-- Kartu Grafik Data UAT -->
          <div class="col-lg-12 col-md-10">
            <div class="card" style="height: 600px;">
              <div class="card-header">
                <h3 class="card-title">Grafik Data UAT</h3>
                <div class="card-tools">
                  <router-link to="/app/uat" class="badge badge-info no-underline">Total UAT: {{ totalUAT }}</router-link>
                </div>
              </div>
              <div class="card-body">
                <canvas id="uatChart" style="width: 100%; height: 100%;"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from 'chart.js';
import Swal from "sweetalert2";

export default {
  data() {
    return {
      totalPerusahaan: 0,
      totalClient: 0,
      totalUAT: 0,
      uatData: [],
      uatLabels: []
    };
  },
  mounted() {
    this.fetchDashboardData();
    this.fetchUATData();
    Chart.register(...registerables);
  },
  methods: {
    async fetchDashboardData() {
      try {
        // Tampilkan loading
        Swal.fire({
          title: 'Loading...',
          text: 'Mengambil data dashboard...',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await axios.get("https://pklwikrama1.4vmapps.com/dashboard-data");
        this.totalPerusahaan = response.data.total_perusahaan;
        this.totalClient = response.data.total_client;

        // Tutup loading setelah data berhasil diambil
        Swal.close();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        Swal.close();
      }
    },

    async fetchUATData() {
      try {
        // Tampilkan loading
        Swal.fire({
          title: 'Loading...',
          text: 'Mohon Tunggu Sebentar!!',
          icon: 'info',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await axios.get("https://pklwikrama1.4vmapps.com/uat-data");
        const uatCountByMonth = {};

        // Mengelompokkan data UAT berdasarkan bulan dan tahun
        response.data.data.forEach(item => {
          const createdDate = new Date(item.created_at);
          const yearMonth = `${createdDate.getFullYear()}-${(createdDate.getMonth() + 1).toString().padStart(2, '0')}`;
          uatCountByMonth[yearMonth] = (uatCountByMonth[yearMonth] || 0) + 1;
        });

        // Mengubah objek menjadi array untuk label dan data
        this.uatLabels = Object.keys(uatCountByMonth).map(month => {
          const [year, monthNum] = month.split("-");
          const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
          return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
        });
        this.uatData = Object.values(uatCountByMonth);
        this.totalUAT = response.data.total;

        // Render grafik
        this.renderChart();

        // Tutup loading setelah data berhasil diambil
        Swal.close();
      } catch (error) {
        console.error("Error fetching UAT data:", error);
        Swal.close();
      }
    },

    renderChart() {
      const ctx = document.getElementById("uatChart").getContext("2d");

      if (this.uatLabels.length === 0 || this.uatData.length === 0) {
        console.warn("No data to render chart");
        return;
      }

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.uatLabels,
          datasets: [
            {
              label: "Jumlah UAT",
              data: this.uatData,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Jumlah UAT'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Bulan'
              }
            }
          },
        },
      });
    }
  },
};
</script>

<style scoped>
.card-height {
  height: 200px; 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
}

.badge-info {
  font-size: 16px;
  padding: 8px;
}

.small-box {
  border-radius: 10px; 
  transition: transform 0.3s; 
}

.small-box:hover {
  transform: scale(1.05); 
}

.icon {
  font-size: 40px; 
}
</style>
