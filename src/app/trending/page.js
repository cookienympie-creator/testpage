import MemeCoins from "@/app/memes";
import GetStarted from "@/components/getstarted";
import React from "react";

const Trending = () => {
  return (
    <>
      <section className="text-white w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <GetStarted />
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-2">
          New Trending Meme Coins
        </h1>
        <p className="text-sm sm:text-base text-center text-gray-400 mb-6">
          Find the hottest meme coins trending right now!
        </p>
        <MemeCoins />
      </section>
    </>
  );
};

export default Trending;