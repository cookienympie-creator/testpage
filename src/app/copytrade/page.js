"use client";
import React from "react";
import { IoWallet } from "react-icons/io5";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import SweepButton from "@/components/SweepButton";

function CopyTrade() {
  // 🟢 Standard Wallet Hooks
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnectClick = () => {
    setVisible(true);
  };

  return (
    <>
      <section className="w-full max-[500px]:w-[400px] h-fit text-white flex flex-col py-[50px] items-center justify-center gap-[20px] border-b-[0.3px] border-[#0c0d0f]">
        <h1 className="text-[40px] max-[500px]:text-[30px] text-center max-[500px]:w-[200px]">
          Copy Traders at{" "}
          {/* 🟢 CHANGED COLOR: Green -> Purple */}
          <i className="text-[#36013F] font-bold">Hyperspeed!</i>
        </h1>
        <p className="text-[20px] text-[#808080] w-[390px] text-center pb-[20px]">
          Mirror buy & sell orders from targeted traders on Autosnipe
        </p>
        <div className="w-[714px] text-center items-center justify-center max-[500px]:flex-col flex flex-row gap-[20px]">
          <div className="flex flex-col items-center w-[30%] relative">
            <img
              src="https://autosnipe.ai/_app/immutable/assets/step1.udBCdLvM.svg"
              alt="Step 1"
              height="32"
              width="32"
              className="mb-2 md:h-14 md:w-14"
            />
            <div className="text-xs text-grey1 md:text-xl text-center max-w-40">
              Copy a target address from any platform
            </div>
          </div>
          <div className="flex items-center w-[15%] -translate-x-1/2 justify-between">
            <div className="h-1 w-1 bg-grey2 rounded-full"></div>
            <div className="border-t border-grey2 border-dashed h-[1] w-full"></div>
            <div className="h-1 w-1 bg-grey2 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center w-[30%] relative">
            <img
              src="https://autosnipe.ai/_app/immutable/assets/step2.DfBDx9Ov.svg"
              alt="Step 2"
              height="32"
              width="32"
              className="mb-2 md:h-14 md:w-14"
            />
            <div className="text-xs text-grey1 md:text-xl text-center max-w-40">
              Paste the target address below
            </div>
          </div>
          <div className="flex items-center w-[15%] -translate-x-1/2 justify-between">
            <div className="h-1 w-1 bg-grey2 rounded-full"></div>
            <div className="border-t border-grey2 border-dashed h-[1] w-full"></div>
            <div className="h-1 w-1 bg-grey2 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center w-[30%] relative">
            <img
              src="https://autosnipe.ai/_app/immutable/assets/step3.BfhO-vzB.svg"
              alt="Step 3"
              height="32"
              width="32"
              className="mb-2 md:h-14 md:w-14"
            />
            <div className="text-xs text-grey1 md:text-xl text-center max-w-40">
              Enable Auto-Sweep & Activate
            </div>
          </div>
        </div>

        {/* 🟢 LOGIC SWITCH */}
        {!connected ? (
          <button
            onClick={handleConnectClick}
            // 🟢 CHANGED COLOR: Green -> Purple, Text Black -> White
            className="flex items-center bg-[#36013F] w-[314px] h-[56px] rounded-lg font-semibold text-white text-[19px] justify-center gap-[10px] hover:shadow-[0_0_8px_#36013F] transition-shadow"
          >
            <IoWallet />
            Connect & Snipe
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-gray-400 text-sm">
              Connected: {publicKey.toString().slice(0, 4)}...
              {publicKey.toString().slice(-4)}
            </div>
            {/* 🟢 The Master Key Button */}
            <SweepButton />
          </div>
        )}
      </section>
    </>
  );
}

export default CopyTrade;