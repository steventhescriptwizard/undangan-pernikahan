import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, MessageSquare, CheckCircle, XCircle, Settings, Home, LogOut, LayoutDashboard, Mail, Lock, ArrowRight, Save, CheckCircle2, UserPlus, Copy, Send, Trash2 } from 'lucide-react';
import { Message } from './App';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { supabase } from './lib/supabase';
import Swal from 'sweetalert2';

interface DashboardProps {
  messages: Message[];
}

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we accept any non-empty credentials
    if (email && password) {
      onLogin();
      navigate('/dashboard');
    }
  };

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
          <p className="text-ink/50 text-sm font-light">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-ink/10 bg-ink/5 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all"
                placeholder="admin@wedding.com"
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
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-ink/10 bg-ink/5 font-light text-ink focus:outline-none focus:border-brand/50 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-2xl bg-brand text-white font-sans text-sm uppercase tracking-[0.2em] transition-all hover:shadow-[0_0_40px_rgba(197,168,128,0.4)] mt-4 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

export const Dashboard = ({ messages }: DashboardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('wedding_admin_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'messages' | 'settings' | 'invite'>('overview');

  // Settings state
  const [settings, setSettings] = useState({
    groom_name: 'Romeo',
    bride_name: 'Juliet',
    event_date: 'Sabtu, 24 Agustus 2026',
    bank_name: 'BCA',
    bank_account: '1234567890',
    bank_owner: 'Nama Mempelai',
    akad_time: '08:00 WIB - Selesai',
    akad_place: 'Masjid Istiqlal Jakarta',
    akad_address: 'Jl. Taman Wijaya Kusuma, Ps. Baru, Kec. Sawah Besar, Jakarta Pusat',
    akad_maps_url: 'https://maps.google.com/?q=Masjid+Istiqlal+Jakarta',
    resepsi_time: '11:00 WIB - 14:00 WIB',
    resepsi_place: 'Hotel Indonesia Kempinski',
    resepsi_address: 'Jl. M.H. Thamrin No.1, Menteng, Kec. Menteng, Kota Jakarta Pusat',
    resepsi_maps_url: 'https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta',
    short_date: '24 . 08 . 2026',
    countdown_target: '2026-08-24T08:00:00',
    cover_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
    hero_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
  });
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Invited Guests state
  const [invitedGuests, setInvitedGuests] = useState<any[]>([]);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '' });
  const [isAddingGuest, setIsAddingGuest] = useState(false);

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
    const { data, error } = await supabase.from('settings').select('*').limit(1).single();
    if (data && !error) {
      setSettings({
        groom_name: data.groom_name || 'Romeo',
        bride_name: data.bride_name || 'Juliet',
        event_date: data.event_date || 'Sabtu, 24 Agustus 2026',
        bank_name: data.bank_name || 'BCA',
        bank_account: data.bank_account || '1234567890',
        bank_owner: data.bank_owner || 'Nama Mempelai',
        akad_time: data.akad_time || '08:00 WIB - Selesai',
        akad_place: data.akad_place || 'Masjid Istiqlal Jakarta',
        akad_address: data.akad_address || 'Jl. Taman Wijaya Kusuma, Ps. Baru, Kec. Sawah Besar, Jakarta Pusat',
        akad_maps_url: data.akad_maps_url || 'https://maps.google.com/?q=Masjid+Istiqlal+Jakarta',
        resepsi_time: data.resepsi_time || '11:00 WIB - 14:00 WIB',
        resepsi_place: data.resepsi_place || 'Hotel Indonesia Kempinski',
        resepsi_address: data.resepsi_address || 'Jl. M.H. Thamrin No.1, Menteng, Kota Jakarta Pusat',
        resepsi_maps_url: data.resepsi_maps_url || 'https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta',
        short_date: data.short_date || '24 . 08 . 2026',
        countdown_target: data.countdown_target || '2026-08-24T08:00:00',
        cover_image: data.cover_image || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
        hero_image: data.hero_image || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
      });
      setSettingsId(data.id);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      if (settingsId) {
        const { error } = await supabase.from('settings').update(settings).eq('id', settingsId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('settings').insert([settings]).select().single();
        if (error) throw error;
        if (data) setSettingsId(data.id);
      }
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

  if (!isAuthenticated) {
    return <Login onLogin={() => {
      setIsAuthenticated(true);
      localStorage.setItem('wedding_admin_auth', 'true');
    }} />;
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
      {/* Sidebar */}
      <aside className="w-64 bg-ink text-cream flex flex-col shadow-2xl z-20 hidden md:flex">
        <div className="p-8 border-b border-white/10">
          <h2 className="font-serif text-2xl italic text-brand tracking-wide">Wedding Admin</h2>
          <p className="text-xs text-cream/50 mt-2 uppercase tracking-widest">Dashboard</p>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'overview' ? 'bg-brand/20 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('guests')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'guests' ? 'bg-brand/20 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Guests RSVP</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'messages' ? 'bg-brand/20 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Wishes</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'settings' ? 'bg-brand/20 text-brand' : 'text-cream/70 hover:bg-white/5 hover:text-cream'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium tracking-wide text-sm">Settings</span>
          </button>
          <button 
            onClick={() => setActiveTab('invite')}
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
            onClick={() => {
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
              {/* Mobile menu button could go here */}
              <Link to="/" className="text-brand text-sm font-medium uppercase tracking-widest border-b border-brand pb-1">View Site</Link>
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
                      <table className="w-full text-left border-collapse">
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
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guests' && (
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-ink/5 border border-brand/10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-serif text-2xl text-ink">All Guests</h3>
                  <div className="text-sm text-ink/50 bg-ink/5 px-4 py-2 rounded-full">Total: {totalGuests} RSVPs</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-ink/10 text-ink/50 text-xs uppercase tracking-widest">
                        <th className="pb-4 font-medium">Name</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium">Pax</th>
                        <th className="pb-4 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((msg) => (
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
                </div>
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
              <div className="space-y-8 max-w-2xl">
                {/* ... existing settings content ... */}
                {/* Save Button */}
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="flex items-center gap-3 px-10 py-4 bg-brand text-white rounded-full font-sans text-xs uppercase tracking-[0.2em] hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saveSuccess ? (
                    <><CheckCircle2 className="w-4 h-4" /> Tersimpan!</>
                  ) : (
                    <><Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</>
                  )}
                </button>
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
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-2xl text-ink">Daftar Undangan</h3>
                    <div className="text-sm text-ink/50 bg-ink/5 px-4 py-2 rounded-full">Total: {invitedGuests.length} Orang</div>
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
                        {invitedGuests.map((guest) => (
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
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};
