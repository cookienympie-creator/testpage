"use client";
import "./style.css";
import { useState } from "react";
import TradingViewWidget from "@/components/tradingviewwidget";
import TokenListAnalytics from "@/components/TokenListAnalytics";

export default function Analytics() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="token-parent">
      <div className="token-live">
        <TradingViewWidget />
      </div>
      
      <div className="token-container shadow-[0_0_8px_#230FFF,0_0_8px_#ff00ff,0_0_8px_#0000ff]">
        <div className="token-topbar">
          <div className="token-topbar-left-cont">
            <p>Active Positions</p>
            <p>History</p>
            <p>Top 100</p>
            <p>Activity</p>
          </div>
          <div className="token-topbar-right-cont">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by name or address"
                className="search-bar-inline"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="usd-up-down-cont">
              <img src="updown.png" alt="" width={20} height={20}/>
              <p>USD</p>
            </div>
          </div>
        </div>

        <div className="token-list-table">
          <p>Token</p>
          <p>Price</p>
          <p>Liquidity</p>
          <p>Market Cap</p>
          <p>Action</p>
        </div>

        {/* Pass search query to the token list component */}
        <TokenListAnalytics searchQuery={searchQuery} />
      </div>
    </div>
  );
}