// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({

//   plugins: [react()],
//   server: {
//     port: 3000,
//   },
// })

//--------------------USAR PARA DEPLOY-------------------//
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@fortawesome/fontawesome-svg-core'],
  },
  resolve: {
    alias: {
      '@': '/src',  // Puedes ajustar la ruta según la estructura de tu proyecto
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'], // Agrega extensiones de archivo
  },
});




