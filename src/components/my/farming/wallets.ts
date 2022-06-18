import SolanaWalletAdapter from "@project-serum/sol-wallet-adapter";
import {
  SolongWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  LedgerWalletAdapter,
} from "../wallets";
import { WalletAdapter } from "@solana/wallet-base";

export interface WalletInfo {
  name: string;
  url: string;
  installUrl?: string;
  getAdapter: ({
    providerUrl,
    endpoint,
  }: {
    providerUrl: any;
    endpoint: string;
  }) => WalletAdapter | undefined;
}

export const Wallets: WalletInfo[] = [
  {
    name: "Phantom",
    url: "https://phantom.app",
    installUrl:
      "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
    getAdapter() {
      if (
        (window as any).solana === undefined ||
        !(window as any).solana.isPhantom
      ) {
        return;
      }

      return new PhantomWalletAdapter();
    },
  },
  {
    name: "Sollet Web",
    url: "https://www.sollet.io",
    getAdapter({
      providerUrl,
      endpoint,
    }: {
      providerUrl: string;
      endpoint: string;
    }) {
      return new SolanaWalletAdapter(providerUrl, endpoint);
    },
  },
  {
    name: "Sollet Extension",
    url: "https://www.sollet.io",
    installUrl:
      "https://chrome.google.com/webstore/detail/sollet/fhmfendgdocmcbmfikdcogofphimnkno",
    getAdapter({ endpoint }: { endpoint: string }) {
      if ((window as any).sollet === undefined) {
        return;
      }
      return new SolanaWalletAdapter((window as any).sollet, endpoint);
    },
  },
  {
    name: "Ledger",
    url: "https://www.ledger.com",
    getAdapter() {
      return new LedgerWalletAdapter();
    },
  },
  {
    name: "MathWallet",
    url: "https://mathwallet.org",
    installUrl:
      "https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc",
    getAdapter() {
      if (
        (window as any) === undefined ||
        !(window as any).solana.isMathWallet
      ) {
        return;
      }
      return new MathWalletAdapter();
    },
  },
  {
    name: "Solong",
    url: "https://solongwallet.com",
    installUrl:
      "https://chrome.google.com/webstore/detail/solong/memijejgibaodndkimcclfapfladdchj",
    getAdapter() {
      if ((window as any).solong === undefined) {
        return;
      }
      return new SolongWalletAdapter();
    },
  },
  {
    name: "Bonfida",
    url: "https://bonfida.com/wallet",
    getAdapter({
      providerUrl,
      endpoint,
    }: {
      providerUrl: string;
      endpoint: string;
    }) {
      return new SolanaWalletAdapter(providerUrl, endpoint);
    },
  },
];
