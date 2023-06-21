import {defineConfig} from 'vite'

export default defineConfig({
    test: {
        environment: "happy-dom",
        globals: true,
        env: "test",
        coverage: {
            reporter: ['html']
        }
    }
})
