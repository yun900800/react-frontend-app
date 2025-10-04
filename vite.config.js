import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 确保构建时生成的静态资源路径正确，以便 Express 静态服务能够找到
  base: '/dist/',
  build: {
    // Vite 默认构建输出目录就是 'dist'
    outDir: 'dist', 
    assetsDir: 'assets', // 资源文件放在 dist/assets 下
    emptyOutDir: true
  }
});