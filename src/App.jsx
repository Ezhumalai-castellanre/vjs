import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  User, 
  Trash2, 
  XCircle,
  Clock,
  LogOut,
  ChevronDown,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  setMonth,
  setYear,
  getYear,
  isBefore,
  startOfDay
} from 'date-fns';

// --- MongoDB API Configuration ---
// Production Railway backend URL (fallback if VITE_API_URL not set)
const PRODUCTION_API_URL = 'https://vjs-production.up.railway.app/api';

const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  const isProduction = import.meta.env.PROD || 
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
  
  // Log environment info for debugging
  if (isProduction) {
    console.log('🌐 Production mode detected');
    console.log('📍 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'unknown');
  }
  
  // If no URL is provided
  if (!url || url.trim() === '') {
    if (isProduction) {
      // Use Railway backend as default in production
      console.log('🔧 Using default Railway backend:', PRODUCTION_API_URL);
      console.log('💡 Tip: Set VITE_API_URL in Vercel for custom backend URL');
      return PRODUCTION_API_URL;
    } else {
      // Development fallback
      console.log('🔧 Development mode: Using localhost:5000');
      return 'http://localhost:5000/api';
    }
  }
  
  // Trim whitespace
  const cleanUrl = url.trim();
  
  // Validate: must be absolute URL (starts with http:// or https://)
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    console.error('❌ VITE_API_URL must be an absolute URL (starting with http:// or https://)');
    console.error('❌ Current value:', cleanUrl);
    console.error('❌ This will cause requests to go to Vercel instead of Railway backend');
    if (isProduction) {
      return null; // Don't use invalid URL in production
    }
    return cleanUrl; // Allow in dev for testing
  }
  
  // Block localhost in production
  if (isProduction && (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1'))) {
    console.error('❌ VITE_API_URL cannot use localhost in production!');
    console.error('❌ Current value:', cleanUrl);
    console.error('❌ Set it to your Railway backend URL: https://your-backend.railway.app/api');
    return null;
  }
  
  // If pointing to Vercel domain, fall back to Railway backend
  if (isProduction && (cleanUrl.includes('vercel.app') || cleanUrl.includes('vjs-gamma'))) {
    console.warn('⚠️ VITE_API_URL is pointing to Vercel domain!');
    console.warn('⚠️ Falling back to Railway backend:', PRODUCTION_API_URL);
    console.warn('💡 Update VITE_API_URL in Vercel to: https://vjs-production.up.railway.app/api');
    return PRODUCTION_API_URL; // Use Railway backend instead
  }
  
  console.log('✅ API URL configured:', cleanUrl);
  return cleanUrl;
};

const API_URL = getApiUrl();

