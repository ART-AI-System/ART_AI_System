import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        ws: true,
      }
    }
  },
  // Pre-bundle all heavy dependencies on server startup to prevent mid-session
  // re-optimization pauses (which can cause temporary 404s in the browser)
  optimizeDeps: {
    include: [
      'react',
      'react-dom/client',
      'react-router-dom',
      'axios',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'recharts',
      'socket.io-client',
      'jszip',
      'mammoth/mammoth.browser',
      'react-syntax-highlighter',
      'react-syntax-highlighter/dist/esm/styles/hljs',
      'react-syntax-highlighter/dist/esm/languages/hljs/javascript',
      'react-syntax-highlighter/dist/esm/languages/hljs/typescript',
      'react-syntax-highlighter/dist/esm/languages/hljs/java',
      'react-syntax-highlighter/dist/esm/languages/hljs/python',
      'react-syntax-highlighter/dist/esm/languages/hljs/css',
      'react-syntax-highlighter/dist/esm/languages/hljs/xml',
    ]
  }
})
