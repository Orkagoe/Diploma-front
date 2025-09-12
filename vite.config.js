import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "f62652972cbe.ngrok-free.app" 
    ]
  }
})
