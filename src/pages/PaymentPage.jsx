import React, { useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, ShieldCheck, Loader2, QrCode, Wallet, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- HELPER FORMAT RUPIAH ---
const formatIDR = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// --- COMPONENTS KECIL ---

const PaymentHeader = ({ onBack }) => (
  <div className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
      <ArrowLeft className="text-[#2a4c44]" />
    </button>
    <h1 className="text-xl font-bold text-[#2a4c44]">Ringkasan Pembayaran</h1>
  </div>
);

const MovieSummaryCard = ({ movie, cinema, time, quantity, seats }) => (
  <div className="bg-white rounded-3xl p-6 shadow-lg mb-6 flex gap-6 items-start animate-in slide-in-from-bottom-2">
    <img 
      src={movie.poster_url || movie.img} 
      alt={movie.title} 
      className="w-24 h-36 object-cover rounded-xl shadow-md bg-gray-200"
      onError={(e) => {e.target.onerror = null; e.target.src = "https://via.placeholder.com/150";}}
    />
    <div className="flex-1">
      <h2 className="text-2xl font-black text-[#2a4c44] mb-2 leading-tight">{movie.title}</h2>
      <div className="flex flex-col gap-2 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-2"><MapPin size={16} className="text-amber-500"/> {cinema}</div>
        <div className="flex items-center gap-2"><Calendar size={16} className="text-amber-500"/> {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <div className="flex items-center gap-2"><Clock size={16} className="text-amber-500"/> {time}</div>
        <div className="flex items-center gap-2"><Ticket size={16} className="text-amber-500"/> {quantity} Tiket ({seats.join(", ")})</div>
      </div>
    </div>
  </div>
);

const PaymentMethodItem = ({ id, name, iconUrl, isSelected, onClick }) => {
  return (
    <div 
      onClick={() => onClick(id)}
      className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200 ${
        isSelected 
        ? "border-amber-500 bg-amber-50 shadow-md transform scale-[1.01]" 
        : "border-gray-100 hover:border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-10 rounded-lg flex items-center justify-center border border-gray-100 bg-white p-1 shadow-sm overflow-hidden">
           {iconUrl ? (
             <img 
                src={iconUrl} 
                alt={name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                    e.target.style.display = 'none'; 
                    e.target.nextSibling.style.display = 'block'; 
                }}
             />
           ) : null}
           <div style={{ display: iconUrl ? 'none' : 'block' }}>
               {id === 'qris' ? <QrCode className="text-gray-600" /> : <Wallet className="text-blue-500" />}
           </div>
        </div>
        <span className="font-bold text-gray-700 text-lg">{name}</span>
      </div>
      
      {isSelected && (
        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-sm">
          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

const PriceSummary = ({ pricePerTicket, quantity, adminFee, totalAmount }) => (
  <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">
    <h3 className="font-bold text-[#2a4c44] mb-4 text-lg">Rincian Biaya</h3>
    <div className="space-y-3 text-sm font-medium">
      <div className="flex justify-between text-gray-500">
        <span>Tiket ({quantity}x)</span>
        <span>{formatIDR(pricePerTicket * quantity)}</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Biaya Layanan</span>
        <span>{formatIDR(adminFee)}</span>
      </div>
      <div className="border-t border-dashed border-gray-300 my-3 pt-4 flex justify-between items-center">
        <span className="font-bold text-[#2a4c44] text-lg">Total Bayar</span>
        <span className="font-black text-amber-600 text-xl">{formatIDR(totalAmount)}</span>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function PaymentPage({ onNavigateHome, movie, cinema, time, user, quantity, seats }) {
  console.log("DATA USER DI PAYMENT:", user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("qris");
  
  // STATE BARU: Untuk Modal Sukses
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const pricePerTicket = 50000;
  const adminFee = 3000;
  const totalAmount = (pricePerTicket * (quantity || 1)) + adminFee;

  const methods = [
    { id: "qris", name: "QRIS", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Commons_QR_code.png/600px-Commons_QR_code.png" },
    { id: "dana", name: "DANA", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/1200px-Logo_dana_blue.svg.png" },
    { id: "gopay", name: "GoPay", icon: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" }
  ];

  const handlePayment = async () => {
    setLoading(true);
    try {
      const payload = {
        id: Date.now(), 
        user_id: user?.id || "guest",
        movie_title: movie.title,
        movie_poster: movie.poster_url || movie.img,
        cinema_name: cinema,
        showtime: time,
        seats: seats, 
        quantity: quantity,
        total_amount: totalAmount,
        booking_date: new Date().toISOString(),
        status: "Lunas"
      };

      // Simulasi delay (API Call)
      await new Promise(r => setTimeout(r, 1500)); 

     if (user && user.id) {
          const storageKey = `tickets_${user.id}`;
          
          const existingTickets = JSON.parse(localStorage.getItem(storageKey) || "[]");
          const updatedTickets = [payload, ...existingTickets]; 
          
          localStorage.setItem(storageKey, JSON.stringify(updatedTickets));
      } else {
          console.warn("User ID tidak ditemukan, tiket tidak tersimpan permanen.");
      }
      setLoading(false); 
      setShowSuccessModal(true); 
      setTimeout(() => {
         navigate('/mytickets');
      }, 2500);

    } catch (error) {
      console.error("Gagal Bayar:", error);
      alert("Gagal memproses pembayaran.");
      setLoading(false);
    }
  };

  if (!movie) return <div className="p-10 text-center">Data tidak ditemukan. <button onClick={onNavigateHome}>Home</button></div>;

  return (
    <div className="min-h-screen bg-[#f5f1dc] font-sans pb-20 relative">
      <PaymentHeader onBack={() => navigate(-1)} />

      {/* --- MODAL POP UP SUKSES --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
            
            {/* Efek Confetti Background (Simple CSS) */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>

            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce">
                <CheckCircle className="text-green-600 w-12 h-12" strokeWidth={3} />
            </div>
            
            <h2 className="text-2xl font-black text-[#2a4c44] mb-2">Pembayaran Berhasil!</h2>
            <p className="text-gray-500 mb-6 font-medium">Tiket kamu sudah aman. Siapkan popcorn dan selamat menonton!</p>
            
            <div className="flex items-center gap-2 text-sm font-bold text-amber-500 bg-amber-50 px-4 py-2 rounded-full animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                Mengalihkan ke Tiket Saya...
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-8">
        <MovieSummaryCard movie={movie} cinema={cinema} time={time} quantity={quantity} seats={seats} />
        
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
           <h3 className="font-bold text-[#2a4c44] mb-4">Metode Pembayaran</h3>
           <div className="space-y-3">
               {methods.map((method) => (
                   <PaymentMethodItem 
                        key={method.id}
                        id={method.id}
                        name={method.name}
                        iconUrl={method.icon}
                        isSelected={paymentMethod === method.id}
                        onClick={setPaymentMethod}
                   />
               ))}
           </div>
        </div>

        <PriceSummary pricePerTicket={pricePerTicket} quantity={quantity} adminFee={adminFee} totalAmount={totalAmount} />

        <button 
          onClick={handlePayment}
          disabled={loading || showSuccessModal} // Disable kalau lagi loading atau modal muncul
          className="w-full bg-[#2a4c44] text-white py-4 rounded-full font-bold text-lg hover:bg-[#1e3630] transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <><Loader2 className="animate-spin" /> Memproses...</> : <><ShieldCheck /> Bayar Sekarang</>}
        </button>
      </div>
    </div>
  );
}