import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // 关键配置：设置基础路径为相对路径 './'
    // 这样部署到 GitHub Pages 的子目录（如 username.github.io/repo-name/）时也能正常加载资源
    base: './', 
    define: {
      // 在客户端代码中注入 process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
    }
  };
});