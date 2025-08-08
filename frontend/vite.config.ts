import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import TinyVuePlugin from '@opentiny/unplugin-tiny-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    TinyVuePlugin('vite', 'single')
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5555
  }
})