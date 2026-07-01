import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

export default defineConfig(({ command }) => ({
    plugins: [
        tsconfigPaths(),
        react(),
        // 🌟 HANYA AKTIFKAN CHECKER SAAT BUKAN SEDANG BUILD (HEMAT RAM VPS)
        command !== 'build' && checker({
            typescript: true,
            eslint: {
                useFlatConfig: true,
                lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
            },
            overlay: {
                initialIsOpen: false,
            },
        }),
    ].filter(Boolean), // Membersihkan nilai false dari array plugin
    preview: {
        port: 5000,
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
    base: '/',
}));