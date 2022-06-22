import Vue from "vue";
import { Plugin } from "@nuxt/types";

import VueCookie from "vue-cookie";
Vue.use(VueCookie);

const cookiePlugin: Plugin = async (ctx, inject) => {
  const cookie = VueCookie;
  ctx.$cookie = cookie;
};
export default cookiePlugin;
