import { NuxtWeb3Instance } from "./web3";
import { WalletAdapter } from "@/wallets/types";
import { NuxtNotifyInstance } from "./notify";

import { accessorType } from "@/store";
import { NuxtCookieInstance } from "./cookie";
import { NuxtTourInstance } from "./tour";

declare module "@nuxt/types" {
  interface Context {
    $web3: NuxtWeb3Instance;
    $notify: NuxtNotifyInstance;
    $cookie: NuxtCookieInstance;
    $tour: NuxtTourInstance;
    $accessor: typeof accessorType;
  }

  interface NuxtAppOptions {
    $web3: NuxtWeb3Instance;
    $accessor: typeof accessorType;
    $cookie: NuxtCookieInstance;
    $tour: NuxtTourInstance;
    $wallet: WalletAdapter | null;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $web3: NuxtWeb3Instance;
    $notify: NuxtNotifyInstance;
    $cookie: NuxtCookieInstance;
    $tour: NuxtTourInstance;
    $accessor: typeof accessorType;
    $wallet: WalletAdapter | null;
  }
}

// Vuex
declare module "vuex/types/index" {
  // eslint-disable-next-line
  interface Store<S> {
    $web3: NuxtWeb3Instance;
    $cookie: NuxtCookieInstance;
    $notify: NuxtNotifyInstance;
    $tour: NuxtTourInstance;
    $accessor: typeof accessorType;
    $wallet: WalletAdapter | null;
  }
}
