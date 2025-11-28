import React, { useState, useEffect } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://cinix-be.vercel.app";

// --- SEAT COMPONENT ---
const Seat = ({ seat, isSelected, onClick }) => {
  const className = seat.is_available
    ? isSelected
      ? "bg-[#6a8e7f] text-white shadow-md scale-105"
      : "bg-white text-[#2a4c44] hover:bg-[#6a8e7f]/20 border border-gray-300"
    : "bg-gray-300 text-gray-400 cursor-not-allowed";

  return (
    <button
      onClick={() => seat.is_available && onClick(seat.seat_number)}
      disabled={!seat.is_available}
      className={`w-8 h-8 md:w-10 md:h-10 rounded text-sm md:text-base font-bold transition ${className}`}
    >
      {seat.seat_number}
    </button>
  );
};

// --- LEGEND ---
const Legend = () => (
  <div className="flex gap-4 mt-6">
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
      <span className="text-sm text-[#2a4c44]">Tersedia</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 bg-[#6a8e7f] rounded"></div>
      <span className="text-sm text-[#2a4c44]">Dipilih</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 bg-gray-300 rounded"></div>
      <span className="text-sm text-[#2a4c44]">Terisi</span>
    </div>
  </div>
);

export default function BookingPage({ movie, cinema, time, userId }) {
  const navigate = useNavigate();
  const { studioId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const ticketPrice = 50000;

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/studios/${studioId}/seats`);
        setSeats(res.data); // pastikan backend kirim array of seats
      } catch (err) {
        console.error("Failed to fetch seats:", err);
      }
    };
    fetchSeats();
  }, [studioId]);

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handlePayment = async () => {
    if (!selectedSeats.length) return alert("Pilih kursi dulu!");

    setLoading(true);
    try {
      const payload = {
        schedule_id: studioId, // backend nanti sesuaikan
        seats: selectedSeats,
        user_id: userId,
        amount: ticketPrice * selectedSeats.length,
      };

      const res = await axios.post(`${API_BASE_URL}/payment`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      const redirectUrl =
        res.data.snap?.redirect_url || res.data.payment?.midtrans_response?.redirect_url;

      if (!redirectUrl) return alert("Gagal mendapatkan link pembayaran");

      window.location.href = redirectUrl;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal memproses pembayaran");
    } finally {
      setLoading(false);
    }
  };

  // --- Layout per row (ambil dari seats backend) ---
  const rows = Array.from(new Set(seats.map((s) => s.seat_number[0]))).sort(); // ambil huruf row
  const seatsByRow = rows.map((row) =>
    seats.filter((s) => s.seat_number.startsWith(row)).sort((a, b) =>
      parseInt(a.seat_number.slice(1)) - parseInt(b.seat_number.slice(1))
    )
  );

  return (
    <div className="min-h-screen bg-[#f5f1dc] font-sans p-4">
      <header className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ChevronLeft size={24} />
          Kembali
        </button>
        <h1 className="font-bold text-xl">{movie?.title || "Movie Title"}</h1>
      </header>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="w-full max-w-xl mb-6 relative">
          <div className="h-2 bg-gray-400 rounded-full w-full shadow-inner"></div>
          <p className="text-center text-gray-500 text-xs mt-2 tracking-[0.3em]">LAYAR BIOSKOP</p>
        </div>

        <div className="flex flex-col gap-2">
          {seatsByRow.map((rowSeats, i) => (
            <div key={i} className="flex justify-center gap-2">
              {rowSeats.map((seat) => (
                <Seat
                  key={seat.id_seat}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.seat_number)}
                  onClick={toggleSeat}
                />
              ))}
            </div>
          ))}
        </div>

        <Legend />

        <div className="mt-6 w-full max-w-xl bg-white p-4 rounded-2xl shadow-lg">
          <p>
            Kursi Dipilih: {selectedSeats.length ? selectedSeats.join(", ") : "-"}
          </p>
          <p>Harga: Rp {ticketPrice.toLocaleString("id-ID")}/kursi</p>
          <p className="font-bold text-lg mt-2">
            Total: Rp {(ticketPrice * selectedSeats.length).toLocaleString("id-ID")}
          </p>

          <button
            onClick={handlePayment}
            disabled={!selectedSeats.length || loading}
            className="w-full mt-4 py-3 bg-[#2a4c44] text-white rounded-xl font-bold hover:bg-[#1e3630] disabled:bg-gray-300"
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
