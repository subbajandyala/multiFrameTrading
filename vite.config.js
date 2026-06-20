import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/multiFrameTrading/',
  server: {
    port: 3000,
  },
})
