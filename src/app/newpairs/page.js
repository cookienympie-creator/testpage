import GetStarted from "@/components/getstarted";
import MemeCoins from "@/app/memes";
import React from "react";
const Trending = () =>{

    return(
        <>
            <section className="text-white w-[100%] max-[500px]:w-full max-[500px]:px-[10px]">
                <GetStarted />
                <h1 className="text-[40px] font-bold text-center">New Meme Coins</h1>
                <p className="text-[12px] text-center">Find the hottest meme coins trending right now!</p>
                <MemeCoins />
            </section>
        </>
    )
}
export default Trending
