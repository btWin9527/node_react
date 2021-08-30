import {defineConfig} from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import styleImport from 'vite-plugin-style-import'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        styleImport({
            libs: [
                {
                    libraryName: 'zarm',
                    esModule: true,
                    resolveStyle: (name) => {
                        return `zarm/es/${name}/style/css`
                    }
                }
            ]
        })],
    css: {
        modules: {
            localsConvention: 'dashesOnly'
        },
        preprocessorOptions: {
            less: {
                // 支持内联js
                javascriptEnabled: true
            }
        }
    },
    server: {
        host: 'localhost',
        open: true,
        cors: true, // 允许跨域
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:7001',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
            }
        }
    },
    resolve: {
        // 别名配置
        alias: {
            '@': path.resolve(__dirname, 'src'), // src路径
            'utils': path.resolve(__dirname, 'src/utils'), // utils路径
        }
    }
})
