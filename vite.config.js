import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "ff9297be7eaf.ngrok-free.app" // <- твой ngrok-домен
    ]
  }
})
