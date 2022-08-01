import path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      formats: ['umd'],
      entry: path.resolve(__dirname, "src/main.ts"),
      name: 'space-shader-box',
      fileName: (format) => `space-shader-box.${format}.js`
    }
  },
  plugins: [svelte({
    compilerOptions: {
      customElement: true
    }
  })]
})
