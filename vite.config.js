import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  optimizeDeps: {
    include: ['@tinymce/tinymce-vue', 'tinymce/tinymce'],
  },
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://pklwikrama1.4vmapps.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});


