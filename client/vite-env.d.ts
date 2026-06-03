declare module '@tailwindcss/vite' {
    import type { Plugin } from 'vite'
    const plugin: () => Plugin
    export default plugin
}