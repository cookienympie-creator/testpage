"use client";
import React, { useState } from "react";
import { FaRocket, FaSearch, FaTimes, FaHome } from "react-icons/fa";
import { BsGearFill, BsGraphUp } from "react-icons/bs";
import { IoWallet, IoStatsChart } from "react-icons/io5";
import { RiExchangeLine } from "react-icons/ri";
import Link from "next/link";

function SideBar({ open, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const menuItems = [
    { href: "/", label: "Home", icon: <FaHome className="text-xl" /> },
    { href: "/trending", label: "Trending", icon: <FaRocket className="text-xl" /> },
    { href: "/newpairs", label: "New Pairs", icon: <BsGearFill className="text-xl" /> },
    { href: "/wallet", label: "Wallet", icon: <IoWallet className="text-xl" /> },
    { href: "/copytrade", label: "Copy Trade", icon: <RiExchangeLine className="text-xl" /> },
    { href: "/analytics", label: "Analytics", icon: <BsGraphUp className="text-xl" /> },
    { href: "/stats", label: "Statistics", icon: <IoStatsChart className="text-xl" /> },
  ];

  return (
    <>
      {/* Mobile overlay with click handler */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-40 sm:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}
      
      <div
        className={`bg-[#0a0a0a] border-r border-gray-800 text-[#cccccc] fixed top-0 left-0 h-full w-72 transition-all duration-300 ease-in-out ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } sm:translate-x-0 sm:w-20 flex flex-col z-50 overflow-hidden`}
      >
        {/* Mobile header with close button */}
        <div className="p-4 border-b border-gray-800 bg-[#0c0c0c] sm:hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Msnipe Dashboard</h2>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          {/* Search bar for mobile */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search tokens, pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white py-2.5 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00cc33] placeholder-gray-500"
            />
          </div>
        </div>

        {/* Desktop logo (hidden on mobile) */}
        <div className="hidden sm:flex items-center justify-center py-5 border-b border-gray-800">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8F00FF] to-blue-400 flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 sm:px-0">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block w-full">
                  <div className="flex items-center justify-start w-full p-3 rounded-xl hover:text-[#8F00FF] hover:bg-[#111111] cursor-pointer transition-all duration-200 group">
                    <div className="flex items-center justify-center w-8 h-8 sm:mx-auto">
                      {item.icon}
                    </div>
                    <span className="ml-3 font-medium sm:hidden">{item.label}</span>
                    <div className="ml-auto sm:hidden">
                      <span className="text-gray-600 text-sm group-hover:text-[#00cc33]">→</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom section for mobile */}
        {open && (
          <div className="p-4 border-t border-gray-800 bg-[#0c0c0c] sm:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Connected</p>
                <p className="text-[#00cc33] text-xs">Mainnet</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-[#00cc33] animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Desktop footer */}
        <div className="hidden sm:flex items-center justify-center py-4 border-t border-gray-800 mt-auto">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400 text-sm">?</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
