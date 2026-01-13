"use client";
import { useEffect, useState } from "react";
import axios from "axios";
// import WalletModal from "@/components/connectModal"; // 🟢 REMOVED
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported

// 🟢 Solana Imports
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const API_ENDPOINTS = {
  pumpfun: async () => {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      { params: { vs_currency: "usd", order: "market_cap_desc", per_page: 100, page: 1, sparkline: false } }
    );
    return res.data.map(coin => ({
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.image,
      price: coin.current_price.toFixed(6),
      liquidity: coin.market_cap,
      marketCap: coin.market_cap,
      holders: coin.total_supply || 0,
      age: new Date(coin.last_updated),
      address: coin.id,
      isNew: (Date.now() - new Date(coin.last_updated).getTime()) <= 24 * 60 * 60 * 1000 // 24 hours
    }));
  }
};

export default function TokenListAnalytics({ searchQuery = "" }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;
  
  // 🟢 Standard Wallet Hooks
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await API_ENDPOINTS["pumpfun"]();
        
        // Sort by newest first and then by market cap (low market cap = newer memecoins)
        const sortedData = data.sort((a, b) => {
          // First sort by age (newest first)
          const ageComparison = new Date(b.age) - new Date(a.age);
          if (ageComparison !== 0) return ageComparison;
          
          // Then by market cap (lower first for memecoins)
          return a.marketCap - b.marketCap;
        });
        
        setCoins(sortedData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tokens from PumpFun");
        setCoins([]);
      }
      setLoading(false);
      setCurrentPage(1);
    })();
  }, []);

  const buy = (coin) => {
    // 🟢 Updated Logic: Trigger Standard Wallet Modal
    if (!connected) {
      setVisible(true);
    } else {
      toast.warning(`Buying ${coin.name} - Insufficient Funds. Fund Your Wallet And Try Again`);
    }
  };

  // Filter coins based on search query
  const filtered = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLast = currentPage * coinsPerPage;
  const indexOfFirst = indexOfLast - coinsPerPage;
  const currentCoins = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / coinsPerPage);

  if (loading) {
    return <p className="text-center py-4 text-gray-400">Loading PumpFun tokens...</p>;
  }

  return (
    <div className="token-container-main">
      {/* Show search query info */}
      {searchQuery && (
        <p className="text-xs text-gray-400 mb-4">
          Showing results for: "{searchQuery}"
        </p>
      )}

      {/* Token list matching your placeholder structure */}
      {currentCoins.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {searchQuery ? 'No PumpFun tokens found matching your search.' : 'No PumpFun tokens available.'}
        </div>
      ) : (
        currentCoins.map((coin, idx) => (
          <div key={coin.address} className="token-main">  
            <div className="token-img-cont">
              <img src={coin.image} alt="" className="img-cont" onError={(e) => e.target.src='/placeholder.png'} />
              <div className="token-details-cont">
                <p className="token-details-bold">
                  {coin.name}
                  {coin.isNew && <span className="ml-1 text-[#FF00FF] text-xs">NEW</span>}
                </p>
                <p className="token-details-regular">
                  {coin.symbol}
                </p>
              </div>
            </div>
            
            <div className="bought">
              <p>${coin.price}</p>
              <p>Price</p>
            </div>

            <div className="sold">
              <p>${coin.liquidity.toLocaleString()}</p>
              <p>Liquidity</p>
            </div>

            <p className="pnl">
              ${coin.marketCap.toLocaleString()}
            </p>

            {/* 🟢 Updated onClick to use new buy logic */}
            <div className="token-buy-btn" onClick={() => buy(coin)}>
              <p>Buy</p>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#1f1f1f] rounded disabled:opacity-50 text-xs hover:bg-[#36013F]"
          >Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded text-xs ${currentPage === num ? 'bg-[#36013F]' : 'bg-[#1f1f1f] hover:bg-[#36013F]'}`}
            >{num}</button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#1f1f1f] rounded disabled:opacity-50 text-xs hover:bg-[#36013F]"
          >Next</button>
        </div>
      )}
      
      {/* 🟢 Removed custom WalletModal component */}
      <ToastContainer theme="dark" />
    </div>
  );
}