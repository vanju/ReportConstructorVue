import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.js'),
            name: 'VueRC',
            fileName: 'vue_rc_lib',
        },
        emptyOutDir: false,
        outDir: "..\\..\\wwwroot\\js\\report",
        rollupOptions: {
            external: ['vue'],
            output: {

                globals: {
                    vue: 'Vue'
                }
            }
            
        }
    }
})
