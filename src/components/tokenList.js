"use client";
import { useEffect, useState } from "react";
import axios from "axios";
// import WalletModal from "@/components/connectModal"; // 🟢 REMOVED (Replaced by Adapter)
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🟢 Solana Imports
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

const API_ENDPOINTS = {
  pumpfun: async () => {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      { params: { vs_currency: "usd", order: "market_cap_desc", per_page: 50, page: 1, sparkline: false } }
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
      address: coin.id
    }));
  },
  raydium: async () => {
    const res = await axios.get("https://api.dexscreener.com/latest/dex/pairs");
    return (res.data.pairs || []).map(pair => ({
      name: pair.baseToken.symbol,
      symbol: pair.baseToken.symbol,
      image: pair.baseToken.logoURI || "/placeholder.png",
      price: parseFloat(pair.priceUsd).toFixed(6),
      liquidity: pair.liquidity?.usd || 0,
      marketCap: pair.fdv || 0,
      holders: Math.floor(Math.random() * 1000 + 1),
      age: new Date(pair.pairCreatedAt),
      address: pair.pairAddress
    }));
  },
  meteora: async () => {
    const res = await axios.get("https://api.dexscreener.com/latest/dex/pairs");
    return (res.data.pairs || []).map(pair => ({
      name: pair.baseToken.symbol,
      symbol: pair.baseToken.symbol,
      image: pair.baseToken.logoURI || "/placeholder.png",
      price: parseFloat(pair.priceUsd).toFixed(6),
      liquidity: pair.liquidity?.usd || 0,
      marketCap: pair.fdv || 0,
      holders: Math.floor(Math.random() * 1000 + 1),
      age: new Date(pair.pairCreatedAt),
      address: pair.pairAddress
    }));
  }
};

export default function Tokens() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("pumpfun");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;
  
  // 🟢 Standard Wallet Hooks (Replaces local modal state)
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await API_ENDPOINTS[source]();
        const now = Date.now();
        const recent = data.filter(c => (now - new Date(c.age).getTime()) <= 6 * 3600000);
        setCoins(recent);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tokens for " + source);
        setCoins([]);
      }
      setLoading(false);
      setCurrentPage(1);
    })();
  }, [source]);

  // 🟢 Updated Buy Logic
  const buy = () => {
    if (!connected) {
      // Opens the Standard Adapter Modal (Phantom, Solflare, etc)
      setVisible(true);
    } else {
      toast.warning("Insufficient Funds. Fund Your Wallet And Try Again");
    }
  };

  const filtered = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLast = currentPage * coinsPerPage;
  const indexOfFirst = indexOfLast - coinsPerPage;
  const currentCoins = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / coinsPerPage);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-4">🚀 Explore Tokens</h1>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex gap-2">
          {Object.keys(API_ENDPOINTS).map(key => (
            <button
              key={key}
              onClick={() => setSource(key)}
              className={`px-4 py-2 rounded ${source === key ? 'bg-green-600' : 'bg-[#1f1f1f]'} hover:bg-green-700`}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search tokens..."
          className="flex-grow p-2 bg-[#1f1f1f] rounded border border-gray-600"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading tokens...</p>
      ) : (
        <div className="overflow-x-auto bg-[#1a1a1a] rounded-2xl shadow-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#161616]">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Liquidity</th>
                <th className="px-4 py-3 text-right">Market Cap</th>
                <th className="px-4 py-3 text-right">Holders</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentCoins.map((coin, idx) => (
                <tr key={coin.address || idx} className="hover:bg-[#1f1f1f]">
                  <td className="px-4 py-2">{indexOfFirst + idx + 1}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <img src={coin.image} alt="" className="w-6 h-6 rounded-full" onError={(e) => e.target.src='/placeholder.png'} />
                    <div>
                      <div className="font-semibold">{coin.name}</div>
                      <div className="text-xs text-gray-400">{coin.symbol}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">${coin.price}</td>
                  <td className="px-4 py-2 text-right">${coin.liquidity?.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">${coin.marketCap?.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{coin.holders}</td>
                  <td className="px-4 py-2 text-right">
                    <button onClick={buy} className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#1f1f1f] rounded disabled:opacity-50"
          >Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${currentPage === num ? 'bg-green-600' : 'bg-[#1f1f1f]'}`}
            >{num}</button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#1f1f1f] rounded disabled:opacity-50"
          >Next</button>
        </div>
      )}

      {/* 🟢 No custom modal needed here anymore */}
      <ToastContainer />
    </div>
  );
}