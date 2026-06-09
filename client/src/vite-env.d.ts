declare module '@tailwindcss/vite' {
    import type { Plugin } from 'vite'
    const plugin: () => Plugin
    export default plugin
}

interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly MODE: string;
    readonly VITE_API_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}