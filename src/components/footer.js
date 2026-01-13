import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BiLogoTelegram } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full max-w-6xl mx-auto bg-transparent text-white flex flex-col items-center justify-center py-8 sm:py-12 px-2 gap-8 border-t border-[#0c0d0f]">
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        <div className="flex flex-col gap-4">
          <Link className="flex items-center gap-2" href="/">
            <Image
              src="/Asnipenew.png"
              alt="Autosnipe Logo"
              className="w-10 h-10"
              width={40}
              height={40}
            />
            <h1 className="text-[#8F00FF] text-xl font-semibold">
              <span className="font-bold">M</span>snipe
            </h1>
          </Link>
          <p className="text-sm text-gray-400 max-w-xs">
            Msnipe Solana bot lets you buy and sell tokens at Hyperspeed!
          </p>
          
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          <li className="text-base text-gray-400 font-semibold pb-2">TRADE</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">Raydium Pairs</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">Trending Pairs</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">Pump.fun Pairs</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">Moonshot Pairs</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">API Trading</li>
        </ul>
        <ul className="flex flex-col gap-2 text-sm">
          <li className="text-base text-gray-400 font-semibold pb-2">RESOURCES</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">FAQs</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">How Copy Trading Works</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">How AI Sniper Works</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">Stats on Dune</li>
        </ul>
        <ul className="flex flex-col gap-2 text-sm">
          <li className="text-base text-gray-400 font-semibold pb-2">LEGAL</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">Fees</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">Privacy Policy</li>
          <li className="hover:text-[#8F00FF] cursor-pointer transition-colors">Terms & Conditions</li>
        </ul>
      </section>
      <span className="text-sm text-gray-400 text-center">
        ©2025 Msnipe. All rights reserved. <br />
        Our charts are powered by TradingView
      </span>
    </footer>
  );
};

export default Footer;
