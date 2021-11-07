import { NuxtWeb3Instance } from './web3'
import { WalletAdapter } from '@/wallets/types'

import { accessorType } from '~/store'

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $web3: NuxtWeb3Instance
    $accessor: typeof accessorType
    $wallet: WalletAdapter | null
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $web3: NuxtWeb3Instance
    $accessor: typeof accessorType
    $wallet: WalletAdapter | null
  }
}

// Vuex
declare module 'vuex/types/index' {
  // eslint-disable-next-line
  interface Store<S> {
    $web3: NuxtWeb3Instance
    $accessor: typeof accessorType
    $wallet: WalletAdapter | null
  }
}
