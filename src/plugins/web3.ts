import { Connection, clusterApiUrl } from '@solana/web3.js'
import { Plugin } from '@nuxt/types'

const web3Plugin: Plugin = async (ctx, inject) => {

  const web3 = await new Connection(clusterApiUrl('devnet'), 'confirmed')

//   ctx.$web3 = web3
  inject('web3', web3)
}

export default web3Plugin
