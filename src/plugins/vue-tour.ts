import Vue from 'vue'
import VueTour from "vue-tour";
import { Plugin } from "@nuxt/types";

Vue.use(VueTour)


const tourPlugin: Plugin = async (ctx, inject) => {
    const tour = VueTour;
    ctx.$tour = tour;
    inject("tour", tour);
}
export default tourPlugin;