export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title:
      'Easy video downloader - Download your favourite video as MP4 or MP3 easy and fast or download only part of an video!',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Use our free tool to download any YouTube video you want. Download MP4 or MP3 youtube videos for free. You can download an single video or an list up to 10. You can also download an part of an video with our cutter tool!',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    script: [
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7999730286556826',
        async: true,
        crossorigin: 'anonymous',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],
  ssr: true,
  target: 'server',
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  serverMiddleware: [
    {
      path: '/api',
      handler: '~api/index.ts',
    },
  ],
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-analytics',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/google-adsense',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  robots: {
    UserAgent: '*',
    Disallow: '/api/',
  },
  googleAnalytics: {
    id: 'UA-222785513-2',
  },
  'google-adsense': {
    id: 'ca-pub-7999730286556826',
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
