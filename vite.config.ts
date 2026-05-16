import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // 在 AI Studio 中，热更新（HMR）通过 DISABLE_HMR 环境变量被禁用。
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // 当 DISABLE_HMR 为 true 时禁用文件监听，以在 Agent 编辑期间节省 CPU。
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
