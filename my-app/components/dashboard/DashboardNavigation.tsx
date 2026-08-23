"use client";

import { Search, Bell, CircleHelp } from "lucide-react";
import Image from "next/image";

export default function DashboardNavigation() {
  return (
    <nav className="flex items-center justify-between w-full h-16 px-6 bg-white border-b border-gray-200">
      {/* Left Side: Search Bar */}
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full py-2 pl-10 pr-3 text-sm text-gray-700 bg-slate-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
          placeholder="Search..."
        />
      </div>

      {/* Right Side: Icons & Avatar */}
      <div className="flex items-center gap-5">
        {/* Notification Icon */}
        <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          <Bell className="w-6 h-6" />
        </button>

        {/* Help Icon */}
        <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          <CircleHelp className="w-6 h-6" />
        </button>

        {/* User Avatar */}
        <button className="relative w-9 h-9 overflow-hidden rounded-full border border-gray-200 cursor-pointer ml-2">
          {/* এখানে আমি একটি ডেমো ইমেজ লিংক দিয়েছি। তুমি চাইলে তোমার প্রোজেক্টের আসল ইমেজ ব্যবহার করতে পারো */}
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
            alt="User Profile"
            className="object-cover w-full h-full"
          />
        </button>
      </div>
    </nav>
  );
}
