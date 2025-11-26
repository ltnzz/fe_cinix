import React from "react";
import { Home, Star, List, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TicketHeader({ onNavigateHome, user }) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-[#f5f1dc] shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={onNavigateHome}>
          <div className="text-4xl font-black text-[#2a4c44] tracking-wider mt-2">CINIX</div>
        </div>
      </div>

      <div className="flex items-center gap-8 text-[#2a4c44] font-bold text-base">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:text-amber-600 transition hover:scale-105"><Home size={22} /><span className="hidden md:inline">Home</span></button>
        <button className="flex items-center gap-2 hover:text-amber-600 transition hover:scale-105"><Star size={22} /><span className="hidden md:inline">Wishlist</span></button>
        {/* Tombol Tickets Aktif */}
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-amber-600 font-extrabold cursor-pointer"><List size={22} /><span className="hidden md:inline">Tickets</span></button>
        
        {user ? (
           <div className="w-10 h-10 bg-gradient-to-tr from-[#2a4c44] to-[#3a6a5e] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <User size={20} />
           </div>
        ) : (
           <button onClick={() => navigate('/login')} className="bg-[#2a4c44] text-white px-6 py-2 rounded-full text-sm">Login</button>
        )}
      </div>
    </header>
  );
}