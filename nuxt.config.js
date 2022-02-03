import { Integrations } from "@sentry/tracing";

export default {
  srcDir: "./src/",
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "la-front-temp",
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
  css: ["@/scss/base.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["@plugins/web3.ts", "@/plugins/notify.ts"],

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
    // baseUrl:
    //   process.env.baseUrl || "https://nexfin-backend-73znx.ondigitalocean.app/",
    baseUrl: process.env.baseUrl || "http://192.168.43.112:3000/",
    //baseUrl: process.env.baseUrl || "https://liquity-back.ambersoft.llc/"
  },

  //   ENV
  env: {
    // baseUrl:
    //   process.env.BASE_URL ||
    //   "https://nexfin-backend-73znx.ondigitalocean.app/",
    baseUrl: process.env.BASE_URL || "http://192.168.43.112:3000/",
    //baseUrl: process.env.BASE_URL || "https://liquity-back.ambersoft.llc/",
    mint: "2U3Mf4umT4CpLhhdwpfmGiktyvhdrLrNNv4z4GgsXNMe",
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
  dev: process.env.NODE_ENV !== "production",
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5000,
  },
};