const ADMIN_PIN = "1234";
const MAX_EVENTS = 2; 
const TIME_SLOTS = ["Morning", "Afternoon", "Evening", "All Day"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function App() {
  const [viewMode, setViewMode] = useState('landing');
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all bookings from MongoDB API
  const fetchBookings = async () => {
    if (!API_URL) {
      console.error("❌ API_URL not configured. Please set VITE_API_URL in Vercel environment variables.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/bookings`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setEvents(data);
      setLoading(false);
      console.log('📅 Loaded bookings from MongoDB:', Object.keys(data).length, 'dates');
    } catch (error) {
      console.error("❌ Database Error:", error);
      
      // Check if we got HTML instead of JSON (common when API URL is wrong)
      if (error.message && error.message.includes("Unexpected token '<'")) {
        console.error("❌ Received HTML instead of JSON. This usually means:");
        console.error("   1. VITE_API_URL is pointing to Vercel instead of Railway");
        console.error("   2. VITE_API_URL is set to a relative path like '/api'");
        console.error("   3. Backend is not deployed or URL is incorrect");
        console.error("   Current API_URL:", API_URL);
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // Poll for updates every 5 seconds (simulating real-time)
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveEvent = async (dateStr, updatedEvents) => {
    if (!API_URL) {
      alert("❌ API not configured. Please set VITE_API_URL environment variable in Vercel.\n\nGo to: Vercel Dashboard → Your Project → Settings → Environment Variables\nAdd: VITE_API_URL = https://your-backend.railway.app/api");
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/bookings/${dateStr}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookings: updatedEvents }),
      });

      if (!response.ok) throw new Error('Failed to save booking');
      
      const result = await response.json();
      console.log('💾 Saved bookings to MongoDB:', result);
      
      // Refresh bookings to get latest data
      await fetchBookings();
    } catch (err) {
      console.error("❌ Save failed:", err);
      
      let errorMessage = "Failed to save booking.";
      
      if (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = "❌ Cannot connect to backend API.\n\nPlease ensure:\n1. Backend is deployed (Railway)\n2. VITE_API_URL is set in Vercel\n3. Backend URL is correct and includes /api";
      } else if (err.message.includes('405') || err.message.includes('Method Not Allowed')) {
        errorMessage = "❌ API endpoint error (405).\n\nThis usually means:\n1. VITE_API_URL is pointing to Vercel instead of Railway\n2. VITE_API_URL might be set to '/api' (relative path)\n\nFix: Set VITE_API_URL to your Railway URL:\nhttps://your-backend.railway.app/api";
      } else if (err.message && err.message.includes("Unexpected token '<'")) {
        errorMessage = "❌ Received HTML instead of JSON.\n\nVITE_API_URL is likely incorrect:\n- Should be: https://your-backend.railway.app/api\n- Not: /api or https://vjs-gamma.vercel.app/api\n\nCheck Vercel environment variables.";
      }
      
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FCF9F2]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#800000] font-bold text-xs uppercase tracking-widest">Opening VJK Mahal...</p>
        </div>
      </div>
    );
  }

  // Show error if API_URL is not configured in production
  if (!API_URL && import.meta.env.PROD) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FCF9F2] p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl border-4 border-[#D4AF37]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#800000] rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#800000] mb-2">Configuration Error</h2>
            <p className="text-slate-600 mb-6">API endpoint is not configured for production.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl mb-6">
            <h3 className="font-bold text-[#800000] mb-3 uppercase text-sm tracking-wider">How to Fix:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
              <li>Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Vercel Dashboard</a></li>
              <li>Select your project: <code className="bg-slate-200 px-2 py-1 rounded">vjs</code></li>
              <li>Go to <strong>Settings</strong> → <strong>Environment Variables</strong></li>
              <li>Add new variable:
                <div className="bg-white p-3 rounded mt-2 font-mono text-xs">
                  <div><strong>Name:</strong> VITE_API_URL</div>
                  <div><strong>Value:</strong> https://your-backend.railway.app/api</div>
                </div>
              </li>
              <li>Click <strong>Redeploy</strong> in the Deployments tab</li>
            </ol>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
            <p className="text-xs text-amber-800 mb-2">
              <strong>⚠️ Common Mistakes:</strong>
            </p>
            <ul className="text-xs text-amber-800 list-disc list-inside space-y-1">
              <li>❌ Don't use: <code>/api</code> (relative path)</li>
              <li>❌ Don't use: <code>https://vjs-gamma.vercel.app/api</code> (Vercel domain)</li>
              <li>✅ Use: <code>https://your-app.up.railway.app/api</code> (Railway backend)</li>
            </ul>
            <p className="text-xs text-amber-800 mt-2">
              <strong>Note:</strong> Replace with your actual Railway backend URL and include <code>/api</code> at the end.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2] text-slate-800 font-sans overflow-x-hidden">
      {viewMode === 'landing' && <LandingScreen onSelectMode={setViewMode} />}
      {viewMode !== 'landing' && (
        <CalendarManager 
          mode={viewMode} 
          events={events} 
          onSave={handleSaveEvent} 
          onExit={() => setViewMode('landing')}
        />
      )}
    </div>
  );
}

