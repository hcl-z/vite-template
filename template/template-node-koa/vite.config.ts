import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

export default defineConfig({
    server: {
        port: 2000
    },
    plugins: [
        ...VitePluginNode({
            adapter: 'koa',
            appPath: './app.ts'
        })
    ]
});