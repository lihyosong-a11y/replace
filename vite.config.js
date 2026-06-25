import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/replace/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
