import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' 让产物可部署在 GitHub Pages 的子路径下
export default defineConfig({ base: './', plugins: [react()] });
