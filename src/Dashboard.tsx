import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { Users, MessageSquare, CheckCircle, XCircle, Settings, Home, LogOut, LayoutDashboard, Mail, Lock, ArrowRight, Save, CheckCircle2, UserPlus, Copy, Send, Trash2, Menu, X, Upload, Plus, Image, Heart, Wallet, Globe, ChevronDown, ChevronRight, ChevronLeft, Share2, Calendar, Search } from 'lucide-react';
import { Message } from './App';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { supabase } from './lib/supabase';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

interface DashboardProps {
  messages: Message[];
}

// Dashboard slug — change this if you want a different URL
const DASHBOARD_SLUG = '/pengelola-c8f2a';

// Lockout config
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const LOCKOUT_KEY = 'wedding_login_locked_until';
const ATTEMPTS_KEY = 'wedding_login_attempts';
const PAGE_SIZE = 10;

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const getLockedUntil = () => parseInt(localStorage.getItem(LOCKOUT_KEY) || '0', 10);
  const getAttempts = () => parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0', 10);
  const isLocked = () => Date.now() < getLockedUntil();

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // Countdown timer — persisted via localStorage
  useEffect(() => {
    const tick = () => {
      const remaining = getLockedUntil() - Date.now();
      if (remaining > 0) {
        setCountdown(Math.ceil(remaining / 1000));
      } else {
        setCountdown(0);
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
      }
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked()) return;

    setIsLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        const newAttempts = getAttempts() + 1;
        localStorage.setItem(ATTEMPTS_KEY, String(newAttempts));

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
          localStorage.setItem(LOCKOUT_KEY, String(lockUntil));
          setCountdown(Math.ceil(LOCKOUT_DURATION_MS / 1000));
          setError('Terlalu banyak percobaan. Akun terkunci selama 5 menit.');
        } else {
          setError(`Email atau password salah. ${MAX_ATTEMPTS - newAttempts} percobaan tersisa.`);
        }
        setPassword('');
      } else {
        localStorage.removeItem(LOCKOUT_KEY);
        localStorage.removeItem(ATTEMPTS_KEY);
        localStorage.setItem('wedding_admin_auth', 'true');
        onLogin();
        navigate(DASHBOARD_SLUG);
      }
    } catch {
      setError('Terjadi kesalahan koneksi. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const locked = isLocked();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-dustyrose/10 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl shadow-ink/5 border border-brand/10 relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-ink mb-2">Admin Login</h1>
          <p className="text-ink/50 text-sm font-light">Masukkan kredensial untuk mengakses dashboard</p>
        </div>

        {(error || locked) && (
          <div className={`mb-6 px-5 py-3 rounded-2xl text-sm font-light flex items-start gap-3 ${locked ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              {locked
                ? <><strong>Akun terkunci.</strong> Coba lagi dalam <span className="font-mono font-bold">{formatCountdown(countdown)}</span></>
                : error
              }
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30" />
              <input 
                type="email" 
                required
                value={email}
                disabled={locked || isLoading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-ink/10 bg-ink/5 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="admin@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30" />
              <input 
                type="password" 
                required
                value={password}
                disabled={locked || isLoading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-ink/10 bg-ink/5 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={locked || isLoading}
            className="w-full group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-2xl bg-brand text-white font-sans text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_40px_rgba(197,168,128,0.4)] mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : locked ? (
                `Terkunci — ${formatCountdown(countdown)}`
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl bg-white/20 transition-all duration-300 ease-out group-hover:scale-100"></div>
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-xs text-ink/40 hover:text-brand transition-colors uppercase tracking-widest cursor-pointer">
            &larr; Back to Invitation
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Pagination = ({ 
  currentPage, 
  totalItems, 
  pageSize, 
  onPageChange 
}: { 
  currentPage: number, 
  totalItems: number, 
  pageSize: number, 
  onPageChange: (page: number) => void 
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-xl bg-white border border-brand/20 text-ink hover:bg-brand/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          // Show only current, first, last, and neighbors if many pages
          if (
            totalPages > 7 &&
            page !== 1 &&
            page !== totalPages &&
            Math.abs(page - currentPage) > 1
          ) {
            if (page === 2 || page === totalPages - 1) {
              return <span key={page} className="px-2 text-ink/30">...</span>;
            }
            return null;
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl font-medium transition-all ${
                currentPage === page 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'bg-white border border-brand/10 text-ink/60 hover:bg-brand/5'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl bg-white border border-brand/20 text-ink hover:bg-brand/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export const Dashboard = ({ messages }: DashboardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    groom_name: 'Ian',
    bride_name: 'Sekar',
    event_date: 'Jumat, 05 Juni 2026',
    bank_name: 'BRI',
    bank_account: '041001006239535',
    bank_owner: 'Angelina Sekar',
    akad_time: '19:00 WIB - 20:00 WIB',
    akad_place: 'Pendhopo Ayem Tentrem',
    akad_address: 'RT.01 RW01, Ringin Sari, Tamanmartani, Kalasan, Sleman Regency, Special Region of Yogyakarta 55571',
    akad_maps_url: 'https://maps.google.com/?q=Pendhopo+Ayem+Tentrem',
    resepsi_time: '11:00 WIB - 14:00 WIB',
    resepsi_place: 'Hotel Indonesia Kempinski',
    resepsi_address: 'Jl. M.H. Thamrin No.1, Menteng, Kec. Menteng, Kota Jakarta Pusat',
    resepsi_maps_url: 'https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta',
    short_date: '05 . 06 . 2026',
    countdown_target: '2026-06-05T19:00:00',
    cover_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
    hero_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
    footer_image: '',
    footer_image_2: '',
    footer_image_3: '',
    footer_image_4: '',
    streaming_url: '',
    gift_qr_url: '',
    gallery_images: [],
    love_story: [],
    wallet_name: 'BCA',
    wallet_number: '0374891355',
    wallet_owner: 'Paulus Rahardian'
  });
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Invited Guests state
  const [invitedGuests, setInvitedGuests] = useState<any[]>([]);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '' });
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Hadir' | 'Tidak Hadir'>('All');
  const [currentPageGuests, setCurrentPageGuests] = useState(1);
  
  // Invited Guests search & pagination state
  const [searchTermInvited, setSearchTermInvited] = useState('');
  const [currentPageInvited, setCurrentPageInvited] = useState(1);
  
  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (msg.text && msg.text.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || msg.attend === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedMessages = filteredMessages.slice(
    (currentPageGuests - 1) * PAGE_SIZE,
    currentPageGuests * PAGE_SIZE
  );

  const filteredInvitedGuests = invitedGuests.filter(guest => 
    guest.name.toLowerCase().includes(searchTermInvited.toLowerCase()) ||
    (guest.phone && guest.phone.includes(searchTermInvited))
  );

  const paginatedInvitedGuests = filteredInvitedGuests.slice(
    (currentPageInvited - 1) * PAGE_SIZE,
    currentPageInvited * PAGE_SIZE
  );

  // Reset page on search/filter
  useEffect(() => {
    setCurrentPageGuests(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPageInvited(1);
  }, [searchTermInvited]);

  // Check Supabase auth session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAuthLoading(false);
    });

    // Listen for auth state changes (e.g. token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        localStorage.removeItem('wedding_admin_auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
      fetchInvitedGuests();
    }
  }, [isAuthenticated]);

  const fetchInvitedGuests = async () => {
    const { data, error } = await supabase
      .from('invited_guests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data && !error) {
      setInvitedGuests(data);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.name) return;

    setIsAddingGuest(true);
    try {
      const { data, error } = await supabase
        .from('invited_guests')
        .insert([{ 
          name: newGuest.name, 
          phone: newGuest.phone,
          slug: newGuest.name.toLowerCase().replace(/\s+/g, '-')
        }])
        .select()
        .single();

      if (error) throw error;
      
      setInvitedGuests([data, ...invitedGuests]);
      setNewGuest({ name: '', phone: '' });
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Tamu berhasil ditambahkan',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error('Error adding guest:', err);
      Swal.fire('Gagal', 'Gagal menambah tamu: ' + err.message, 'error');
    } finally {
      setIsAddingGuest(false);
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        if (data.length === 0) {
          Swal.fire('Info', 'File Excel kosong', 'info');
          return;
        }

        setIsAddingGuest(true);
        const guestsToInsert = data.map(item => {
          const name = item.Nama || item.nama || item['Nama Tamu'] || item.name || Object.values(item)[0];
          const phone = item.WhatsApp || item.whatsapp || item.Phone || item.phone || item['Nomor WhatsApp'] || Object.values(item)[1] || '';
          return {
            name: String(name),
            phone: String(phone),
            slug: String(name).toLowerCase().replace(/\s+/g, '-')
          };
        }).filter(g => g.name);

        const { error } = await supabase
          .from('invited_guests')
          .insert(guestsToInsert);

        if (error) throw error;

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: `${guestsToInsert.length} tamu berhasil diimport`,
          confirmButtonColor: '#C5A880'
        });
        
        fetchInvitedGuests();
      } catch (err: any) {
        console.error('Error importing excel:', err);
        Swal.fire('Gagal', 'Gagal membaca atau menyimpan data dari Excel: ' + err.message, 'error');
      } finally {
        setIsAddingGuest(false);
        if (e.target) e.target.value = ''; // Reset input
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDeleteGuest = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Tamu?',
      text: "Anda tidak dapat mengembalikan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C5A880',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from('invited_guests').delete().eq('id', id);
      if (!error) {
        setInvitedGuests(invitedGuests.filter(g => g.id !== id));
        Swal.fire('Terhapus!', 'Tamu telah dihapus.', 'success');
      }
    }
  };

  const generateLink = (name: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?to=${encodeURIComponent(name)}`;
  };

  const handleCopyLink = (name: string) => {
    navigator.clipboard.writeText(generateLink(name));
    Swal.fire({
      icon: 'success',
      title: 'Link Disalin',
      showConfirmButton: false,
      timer: 1000
    });
  };

  const handleSendWhatsApp = (name: string, phone: string) => {
    const link = generateLink(name);
    const message = `Halo ${name},\n\nTanpa mengurangi rasa hormat, kami bermaksud mengundang Anda untuk hadir di acara pernikahan kami.\n\nDetail undangan dapat dilihat melalui link berikut:\n${link}\n\nMerupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.\n\nTerima kasih.`;
    
    // Clean phone number (remove non-digits, ensure starts with country code)
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').limit(1).single();
      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        setSettings({
          groom_name: data.groom_name || '',
          bride_name: data.bride_name || '',
          event_date: data.event_date || '',
          bank_name: data.bank_name || '',
          bank_account: data.bank_account || '',
          bank_owner: data.bank_owner || '',
          akad_time: data.akad_time || '',
          akad_place: data.akad_place || '',
          akad_address: data.akad_address || '',
          akad_maps_url: data.akad_maps_url || '',
          resepsi_time: data.resepsi_time || '',
          resepsi_place: data.resepsi_place || '',
          resepsi_address: data.resepsi_address || '',
          resepsi_maps_url: data.resepsi_maps_url || '',
          short_date: data.short_date || '',
          countdown_target: data.countdown_target || '',
          cover_image: data.cover_image || '',
          hero_image: data.hero_image || '',
          footer_image: data.footer_image || '',
          footer_image_2: data.footer_image_2 || '',
          footer_image_3: data.footer_image_3 || '',
          footer_image_4: data.footer_image_4 || '',
          streaming_url: data.streaming_url || '',
          gift_qr_url: data.gift_qr_url || '',
          gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : [],
          love_story: Array.isArray(data.love_story) ? data.love_story : [],
          wallet_name: data.wallet_name || '',
          wallet_number: data.wallet_number || '',
          wallet_owner: data.wallet_owner || '',
        });
        setSettingsId(data.id);
      }
    } catch (err) {
      console.error('Unexpected error fetching settings:', err);
    }
  };

const toLocalISOString = (date: Date): string => {
  const pad = (num: number) => (num < 10 ? '0' : '') + num;
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds());
};

const parseTargetDate = (settings: any): number => {
  let targetTime = NaN;

  // 1. Try to parse from settings.short_date (e.g. "05 . 06 . 2026")
  if (settings.short_date) {
    const cleanShort = settings.short_date.replace(/\s+/g, '');
    const parts = cleanShort.split(/[\.\-\/]/);
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);
      // Handle YYYY-MM-DD format if parts[0] is year
      if (parts[0].length === 4) {
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        day = parseInt(parts[2], 10);
      }
      if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        // Try to get time from akad_time (e.g. "19:00 WIB")
        let hours = 8;
        let minutes = 0;
        if (settings.akad_time) {
          const timeMatch = settings.akad_time.match(/(\d{1,2})[:.](\d{2})/);
          if (timeMatch) {
            hours = parseInt(timeMatch[1], 10);
            minutes = parseInt(timeMatch[2], 10);
          }
        }
        targetTime = new Date(year, month - 1, day, hours, minutes, 0).getTime();
      }
    }
  }

  // 2. Try to parse from settings.event_date (e.g. "Jumat, 05 Juni 2026")
  if (isNaN(targetTime) && settings.event_date) {
    const lowerEvent = settings.event_date.toLowerCase();
    const indonesianMonths = [
      'januari', 'februari', 'maret', 'april', 'mei', 'juni',
      'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
    ];
    let monthIndex = -1;
    for (let i = 0; i < indonesianMonths.length; i++) {
      if (lowerEvent.includes(indonesianMonths[i])) {
        monthIndex = i;
        break;
      }
    }
    if (monthIndex !== -1) {
      const yearMatch = lowerEvent.match(/\b(20\d{2})\b/);
      const dayMatch = lowerEvent.match(/\b(\d{1,2})\b/);
      if (yearMatch && dayMatch) {
        const year = parseInt(yearMatch[1], 10);
        let day = parseInt(dayMatch[1], 10);
        if (day === year) {
          const numbers = lowerEvent.match(/\b\d+\b/g);
          if (numbers) {
            const other = numbers.find(n => n.length <= 2);
            if (other) day = parseInt(other, 10);
          }
        }
        let hours = 8;
        let minutes = 0;
        if (settings.akad_time) {
          const timeMatch = settings.akad_time.match(/(\d{1,2})[:.](\d{2})/);
          if (timeMatch) {
            hours = parseInt(timeMatch[1], 10);
            minutes = parseInt(timeMatch[2], 10);
          }
        }
        targetTime = new Date(year, monthIndex, day, hours, minutes, 0).getTime();
      }
    }
  }

  // 3. Fallback to settings.countdown_target (ISO format)
  if (isNaN(targetTime) && settings.countdown_target) {
    targetTime = new Date(settings.countdown_target).getTime();
  }

  // 4. Default fallback (1 year ahead)
  if (isNaN(targetTime)) {
    targetTime = new Date().getTime() + (365 * 24 * 60 * 60 * 1000);
  }

  return targetTime;
};

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const targetTime = parseTargetDate(settings);
      const isoString = toLocalISOString(new Date(targetTime));
      const updatedSettings = {
        ...settings,
        countdown_target: isoString
      };

      if (settingsId) {
        const { error } = await supabase.from('settings').update(updatedSettings).eq('id', settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('settings').insert([updatedSettings]).select().single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
      setSettings(updatedSettings);
      setSaveSuccess(true);
      Swal.fire({
        title: 'Sukses!',
        text: 'Pengaturan berhasil disimpan',
        icon: 'success',
        confirmButtonColor: '#C5A880',
        background: '#FDFCFB',
        timer: 3000,
        timerProgressBar: true
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal menyimpan pengaturan: ' + (err.message || 'Terjadi kesalahan sistem'),
        icon: 'error',
        confirmButtonColor: '#C5A880',
        background: '#FDFCFB'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wedding')
        .getPublicUrl(filePath);

      setSettings({ ...settings, [field]: publicUrl });
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Gambar berhasil diupload',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengupload gambar: ' + error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wedding')
        .getPublicUrl(filePath);

      setSettings({ 
        ...settings, 
        gallery_images: [...(settings.gallery_images || []), publicUrl] 
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Foto galeri berhasil ditambahkan',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('Error uploading gallery image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengupload foto galeri: ' + error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeGalleryImage = (url: string) => {
    setSettings({
      ...settings,
      gallery_images: settings.gallery_images.filter(img => img !== url)
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(44, 48, 46);
    doc.text('Daftar Tamu RSVP', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Diekspor pada: ${new Date().toLocaleString('id-ID')}`, 14, 30);

    // Table setup
    const headers = ['Nama', 'Status', 'Pax', 'Waktu'];
    const colWidths = [75, 30, 20, 45];
    const colX = [14, 89, 119, 139];
    const rowHeight = 8;
    let y = 42;

    // Draw header row
    doc.setFillColor(197, 168, 128); // brand color
    doc.rect(14, y - 5, 182, rowHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    headers.forEach((header, i) => {
      doc.text(header, colX[i], y);
    });

    // Draw data rows
    doc.setFont('helvetica', 'normal');
    filteredMessages.forEach((msg, idx) => {
      y += rowHeight;
      // Alternate row background
      if (idx % 2 === 0) {
        doc.setFillColor(253, 252, 251);
        doc.rect(14, y - 5, 182, rowHeight, 'F');
      }
      doc.setTextColor(44, 48, 46);
      const row = [msg.name, msg.attend, msg.guests || '-', msg.time];
      row.forEach((cell, i) => {
        const text = String(cell);
        const maxWidth = colWidths[i] - 3;
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines[0], colX[i], y); // show first line only to keep table neat
      });
      // Bottom line
      doc.setDrawColor(230, 225, 220);
      doc.line(14, y + 3, 196, y + 3);

      // New page if needed
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    
    doc.save(`RSVP_Wedding_${new Date().toLocaleDateString('id-ID')}.pdf`);
  };

  const generateInvitationImage = async (name: string) => {
    const { toPng } = await import('html-to-image');
    
    // Create a temporary element for capturing
    const node = document.createElement('div');
    node.style.width = '600px';
    node.style.height = '800px';
    node.style.padding = '40px';
    node.style.background = '#FDFCFB';
    node.style.display = 'flex';
    node.style.flexDirection = 'column';
    node.style.alignItems = 'center';
    node.style.justifyContent = 'center';
    node.style.textAlign = 'center';
    node.style.border = '20px solid #C5A880';
    node.style.fontFamily = 'serif';

    node.innerHTML = `
      <div style="color: #C5A880; font-size: 24px; margin-bottom: 20px;">The Wedding of</div>
      <div style="font-size: 64px; color: #2C302E; margin-bottom: 10px;">${settings.groom_name} & ${settings.bride_name}</div>
      <div style="width: 60px; height: 1px; background: #C5A880; margin: 30px 0;"></div>
      <div style="font-size: 18px; color: #6B7280; margin-bottom: 40px;">Special Invite For:</div>
      <div style="font-size: 32px; color: #2C302E; font-weight: bold;">${name}</div>
      <div style="margin-top: 60px; font-size: 18px; color: #C5A880;">${settings.event_date}</div>
    `;

    document.body.appendChild(node);
    try {
      const dataUrl = await toPng(node);
      const link = document.createElement('a');
      link.download = `Undangan_${name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      Swal.fire('Gagal', 'Terjadi kesalahan saat membuat gambar', 'error');
    } finally {
      document.body.removeChild(node);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <span className="inline-block w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const totalGuests = messages.length;
  const attending = messages.filter(m => m.attend === 'Hadir').length;
  const notAttending = messages.filter(m => m.attend === 'Tidak Hadir').length;
  
  // Calculate total pax (number of people attending)
  const totalPax = messages.reduce((acc, msg) => {
    if (msg.attend === 'Hadir' && msg.guests) {
      const num = parseInt(msg.guests.split(' ')[0]);
      return acc + (isNaN(num) ? 0 : num);
    }
    return acc;
  }, 0);

  const pieData = [
    { name: 'Hadir', value: attending },
    { name: 'Tidak Hadir', value: notAttending },
  ];
  const COLORS = ['#C5A880', '#2C302E'];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-ink text-cream flex flex-col shadow-2xl z-50 
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl italic text-brand tracking-wide">Wedding Admin</h2>
            <p className="text-xs text-cream/50 mt-2 uppercase tracking-widest">Dashboard</p>
          </div>
          <button 
            className="md:hidden text-cream/50 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'overview' ? 'bg-brand/20 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Overview</span>
          </button>
          <button 
            onClick={() => { setActiveTab('guests'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'guests' ? 'bg-brand/20 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Guests RSVP</span>
          </button>
          <button 
            onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'messages' ? 'bg-brand/20 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Wishes</span>
          </button>

          {/* Collapsible Settings */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab.startsWith('settings') ? 'bg-brand/10 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
            >
              <div className="flex items-center gap-4">
                <Settings className="w-5 h-5" />
                <span className="font-medium tracking-wide text-sm">Settings</span>
              </div>
              {isSettingsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {(isSettingsExpanded || activeTab.startsWith('settings')) && (
              <div className="pl-12 space-y-1 mt-1">
                <button 
                  onClick={() => { setActiveTab('settings-general'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs ${activeTab === 'settings-general' ? 'text-brand bg-brand/5' : 'text-cream/40 hover:text-cream hover:bg-white/5'}`}
                >
                  <Globe className="w-4 h-4" /> General
                </button>
                <button 
                  onClick={() => { setActiveTab('settings-love-story'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs ${activeTab === 'settings-love-story' ? 'text-brand bg-brand/5' : 'text-cream/40 hover:text-cream hover:bg-white/5'}`}
                >
                  <Heart className="w-4 h-4" /> Love Story
                </button>
                <button 
                  onClick={() => { setActiveTab('settings-gallery'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs ${activeTab === 'settings-gallery' ? 'text-brand bg-brand/5' : 'text-cream/40 hover:text-cream hover:bg-white/5'}`}
                >
                  <Image className="w-4 h-4" /> Gallery
                </button>
                <button 
                  onClick={() => { setActiveTab('settings-payment'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs ${activeTab === 'settings-payment' ? 'text-brand bg-brand/5' : 'text-cream/40 hover:text-cream hover:bg-white/5'}`}
                >
                  <Wallet className="w-4 h-4" /> Payment & Info
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => { setActiveTab('invite'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'invite' ? 'bg-brand/20 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Invite Guests</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link 
            to="/"
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-cream/70 hover:bg-white/5 hover:text-cream transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">View Site</span>
          </Link>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              setIsAuthenticated(false);
              localStorage.removeItem('wedding_admin_auth');
            }}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-dustyrose/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="font-serif text-4xl text-ink font-light capitalize">{activeTab}</h1>
              <p className="text-ink/50 mt-2 font-light">Manage your wedding invitation details</p>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl bg-white border border-brand/20 text-ink shadow-lg shadow-ink/5"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-ink/60 font-medium uppercase tracking-widest text-xs">Total RSVPs</h3>
                    </div>
                    <p className="text-4xl font-serif text-ink">{totalGuests}</p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-ink/60 font-medium uppercase tracking-widest text-xs">Attending</h3>
                    </div>
                    <p className="text-4xl font-serif text-ink">{attending}</p>
                    <p className="text-sm text-ink/40 mt-2 font-light">Estimated Pax: {totalPax}</p>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                        <XCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-ink/60 font-medium uppercase tracking-widest text-xs">Not Attending</h3>
                    </div>
                    <p className="text-4xl font-serif text-ink">{notAttending}</p>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h3 className="text-ink/60 font-medium uppercase tracking-widest text-xs">Wishes</h3>
                    </div>
                    <p className="text-4xl font-serif text-ink">{messages.length}</p>
                  </div>
                </div>

                {/* Charts & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                    <h3 className="font-serif text-2xl text-ink mb-6">Attendance Ratio</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                          />
                          <Legend iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif text-2xl text-ink">Recent RSVPs</h3>
                      <button onClick={() => setActiveTab('guests')} className="text-brand text-sm uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                      {/* Desktop Table */}
                      <table className="w-full text-left border-collapse hidden md:table">
                        <thead>
                          <tr className="border-b border-ink/10 text-ink/50 text-xs uppercase tracking-widest">
                            <th className="pb-4 font-medium">Name</th>
                            <th className="pb-4 font-medium">Status</th>
                            <th className="pb-4 font-medium">Pax</th>
                            <th className="pb-4 font-medium">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages.slice(0, 5).map((msg) => (
                            <tr key={msg.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5 transition-colors">
                              <td className="py-4 font-medium text-ink">{msg.name}</td>
                              <td className="py-4">
                                <span className={`text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-widest ${msg.attend === 'Hadir' ? 'bg-brand/10 text-brand' : 'bg-ink/5 text-ink/60'}`}>
                                  {msg.attend}
                                </span>
                              </td>
                              <td className="py-4 text-ink/70 text-sm">{msg.guests || '-'}</td>
                              <td className="py-4 text-ink/50 text-sm">{msg.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Mobile Cards */}
                      <div className="space-y-4 md:hidden">
                        {messages.slice(0, 5).map((msg) => (
                          <div key={msg.id} className="p-4 rounded-2xl border border-ink/5 bg-ink/5 hover:bg-brand/5 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-ink">{msg.name}</h4>
                              <span className={`text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-widest ${msg.attend === 'Hadir' ? 'bg-brand/10 text-brand' : 'bg-ink/5 text-ink/60'}`}>
                                {msg.attend}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-ink/50">
                              <span>Pax: <span className="text-ink/70 font-medium">{msg.guests || '-'}</span></span>
                              <span>{msg.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guests' && (
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h3 className="font-serif text-2xl text-ink">All Guests</h3>
                  <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <input 
                        type="text" 
                        placeholder="Cari nama atau pesan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-4 py-2 rounded-xl border border-ink/10 bg-cream/30 text-sm focus:outline-none focus:border-brand/50"
                      />
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-4 py-2 rounded-xl border border-ink/10 bg-cream/30 text-sm focus:outline-none focus:border-brand/50"
                    >
                      <option value="All">Semua Status</option>
                      <option value="Hadir">Hadir</option>
                      <option value="Tidak Hadir">Tidak Hadir</option>
                    </select>
                    <button 
                      onClick={exportToPDF}
                      className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand/90 transition-all cursor-pointer"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {/* Desktop Table */}
                  <table className="w-full text-left border-collapse hidden md:table">
                    <thead>
                      <tr className="border-b border-ink/10 text-ink/50 text-xs uppercase tracking-widest">
                        <th className="pb-4 font-medium">Name</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium">Pax</th>
                        <th className="pb-4 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMessages.map((msg) => (
                        <tr key={msg.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5 transition-colors">
                          <td className="py-4 font-medium text-ink">{msg.name}</td>
                          <td className="py-4">
                            <span className={`text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-widest ${msg.attend === 'Hadir' ? 'bg-brand/10 text-brand' : 'bg-ink/5 text-ink/60'}`}>
                              {msg.attend}
                            </span>
                          </td>
                          <td className="py-4 text-ink/70 text-sm">{msg.guests || '-'}</td>
                          <td className="py-4 text-ink/50 text-sm">{msg.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile Cards */}
                  <div className="space-y-4 md:hidden">
                    {paginatedMessages.map((msg) => (
                      <div key={msg.id} className="p-4 rounded-2xl border border-ink/5 bg-ink/5 hover:bg-brand/5 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-ink">{msg.name}</h4>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-widest ${msg.attend === 'Hadir' ? 'bg-brand/10 text-brand' : 'bg-ink/5 text-ink/60'}`}>
                            {msg.attend}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-ink/50">
                          <span>Pax: <span className="text-ink/70 font-medium">{msg.guests || '-'}</span></span>
                          <span>{msg.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredMessages.length === 0 && (
                    <div className="py-12 text-center text-ink/30 italic font-light">
                      Tidak ada data yang sesuai dengan filter
                    </div>
                  )}
                </div>

                <Pagination 
                  currentPage={currentPageGuests}
                  totalItems={filteredMessages.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPageGuests}
                />
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                <h3 className="font-serif text-2xl text-ink mb-8">Guest Wishes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-6 rounded-2xl border border-ink/10 bg-cream/30 hover:shadow-lg hover:border-brand/30 transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-serif text-xl text-ink">{msg.name}</h4>
                          <p className="text-xs text-ink/40 mt-1">{msg.time}</p>
                        </div>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-widest ${msg.attend === 'Hadir' ? 'bg-brand/10 text-brand' : 'bg-ink/5 text-ink/60'}`}>
                          {msg.attend}
                        </span>
                      </div>
                      <p className="text-ink/70 font-light italic text-sm leading-relaxed">"{msg.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8 max-w-4xl pb-12">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10 space-y-8">
                  <h3 className="font-serif text-2xl text-ink">Wedding Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Groom Name</label>
                      <input type="text" value={settings.groom_name} onChange={(e) => setSettings({...settings, groom_name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Bride Name</label>
                      <input type="text" value={settings.bride_name} onChange={(e) => setSettings({...settings, bride_name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Event Date (Full)</label>
                      <input type="text" value={settings.event_date} onChange={(e) => setSettings({...settings, event_date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" placeholder="Sabtu, 24 Agustus 2026" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Short Date (Display)</label>
                      <input type="text" value={settings.short_date} onChange={(e) => setSettings({...settings, short_date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" placeholder="05 . 05 . 2026" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Countdown Target (ISO Format)</label>
                    <input type="text" value={settings.countdown_target} onChange={(e) => setSettings({...settings, countdown_target: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand/20 outline-none" placeholder="2026-08-24T08:00:00" />
                  </div>

                  <hr className="border-slate-100" />
                  
                  <h3 className="font-serif text-2xl text-ink">Event Information</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-brand/5 rounded-2xl border border-brand/10 space-y-4">
                      <h4 className="font-medium text-brand">Ngunduh Manten</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Waktu</label>
                          <input type="text" value={settings.akad_time} onChange={(e) => setSettings({...settings, akad_time: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" placeholder="08:00 WIB - Selesai" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Tempat</label>
                          <input type="text" value={settings.akad_place} onChange={(e) => setSettings({...settings, akad_place: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" placeholder="Masjid Istiqlal" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Alamat</label>
                        <input type="text" value={settings.akad_address} onChange={(e) => setSettings({...settings, akad_address: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Maps URL</label>
                        <input type="text" value={settings.akad_maps_url} onChange={(e) => setSettings({...settings, akad_maps_url: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" />
                      </div>
                    </div>

                    <div className="p-6 bg-dustyrose/5 rounded-2xl border border-dustyrose/10 space-y-4">
                      <h4 className="font-medium text-dustyrose">Resepsi</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Waktu</label>
                          <input type="text" value={settings.resepsi_time} onChange={(e) => setSettings({...settings, resepsi_time: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" placeholder="11:00 - 13:00 WIB" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Tempat</label>
                          <input type="text" value={settings.resepsi_place} onChange={(e) => setSettings({...settings, resepsi_place: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" placeholder="Gedung Serbaguna" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Alamat</label>
                        <input type="text" value={settings.resepsi_address} onChange={(e) => setSettings({...settings, resepsi_address: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Maps URL</label>
                        <input type="text" value={settings.resepsi_maps_url} onChange={(e) => setSettings({...settings, resepsi_maps_url: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <h3 className="font-serif text-2xl text-ink">Visuals & Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Cover Image</label>
                      <div className="relative group aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 hover:border-brand/50 transition-colors">
                        {settings.cover_image ? (
                          <img src={settings.cover_image} alt="Cover Preview" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Image className="w-12 h-12" />
                          </div>
                        )}
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-xs font-medium uppercase tracking-widest">Ganti Gambar</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover_image')} />
                        </label>
                      </div>
                      <input type="text" value={settings.cover_image} onChange={(e) => setSettings({...settings, cover_image: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-500 bg-slate-50" placeholder="URL Gambar" />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Hero Image</label>
                      <div className="relative group aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 hover:border-brand/50 transition-colors">
                        {settings.hero_image ? (
                          <img src={settings.hero_image} alt="Hero Preview" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Image className="w-12 h-12" />
                          </div>
                        )}
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-xs font-medium uppercase tracking-widest">Ganti Gambar</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image')} />
                        </label>
                      </div>
                      <input type="text" value={settings.hero_image} onChange={(e) => setSettings({...settings, hero_image: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-500 bg-slate-50" placeholder="URL Gambar" />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-700">Footer Image</label>
                      <div className="relative group aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 hover:border-brand/50 transition-colors">
                        {settings.footer_image ? (
                          <img src={settings.footer_image} alt="Footer Preview" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Image className="w-12 h-12" />
                          </div>
                        )}
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-xs font-medium uppercase tracking-widest">Ganti Gambar</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'footer_image')} />
                        </label>
                      </div>
                      <input type="text" value={settings.footer_image || ''} onChange={(e) => setSettings({...settings, footer_image: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs font-mono text-slate-500 bg-slate-50" placeholder="URL Gambar" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings - General */}
            {activeTab === 'settings-general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10 space-y-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-ink">General Info</h3>
                      <p className="text-xs text-ink/40 font-light">Informasi dasar undangan pernikahan</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand font-bold border-b border-brand/10 pb-2">Mempelai</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Nama Mempelai Pria</label>
                          <input type="text" value={settings.groom_name} onChange={(e) => setSettings({...settings, groom_name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Nama Mempelai Wanita</label>
                          <input type="text" value={settings.bride_name} onChange={(e) => setSettings({...settings, bride_name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand font-bold border-b border-brand/10 pb-2">Waktu & Tanggal</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Tanggal Acara (Teks)</label>
                          <input type="text" value={settings.event_date} onChange={(e) => setSettings({...settings, event_date: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" placeholder="Contoh: Sabtu, 24 Agustus 2026" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Countdown Target (ISO Format)</label>
                          <input type="text" value={settings.countdown_target} onChange={(e) => setSettings({...settings, countdown_target: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" placeholder="2026-08-24T08:00:00" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Short Date (Display)</label>
                          <input type="text" value={settings.short_date} onChange={(e) => setSettings({...settings, short_date: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" placeholder="05 . 05 . 2026" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand font-bold border-b border-brand/10 pb-2">Visuals & Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Cover Image</label>
                        <div className="relative group aspect-[3/4] rounded-3xl overflow-hidden bg-cream/50 border-2 border-dashed border-brand/10 hover:border-brand/30 transition-all">
                          {settings.cover_image ? (
                            <img src={settings.cover_image} alt="Cover Preview" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink/10">
                              <Image className="w-12 h-12" />
                            </div>
                          )}
                          <label className="absolute inset-0 flex flex-col items-center justify-center bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-cream backdrop-blur-sm">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Update Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover_image')} />
                          </label>
                        </div>
                        <input type="text" value={settings.cover_image} onChange={(e) => setSettings({...settings, cover_image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink/5 bg-ink/5 text-[10px] font-mono text-ink/40 focus:outline-none focus:border-brand/30" placeholder="URL Gambar" />
                      </div>
                      
                      <div className="space-y-4">
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Hero Image</label>
                        <div className="relative group aspect-[3/4] rounded-3xl overflow-hidden bg-cream/50 border-2 border-dashed border-brand/10 hover:border-brand/30 transition-all">
                          {settings.hero_image ? (
                            <img src={settings.hero_image} alt="Hero Preview" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink/10">
                              <Image className="w-12 h-12" />
                            </div>
                          )}
                          <label className="absolute inset-0 flex flex-col items-center justify-center bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-cream backdrop-blur-sm">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Update Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image')} />
                          </label>
                        </div>
                        <input type="text" value={settings.hero_image} onChange={(e) => setSettings({...settings, hero_image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink/5 bg-ink/5 text-[10px] font-mono text-ink/40 focus:outline-none focus:border-brand/30" placeholder="URL Gambar" />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Footer Image 1</label>
                        <div className="relative group aspect-[3/4] rounded-3xl overflow-hidden bg-cream/50 border-2 border-dashed border-brand/10 hover:border-brand/30 transition-all">
                          {settings.footer_image ? (
                            <img src={settings.footer_image} alt="Footer 1 Preview" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink/10">
                              <Image className="w-12 h-12" />
                            </div>
                          )}
                          <label className="absolute inset-0 flex flex-col items-center justify-center bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-cream backdrop-blur-sm">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Update Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'footer_image')} />
                          </label>
                        </div>
                        <input type="text" value={settings.footer_image || ''} onChange={(e) => setSettings({...settings, footer_image: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink/5 bg-ink/5 text-[10px] font-mono text-ink/40 focus:outline-none focus:border-brand/30" placeholder="URL Gambar 1" />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Footer Image 2</label>
                        <div className="relative group aspect-[3/4] rounded-3xl overflow-hidden bg-cream/50 border-2 border-dashed border-brand/10 hover:border-brand/30 transition-all">
                          {settings.footer_image_2 ? (
                            <img src={settings.footer_image_2} alt="Footer 2 Preview" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink/10">
                              <Image className="w-12 h-12" />
                            </div>
                          )}
                          <label className="absolute inset-0 flex flex-col items-center justify-center bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-cream backdrop-blur-sm">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Update Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'footer_image_2')} />
                          </label>
                        </div>
                        <input type="text" value={settings.footer_image_2 || ''} onChange={(e) => setSettings({...settings, footer_image_2: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink/5 bg-ink/5 text-[10px] font-mono text-ink/40 focus:outline-none focus:border-brand/30" placeholder="URL Gambar 2" />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Footer Image 3</label>
                        <div className="relative group aspect-[3/4] rounded-3xl overflow-hidden bg-cream/50 border-2 border-dashed border-brand/10 hover:border-brand/30 transition-all">
                          {settings.footer_image_3 ? (
                            <img src={settings.footer_image_3} alt="Footer 3 Preview" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink/10">
                              <Image className="w-12 h-12" />
                            </div>
                          )}
                          <label className="absolute inset-0 flex flex-col items-center justify-center bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-cream backdrop-blur-sm">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Update Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'footer_image_3')} />
                          </label>
                        </div>
                        <input type="text" value={settings.footer_image_3 || ''} onChange={(e) => setSettings({...settings, footer_image_3: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink/5 bg-ink/5 text-[10px] font-mono text-ink/40 focus:outline-none focus:border-brand/30" placeholder="URL Gambar 3" />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Footer Image 4</label>
                        <div className="relative group aspect-[3/4] rounded-3xl overflow-hidden bg-cream/50 border-2 border-dashed border-brand/10 hover:border-brand/30 transition-all">
                          {settings.footer_image_4 ? (
                            <img src={settings.footer_image_4} alt="Footer 4 Preview" className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink/10">
                              <Image className="w-12 h-12" />
                            </div>
                          )}
                          <label className="absolute inset-0 flex flex-col items-center justify-center bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-cream backdrop-blur-sm">
                            <Upload className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Update Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'footer_image_4')} />
                          </label>
                        </div>
                        <input type="text" value={settings.footer_image_4 || ''} onChange={(e) => setSettings({...settings, footer_image_4: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-ink/5 bg-ink/5 text-[10px] font-mono text-ink/40 focus:outline-none focus:border-brand/30" placeholder="URL Gambar 4" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand font-bold border-b border-brand/10 pb-2">Lokasi & Acara</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold text-ink/20 uppercase tracking-widest">Ngunduh Manten</p>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Waktu Akad</label>
                          <input type="text" value={settings.akad_time} onChange={(e) => setSettings({...settings, akad_time: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Tempat Akad</label>
                          <input type="text" value={settings.akad_place} onChange={(e) => setSettings({...settings, akad_place: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Maps URL Akad</label>
                          <input type="text" value={settings.akad_maps_url} onChange={(e) => setSettings({...settings, akad_maps_url: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold text-ink/20 uppercase tracking-widest">Resepsi</p>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Waktu Resepsi</label>
                          <input type="text" value={settings.resepsi_time} onChange={(e) => setSettings({...settings, resepsi_time: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Tempat Resepsi</label>
                          <input type="text" value={settings.resepsi_place} onChange={(e) => setSettings({...settings, resepsi_place: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Maps URL Resepsi</label>
                          <input type="text" value={settings.resepsi_maps_url} onChange={(e) => setSettings({...settings, resepsi_maps_url: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-3 px-10 py-4 bg-brand text-white rounded-full font-sans text-xs uppercase tracking-[0.2em] hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60">
                      {saveSuccess ? <><CheckCircle2 className="w-4 h-4" /> Tersimpan!</> : <><Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings - Love Story */}
            {activeTab === 'settings-love-story' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-ink">Our Love Story</h3>
                      <p className="text-xs text-ink/40 font-light">Kelola linimasa perjalanan cinta kalian</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {settings.love_story?.map((milestone, idx) => (
                      <div key={idx} className="p-6 rounded-2xl border border-ink/5 bg-cream/30 space-y-4 group relative">
                        <button onClick={() => {
                          const newStory = [...(settings.love_story || [])];
                          newStory.splice(idx, 1);
                          setSettings({ ...settings, love_story: newStory });
                        }} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid md:grid-cols-4 gap-6">
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Tahun</label>
                            <input type="text" value={milestone.year} onChange={(e) => {
                              const newStory = [...(settings.love_story || [])];
                              newStory[idx].year = e.target.value;
                              setSettings({ ...settings, love_story: newStory });
                            }} className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white font-light text-sm focus:outline-none focus:border-brand/50" placeholder="2020" />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Judul Kejadian</label>
                            <input type="text" value={milestone.title} onChange={(e) => {
                              const newStory = [...(settings.love_story || [])];
                              newStory[idx].title = e.target.value;
                              setSettings({ ...settings, love_story: newStory });
                            }} className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white font-light text-sm focus:outline-none focus:border-brand/50" placeholder="First Meet" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Deskripsi</label>
                          <textarea rows={3} value={milestone.description} onChange={(e) => {
                            const newStory = [...(settings.love_story || [])];
                            newStory[idx].description = e.target.value;
                            setSettings({ ...settings, love_story: newStory });
                          }} className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white font-light text-sm resize-none focus:outline-none focus:border-brand/50" placeholder="Ceritakan momen singkat ini..." />
                        </div>
                      </div>
                    ))}

                    <button onClick={() => setSettings({ ...settings, love_story: [...(settings.love_story || []), { year: '', title: '', description: '' }] })} className="w-full py-4 border-2 border-dashed border-brand/20 rounded-2xl text-brand/60 hover:text-brand hover:border-brand/40 hover:bg-brand/5 transition-all text-xs font-sans uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Tambah Milestone Baru
                    </button>
                  </div>

                  <div className="flex justify-end mt-10">
                    <button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-3 px-10 py-4 bg-brand text-white rounded-full font-sans text-xs uppercase tracking-[0.2em] hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer">
                      {saveSuccess ? <><CheckCircle2 className="w-4 h-4" /> Tersimpan!</> : <><Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings - Gallery */}
            {activeTab === 'settings-gallery' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                        <Image className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif text-ink">Photo Gallery</h3>
                        <p className="text-xs text-ink/40 font-light">Foto prewedding dan dokumentasi</p>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl text-xs font-sans uppercase tracking-[0.2em] cursor-pointer hover:bg-brand/90 transition-all shadow-lg active:scale-95">
                      <Plus className="w-4 h-4" /> Tambah Foto
                      <input type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {settings.gallery_images?.map((url, idx) => (
                      <div key={idx} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm border border-ink/5 bg-cream/30">
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <button onClick={() => removeGalleryImage(url)} className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-red-500 transition-colors backdrop-blur-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!settings.gallery_images || settings.gallery_images.length === 0) && (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-ink/10 rounded-3xl text-ink/20 italic font-light">
                        Belum ada foto galeri. Silakan upload foto prewedding Anda.
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-10">
                    <button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-3 px-10 py-4 bg-brand text-white rounded-full font-sans text-xs uppercase tracking-[0.2em] hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer">
                      {saveSuccess ? <><CheckCircle2 className="w-4 h-4" /> Tersimpan!</> : <><Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings - Payment & Advanced */}
            {activeTab === 'settings-payment' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10 space-y-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-ink">Payment & Gifts</h3>
                      <p className="text-xs text-ink/40 font-light">Informasi pengiriman hadiah digital</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand font-bold border-b border-brand/10 pb-2">Rekening Bank</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Nama Bank</label>
                          <input type="text" value={settings.bank_name} onChange={(e) => setSettings({...settings, bank_name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Nomor Rekening</label>
                          <input type="text" value={settings.bank_account} onChange={(e) => setSettings({...settings, bank_account: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Pemilik Rekening</label>
                          <input type="text" value={settings.bank_owner} onChange={(e) => setSettings({...settings, bank_owner: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand font-bold border-b border-brand/10 pb-2">E-Wallet (Digital)</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Nama Layanan (DANA/GOPAY)</label>
                          <input type="text" value={settings.wallet_name} onChange={(e) => setSettings({...settings, wallet_name: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Nomor E-Wallet</label>
                          <input type="text" value={settings.wallet_number} onChange={(e) => setSettings({...settings, wallet_number: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">Pemilik E-Wallet</label>
                          <input type="text" value={settings.wallet_owner} onChange={(e) => setSettings({...settings, wallet_owner: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-ink/5" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand font-bold border-b border-brand/10 pb-2">Live Streaming</h4>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-ink/40 mb-2 ml-1">YouTube Live URL</label>
                        <input type="text" value={settings.streaming_url} onChange={(e) => setSettings({...settings, streaming_url: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all" placeholder="https://youtube.com/live/..." />
                        <p className="text-[10px] text-ink/30 italic font-light">Link siaran langsung akan muncul di section Live Celebration</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-brand font-bold border-b border-brand/10 pb-2">QR Code Gift</h4>
                      <div className="flex items-start gap-6">
                        <div className="w-32 h-32 rounded-2xl border border-ink/10 overflow-hidden bg-white p-2 flex items-center justify-center shadow-inner">
                          {settings.gift_qr_url ? (
                            <img src={settings.gift_qr_url} alt="QR Preview" className="w-full h-full object-contain" />
                          ) : (
                            <Image className="w-8 h-8 text-ink/10" />
                          )}
                        </div>
                        <div className="flex-1 space-y-4">
                          <label className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-brand/10 text-brand rounded-xl text-[10px] font-sans uppercase tracking-widest cursor-pointer hover:bg-brand/20 transition-all border border-brand/20">
                            <Upload className="w-3 h-3" /> Pilih File QR
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gift_qr_url')} />
                          </label>
                          <p className="text-[10px] text-ink/30 font-light">Upload QRIS atau Foto Rekening Anda</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-10">
                    <button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-3 px-10 py-4 bg-brand text-white rounded-full font-sans text-xs uppercase tracking-[0.2em] hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer">
                      {saveSuccess ? <><CheckCircle2 className="w-4 h-4" /> Tersimpan!</> : <><Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</>}
                    </button>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'invite' && (
              <div className="space-y-8">
                {/* Add Guest Form */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                  <h3 className="font-serif text-2xl text-ink mb-6">Tambah Tamu Undangan</h3>
                  <form onSubmit={handleAddGuest} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Nama Tamu</label>
                      <input
                        type="text"
                        required
                        value={newGuest.name}
                        onChange={e => setNewGuest({ ...newGuest, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all"
                        placeholder="Contoh: Budi & Istri"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Nomor WhatsApp (Opsional)</label>
                      <input
                        type="text"
                        value={newGuest.phone}
                        onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })}
                        className="w-full px-5 py-4 rounded-2xl border border-ink/10 bg-cream/30 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all"
                        placeholder="0812XXXXXXXX"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isAddingGuest}
                      className="w-full py-4 bg-brand text-white rounded-2xl font-sans text-xs uppercase tracking-[0.2em] hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 disabled:opacity-50 cursor-pointer"
                    >
                      {isAddingGuest ? 'Menambah...' : 'Tambah Tamu'}
                    </button>
                  </form>
                </div>

                {/* Invited Guests Table */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h3 className="font-serif text-2xl text-ink">Daftar Undangan</h3>
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                      <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
                        <input 
                          type="text" 
                          placeholder="Cari nama tamu..."
                          value={searchTermInvited}
                          onChange={(e) => setSearchTermInvited(e.target.value)}
                          className="w-full pl-11 pr-4 py-2 rounded-xl border border-ink/10 bg-cream/30 text-sm focus:outline-none focus:border-brand/50"
                        />
                      </div>
                      <label className="flex items-center gap-2 px-4 py-2 bg-green-600/10 text-green-600 rounded-full text-xs font-sans uppercase tracking-widest cursor-pointer hover:bg-green-600/20 transition-all border border-green-600/20 shadow-sm">
                        <Upload className="w-3.5 h-3.5" /> Import Excel
                        <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleImportExcel} />
                      </label>
                      <div className="text-sm text-ink/50 bg-ink/5 px-4 py-2 rounded-full border border-ink/10">
                        {filteredInvitedGuests.length} {filteredInvitedGuests.length !== invitedGuests.length && `dari ${invitedGuests.length}`} Orang
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-ink/10 text-ink/50 text-xs uppercase tracking-widest">
                          <th className="pb-4 font-medium">Nama Tamu</th>
                          <th className="pb-4 font-medium">WhatsApp</th>
                          <th className="pb-4 font-medium text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedInvitedGuests.map((guest) => (
                          <tr key={guest.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5 transition-colors">
                            <td className="py-4">
                              <p className="font-medium text-ink">{guest.name}</p>
                              <p className="text-[10px] text-brand/60 font-mono mt-1 truncate max-w-[200px]">{generateLink(guest.name)}</p>
                            </td>
                            <td className="py-4 text-ink/70 text-sm">{guest.phone || '-'}</td>
                            <td className="py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleCopyLink(guest.name)}
                                  className="p-2 rounded-xl bg-ink/5 text-ink/60 hover:bg-brand/10 hover:text-brand transition-all cursor-pointer"
                                  title="Salin Link"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => generateInvitationImage(guest.name)}
                                  className="p-2 rounded-xl bg-dustyrose/10 text-dustyrose hover:bg-dustyrose/20 transition-all cursor-pointer"
                                  title="Generate Image"
                                >
                                  <LayoutDashboard className="w-4 h-4" />
                                </button>
                                {guest.phone && (
                                  <button
                                    onClick={() => handleSendWhatsApp(guest.name, guest.phone)}
                                    className="p-2 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-all cursor-pointer"
                                    title="Kirim WhatsApp"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteGuest(guest.id)}
                                  className="p-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {invitedGuests.length === 0 && (
                          <tr>
                            <td colSpan={3} className="py-12 text-center text-ink/30 italic font-light">
                              Belum ada tamu yang ditambahkan
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Pagination 
                    currentPage={currentPageInvited}
                    totalItems={filteredInvitedGuests.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPageInvited}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
