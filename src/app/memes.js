"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
// import WalletModal from '@/components/connectModal'; // 🟢 REMOVED
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🟢 Solana Imports
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function TokenTable() {
  // State variables
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isWalletModalOpen, setIsWalletModalOpen] = useState(false); // 🟢 REMOVED
  const [error, setError] = useState(null);
  // const [connectedWallet, setConnectedWallet] = useState(null); // 🟢 REMOVED
  const intervalRef = useRef(null);

  // 🟢 Standard Wallet Hooks
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  // Carousel / paging state
  const carouselRef = useRef(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Fetch meme coins data
  const fetchMemeCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/meme-coins");
      
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      
      const data = await response.json();
      const normalizedData = (data.data || []).map(item => ({
        ...item,
        pairData: {
          priceUsd: item.pairData?.priceUsd || 0,
          priceChange: { h24: item.pairData?.priceChange?.h24 || 0 },
          liquidity: { usd: item.pairData?.liquidity?.usd || 0 },
          volume: { h24: item.pairData?.volume?.h24 || 0 },
          baseToken: {
            name: item.pairData?.baseToken?.name || 'Unknown',
            symbol: item.pairData?.baseToken?.symbol || 'UNK',
            address: item.pairData?.baseToken?.address || '',
          },
          info: {
            imageUrl: item.pairData?.info?.imageUrl || '/placeholder.svg',
            websites: item.pairData?.info?.websites || [],
          },
          url: item.pairData?.url || ''
        }
      }));
      
      setCoins(normalizedData);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setCoins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemeCoins();
    intervalRef.current = setInterval(fetchMemeCoins, 300000000);

    // 🟢 REMOVED localStorage wallet logic
    // The Wallet Adapter handles connection persistence automatically

    return () => clearInterval(intervalRef.current);
  }, []);

  // 🟢 Updated Buy Handler
  const handleBuyClick = (coin) => {
    if (!connected) {
      // Open Standard Wallet Modal
      setVisible(true);
    } else {
      // Show the exact same toast you requested
      toast.error(
        <div>
          <p>Insufficient SOL balance in your wallet!</p>
          <p className="text-sm">You need at least 0.005 SOL (incl. fee) to make this purchase</p>
        </div>,
        { position: "top-right", autoClose: 8000 }
      );
    }
  };

  // Filter coins
  const filteredCoins = coins.filter(coin => {
    const pair = coin?.pairData;
    if (!pair) return false;
    const query = searchQuery.toLowerCase();
    return (
      pair.baseToken?.address?.toLowerCase().includes(query) || 
      pair.baseToken?.symbol?.toLowerCase().includes(query) || 
      pair.baseToken?.name?.toLowerCase().includes(query)
    );
  });

  // Group filtered coins into pages of 8 (each "card" shows 8 coins)
  const pageSize = 8;
  const pages = [];
  for (let i = 0; i < filteredCoins.length; i += pageSize) {
    pages.push(filteredCoins.slice(i, i + pageSize));
  }
  const totalPages = pages.length || 1;

  // Move carousel to page index (smooth scroll). Logs to console for visibility.
  const goToPage = (pageIndex) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.querySelector('[data-card]')?.clientWidth || container.clientWidth;
    const gap = parseInt(getComputedStyle(container).gap || 16, 10) || 16;
    const scrollTarget = pageIndex * (cardWidth + gap);
    container.scrollTo({ left: scrollTarget, behavior: 'smooth' });
    setCurrentPageIndex(pageIndex);
    console.log(`Carousel moved to page ${pageIndex}`);
  };

  // Next / Prev navigation
  const nextPage = () => {
    const next = Math.min(totalPages - 1, currentPageIndex + 1);
    goToPage(next);
  };
  const prevPage = () => {
    const prev = Math.max(0, currentPageIndex - 1);
    goToPage(prev);
  };

  // When user scrolls manually we should update the currentPageIndex
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const cardEl = container.querySelector('[data-card]');
        if (!cardEl) return;
        const cardWidth = cardEl.clientWidth;
        const gap = parseInt(getComputedStyle(container).gap || 16, 10) || 16;
        const pageSizePx = cardWidth + gap;
        const idx = Math.round(container.scrollLeft / pageSizePx);
        if (idx !== currentPageIndex) {
          setCurrentPageIndex(Math.min(Math.max(0, idx), totalPages - 1));
          console.log('Carousel scrolled to index:', idx);
        }
        ticking = false;
      });
      ticking = true;
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [currentPageIndex, totalPages]);

  // Format helpers
  const formatPercentage = (num) => Math.abs(num || 0).toFixed(2);
  const getPriceColor = (price) => {
    const numericPrice = Number(price);
    if (numericPrice < 0.0001) return 'text-red-500';
    if (numericPrice < 0.001) return 'text-orange-500';
    return 'text-green-500';
  };

  // Loading and error states
  if (loading) return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="w-full h-64 flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );

  // Common component for token info
  const TokenCell = ({ pair }) => (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-800 overflow-hidden">
        <img
          src={pair.info?.imageUrl || '/placeholder.svg'}
          alt={pair.baseToken?.name || 'Unknown token'}
          className="w-full h-full rounded-full object-fill"
          onError={(e) => e.target.src = '/placeholder.svg'}
        />
      </div>
      <div>
        <div className="text-white text-[13px]">{pair.baseToken?.name || 'Unknown'}</div>
        <div className="text-gray-400 text-[10px]">{pair.baseToken?.symbol || 'UNK'}</div>
      </div>
    </div>
  );

  // Common component for price change
  const PriceChangeCell = ({ value }) => (
    <span className={`${value > 0 ? "text-green-500" : "text-red-500"}`}>
      {value > 0 ? '+' : ''}{formatPercentage(value)}%
    </span>
  );

  /**********************
   * Mobile dot helpers *
   **********************/
  const visibleDotCount = Math.min(4, totalPages);
  const dotToPage = (dotIndex) => {
    if (totalPages <= visibleDotCount) {
      return dotIndex;
    } else {
      const step = totalPages / visibleDotCount;
      const target = Math.round(dotIndex * step);
      return Math.min(totalPages - 1, target);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto w-full py-4 md:py-8 sm:px-2 md:px-4">
        <h1 className="text-2xl md:text-2xl font-bold mb-4 md:mb-8 text-white">
          🔥 Live Meme Coins ({filteredCoins.length})
        </h1>
        
        {/* Filter section (unchanged) */}
        <section className="flex sm:flex-row flex-col w-full sm:gap-2 gap-6 justify-between items-center overflow-x-scroll px-[2px] py-4">
          {/* ... Keep existing filter JSX ... */}
          <div className="flex gap-4 sm:w-fit w-full sm:justify-center justify-between items-center">
            <h1 className="sm:text-xl text-[22px]">
              Trending
            </h1>
            <div className="flex bg-[#1c1d22] text-[15px] rounded-lg py-[3px] px-2 gap-2">
              <button className="px-[12px] py-[6px]">24h</button>
              <button className="px-[12px] py-[6px] bg-[#010101] text-[#00cc33] rounded-lg">6h</button>
              <button className="px-[12px] py-[6px]">1h</button>
              <button className="px-[12px] py-[6px]">5m</button>
            </div>
          </div>
          <div className="flex gap-2 text-[10px] sm:text-[10px] sm:w-[420px] w-full sm:pt-[0px] pt-[20px] overflow-x-scroll">
            {/* ... Keep existing filter buttons ... */}
          </div>
        </section>

         <div className="lg:mb-6">
            {/* ... Keep existing info banner ... */}
         </div>

        {/* Search and info section */}
        <div className="sm:bg-[rgba(0,0,0,0.34)] rounded-[44px] p-2 md:p-6 mb-4 md:mb-8">
          <div className="relative w-full">
            {/* Carousel container */}
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
              {pages.length === 0 ? (
                <div className="w-full max-w-3xl mx-auto py-8 text-center text-base text-red-400 animate-pulse bg-[#0c0d0f] rounded-[44px] px-4">
                  Error node lost, make sure your wallet is connected and substantially funded in sol at least 0.8 to 5 solana and try again
                  <br />
                  Note: least starting solana varies based off region some start can use at least 0.4
                </div>
              ) : (
                pages.map((page, pageIndex) => (
                  <div
                    key={pageIndex}
                    data-card
                    className="flex-shrink-0 w-full sm:w-[720px] md:w-[720px] lg:w-[720px] bg-[#0c0d0f] rounded-[30px] p-4 snap-center"
                    aria-hidden={pageIndex !== currentPageIndex}
                  >
                    <div className="w-full">
                      <table className="w-full text-sm table-fixed">
                        <thead>
                          <tr className="text-gray-400 uppercase text-[10px] font-semibold">
                            <th className="py-2 px-2 text-left w-[35%]">Coin</th>
                            <th className="py-2 px-2 text-left w-[20%]">Price</th>
                            <th className="py-2 px-2 text-left w-[20%]">24h</th>
                            <th className="py-2 px-2 text-left w-[25%]">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {page.map((item, idx) => {
                            const pair = item.pairData;
                            const globalIndex = pageIndex * pageSize + idx;
                            return (
                              <tr
                                key={globalIndex}
                                className="hover:bg-[rgba(0,0,0,0.95)] cursor-pointer transition-colors h-[70px]"
                              >
                                <td className="px-2 py-2 truncate">
                                  <TokenCell pair={pair} />
                                </td>
                                <td className={`px-2 py-2 truncate ${getPriceColor(pair.priceUsd)}`}>
                                  ${Number(pair.priceUsd).toFixed(6)}
                                </td>
                                <td className="px-2 py-2 truncate">
                                  <PriceChangeCell value={pair.priceChange?.h24} />
                                </td>
                                <td className="px-2 py-2">
                                  <button
                                    className="bg-[#8F00FF] hover:bg-green-600 text-white font-medium text-xs px-2 py-1 rounded whitespace-nowrap w-full"
                                    onClick={() => handleBuyClick(item)}
                                  >
                                    Buy
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Mobile-only arrows & dots (Unchanged) */}
            <div className="md:hidden relative">
              <button
                onClick={prevPage}
                aria-label="prev page"
                className="absolute left-3 bottom-14 z-30 p-2 rounded-full bg-[rgba(255, 255, 255, 0.9)] text-white shadow-lg"
              >
                 <Image src="/chevron-left.png" alt="previous page" width={30} height={30} />
              </button>

              <button
                onClick={nextPage}
                aria-label="next page"
                className="absolute right-3 bottom-14 z-30 p-2 rounded-full bg-[rgba(255,255,255,0.9)] text-white shadow-lg"
              >
                 <Image src="/chevron-right.png" alt="next page" width={30} height={30} />
              </button>

              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
                {Array.from({ length: visibleDotCount }).map((_, dotIdx) => {
                  const mappedPage = dotToPage(dotIdx);
                  return (
                    <button
                      key={dotIdx}
                      onClick={() => goToPage(mappedPage)}
                      aria-label={`go to dot ${dotIdx + 1}`}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform transform ${
                        currentPageIndex === mappedPage ? 'scale-125' : 'scale-100'
                      }`}
                      style={{
                        background: currentPageIndex === mappedPage ? '#8F00FF' : 'rgba(35,15,255,0.25)',
                        border: '2px solid rgba(0,0,0,0.0)',
                        boxShadow: '0 4px 12px rgba(35,15,255,0.15)',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 🟢 REMOVED <WalletModal /> */}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        [data-card] {
          scroll-snap-align: center;
        }
        @media (max-width: 767px) {
          .dot {
          position: absolute;
          bottom: 0px;
            width: 22px;
            height: 22px;
            border-radius: 999px;
          }
        }
      `}</style>
    </>
  );
}