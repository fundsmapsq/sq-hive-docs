import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sq-hive-docs/',   // ← replace with your exact GitHub repo name
})
