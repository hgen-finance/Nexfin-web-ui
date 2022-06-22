import { Integrations } from "@sentry/tracing";
require("dotenv").config();

export default {
  srcDir: "./src/",
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "HGEN Finance",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // for the custom loader
  //   loadingIndicator: "@/components/loader.vue",
  //   loading: "@/components/loader.vue",

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@/scss/base.scss",
    "vue-tour/dist/vue-tour.css",
    //lib css
    "codemirror/lib/codemirror.css",
    //merge css
    "codemirror/addon/merge/merge.css",
    //theme css
    "codemirror/theme/base16-dark.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "@/plugins/web3.ts",
    "@/plugins/notify.ts",
    "@/plugins/vue-tour.ts",
    { src: "@/plugins/vue-cookie.ts", ssr: false, injectAs: "cookie" },
    { src: "@/plugins/vue-codemirror.ts", ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // lib amber
    "@modules/amberlib",
    // https://typed-vuex.roe.dev
    "nuxt-typed-vuex",
    // proxy for nuxt
    // "@nuxtjs/proxy",
  ],

  // nuxt scroll behaviour for anchoring
  router: {
    scrollBehavior: async function (to, from, savedPosition) {
      const ADDITIONAL_OFFSET = 80;
      if (savedPosition) {
        return savedPosition;
      }

      const findEl = async (hash, x = 0) => {
        return (
          document.querySelector(hash) ||
          new Promise((resolve) => {
            if (x > 50) {
              return resolve(document.querySelector("#app"));
            }
            setTimeout(() => {
              resolve(findEl(hash, ++x || 1));
            }, 100);
          })
        );
      };

      if (to.hash) {
        let el = await findEl(to.hash);
        if ("scrollBehavior" in document.documentElement.style) {
          return window.scrollTo({
            top: el.offsetTop + ADDITIONAL_OFFSET,
            behavior: "smooth",
          });
        } else {
          return window.scrollTo(0, el.offsetTop + ADDITIONAL_OFFSET);
        }
      }

      return { x: 0, y: 0 };
    },
  },
  // TODO: set the runtime-base config for the sentry
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "@nuxtjs/svg", "@nuxtjs/sentry"],
  sentry: {
    // Additional Module Options
    // https://sentry.nuxtjs.org/sentry/options
    dsn: "https://b519ab51f3774aa3b451b6cef1c1491a@o1120091.ingest.sentry.io/6155195", // project dsn generated in sentry web
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    integrations: [new Integrations.BrowserTracing()],
    // TODO: adjusting this value in production
    tracesSampleRate: 1.0,
    config: {
      // native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
    },
  },

  axios: {
    baseUrl: process.env.baseUrl || "https://nexfin-backend.vercel.app",
    // proxy: true,
  },

  //   ENV
  env: {
    baseUrl: process.env.BASE_URL || "https://nexfin-backend.vercel.app",
    mint: "2aNEZTF7Lw9nfYv6qQEuWDyngSrB5hbdfx35jpqwcKz8",
    mintAuthority: process.env.MINT_AUTHORITY,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: "empty",
      };
    },
  },
  // for cors
  // proxy: {
  //     "/api/": {
  //         target: process.env.BASE_URL || "http://server:3000/",
  //         pathRewrite: { "^/api/": "/" },
  //     },
  // },

  // TODO only for the containers
  dev: process.env.NODE_ENV !== "production",
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5000,
  },
};
