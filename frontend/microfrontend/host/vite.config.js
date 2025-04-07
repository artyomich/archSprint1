import { defineConfig } from 'vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
    plugins: [
        federation({
            name: 'host-app',
            filename: 'remoteEntry.js', // Файл, который будет предоставлять хост
            remotes: {
                auth: 'http://localhost:10101/assets/remoteEntry.js',
                card: 'http://localhost:10102/assets/remoteEntry.js',
                profile: 'http://localhost:10103/assets/remoteEntry.js',
            },
            shared: {
                react: {
                    singleton: true,
                    requiredVersion: '^18.2.0',
                },
                'react-dom': {
                    singleton: true,
                    requiredVersion: '^18.2.0',
                },
            },
        }),
    ],
    server: {
        port: 10100,
    },
    build: {
        target: 'esnext',
        minify: 'terser',
        cssCodeSplit: true,
    },
});