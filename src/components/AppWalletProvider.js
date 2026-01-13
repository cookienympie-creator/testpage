"use client";

import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// Default styles for the wallet button
import "@solana/wallet-adapter-react-ui/styles.css";

export default function AppWalletProvider({ children }) {
  // 🟢 USE ENVIRONMENT VARIABLE
  // If the var is missing (local dev), fall back to a default or empty string
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

  const wallets = useMemo(
    () => [
      // Supports MetaMask via Snaps automatically
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}