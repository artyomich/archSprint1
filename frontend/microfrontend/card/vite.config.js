import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
    plugins: [
        federation({
            name: 'card',
            filename: 'remoteEntry.js',
            exposes: {},
            shared: ['react', 'react-dom'],
        }),
    ],
    server: {
        port: 10102,
    },
});