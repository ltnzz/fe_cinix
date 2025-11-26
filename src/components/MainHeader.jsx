import React from "react";
import { Home, Star, List, User, MapPin, LogOut } from "lucide-react";

export default function MainHeader({ onNavigateHome, onNavigateLogin, onNavigateTickets, onNavigateWishlist, user, onLogoutClick }) {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-[#f5f1dc] shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onNavigateHome}>
          <div className="text-4xl font-black text-[#2a4c44] tracking-wider mt-2">CINIX</div>
        </div>
        <div className="hidden md:flex items-center gap-1 ml-6 bg-[#e6ddba] px-4 py-1.5 rounded-full text-sm text-[#2a4c44] font-bold shadow-sm">
          <MapPin size={18} /><span>Jabodetabek</span>
        </div>
      </div>
      <div className="flex items-center gap-8 text-[#2a4c44] font-bold text-base">
        <button onClick={onNavigateHome} className="flex items-center gap-2 hover:text-amber-600 transition hover:scale-105"><Home size={22} /><span className="hidden md:inline">Home</span></button>
        <button onClick={onNavigateTickets} className="flex items-center gap-2 hover:text-amber-600 transition hover:scale-105"><List size={22} /><span className="hidden md:inline">Tickets</span></button>
        <button onClick={onNavigateWishlist} className="flex items-center gap-2 hover:text-amber-600 transition hover:scale-105" > <Star size={22} /><span className="hidden md:inline">Wishlist</span> </button>
        
        <div className="ml-2 border-l-2 border-gray-300 pl-8">
          {user ? (
            <div className="flex items-center gap-4 group relative cursor-pointer">
              <div className="text-right hidden md:block leading-tight">
                <p className="text-[11px] text-gray-500 uppercase font-extrabold">Welcome,</p>
                <p className="font-black text-[#2a4c44] text-base truncate max-w-[120px]">{user.name}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-tr from-[#2a4c44] to-[#3a6a5e] text-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-amber-400/50 transition-all border-2 border-white"><User size={24} /></div>
              <div className="absolute top-12 right-0 pt-4 hidden group-hover:block">
                <button onClick={onLogoutClick} className="bg-white shadow-xl border border-gray-200 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 text-sm font-bold w-40 flex items-center gap-2 transition"><LogOut size={18} /><span>Logout</span></button>
              </div>
            </div>
          ) : (
            <button onClick={onNavigateLogin} className="flex items-center gap-2 bg-gradient-to-r from-[#2a4c44] to-[#1e3630] text-white px-7 py-3 rounded-full hover:shadow-lg hover:from-[#3a6a5e] transition-all font-bold shadow-md transform hover:-translate-y-0.5"><User size={20} /><span>Login</span></button>
          )}
        </div>
      </div>
    </header>
  );
}