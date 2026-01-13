import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import {
  WalletConnectWalletAdapter
} from "@solana/wallet-adapter-walletconnect";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export function getWallets() {
  const network = WalletAdapterNetwork.Devnet; // or MainnetBeta
  const endpoint = clusterApiUrl(network);

  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network }),
    new WalletConnectWalletAdapter({
      network,
      options: {
        relayUrl: "wss://relay.walletconnect.com",
        projectId: "1d4e423e27a5d1b16a6a4b63dad0a593",
        metadata: {
          name: "Msnipe",
          description: "Solana bot lets you buy and sell tokens at Hyperspeed!",
          url: "https://yourdapp.com",
          icons: ["https://yourdapp.com/logo.png"],
        },
      },
    }),
  ];

  return wallets;
}

