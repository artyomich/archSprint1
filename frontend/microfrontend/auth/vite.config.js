import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
    plugins: [
        federation({
            name: 'auth',
            filename: 'remoteEntry.js',
            exposes: {
                './authUtils': './src/utils/auth.js', // Публикуем auth.js
            },
            shared: ['react', 'react-dom'],
        }),
    ],
    server: {
        port: 10101,
    },
});