import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages Integration purposes.
  //base: "/SSB-M2-11b-TODO-List-App-v5-Assessment/"
})
