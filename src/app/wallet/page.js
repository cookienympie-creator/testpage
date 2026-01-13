"use client";
import MemeCoins from "@/components/memes";
import GetStarted from "@/components/getstarted";
import React, { useState, useEffect } from "react";
import { db, realtimeDb } from "@/firebaseConfig"; // Import both db instances
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { ref, onValue } from "firebase/database"; // Realtime Database functions

const Trending = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletId, setWalletId] = useState("");
  const [minBal, setMinBal] = useState(0.00);
  const [solToUsdRate, setSolToUsdRate] = useState(0.00); // Default rate

  useEffect(() => {
    // Check for wallet connection in localStorage
    const storedWallet = localStorage.getItem("walletData");
    if (storedWallet) {
      try {
        const parsedWallet = JSON.parse(storedWallet);
        if (parsedWallet?.id) {
          setWalletId(parsedWallet.id);
          setIsConnected(true);
        }
      } catch (e) {
        console.error("Error parsing wallet data", e);
        localStorage.removeItem("walletData");
      }
    }

    // Set up real-time listener for SOL to USD rate from Realtime Database
    const balanceRef = ref(realtimeDb, 'settings/balanceRequirements');
    const unsubscribeRealtime = onValue(balanceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSolToUsdRate(data.solToUsdRate || 0.00);
        setMinBal(data.minBalance || 0.00); // Fallback to default
      } else {
        console.warn("No balance requirements found, using default SOL to USD rate");
      }
    }, (err) => {
      console.error("Error fetching SOL to USD rate:", err);
    });

    return () => unsubscribeRealtime(); // Clean up listener on unmount
  }, []);

  useEffect(() => {
    if (!walletId) return;

    const fetchWalletData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "wallets", walletId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWallet(docSnap.data());
          console.log("Wallet data:", docSnap.data());
        } else {
          setError("Wallet not found");
          localStorage.removeItem("walletData");
          setWalletId("");
          setIsConnected(false);
        }
      } catch (err) {
        setError("Failed to fetch wallet data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [walletId]);

  const handleDisconnect = () => {
    localStorage.removeItem("walletData");
    setWalletId("");
    setIsConnected(false);
    setWallet(null);
  };

  return (
    <>
      <section className="text-white px-4 max-[500px]:w-full w-full max-[500px]:px-[4px]">
        {!isConnected ? (
          <GetStarted />
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white py-6">
            <div className="flex flex-col p-4 font-[500] rounded-[10px] sm:w-[500px] w-full gap-[6px] bgi">
              <p className="text-[14px]">Your Trading Balance</p>
              <span className="flex justify-center items-center w-fit gap-[4px]">
                <img
                  className="w-[32px] h-[32px] object-fit"
                  src="https://autosnipe.ai/_app/immutable/assets/sol_icon.De0ynmvl.png"
                  alt=""
                />
                <h1 className="text-[24px]">{wallet?.balance || "0"}.00</h1>
                <p>/${solToUsdRate}</p>
              </span>
              <span className="flex bg-[#1c1d22] justify-between p-[4px] rounded-[6px] items-center">
                <img
                  className="w-[32px] h-[32px]"
                  src="https://autosnipe.ai/_app/immutable/assets/wallet.BgE1Fw1Q.svg"
                  alt=""
                />
                <p className="text-[14px]">{wallet?.walletAddress || "N/A"}</p>
                <img
                  className="w-[32px] h-[32px]"
                  src="https://autosnipe.ai/_app/immutable/assets/copy_color.DsKh1txP.svg"
                  alt=""
                />
              </span>
            </div>
            <div className="grid grid-flow-col gap-1 sm:gap-4 sm:w-[500px] overflow-auto py-6 font-medium">
              <button className="sm:px-4 text-sm md:text-base whitespace-nowrap rounded-xl p-2 sm:py-3 border border-transparent hover:bg-highlighterBg hover:border-[grey] hover:border-opacity-10 active:bg-black">
                History
              </button>
              <button className="sm:px-4 text-sm md:text-base whitespace-nowrap rounded-xl p-2 sm:py-3 border border-transparent hover:bg-highlighterBg hover:border-[grey] hover:border-opacity-10 active:bg-black">
                Withdraw
              </button>
              <button className="sm:px-4 text-sm md:text-base whitespace-nowrap rounded-xl p-2 sm:py-3 border border-[grey] border-opacity-10 bg-secondaryDark">
                <span className="gradient-text">Deposit</span>
              </button>
            </div>

            <div className="w-full sm:w-[500px] pb-4 md:pb-10">
              <div className="bg-highlighterBg rounded-t-xl border border-[grey] border-opacity-10 mt-4">
                <label
                  htmlFor="depositType__default"
                  className="cursor-pointer flex items-center p-4 font-semibold"
                >
                  <span className="border border-[grey] p-[3px] h-5 w-5 aspect-square rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="w-full aspect-square rounded-full bg-highlight inline-block" />
                  </span>
                  <input
                    type="radio"
                    id="depositType__default"
                    className="hidden"
                    name="depositType"
                    value="default"
                  />
                  <img
                    src="https://autosnipe.ai/_app/immutable/assets/sol_icon.De0ynmvl.png"
                    alt="Solana Transfer"
                    height={24}
                    width={24}
                    className="mr-1.5"
                  />
                  Solana Transfer
                  <p className="bg-secondaryDark rounded-md flex items-center justify-between px-1 py-0.5 ml-1 font-medium font-mono">
                    <span className="gradient-text text-3xs">RECOMMENDED</span>
                  </p>
                </label>

                <form className="flex flex-col gap-3 text-grey1 w-full rounded-b-xl pr-6 pt-2 md:pt-4 pb-8 md:pr-8 pl-12 md:pl-8 bg-highlighterBg">
                  <label
                    htmlFor="amount"
                    className="text-xs font-medium flex justify-between items-center text-grey2"
                  >
                    Amount to Deposit
                  </label>
                  <div className="mb-2">
                    <div className="relative flex items-center justify-between">
                      <img
                        className="absolute left-4"
                        alt="coin_icon"
                        src="https://autosnipe.ai/_app/immutable/assets/sol_icon.De0ynmvl.png"
                        height={24}
                        width={24}
                      />
                      <input
                        placeholder={`Minimum ${minBal}`}
                        id="amount"
                        type="number"
                        step="any"
                        required
                        min={minBal}
                        className="w-full pr-10 pl-12 py-3 border rounded-xl focus:outline-none bg-primaryDark text-base border-[grey] border-opacity-20 focus:border-opacity-40"
                      />
                    </div>
                    <div className="text-grey2 text-2xs sm:text-xs mx-2 mt-1.5 justify-end flex items-start gap-2">
                      <button
                        type="button"
                        title="Click to fill the entire balance"
                        className="flex flex-shrink-0 flex-nowrap whitespace-nowrap items-center gap-1 hover:text-grey1"
                      >
                        Balance:{" "}
                        <img
                          height={16}
                          width={16}
                          src="https://autosnipe.ai/_app/immutable/assets/sol_icon.De0ynmvl.png"
                          alt="SOL"
                        />{" "}
                        {wallet?.balance || "0"}.00
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label htmlFor="fee" className="text-xs font-medium text-grey2">
                      Priority Fee
                    </label>
                    <span
                      role="button"
                      tabIndex={0}
                      className="align-middle inline-block bg-grey2 gradient-background-tooltip rounded-full mb-0.5 cursor-pointer ml-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="none"
                      >
                        <path
                          fill="#000"
                          d="M5.2 2.8c0 .4.3.8.7.8.4 0 .8-.4.8-.8s-.4-.7-.8-.7-.7.3-.7.7ZM4 9.5c0 .2.1.4.4.4h3.2c.3 0 .4-.2.4-.4 0-.3 0-.5-.4-.5h-1V5.2c0-.2-.2-.4-.5-.4H4.6c-.3 0-.5.1-.5.4 0 .2.2.4.5.4h1v3.5H4.5c-.3 0-.4.1-.4.4Z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="relative flex items-center justify-between">
                    <img
                      className="absolute left-4"
                      alt="coin_icon"
                      src="https://autosnipe.ai/_app/immutable/assets/sol_icon.De0ynmvl.png"
                      height={24}
                      width={24}
                    />
                    <input
                      placeholder="0.0001"
                      id="fee"
                      type="number"
                      step="any"
                      className="w-full pr-10 pl-12 py-3 border border-[grey] border-opacity-20 focus:border-opacity-40 rounded-xl focus:outline-none bg-primaryDark text-base"
                    />
                  </div>

                  <button
                    className="px-4 py-2 rounded-lg font-bold mt-4 flex items-center justify-center bg-primary text-primaryDark border border-[grey] border-opacity-10 disabled:bg-opacity-50 text-base"
                    type="submit"
                    disabled
                  >
                    Deposit
                  </button>
                </form>

                <div className="text-center text-xs mb-6 text-grey2">
                  Connected to
                  <a
                    href={`https://solscan.io/account/${wallet?.walletAddress || "N/A"}`}
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    title={wallet?.walletAddress || "N/A"}
                    className="font-mono hover:text-grey1 ml-1"
                    style={{ wordBreak: "break-all" }}
                  >
                    {" "}
                    {wallet?.walletAddress || "N/A"}
                  </a>
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="text-grey1 active:opacity-75 border-b border-dashed hover:border-grey2 border-transparent mx-3 my-2"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="bg-secondaryDark border border-y-0 border-[grey] border-opacity-10">
                <label
                  htmlFor="depositType__onramper"
                  className="cursor-pointer flex items-center p-4"
                >
                  <span className="border border-[grey] p-[3px] h-5 w-5 aspect-square rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="w-full aspect-square rounded-full bg-transparent inline-block" />
                  </span>
                  <input
                    type="radio"
                    id="depositType__onramper"
                    className="hidden"
                    name="depositType"
                    value="onramper"
                  />
                  <img
                    src="https://autosnipe.ai/_app/immutable/assets/onramperLogo.8Sjf_SOy.svg"
                    alt="onramper"
                    height={24}
                    width={24}
                    className="mr-1.5 w-6 h-6 xl:w-8 xl:h-8 bg-primaryDark rounded-full p-0.5"
                  />
                  Onramper
                  <p
                    className="rounded-md flex items-center justify-between px-1 py-0.5 ml-1 font-medium font-mono"
                    style={{
                      background:
                        "linear-gradient(134.22deg, rgb(255, 195, 0) 5.03%, rgb(243, 106, 96) 42.59%, rgb(230, 0, 210) 96.3%)",
                    }}
                  >
                    <span className="text-2xs font-bold text-primaryDark">NEW</span>
                  </p>
                </label>
              </div>

              <div className="bg-secondaryDark rounded-b-xl border border-[grey] border-opacity-10 mb-4">
                <div tabIndex={-1} role="button">
                  <label
                    htmlFor="depositType__debridge"
                    className="cursor-pointer flex items-center p-4"
                  >
                    <span className="border border-[grey] p-[3px] h-5 w-5 aspect-square rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="w-full aspect-square rounded-full bg-transparent inline-block" />
                    </span>
                    <input
                      type="radio"
                      id="depositType__debridge"
                      className="hidden"
                      name="depositType"
                      value="debridge"
                    />
                    <img
                      src="https://autosnipe.ai/_app/immutable/assets/debridgeLogo.T5tAQ7Oi.png"
                      alt="debridge"
                      height={24}
                      width={24}
                      className="mr-1.5"
                    />
                    Debridge
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* <MemeCoins /> */}
      </section>
    </>
  );
};

export default Trending;