function LandingScreen({ onSelectMode }) {
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) onSelectMode('admin');
    else { setError('Incorrect PIN'); setPin(''); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-3 sm:p-4 md:p-6 bg-[#800000] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full border-8 sm:border-[15px] border-[#D4AF37]"></div>
        <div className="absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full border-8 sm:border-[15px] border-[#D4AF37]"></div>
      </div>

      <div className="bg-white p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl max-w-[90vw] sm:max-w-sm md:max-w-md w-full text-center relative z-10 border-b-6 sm:border-b-8 border-[#D4AF37] animate-in fade-in zoom-in duration-500">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#D4AF37]">
             <span className="text-[#800000] font-serif text-3xl sm:text-4xl md:text-5xl font-bold italic">VJK</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#800000] mb-1 tracking-tight">VJK Mahal</h1>
        <p className="text-xs sm:text-sm md:text-base font-medium text-slate-500 mb-8 sm:mb-10 italic">Event Booking System</p>

        {!showPinInput ? (
          <div className="space-y-3 sm:space-y-4">
            <button 
              onClick={() => onSelectMode('customer')} 
              className="w-full flex items-center justify-center p-3.5 sm:p-4 md:p-5 bg-[#FDFBF4] text-[#800000] rounded-xl sm:rounded-2xl md:rounded-[2rem] hover:bg-[#F2E4B8] active:bg-[#F2E4B8] transition-all font-bold text-sm sm:text-base border-2 border-[#D4AF37]/30 shadow-sm active:scale-95 touch-manipulation"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" /> Check Availability
            </button>
            <button 
              onClick={() => setShowPinInput(true)} 
              className="w-full flex items-center justify-center p-3.5 sm:p-4 md:p-5 bg-[#800000] text-white rounded-xl sm:rounded-2xl md:rounded-[2rem] hover:bg-black active:bg-black transition-all font-bold text-sm sm:text-base shadow-xl active:scale-95 touch-manipulation"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" /> Management Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-3 sm:space-y-4">
            <input 
              type="password" 
              value={pin} 
              inputMode="numeric"
              pattern="[0-9]*"
              onChange={(e) => { setPin(e.target.value); setError(''); }} 
              className="w-full p-3 sm:p-4 border-2 border-slate-100 bg-slate-50 rounded-xl sm:rounded-2xl text-center text-xl sm:text-2xl tracking-[0.3em] sm:tracking-[0.5em] focus:ring-4 focus:ring-[#D4AF37]/20 focus:outline-none" 
              placeholder="****" 
              maxLength="4"
              autoFocus 
            />
            {error && <p className="text-[#800000] font-bold text-[9px] sm:text-[10px] uppercase">{error}</p>}
            <div className="flex gap-2 sm:gap-3">
              <button type="button" onClick={() => setShowPinInput(false)} className="flex-1 p-3 sm:p-4 text-slate-400 font-bold text-xs sm:text-sm">Back</button>
              <button type="submit" className="flex-1 p-3 sm:p-4 bg-[#D4AF37] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-lg active:scale-95">Login</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CalendarManager({ mode, events, onSave, onExit }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ 
    start: startOfWeek(monthStart), 
    end: endOfWeek(endOfMonth(monthStart)) 
  });

  const years = useMemo(() => {
    const y = [];
    const base = getYear(new Date());
    for (let i = base; i <= base + 5; i++) y.push(i);
    return y;
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-3 md:p-6 lg:p-8 pb-4 sm:pb-6">
      <header className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] shadow-xl border-b-2 sm:border-b-4 border-[#D4AF37]">
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#800000] rounded-lg sm:rounded-xl flex items-center justify-center text-white font-serif font-bold text-lg sm:text-xl flex-shrink-0">V</div>
           <div className="flex-1 min-w-0">
             <h2 className="text-base sm:text-lg md:text-xl font-serif font-bold text-[#800000] truncate">VJK Mahal</h2>
             <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider sm:tracking-widest">Availability View</p>
           </div>
           <button onClick={onExit} className="ml-auto md:hidden p-2 text-rose-500 hover:bg-rose-50 rounded-lg active:scale-95 flex-shrink-0 touch-manipulation">
             <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
           </button>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-slate-100 rounded-lg sm:rounded-xl p-1 flex-1 md:flex-none min-w-0">
            <button 
              onClick={() => setCurrentDate(subMonths(currentDate, 1))} 
              className="p-1.5 sm:p-2 hover:bg-white rounded-lg active:scale-95 flex-shrink-0 touch-manipulation"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="flex-1 text-center py-1.5 sm:py-2 px-2 font-bold text-[#800000] text-xs sm:text-sm whitespace-nowrap min-w-[100px] sm:min-w-[120px]">
              {format(currentDate, 'MMM yyyy')}
            </span>
            <button 
              onClick={() => setCurrentDate(addMonths(currentDate, 1))} 
              className="p-1.5 sm:p-2 hover:bg-white rounded-lg active:scale-95 flex-shrink-0 touch-manipulation"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <button 
            onClick={onExit} 
            className="hidden md:block p-2.5 sm:p-3 bg-rose-50 text-rose-600 rounded-lg sm:rounded-xl hover:bg-rose-100 active:scale-95 flex-shrink-0 touch-manipulation"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="bg-slate-50 p-2 sm:p-3 text-center text-[9px] sm:text-[10px] font-black text-[#800000]/40 uppercase">
            {d}
          </div>
        ))}
        {calendarDays.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayEvents = events[dateStr] || [];
          const isSameMonthDate = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);
          const isAvailable = dayEvents.length === 0;
          const isFull = dayEvents.length >= MAX_EVENTS;
          const isPastDate = isBefore(startOfDay(day), startOfDay(new Date()));
          const hasBookings = dayEvents.length > 0;
          // Allow clicking if it's in the current month AND (has bookings OR is not a past date)
          const isClickable = isSameMonthDate && (hasBookings || !isPastDate);

          return (
            <div 
              key={dateStr} 
              onClick={() => isClickable && setSelectedDate(day)} 
              className={`
                min-h-[75px] sm:min-h-[90px] md:min-h-[120px] lg:min-h-[140px] p-1.5 sm:p-2 transition-all relative border border-transparent touch-manipulation
                ${!isSameMonthDate ? 'bg-slate-50 opacity-20' : 
                  isPastDate && !hasBookings ? 'bg-slate-100 opacity-30 cursor-not-allowed' :
                  isPastDate && hasBookings ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer opacity-70' :
                  isAvailable ? 'bg-emerald-50/50 active:bg-emerald-100/50 cursor-pointer' :
                  isFull ? 'bg-rose-50/50 active:bg-rose-100/50 cursor-pointer' :
                  'bg-yellow-50/70 active:bg-yellow-100/70 cursor-pointer'}
                ${isTodayDate ? 'ring-1 sm:ring-2 ring-inset ring-[#800000]/20' : ''}
              `}
            >
              <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                <span className={`
                  text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-md sm:rounded-lg 
                  ${isTodayDate ? 'bg-[#800000] text-white shadow-md' : 
                    isPastDate && isSameMonthDate && !hasBookings ? 'text-slate-300' :
                    isPastDate && isSameMonthDate && hasBookings ? 'text-slate-500' :
                    isAvailable && isSameMonthDate ? 'text-emerald-700 font-black' :
                    isFull && isSameMonthDate ? 'text-rose-700 font-black' :
                    isSameMonthDate ? 'text-yellow-700 font-black' :
                    'text-slate-500'}
                `}>
                  {format(day, 'd')}
                </span>
                {isSameMonthDate && (
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                    isPastDate && hasBookings ? 'bg-slate-400' :
                    isPastDate ? 'opacity-0' :
                    isAvailable ? 'bg-emerald-400' : 
                    isFull ? 'bg-rose-500' : 
                    'bg-yellow-500'
                  }`} />
                )}
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                {isSameMonthDate && isPastDate && hasBookings && dayEvents.map((e, i) => (
                  <div key={i} className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] p-0.5 sm:p-1 rounded border truncate font-bold leading-tight bg-slate-200 text-slate-600 border-slate-300">
                    {e.slot}
                  </div>
                ))}
                {isSameMonthDate && !isPastDate && dayEvents.map((e, i) => (
                  <div key={i} className={`text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] p-0.5 sm:p-1 rounded border truncate font-bold leading-tight ${isFull ? 'bg-rose-600 text-white border-transparent' : 'bg-yellow-100 text-yellow-800 border-yellow-300'}`}>
                    {e.slot}
                  </div>
                ))}
                {isSameMonthDate && isPastDate && !hasBookings && (
                  <div className="hidden md:block text-[7px] sm:text-[8px] text-slate-400 font-bold uppercase tracking-tighter opacity-40 mt-1 sm:mt-2">
                    Past
                  </div>
                )}
                {isSameMonthDate && !isPastDate && isAvailable && (
                  <div className="hidden sm:hidden md:block text-[7px] sm:text-[8px] text-emerald-600 font-bold uppercase tracking-tighter opacity-40 mt-1 sm:mt-2">
                    Available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 md:p-6 bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-md bg-emerald-50 border border-emerald-200 flex-shrink-0"></div> 
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-emerald-700 uppercase tracking-wider sm:tracking-widest">Available</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-md bg-yellow-100 border border-yellow-300 shadow-sm flex-shrink-0"></div> 
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-yellow-700 uppercase tracking-wider sm:tracking-widest">Partial</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-md bg-rose-600 flex-shrink-0"></div> 
          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-rose-700 uppercase tracking-wider sm:tracking-widest">Full</span>
        </div>
      </div>
      
      <p className="text-center mt-6 sm:mt-8 md:mt-12 text-[7px] sm:text-[8px] md:text-[9px] font-black text-[#800000]/30 uppercase tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] px-2">VJK Mahal Digital Ledger</p>

      {selectedDate && (
        <DayModal 
          date={selectedDate} 
          events={events[format(selectedDate, 'yyyy-MM-dd')] || []} 
          mode={mode} 
          onClose={() => setSelectedDate(null)} 
          onSave={onSave} 
        />
      )}
    </div>
  );
}

function DayModal({ date, events, mode, onClose, onSave }) {
  const [localEvents, setLocalEvents] = useState([...events]);
  const [form, setForm] = useState({ 
    name: '', 
    slot: 'Morning',
    customerName: '',
    phone: '',
    price: '',
    advance: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Check if the selected date is in the past
  const isPastDate = isBefore(startOfDay(date), startOfDay(new Date()));
  const isToday = startOfDay(date).getTime() === startOfDay(new Date()).getTime();

  // Calculate pending amount automatically
  const calculatePending = (price, advance) => {
    const priceNum = parseFloat(price) || 0;
    const advanceNum = parseFloat(advance) || 0;
    return Math.max(0, priceNum - advanceNum); // Prevent negative pending
  };

  const add = () => {
    if (!form.name.trim() || !form.customerName.trim() || localEvents.length >= MAX_EVENTS) return;
    
    const price = parseFloat(form.price) || 0;
    const advance = parseFloat(form.advance) || 0;
    
    const newEvent = { 
      ...form, 
      id: Date.now().toString(),
      price: price,
      advance: advance,
      pending: calculatePending(price, advance),
      createdAt: new Date().toISOString()
    };
    
    setLocalEvents([...localEvents, newEvent]);
    resetForm();
  };

  const updateEvent = () => {
    if (!form.name.trim() || !form.customerName.trim()) return;
    
    const price = parseFloat(form.price) || 0;
    const advance = parseFloat(form.advance) || 0;
    
    const updatedEvent = {
      ...form,
      price: price,
      advance: advance,
      pending: calculatePending(price, advance),
      updatedAt: new Date().toISOString()
    };
    
    setLocalEvents(localEvents.map(e => e.id === editingId ? updatedEvent : e));
    resetForm();
    setEditingId(null);
  };

  const editEvent = (event) => {
    setForm({ 
      name: event.name,
      slot: event.slot,
      customerName: event.customerName || event.ownerName || '', // Support old data
      phone: event.phone,
      price: event.price.toString(),
      advance: event.advance.toString(),
      notes: event.notes || '',
      id: event.id
    });
    setEditingId(event.id);
  };

  const cancelEdit = () => {
    resetForm();
    setEditingId(null);
  };

  const resetForm = () => {
    setForm({ 
      name: '', 
      slot: 'Morning',
      customerName: '',
      phone: '',
      price: '',
      advance: '',
      notes: ''
    });
  };

  const remove = (id) => {
    setLocalEvents(localEvents.filter(e => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
      resetForm();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(format(date, 'yyyy-MM-dd'), localEvents);
    setIsSaving(false);
    onClose();
  };

  const isAvailable = localEvents.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-3 md:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl md:rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full duration-300 border-b-6 sm:border-b-8 md:border-b-[12px] border-[#D4AF37] max-h-[95vh] sm:max-h-[90vh] flex flex-col my-auto">
        <div className={`p-4 sm:p-5 md:p-6 lg:p-8 text-white flex justify-between items-center flex-shrink-0 ${
          isPastDate ? 'bg-slate-500' : isAvailable ? 'bg-emerald-600' : 'bg-[#800000]'
        }`}>
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold tracking-tight truncate">{format(date, 'EEEE')}</h3>
            <p className="opacity-80 text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest">
              {format(date, 'MMMM do, yyyy')}
              {isPastDate && ' • PAST DATE'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-white/20 active:bg-white/30 rounded-full transition-all flex-shrink-0 touch-manipulation">
            <XCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          </button>
        </div>
        
        <div className="p-4 sm:p-5 md:p-6 lg:p-8 overflow-y-auto flex-1">
          {isPastDate && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-100 border-2 border-slate-300 rounded-xl">
              <p className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{mode === 'admin' ? 'Past Date - View Only Mode (No editing or new bookings)' : 'Past Date - Booking Details'}</span>
              </p>
            </div>
          )}
          
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {localEvents.map(e => {
              // Calculate pending - support both old and new data structure
              const pending = e.pending !== undefined ? e.pending : (e.price || 0) - (e.advance || 0);
              const isPaidFull = pending <= 0;
              
              return (
                <div key={e.id} className={`bg-slate-50 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border-2 shadow-sm transition-all ${editingId === e.id ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20' : 'border-slate-100'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${localEvents.length >= MAX_EVENTS ? 'bg-[#800000] text-white' : 'bg-amber-100 text-amber-600'}`}>
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 sm:gap-2 mb-2 sm:mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-800 text-sm sm:text-base truncate">{e.name}</p>
                            <p className="text-[8px] sm:text-[9px] uppercase font-black text-[#D4AF37] tracking-wider">{e.slot}</p>
                          </div>
                          {mode === 'admin' && !isPastDate && (
                            <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                              <button 
                                onClick={() => editEvent(e)} 
                                className="text-blue-500 active:text-blue-700 p-1.5 sm:p-2 active:bg-blue-50 rounded-lg transition-all touch-manipulation"
                                title="Edit"
                              >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => remove(e.id)} 
                                className="text-rose-400 active:text-rose-600 p-1.5 sm:p-2 active:bg-rose-50 rounded-lg transition-all touch-manipulation"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          )}
                          {isPastDate && mode === 'admin' && (
                            <div className="text-[8px] sm:text-[9px] uppercase font-black text-slate-400 tracking-wider px-2">
                              View Only
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1.5 sm:space-y-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs flex-wrap">
                            <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="font-bold text-slate-700 truncate">{e.customerName || e.ownerName || 'N/A'}</span>
                            {e.phone && <span className="text-slate-400 truncate">• {e.phone}</span>}
                          </div>
                          
                          {mode === 'admin' && (
                            <>
                              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-2">
                                <div className="bg-white p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                                  <p className="text-[7px] sm:text-[8px] uppercase text-slate-400 font-black tracking-wider">Price</p>
                                  <p className="text-xs sm:text-sm font-black text-slate-700 truncate">₹{e.price?.toLocaleString() || 0}</p>
                                </div>
                                <div className="bg-white p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                                  <p className="text-[7px] sm:text-[8px] uppercase text-slate-400 font-black tracking-wider">Advance</p>
                                  <p className="text-xs sm:text-sm font-black text-blue-600 truncate">₹{e.advance?.toLocaleString() || 0}</p>
                                </div>
                                <div className="bg-white p-1.5 sm:p-2 rounded-md sm:rounded-lg">
                                  <p className="text-[7px] sm:text-[8px] uppercase text-amber-600 font-black tracking-wider">Pending</p>
                                  <p className="text-xs sm:text-sm font-black text-amber-700 truncate">₹{pending?.toLocaleString() || 0}</p>
                                </div>
                              </div>
                              
                              <div className={`p-2 rounded-lg mt-2 ${isPaidFull ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                                <p className={`text-[7px] sm:text-[8px] uppercase font-black tracking-wider mb-0.5 ${isPaidFull ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {isPaidFull ? 'FULLY PAID ✓' : 'PENDING AMOUNT'}
                                </p>
                                <p className={`text-base sm:text-lg font-black ${isPaidFull ? 'text-emerald-700' : 'text-amber-700'}`}>
                                  ₹{Math.abs(pending).toLocaleString()}
                                </p>
                              </div>
                              
                              {e.notes && (
                                <div className="bg-amber-50 p-2 rounded-lg mt-2">
                                  <p className="text-[7px] sm:text-[8px] uppercase text-amber-600 font-black tracking-wider">Notes</p>
                                  <p className="text-[11px] sm:text-xs text-amber-900 mt-0.5 break-words">{e.notes}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {isAvailable && (
              <div className="text-center py-8 sm:py-10 md:py-12 bg-emerald-50 rounded-2xl sm:rounded-[2.5rem] border-2 border-dashed border-emerald-100">
                <User className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 text-emerald-200" />
                <p className="text-[10px] sm:text-[11px] font-black uppercase text-emerald-600 tracking-[0.2em] sm:tracking-[0.3em] px-2">Date is Available</p>
              </div>
            )}
          </div>

          {mode === 'admin' && !isPastDate && (localEvents.length < MAX_EVENTS || editingId) && (
            <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-slate-100">
              {editingId && (
                <div className="bg-blue-50 border-2 border-blue-200 p-2.5 sm:p-3 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
                  <p className="text-[10px] sm:text-xs font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editing Booking
                  </p>
                </div>
              )}
              
              <div className="space-y-2.5 sm:space-y-3">
                <input 
                  type="text" 
                  placeholder="Event Name (e.g., Wedding)" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full p-3 sm:p-3.5 md:p-4 bg-slate-50 rounded-lg sm:rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#D4AF37] focus:bg-white transition-all" 
                />
                
                <input 
                  type="text" 
                  placeholder="Customer Name *" 
                  value={form.customerName} 
                  onChange={e => setForm({...form, customerName: e.target.value})} 
                  className="w-full p-3 sm:p-3.5 md:p-4 bg-slate-50 rounded-lg sm:rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#D4AF37] focus:bg-white transition-all" 
                />
                
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  inputMode="tel"
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})} 
                  className="w-full p-3 sm:p-3.5 md:p-4 bg-slate-50 rounded-lg sm:rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#D4AF37] focus:bg-white transition-all" 
                />
                
                <div className="relative">
                  <select 
                    value={form.slot} 
                    onChange={e => setForm({...form, slot: e.target.value})} 
                    className="w-full appearance-none p-3 sm:p-3.5 md:p-4 bg-slate-50 rounded-lg sm:rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#D4AF37] focus:bg-white"
                  >
                    {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3">
                  <div>
                    <label className="text-[8px] sm:text-[9px] uppercase font-black text-slate-400 tracking-wider mb-1 block">Total Price</label>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      placeholder="0" 
                      value={form.price} 
                      onChange={e => setForm({...form, price: e.target.value})} 
                      className="w-full p-2.5 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#D4AF37] focus:bg-white transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-[8px] sm:text-[9px] uppercase font-black text-blue-600 tracking-wider mb-1 block">Advance Paid</label>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      placeholder="0" 
                      value={form.advance} 
                      onChange={e => setForm({...form, advance: e.target.value})} 
                      className="w-full p-2.5 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-blue-400 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
                
                {(form.price || form.advance) && (
                  <div className="bg-amber-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-amber-200">
                    <div className="flex items-center justify-between">
                      <p className="text-[8px] sm:text-[9px] uppercase font-black text-amber-600 tracking-wider">Pending Amount</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-black text-amber-700">
                        ₹{calculatePending(form.price, form.advance).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[8px] text-amber-600 mt-1">Auto-calculated: Price - Advance</p>
                  </div>
                )}
                
                <textarea 
                  placeholder="Notes (optional)" 
                  value={form.notes} 
                  onChange={e => setForm({...form, notes: e.target.value})} 
                  rows="2"
                  className="w-full p-3 sm:p-3.5 md:p-4 bg-slate-50 rounded-lg sm:rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#D4AF37] focus:bg-white transition-all resize-none" 
                />
              </div>
              
              <div className="flex gap-2 sm:gap-3 pt-2">
                {editingId ? (
                  <>
                    <button 
                      onClick={cancelEdit} 
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-200 text-slate-600 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest active:scale-95 transition-all touch-manipulation"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={updateEvent} 
                      disabled={!form.name.trim() || !form.customerName.trim()} 
                      className="flex-[2] px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest disabled:opacity-20 active:scale-95 transition-all shadow-lg touch-manipulation"
                    >
                      Update
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={add} 
                    disabled={!form.name.trim() || !form.customerName.trim()} 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#800000] text-white rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest disabled:opacity-20 active:scale-95 transition-all shadow-lg touch-manipulation"
                  >
                    Add Booking
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-3 md:gap-4 pt-4 border-t border-slate-100">
            <button 
              onClick={onClose} 
              className="flex-1 p-3 sm:p-4 md:p-5 text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest hover:bg-slate-50 active:bg-slate-100 rounded-xl sm:rounded-2xl transition-all touch-manipulation"
            >
              Close
            </button>
            {mode === 'admin' && !isPastDate && (
              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="flex-[2] bg-[#D4AF37] text-white p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all touch-manipulation"
              >
                {isSaving ? 'Saving...' : 'Save Bookings'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

