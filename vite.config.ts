import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  // Avoid resolving paths through native realpath. This keeps builds reliable in
  // Windows sandboxed folders where the native call can be restricted.
  resolve: { preserveSymlinks: true },
})
