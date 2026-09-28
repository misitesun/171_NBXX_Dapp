import {
    defineConfig,
    loadEnv,
    type HtmlTagDescriptor,
    type Plugin,
} from 'vite'
import react from '@vitejs/plugin-react'

const SOCIAL_META_ENABLED_VALUE = '1'

const getEnvValue = (
    env: Record<string, string>,
    key: string,
) => env[key] ?? ''

const createMetaTag = (
    name: string,
    content: string,
): HtmlTagDescriptor => ({
    tag: 'meta',
    attrs: { name, content },
    injectTo: 'head',
})

const createPropertyMetaTag = (
    property: string,
    content: string,
): HtmlTagDescriptor => ({
    tag: 'meta',
    attrs: { property, content },
    injectTo: 'head',
})

const createSocialMetaTags = (
    env: Record<string, string>,
): HtmlTagDescriptor[] => [
    createMetaTag('description', getEnvValue(env, 'VITE_SOCIAL_DESCRIPTION')),
    {
        tag: 'link',
        attrs: {
            rel: 'canonical',
            href: getEnvValue(env, 'VITE_SOCIAL_URL'),
        },
        injectTo: 'head',
    },
    createPropertyMetaTag('og:type', 'website'),
    createPropertyMetaTag('og:site_name', getEnvValue(env, 'VITE_APP_NAME')),
    createPropertyMetaTag('og:title', getEnvValue(env, 'VITE_SOCIAL_TITLE')),
    createPropertyMetaTag('og:description', getEnvValue(env, 'VITE_SOCIAL_DESCRIPTION')),
    createPropertyMetaTag('og:url', getEnvValue(env, 'VITE_SOCIAL_URL')),
    createPropertyMetaTag('og:image', getEnvValue(env, 'VITE_SOCIAL_IMAGE')),
    createPropertyMetaTag('og:image:secure_url', getEnvValue(env, 'VITE_SOCIAL_IMAGE')),
    createPropertyMetaTag('og:image:width', getEnvValue(env, 'VITE_SOCIAL_IMAGE_WIDTH')),
    createPropertyMetaTag('og:image:height', getEnvValue(env, 'VITE_SOCIAL_IMAGE_HEIGHT')),
    createPropertyMetaTag('og:image:alt', getEnvValue(env, 'VITE_SOCIAL_IMAGE_ALT')),
    createPropertyMetaTag('og:locale', getEnvValue(env, 'VITE_SOCIAL_LOCALE')),
    createMetaTag('twitter:card', 'summary_large_image'),
    createMetaTag('twitter:site', getEnvValue(env, 'VITE_SOCIAL_X_SITE')),
    createMetaTag('twitter:creator', getEnvValue(env, 'VITE_SOCIAL_X_CREATOR')),
    createMetaTag('twitter:title', getEnvValue(env, 'VITE_SOCIAL_TITLE')),
    createMetaTag('twitter:description', getEnvValue(env, 'VITE_SOCIAL_DESCRIPTION')),
    createMetaTag('twitter:image', getEnvValue(env, 'VITE_SOCIAL_IMAGE')),
    createMetaTag('twitter:image:alt', getEnvValue(env, 'VITE_SOCIAL_IMAGE_ALT')),
]

const createSocialMetaPlugin = (
    env: Record<string, string>,
): Plugin => ({
    name: 'inject-social-meta',
    transformIndexHtml() {
        if (getEnvValue(env, 'VITE_ENABLE_SOCIAL_META') !== SOCIAL_META_ENABLED_VALUE) {
            return []
        }

        return createSocialMetaTags(env)
    },
})

// Vite project config.
// Vite 项目配置。
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_')

    return {
        base: '/h5/',
        plugins: [
            react(),
            createSocialMetaPlugin(env),
        ],
        resolve: {
            alias: {
                '@': '/src',
            },
        },
        build: {
            cssMinify: 'esbuild',
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // Inject shared SCSS mixins into every style file.
                    // 将共享 SCSS mixin 注入到每个样式文件中。
                    additionalData: '@use "@/styles/mixins.scss" as *;\n',
                },
            },
        },
    }
})
