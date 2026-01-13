"use client";
import React, { useState } from "react";
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import SideBar from "./sidebar";
import { usePathname } from "next/navigation";

// 🟢 Solana Imports
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const Navbar = () => {
  const [sideOpen, setSideOpen] = useState(false);
  const [showSearchMessage, setShowSearchMessage] = useState(false);
  const pathname = usePathname();

  // 🟢 Use Standard Wallet Hooks
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal(); // For opening the modal

  const toggleSidebar = () => {
    setSideOpen(!sideOpen);
  };

  const closeSidebar = () => {
    setSideOpen(false);
  };

  // 🟢 Open Standard Modal
  const openWalletModal = () => {
    setVisible(true);
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    const addrStr = address.toString();
    return `${addrStr.substring(0, 6)}...${addrStr.substring(addrStr.length - 4)}`;
  };

  const handleSearchInput = (e) => {
    setShowSearchMessage(e.target.value.length > 0);
  };

  return (
    <nav className="w-full fixed top-0 z-[110] flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 bg-black border-b border-[#0c0d0f] text-white">
      <div className="flex items-center gap-4 sm:gap-6">
        <button onClick={toggleSidebar} className="text-xl sm:text-2xl">
          {sideOpen ? <IoClose /> : <GiHamburgerMenu />}
        </button>
        <Link className="flex items-center gap-2" href="/">
          <Image
            src="/Asnipenew.png"
            alt="Autosnipe Logo"
            className="w-8 h-8"
            width={32}
            height={32}
          />
          <h1 className="text-[#8F00FF] text-lg sm:text-xl font-semibold">
            <span className="font-bold">M</span>snipe
          </h1>
        </Link>
        <span className="hidden sm:flex items-center gap-2 bg-[#1C1D22] px-3 py-1.5 rounded-md">
          <Image
            src="/sol_icon.De0ynmvl.png"
            alt="Solana"
            className="w-5 h-5"
            width={20}
            height={20}
          />
          <p className="text-sm">Solana</p>
        </span>
         <span className="hidden sm:flex items-center gap-2 bg-[#1C1D22] px-3 py-1.5 rounded-md">
          <Image
            src="/binance.png"
            alt="Binance"
            className="w-5 h-5"
            width={20}
            height={20}
          />
          <p className="text-sm">Binance</p>
        </span>
      </div>
      <div className="hidden md:flex flex-1 max-w-md mx-4 relative flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search token name or address"
            className="w-full h-9 bg-transparent border border-gray-600 rounded-lg pl-9 pr-12 py-2 text-sm focus:outline-none focus:border-[#00cc33] focus:bg-[#1C1D22] hover:bg-[#1C1D22] transition-colors"
            onChange={handleSearchInput}
          />
          <CiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
            disabled
          >
            ⌘ + K
          </button>
        </div>
        {showSearchMessage && (
          <div className="text-sm text-red-400 bg-[#0c0d0f] rounded-md px-3 py-2 w-full text-center">
            Please ensure you have at least 3 GBOLA to use the search feature.
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
      
        {/* 🟢 LOGIC SWITCH: Connect vs Connected */}
        {connected && publicKey ? (
          <button
            onClick={disconnect}
            className="bg-green-600 hover:bg-red-800 text-sm px-3 py-1.5 rounded-md transition-colors"
          >
            Connected: {shortenAddress(publicKey)}
          </button>
        ) : (
          <button
            onClick={openWalletModal}
            className="flex items-center gap-2 bg-[#36013F] hover:bg-[#36013F] text-white text-sm sm:text-base font-semibold px-4 py-2 rounded-md transition-colors hover:shadow-[0_0_8px_#36013F,0_0_8px_#ff00ff,0_0_8px_#0000ff] shadow-[0_0_8px_#230FFF,0_0_8px_#ff00ff,0_0_8px_#0000ff] transition-shadow"
          >
            Connect <span className="hidden sm:inline">& Snipe</span>
          </button>
        )}
      </div>
      <SideBar open={sideOpen} onClose={closeSidebar} currentPath={pathname} />
      
      {/* 🟢 REMOVED CUSTOM WALLET MODAL - NO LONGER NEEDED */}
    </nav>
  );
};

export default Navbar;