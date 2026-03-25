/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Music, Quote, CheckCircle2, X, ArrowLeft, Flower2, MailOpen, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { supabase } from './lib/supabase';
import { FallingPetals, SparkleAccent } from './components/FallingPetals';

export interface Message {
  id: number;
  name: string;
  text: string;
  time: string;
  attend: string;
  guests?: string;
}

export interface SiteSettings {
  groom_name: string;
  bride_name: string;
  event_date: string;
  bank_name: string;
  bank_account: string;
  bank_owner: string;
  // Ngunduh Manten
  akad_time: string;
  akad_place: string;
  akad_address: string;
  akad_maps_url: string;
  // Resepsi
  resepsi_time: string;
  resepsi_place: string;
  resepsi_address: string;
  resepsi_maps_url: string;
  // Dynamic Images & Config
  short_date: string;
  countdown_target: string;
  cover_image: string;
  hero_image: string;
  streaming_url?: string;
  gift_qr_url?: string;
  gallery_images?: string[];
  love_story?: { year: string; title: string; description: string }[];
  // Wallet Settings
  wallet_name?: string;
  wallet_number?: string;
  wallet_owner?: string;
  footer_image: string;
  footer_image_2: string;
  footer_image_3: string;
  footer_image_4: string;
}

interface CoverProps {
  isOpened: boolean;
  onOpen: () => void;
  settings: SiteSettings;
}

export const Cover = ({ isOpened, onOpen, settings }: CoverProps) => {
  const [guestName, setGuestName] = useState('Tamu Undangan');

  useEffect(() => {
    // Get guest name from URL parameter ?to=Name
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
    }
  }, []);

  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpened]);

  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%', opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-maroon" >
          
          <FallingPetals />

          {/* Corner Ornaments — bunga 01.svg × 4 corners */}
          {/* Top Left */}
          <motion.img
            src="/assets/ornamen/bunga 01.svg"
            alt="Ornamen pojok kiri atas"
            className="fixed top-0 left-0 w-24 md:w-32 lg:w-40 pointer-events-none"
            style={{ transformOrigin: 'top left' }}
            initial={{ opacity: 0, x: -40, y: -40, rotate: -15, scale: 0.8 }}
            animate={{
              opacity: 0.75,
              x: 0,
              y: [0, -10, 0, -6, 0],
              rotate: [-4, 2, -4],
              scale: 1,
            }}
            transition={{
              opacity: { duration: 1.6, delay: 0.5, ease: 'easeOut' },
              x: { duration: 1.6, delay: 0.5, ease: 'easeOut' },
              y: { duration: 7, delay: 2.0, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 10, delay: 2.0, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 1.6, delay: 0.5, ease: 'easeOut' },
            }}
          />
          {/* Top Right */}
          <motion.img
            src="/assets/ornamen/bunga 01.svg"
            alt="Ornamen pojok kanan atas"
            className="fixed top-0 right-0 w-24 md:w-32 lg:w-40 pointer-events-none"
            style={{ transformOrigin: 'top right', transform: 'scaleX(-1)' }}
            initial={{ opacity: 0, x: 40, y: -40, rotate: 15, scale: 0.8 }}
            animate={{
              opacity: 0.75,
              x: 0,
              y: [0, -8, 0, -5, 0],
              rotate: [3, -3, 3],
              scale: 1,
            }}
            transition={{
              opacity: { duration: 1.6, delay: 0.7, ease: 'easeOut' },
              x: { duration: 1.6, delay: 0.7, ease: 'easeOut' },
              y: { duration: 8, delay: 2.3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 11, delay: 2.3, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 1.6, delay: 0.7, ease: 'easeOut' },
            }}
          />
          {/* Bottom Left */}
          <motion.img
            src="/assets/ornamen/bunga 01.svg"
            alt="Ornamen pojok kiri bawah"
            className="fixed bottom-0 left-0 w-24 md:w-32 lg:w-40 pointer-events-none"
            style={{ transformOrigin: 'bottom left', transform: 'scaleY(-1)' }}
            initial={{ opacity: 0, x: -40, y: 40, rotate: 10, scale: 0.8 }}
            animate={{
              opacity: 0.75,
              x: 0,
              y: [0, 10, 0, 6, 0],
              rotate: [4, -2, 4],
              scale: 1,
            }}
            transition={{
              opacity: { duration: 1.6, delay: 0.9, ease: 'easeOut' },
              x: { duration: 1.6, delay: 0.9, ease: 'easeOut' },
              y: { duration: 9, delay: 2.6, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 12, delay: 2.6, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 1.6, delay: 0.9, ease: 'easeOut' },
            }}
          />
          {/* Bottom Right */}
          <motion.img
            src="/assets/ornamen/bunga 01.svg"
            alt="Ornamen pojok kanan bawah"
            className="fixed bottom-0 right-0 w-24 md:w-32 lg:w-40 pointer-events-none"
            style={{ transformOrigin: 'bottom right', transform: 'scale(-1, -1)' }}
            initial={{ opacity: 0, x: 40, y: 40, rotate: -10, scale: 0.8 }}
            animate={{
              opacity: 0.75,
              x: 0,
              y: [0, 8, 0, 5, 0],
              rotate: [-3, 3, -3],
              scale: 1,
            }}
            transition={{
              opacity: { duration: 1.6, delay: 1.1, ease: 'easeOut' },
              x: { duration: 1.6, delay: 1.1, ease: 'easeOut' },
              y: { duration: 10, delay: 2.9, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 13, delay: 2.9, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 1.6, delay: 1.1, ease: 'easeOut' },
            }}
          />

          <div className="w-full min-h-full flex items-center justify-center py-10">
            {/* Main Arch Container */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="relative w-[85%] max-w-sm lg:max-w-md h-auto bg-cream/85 backdrop-blur-md border border-white/60 rounded-t-[200px] rounded-b-2xl shadow-2xl shadow-black/40 flex flex-col items-center pt-12 pb-8 md:pt-14 md:pb-10 px-4 md:px-6 text-ink isolate"
            >
              <SparkleAccent count={6} />
              
              {/* Top Text */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-4 md:mb-5 z-10 mt-2"
              >
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-ink/60 leading-relaxed">
                  UNDANGAN
                </p>
              </motion.div>

              {/* Names */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-4 md:mb-6 z-10"
              >
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-maroon leading-none transform -rotate-2">
                  {settings.groom_name} <span className="text-2xl md:text-3xl lg:text-4xl text-maroon">&</span><br/>{settings.bride_name}
                </h1>
              </motion.div>

              {/* Middle Text */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-6 md:mb-8 z-10"
              >
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-sans font-medium text-ink/80 leading-relaxed">
                  Mengundang Anda<br/>Dalam Acara
                </p>
              </motion.div>

              {/* Date & Time */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-6 md:mb-8 z-10 flex flex-col items-center"
              >
                <p className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-sans font-semibold text-maroon mb-3">Ngunduh Mantu</p>
                <div className="flex flex-col items-center gap-2 text-ink">
                  <p className="text-xs md:text-sm font-serif font-medium uppercase tracking-[0.1em]">{settings.event_date}</p>
                  <div className="w-8 h-px bg-brand/50 my-1"></div>
                  <p className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-sans">{settings.akad_time}</p>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 2.0, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-5 md:mb-6 z-10"
              >
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-sans font-medium text-ink/80 max-w-[200px] leading-relaxed mx-auto">
                  {settings.akad_place}
                </p>
              </motion.div>

              {/* Guest Info & Button */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col items-center mt-auto z-10 bg-maroon/5 backdrop-blur-sm p-4 rounded-xl border border-maroon/10"
              >
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-ink/60 mb-1">Kepada Yth.</p>
                <p className="font-serif text-base md:text-lg font-medium text-maroon mb-4 text-center">{guestName}</p>
                
                <button 
                  onClick={onOpen}
                  className="group relative inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3 overflow-hidden rounded-full bg-maroon text-cream font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <MailOpen className="w-3 h-3 md:w-3.5 md:h-3.5" /> Buka Undangan
                  </span>
                  <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 ease-out group-hover:scale-100"></div>
                </button>
              </motion.div>

              {/* Overlapping Couple Photo */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 2.4, ease: "easeOut" }}
                className="absolute top-[45%] lg:top-[50%] left-0 md:-left-12 lg:-left-16 transform -translate-y-1/2 -translate-x-1/4 md:translate-x-0 w-24 h-36 md:w-32 md:h-48 lg:w-40 lg:h-56 rounded-t-full rounded-b-full overflow-hidden border-[3px] md:border-4 border-cream shadow-[0_10px_30px_rgba(0,0,0,0.15)] z-20"
              >
                <img 
                  src={settings.cover_image} 
                  alt="Couple" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Hero = ({ settings }: { settings: SiteSettings }) => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden bg-cream">
    {/* Decorative background elements */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand/10 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-dustyrose/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
    </div>

    {/* Corner Ornaments */}
    <motion.img
      src="/assets/ornamen/ornamen%20kiri%20atas.svg"
      alt="Ornament Top Left"
      initial={{ opacity: 0, x: -20, y: -20 }}
      animate={{ opacity: 0.6, x: 0, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
      className="absolute top-2 left-2 md:top-6 md:left-6 w-14 md:w-20 lg:w-28 pointer-events-none z-0 animate-float"
    />
    <motion.img
      src="/assets/ornamen/ornamen%20kanan%20atas.svg"
      alt="Ornament Top Right"
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 0.6, x: 0, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
      className="absolute top-2 right-2 md:top-6 md:right-6 w-14 md:w-20 lg:w-28 pointer-events-none z-0 animate-sway origin-top-right"
    />
    <motion.img
      src="/assets/ornamen/ornamen%20kiri%20bawah.svg"
      alt="Ornament Bottom Left"
      initial={{ opacity: 0, x: -20, y: 20 }}
      animate={{ opacity: 0.6, x: 0, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
      className="absolute bottom-2 left-2 md:bottom-6 md:left-6 w-14 md:w-20 lg:w-28 pointer-events-none z-0 animate-sway origin-bottom-left"
    />
    
    <div className="animate-fade-in z-20 flex flex-col items-center w-full max-w-5xl">
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="text-brand uppercase tracking-[0.3em] text-xs md:text-sm font-medium mb-8 md:mb-12 w-full text-center"
      >
        Ngunduh Mantu Celebration Of
      </motion.p>
      
      <div className="relative w-full md:grid md:grid-cols-3 md:items-center flex flex-col items-center gap-8 md:gap-0 mb-12 md:mb-16">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-6xl md:text-7xl lg:text-8xl text-ink font-light tracking-tight text-shimmer animate-text-glow md:text-right"
        >
          {settings.groom_name}
        </motion.h1>
        
        <div className="flex justify-center w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative w-56 h-72 md:w-64 md:h-80 lg:w-80 lg:h-[28rem] mx-auto z-10"
          >
            <div className="absolute inset-0 border border-brand/40 rounded-t-full rounded-b-full scale-[1.05] -rotate-3 transition-transform duration-700 hover:rotate-0"></div>
            <div className="absolute inset-0 border border-dustyrose/40 rounded-t-full rounded-b-full scale-[1.05] rotate-3 transition-transform duration-700 hover:rotate-0"></div>
            <img 
              alt="Couple" 
              className="w-full h-full object-cover rounded-t-full rounded-b-full shadow-2xl" 
              src={settings.hero_image} 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 md:-bottom-8 w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-cream z-20 animate-heartbeat animate-glow-pulse">
              <span className="font-serif text-4xl md:text-5xl text-brand italic">&</span>
            </div>
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-6xl md:text-7xl lg:text-8xl text-ink font-light tracking-tight text-shimmer-delayed animate-text-glow md:text-left"
        >
          {settings.bride_name}
        </motion.h1>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="flex flex-col items-center space-y-8 mt-4"
      >
        <div className="flex items-center gap-4 text-ink/70">
          <span className="h-px w-12 md:w-24 bg-brand/50"></span>
          <p className="font-serif text-xl md:text-2xl italic tracking-wide">{settings.short_date}</p>
          <span className="h-px w-12 md:w-24 bg-brand/50"></span>
        </div>
        <a 
          href="#event" 
          className="group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden rounded-full bg-brand text-white font-sans text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,168,128,0.4)]"
        >
          <span className="relative z-10">Save the Date</span>
          <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 ease-out group-hover:scale-100"></div>
        </a>
      </motion.div>
    </div>

    <motion.img
      src="/assets/ornamen/ornamen%20kanan%20bawah.svg"
      alt="Ornament Bottom Right"
      initial={{ opacity: 0, x: 20, y: 20 }}
      animate={{ opacity: 0.6, x: 0, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut", delay: 0.9 }}
      className="absolute bottom-2 right-2 md:bottom-6 md:right-6 w-14 md:w-20 lg:w-28 pointer-events-none z-0 animate-float-delayed"
    />
  </section>
);

const Countdown = ({ settings }: { settings: SiteSettings }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Parse target date from string (e.g. "2026-08-24T08:00:00")
    // Fallback to 1 year ahead if invalid/missing
    let targetTime = new Date(settings.countdown_target).getTime();
    if (isNaN(targetTime)) {
        targetTime = new Date().getTime() + (365 * 24 * 60 * 60 * 1000);
    }
    const weddingDate = targetTime;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>



      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-brand uppercase tracking-[0.2em] text-xs font-medium mb-3">Menuju Hari Bahagia</p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink font-light">Menghitung Hari</h2>
          <div className="w-16 h-px bg-brand/50 mx-auto mt-6"></div>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { label: 'Hari', value: timeLeft.days },
            { label: 'Jam', value: timeLeft.hours },
            { label: 'Menit', value: timeLeft.minutes },
            { label: 'Detik', value: timeLeft.seconds }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                delay: idx * 0.15,
                ease: [0.21, 1.11, 0.81, 0.99] // Custom spring-like easing
              }}
              className="bg-white/40 backdrop-blur-md p-4 md:p-8 rounded-3xl border border-brand/20 shadow-xl shadow-brand/5 relative group overflow-hidden"
            >
              <motion.div 
                className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
              <span className="block text-4xl md:text-6xl font-serif text-ink font-light mb-2 relative z-10 tabular-nums">
                {item.value.toString().padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand font-semibold relative z-10">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventDetails = ({ settings }: { settings: SiteSettings }) => {
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Jika sudah format embed, kembalikan langsung
    if (url.includes('google.com/maps/embed') || url.includes('google.com/maps/search')) return url;
    
    // Jika link Google Maps (baik pendek maupun panjang)
    if (url.includes('maps.app.goo.gl') || url.includes('google.com/maps') || url.includes('goo.gl/maps')) {
      // Coba ekstrak nama tempat dari URL jika ada format /place/Nama+Tempat
      const placeMatch = url.match(/place\/([^\/\?]+)/);
      if (placeMatch && placeMatch[1]) {
        return `https://www.google.com/maps?q=${placeMatch[1]}&output=embed`;
      }
      
      // Jika tidak ada /place/, gunakan Nama Tempat (akad_place) sebagai query pencarian
      // Ini adalah cara paling ampuh untuk link pendek
      if (settings.akad_place) {
        return `https://www.google.com/maps?q=${encodeURIComponent(settings.akad_place + ' ' + (settings.akad_address || ''))}&output=embed`;
      }
    }
    
    return '';
  };

  const getDirectionsUrl = (url: string) => {
    if (!url) return '#';
    // If it's an embed URL, try to make it a searchable link for the directions button
    if (url.includes('google.com/maps/embed')) {
      const match = url.match(/pb=!1m18!1m12!1m3!1d[^\!]+\!2d([^\!]+)\!3d([^\!]+)/);
      if (match && match[1] && match[2]) {
        return `https://www.google.com/maps?q=${match[2]},${match[1]}`;
      }
    }
    return url;
  };

  return (
    <section id="event" className="py-32 bg-cream relative overflow-hidden">
    {/* Decorative background elements */}
    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
    <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none"></div>
    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-dustyrose/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none"></div>



    <div className="container mx-auto px-4 max-w-6xl relative z-10">
      <div className="text-center mb-24">
        <motion.p 
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-brand uppercase tracking-[0.3em] text-xs font-semibold mb-3"
        >
          Informasi
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl text-ink font-light tracking-tight"
        >
          Acara Ngunduh Manten
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-16 h-px bg-brand/50 mx-auto mt-6"
        ></motion.div>
      </div>
      
      <div className="flex justify-center">
        {/* Ngunduh Manten */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-ink/5 border border-brand/10 text-center relative group overflow-hidden flex flex-col max-w-2xl w-full hover:shadow-brand/10 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 transform group-hover:scale-110 group-hover:rotate-12">
            <MapPin className="w-40 h-40 text-brand" />
          </div>
          
          <div className="relative z-10 flex-grow">
            <h3 className="font-serif text-4xl md:text-5xl mb-8 text-ink font-light">Ngunduh Manten</h3>
            <div className="space-y-6 text-ink/70">
              <div className="bg-brand/5 py-4 px-8 rounded-full inline-block mb-4 border border-brand/10">
                <p className="font-serif text-xl text-ink">{settings.event_date}</p>
                <p className="text-brand font-medium tracking-widest text-xs uppercase mt-1">{settings.akad_time}</p>
              </div>
              
              <div className="pt-4 pb-2">
                <p className="font-serif text-2xl text-ink mb-2">{settings.akad_place}</p>
                <p className="text-sm mt-2 text-ink/50 max-w-xs mx-auto font-light leading-relaxed">{settings.akad_address}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 relative z-10">
            <div className="w-full h-72 rounded-[1.5rem] overflow-hidden border border-brand/10 shadow-inner mb-8 group-hover:border-brand/30 transition-colors duration-500">
              {getEmbedUrl(settings.akad_maps_url) ? (
                <iframe 
                  src={getEmbedUrl(settings.akad_maps_url)} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Ngunduh Manten"
                  className="grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-brand/5 p-8 text-ink/40">
                  <MapPin className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-[10px] font-sans uppercase tracking-widest mb-2 opacity-60">Lokasi Acara</p>
                  <p className="font-serif text-lg text-ink text-center mb-4">{settings.akad_place}</p>
                  <a 
                    href={settings.akad_maps_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-brand border-b border-brand pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    Klik untuk melihat peta interaktif
                  </a>
                </div>
              )}
            </div>
            
            <a 
              href={getDirectionsUrl(settings.akad_maps_url)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand text-white hover:bg-brand/90 transition-all duration-300 rounded-full font-sans text-xs uppercase tracking-[0.2em] w-full shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Lihat Petunjuk Arah</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);
};

const LoveStory = ({ settings }: { settings: SiteSettings }) => {
  const milestones = settings.love_story && settings.love_story.length > 0 ? settings.love_story : [
    {
      year: '2020',
      title: 'First Meet',
      description: 'Pertemuan pertama yang tak terduga, di mana dua orang asing mulai saling mengenal dan menuliskan cerita mereka.',
    },
    {
      year: '2021',
      title: 'First Date',
      description: 'Kencan pertama kami di sebuah kedai kopi kecil, menghabiskan waktu berjam-jam hanya untuk mengobrol dan tertawa bersama.',
    },
    {
      year: '2022',
      title: 'The Proposal',
      description: 'Setelah melewati banyak suka dan duka, di bawah langit malam yang indah, kami memutuskan untuk melangkah ke jenjang yang lebih serius.',
    },
    {
      year: '2023',
      title: 'Engagement',
      description: 'Momen pertunangan kami yang hangat, disaksikan oleh keluarga besar dan sahabat terdekat yang selalu mendukung kami.',
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-dustyrose/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Corner Ornaments */}
      {/* Top Left — ornamen love kiri 02 */}
      <motion.img
        src="/assets/ornamen/ornamen%20love%20kiri%2002.svg"
        alt="Ornament Top Left"
        initial={{ opacity: 0, x: -30, y: -30, rotate: -10 }}
        whileInView={{ opacity: 0.7, x: 0, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.1 }}
        className="absolute top-2 left-2 md:top-6 md:left-6 w-12 md:w-16 lg:w-20 pointer-events-none z-0 animate-sway origin-top-left"
      />
      {/* Top Right — ornamen love kanan 02 */}
      <motion.img
        src="/assets/ornamen/ornamen%20love%20kanan%2002.svg"
        alt="Ornament Top Right"
        initial={{ opacity: 0, x: 30, y: -30, rotate: 10 }}
        whileInView={{ opacity: 0.7, x: 0, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.25 }}
        className="absolute top-2 right-2 md:top-6 md:right-6 w-12 md:w-16 lg:w-20 pointer-events-none z-0 animate-float origin-top-right"
      />
      {/* Bottom Left — ornamen love kanan 02 (flipped horizontally) */}
      <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6 w-12 md:w-16 lg:w-20 pointer-events-none z-0" style={{ transform: 'scaleX(-1)' }}>
        <motion.img
          src="/assets/ornamen/ornamen%20love%20kanan%2002.svg"
          alt="Ornament Bottom Left"
          initial={{ opacity: 0, x: 30, y: 30, rotate: -10 }}
          whileInView={{ opacity: 0.7, x: 0, y: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
          className="w-full h-full animate-sway origin-bottom-right"
        />
      </div>
      {/* Bottom Right — ornamen balon */}
      <motion.img
        src="/assets/ornamen/ornamen%20balon.svg"
        alt="Ornament Bottom Right"
        initial={{ opacity: 0, x: 30, y: 30, scale: 0.8 }}
        whileInView={{ opacity: 0.75, x: 0, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
        className="absolute bottom-2 right-2 md:bottom-6 md:right-6 w-12 md:w-16 lg:w-20 pointer-events-none z-0 animate-float-delayed origin-bottom-right"
      />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand uppercase tracking-[0.2em] text-xs font-medium mb-3"
          >
            Perjalanan Cinta Kami
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-ink font-light"
          >
            Our Love Story
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-px bg-brand/50 mx-auto mt-6"
          ></motion.div>
        </div>
        
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-[1px] bg-gradient-to-b from-transparent via-brand/30 to-transparent"></div>
          
          <div className="space-y-16 md:space-y-24">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                initial={{ 
                  opacity: 0, 
                  x: index % 2 === 0 ? 50 : -50,
                  filter: "blur(10px)"
                }}
                whileInView={{ 
                  opacity: 1, 
                  x: 0,
                  filter: "blur(0px)"
                }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className={`flex flex-col md:flex-row items-start md:items-center relative group ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-brand z-10 shadow-[0_0_0_6px_rgba(255,255,255,1)] transition-all duration-700 group-hover:scale-150 group-hover:bg-brand">
                  <div className="w-2 h-2 rounded-full bg-brand group-hover:bg-white transition-colors duration-500"></div>
                </div>
                
                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-20 text-left' : 'md:pr-20 md:text-right'}`}>
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="inline-block px-5 py-1.5 rounded-full border border-brand/30 text-brand text-[10px] font-bold tracking-[0.2em] mb-4 bg-brand/5 backdrop-blur-sm"
                  >
                    {milestone.year}
                  </motion.span>
                  <h4 className="font-serif text-3xl md:text-4xl text-ink mb-4 tracking-tight">{milestone.title}</h4>
                  <p className="text-ink/60 text-sm md:text-base leading-relaxed font-light italic">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const getGalleryImages = (settings: SiteSettings) => {
  return settings.gallery_images && settings.gallery_images.length > 0 ? settings.gallery_images : [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD9tU_dRvaeM6K_Zdub63NP1PDS0agjCqDBKWAk_5filw1FJhUXpyyV1OWPzDUM4D45gScup2R7ODysB6kZHWNDsg725LkAIGFWeUW7lgg2mdS-4ydDrMafzfRvo4uFjlGMjLgWEW-Tt_do53Wh_Qpgwx7FCvaQ3f8KKLHx9LjaKxtXOQZDBLV6NvsDJTVmBOkoFMREfBlnecOo4FnRYAW0b1opL224gxkEywHmh9brqWvQrDkteRaFVKPbqgwzdpB5gi2yAFsErliO",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC-Hqp8dB2AmQybtmJ160z9knnRQw6Id6oH6-RiNTzm9xEGA_kJwl1ZC2xbTLEUD0UPohGB9Q-8jIXpAzSYwm_U7ypOQA7SpLUYyTFqQ1pKdYaxzFs8muWMHJB9k9YO8Xm9v1KjM28W7Z-tjmzK2sPQm2rtL0NcKYSU3T5vpexoC2oNIS0uPMEmCpVgq0Sb2I3a6QLSqM_G0U5E-DZZIAEgDHN8S_YxfCa-eUAPJhVKrjs2WmDbfx0azduHZFwof-vnIT0L1vPhFcU",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCHcjw_MCBbX30FzkAboOBdgJgJcNXovmocz2hhe-cnz3SXLrUY6bkDTWjzRcnL9Rn6A2zKI9XXodD82FO9AnHZRe8KcfSBgFsDBua4j297-MC-l3KOFVMy524EQlQhZUQVnT-GQwRqdqcAbxpEeN8v4SZWoFvzomfI4gqL9b7FphyhQjywF7XcXjfeEz1wsFDZQUAosulBm15z-zktLBx4ceusWmxBeECwhM3K17l4Y15CNDo2vBI_XcA5mftsS8ZnxDBg8vMTchwM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCx8-XBWG2nzhsp9SqKYgBB0TT6pgus76oGr_XQzK6NJhYGRZ_ngFWN63j7cNcEogwgMUgFNmxULOhSlRYINECk_oOn2UGOqc2eB9C1HxO_X8AQGpuyt8egkeCgIzKl3rhfYAdN-BhXsJCzFMBcPwpZ4Rk03KbJweGRlm-5aZ7EFJ4vmzByDA8K4A3xYRyHYAuSg5JG-PrgSFDidJO76YkTxNGauoLAJaKdg3skgjlJWUOATGkzHItWXjOyh0jHs7cyiVf2ml2yd1r-"
  ];
};

const Gallery = ({ settings, onImageSelect }: { settings: SiteSettings, onImageSelect: (src: string) => void }) => {
  const images = getGalleryImages(settings);

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section id="gallery" ref={containerRef} className="py-32 bg-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-dustyrose/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none"></div>



      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand uppercase tracking-[0.2em] text-xs font-medium mb-3"
          >
            Momen Bahagia
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-ink font-light"
          >
            Prewedding Gallery
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="w-16 h-px bg-brand/50 mx-auto mt-6"
          ></motion.div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {images.map((src, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1, 
                delay: idx * 0.1,
                ease: "easeOut" 
              }}
              style={{ y: idx % 2 === 0 ? y1 : y2 }}
              onClick={() => onImageSelect(src)}
              className="overflow-hidden rounded-[2.5rem] aspect-[3/4] shadow-2xl shadow-ink/10 relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/40 transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 shadow-xl">
                  <Flower2 className="w-6 h-6 text-white animate-spin-slow" />
                </div>
              </div>
              <img 
                alt="Gallery" 
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" 
                src={src} 
                referrerPolicy="no-referrer" 
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WeddingGift = ({ settings }: { settings: SiteSettings }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
      


      <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <p className="text-brand uppercase tracking-[0.3em] text-xs font-semibold mb-3">Tanda Kasih</p>
          <h2 className="font-serif text-4xl md:text-6xl text-ink font-light tracking-tight">Wedding Gift</h2>
          <div className="w-20 h-px bg-brand/50 mx-auto mt-8"></div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-ink/70 mb-16 font-light leading-relaxed max-w-xl mx-auto italic"
        >
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan kasih Anda, kami sediakan fitur berikut:
        </motion.p>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="p-10 bg-white rounded-[2.5rem] shadow-2xl shadow-brand/5 border border-brand/10 relative overflow-hidden group hover:shadow-brand/20 transition-all duration-700 isolate"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand/15 transition-colors duration-700 pointer-events-none -z-10"></div>
            <p className="font-sans font-semibold tracking-[0.3em] text-xs text-ink/40 uppercase mb-6">{settings.bank_name || 'BCA'}</p>
            <p className="text-3xl md:text-4xl font-serif text-brand mb-6 tracking-wider leading-none">{settings.bank_account || '1234567890'}</p>
            <p className="text-xs text-ink/50 font-bold uppercase tracking-[0.2em]">A/N {settings.bank_owner}</p>
            <div className="mt-10 flex justify-center">
              <button 
                onClick={() => handleCopy(settings.bank_account || '1234567890', 'bca')}
                className="group relative px-8 py-3 rounded-full overflow-hidden border border-brand/30 transition-all duration-500 hover:border-brand cursor-pointer"
              >
                <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10 text-[10px] uppercase font-bold tracking-[0.3em] text-brand group-hover:text-white transition-colors duration-500">
                  {copied === 'bca' ? 'Tersalin!' : 'Salin Rekening'}
                </span>
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="p-10 bg-white rounded-[2.5rem] shadow-2xl shadow-dustyrose/5 border border-dustyrose/10 relative overflow-hidden group hover:shadow-dustyrose/20 transition-all duration-700 isolate"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-dustyrose/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-dustyrose/15 transition-colors duration-700 pointer-events-none -z-10"></div>
            {settings.gift_qr_url ? (
              <div className="space-y-6">
                <p className="font-sans font-semibold tracking-[0.3em] text-xs text-ink/40 uppercase mb-4">Digital Gift / QRIS</p>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-52 h-52 mx-auto bg-white p-3 rounded-[1.5rem] border border-ink/5 shadow-inner transition-transform duration-700 flex items-center justify-center overflow-hidden"
                >
                  <img 
                    src={settings.gift_qr_url} 
                    alt="Gift QR" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </motion.div>
                <div>
                  <p className="text-xs text-ink/50 font-bold uppercase tracking-[0.2em] mb-1">A/N {settings.bank_owner}</p>
                  <p className="text-[10px] text-ink/30 italic">Scan QR untuk mengirim tanda kasih</p>
                </div>
              </div>
            ) : (
              <>
                <p className="font-sans font-semibold tracking-[0.3em] text-xs text-ink/40 uppercase mb-6">{settings.wallet_name || 'DANA / GOPAY'}</p>
                <p className="text-3xl md:text-4xl font-serif text-dustyrose mb-6 tracking-wider leading-none">{settings.wallet_number || '0812-XXXX-XXXX'}</p>
                <p className="text-xs text-ink/50 font-bold uppercase tracking-[0.2em]">A/N {settings.wallet_owner || 'Nama Mempelai'}</p>
                <div className="mt-10 flex justify-center">
                  <button 
                    onClick={() => handleCopy(settings.wallet_number || '0812-XXXX-XXXX', 'dana')}
                    className="group relative px-8 py-3 rounded-full overflow-hidden border border-dustyrose/30 transition-all duration-500 hover:border-dustyrose cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-dustyrose translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative z-10 text-[10px] uppercase font-bold tracking-[0.3em] text-dustyrose group-hover:text-white transition-colors duration-500">
                      {copied === 'dana' ? 'Tersalin!' : 'Salin Nomor'}
                    </span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Streaming = ({ settings }: { settings: SiteSettings }) => {
  if (!settings.streaming_url) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-12"
        >
          <p className="text-brand uppercase tracking-[0.3em] text-xs font-semibold mb-3">Siaran Langsung</p>
          <h2 className="font-serif text-4xl md:text-6xl text-ink font-light tracking-tight">Live Streaming</h2>
          <div className="w-20 h-px bg-brand/50 mx-auto mt-8"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="p-10 md:p-16 bg-cream rounded-[3rem] shadow-2xl shadow-brand/10 border border-brand/10 relative overflow-hidden group isolate"
        >
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm -z-10"></div>
          <p className="text-ink/70 mb-10 font-light leading-relaxed max-w-xl mx-auto italic md:text-lg">
            Kami mengundang Bapak/Ibu/Saudara/i yang tidak dapat hadir secara langsung untuk menyaksikan momen bahagia kami melalui siaran langsung:
          </p>
          
          <div className="flex justify-center">
            <a 
              href={settings.streaming_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-4 px-10 py-4 bg-brand text-white rounded-full overflow-hidden shadow-xl shadow-brand/20 transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <Music className="w-6 h-6 animate-pulse" />
              <span className="relative z-10 font-bold tracking-[0.2em] text-sm uppercase">Buka Siaran Langsung</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WishesModal = ({ isOpen, onClose, onSubmit, defaultName }: { isOpen: boolean, onClose: () => void, onSubmit: (data: any) => void, defaultName: string }) => {
  const [formData, setFormData] = useState({ name: defaultName || '', guests: '1 Orang', attend: 'Hadir', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.message) {
      setShowConfirm(true);
    }
  };

  const handleConfirmSubmit = () => {
    onSubmit(formData);
    setShowConfirm(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', guests: '1 Orang', attend: 'Hadir', message: '' });
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-lg relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-dustyrose/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-ink/40 hover:text-ink transition-colors cursor-pointer z-50 bg-white/50 rounded-full p-2 backdrop-blur-sm">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-10 relative z-10">
          <p className="text-brand uppercase tracking-[0.2em] text-[10px] font-medium mb-2">Konfirmasi Kehadiran</p>
          <h2 className="font-serif text-4xl text-ink font-light">RSVP</h2>
          <div className="w-12 h-px bg-brand/30 mx-auto mt-4"></div>
        </div>
        
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-12 text-center relative z-10"
            >
              <div className="w-20 h-20 bg-brand/10 text-brand rounded-full flex items-center justify-center mb-6 border border-brand/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl text-ink mb-3 font-light">Terima Kasih</h3>
              <p className="text-ink/60 font-light leading-relaxed">Pesan dan konfirmasi kehadiran Anda<br/>telah kami terima dengan baik.</p>
            </motion.div>
          ) : showConfirm ? (
            <motion.div 
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-8 text-center relative z-10"
            >
              <h3 className="font-serif text-2xl text-ink mb-4 font-light">Konfirmasi Pengiriman</h3>
              <p className="text-ink/60 mb-10 font-light leading-relaxed">Apakah Anda yakin data dan pesan<br/>yang Anda masukkan sudah benar?</p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 rounded-full font-sans text-xs uppercase tracking-widest border border-ink/10 text-ink/60 hover:bg-ink/5 hover:text-ink transition-all cursor-pointer"
                >
                  Kembali Edit
                </button>
                <button 
                  onClick={handleConfirmSubmit}
                  className="flex-1 py-4 rounded-full font-sans text-xs uppercase tracking-widest bg-brand text-white hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 cursor-pointer"
                >
                  Ya, Kirim
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleInitialSubmit} 
              className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 relative z-10"
            >
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-4 rounded-2xl border border-ink/10 focus:ring-1 focus:ring-brand focus:border-brand outline-none transition-all bg-white/50 font-light text-ink placeholder:text-ink/30"
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Kehadiran</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl border border-ink/10 focus:ring-1 focus:ring-brand focus:border-brand outline-none transition-all bg-white/50 font-light text-ink appearance-none"
                    value={formData.attend}
                    onChange={(e) => setFormData({...formData, attend: e.target.value})}
                  >
                    <option>Hadir</option>
                    <option>Tidak Hadir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Jumlah Tamu</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl border border-ink/10 focus:ring-1 focus:ring-brand focus:border-brand outline-none transition-all bg-white/50 font-light text-ink appearance-none"
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                  >
                    <option>1 Orang</option>
                    <option>2 Orang</option>
                    <option>3 Orang</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans uppercase tracking-widest text-ink/60 mb-2 ml-1">Pesan & Doa</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl border border-ink/10 focus:ring-1 focus:ring-brand focus:border-brand outline-none transition-all bg-white/50 font-light text-ink placeholder:text-ink/30 resize-none"
                  placeholder="Tuliskan pesan dan doa untuk kedua mempelai..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-brand text-white py-4 rounded-full font-sans text-xs uppercase tracking-[0.2em] hover:bg-brand/90 transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-0.5 cursor-pointer mt-4"
              >
                Kirim Pesan
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const AllWishes = ({ messages }: { messages: Message[] }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-cream py-12 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-dustyrose/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-ink/60 hover:text-brand mb-12 transition-colors cursor-pointer font-medium tracking-wider text-sm uppercase"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand uppercase tracking-[0.2em] text-xs font-medium mb-3"
          >
            Doa & Harapan
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl text-ink font-light"
          >
            Semua Ucapan & Doa
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-px bg-brand/50 mx-auto mt-6"
          ></motion.div>
        </div>
        
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white p-8 rounded-3xl shadow-xl shadow-brand/5 border border-brand/10 relative group hover:shadow-2xl hover:shadow-brand/10 transition-all duration-500"
              >
                <Quote className="absolute top-8 right-8 w-10 h-10 text-brand/5 group-hover:text-brand/10 transition-colors duration-500" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold font-serif text-xl border border-brand/20">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-serif text-xl text-ink leading-tight">{msg.name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-widest ${msg.attend === 'Hadir' ? 'bg-brand/10 text-brand' : 'bg-ink/5 text-ink/60'}`}>
                        {msg.attend}
                      </span>
                      <span className="text-[10px] text-ink/40 font-medium tracking-wider">
                        • {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-ink/70 text-sm leading-relaxed relative z-10 font-light italic mt-4">
                  "{msg.text}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RSVPAndGuestbook = ({ messages, onAddMessage, guestName }: { messages: Message[], onAddMessage: (data: any) => void, guestName: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="rsvp" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-cream/30 pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none"></div>



      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-brand uppercase tracking-[0.3em] text-xs font-semibold mb-3"
          >
            Doa & Harapan
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-4xl md:text-6xl text-ink font-light tracking-tight"
          >
            Wishes & Prayers
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-20 h-px bg-brand/50 mx-auto mt-8"
          ></motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-16"
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full bg-brand text-white font-sans text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,168,128,0.4)] cursor-pointer"
          >
            <span className="relative z-10">RSVP & Harapan</span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/20 transition-all duration-300 ease-out group-hover:scale-100"></div>
          </button>
        </motion.div>

        <div className="space-y-8 mb-16">
          <AnimatePresence>
            {messages.slice(0, 3).map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 30, scale: 0.98, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-brand/5 border border-brand/10 relative group hover:shadow-brand/15 transition-all duration-700 isolate"
              >
                <Quote className="absolute top-10 right-10 w-12 h-12 text-brand/5 group-hover:text-brand/10 transition-all duration-700 -z-10 group-hover:rotate-12" />
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold font-serif text-2xl border border-brand/20 group-hover:bg-brand group-hover:text-white transition-all duration-700 shadow-inner">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-serif text-2xl text-ink leading-tight mb-2 tracking-tight">{msg.name}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.2em] shadow-sm ${msg.attend === 'Hadir' ? 'bg-brand/10 text-brand' : 'bg-ink/5 text-ink/40'}`}>
                        {msg.attend}
                      </span>
                      <span className="text-[10px] text-ink/30 font-bold uppercase tracking-[0.15em]">
                         • {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-ink/60 text-base md:text-lg leading-relaxed relative z-10 font-light italic mt-8 pl-4 border-l-2 border-brand/20">
                  "{msg.text}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {messages.length > 3 && (
          <div className="flex justify-center mt-8">
            <Link 
              to="/wishes"
              className="text-brand font-medium hover:text-brand/80 transition-colors border-b border-brand pb-1 cursor-pointer"
            >
              Lihat Semua Ucapan ({messages.length})
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <WishesModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={onAddMessage}
            defaultName={guestName}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// 4. Update Footer to accept couple name props.
const Footer = ({ settings }: { settings: SiteSettings }) => (
  <footer className="py-32 bg-maroon text-cream text-center relative overflow-hidden">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C5A880 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-brand/10 blur-[100px] pointer-events-none"></div>
    
    {/* Corner Ornaments — bunga 01.svg × 4 corners */}
    {/* Top Left */}
    <motion.img
      src="/assets/ornamen/bunga 01.svg"
      alt="Ornamen pojok kiri atas"
      className="absolute top-0 left-0 w-24 md:w-32 lg:w-40 pointer-events-none opacity-40"
      style={{ transformOrigin: 'top left' }}
      initial={{ opacity: 0, x: -20, y: -20, rotate: -10 }}
      whileInView={{ opacity: 0.4, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      animate={{
        y: [0, -8, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        opacity: { duration: 1.2 },
        x: { duration: 1.2 },
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
      }}
    />
    {/* Top Right */}
    <motion.img
      src="/assets/ornamen/bunga 01.svg"
      alt="Ornamen pojok kanan atas"
      className="absolute top-0 right-0 w-24 md:w-32 lg:w-40 pointer-events-none opacity-40"
      style={{ transformOrigin: 'top right', transform: 'scaleX(-1)' }}
      initial={{ opacity: 0, x: 20, y: -20, rotate: 10 }}
      whileInView={{ opacity: 0.4, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      animate={{
        y: [0, -6, 0],
        rotate: [2, -2, 2],
      }}
      transition={{
        opacity: { duration: 1.2, delay: 0.2 },
        x: { duration: 1.2, delay: 0.2 },
        y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
        rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
      }}
    />
    {/* Bottom Left */}
    <motion.img
      src="/assets/ornamen/bunga 01.svg"
      alt="Ornamen pojok kiri bawah"
      className="absolute bottom-0 left-0 w-24 md:w-32 lg:w-40 pointer-events-none opacity-40"
      style={{ transformOrigin: 'bottom left', transform: 'scaleY(-1)' }}
      initial={{ opacity: 0, x: -20, y: 20, rotate: 10 }}
      whileInView={{ opacity: 0.4, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      animate={{
        y: [0, 8, 0],
        rotate: [3, -1, 3],
      }}
      transition={{
        opacity: { duration: 1.2, delay: 0.4 },
        x: { duration: 1.2, delay: 0.4 },
        y: { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
        rotate: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
      }}
    />
    {/* Bottom Right */}
    <motion.img
      src="/assets/ornamen/bunga 01.svg"
      alt="Ornamen pojok kanan bawah"
      className="absolute bottom-0 right-0 w-24 md:w-32 lg:w-40 pointer-events-none opacity-40"
      style={{ transformOrigin: 'bottom right', transform: 'scale(-1, -1)' }}
      initial={{ opacity: 0, x: 20, y: 20, rotate: -10 }}
      whileInView={{ opacity: 0.4, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true }}
      animate={{
        y: [0, 6, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        opacity: { duration: 1.2, delay: 0.6 },
        x: { duration: 1.2, delay: 0.6 },
        y: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
        rotate: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
      }}
    />

    <div className="container mx-auto px-4 max-w-4xl relative z-10 flex flex-col items-center">
      
      {/* Small Gallery */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20">
        {[
          settings.footer_image || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400",
          settings.footer_image_2 || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=400",
          settings.footer_image_3 || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=400",
          settings.footer_image_4 || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400"
        ].map((src, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
            className="w-24 h-36 md:w-40 md:h-56 rounded-t-full rounded-b-full overflow-hidden border border-brand/20 shadow-2xl shadow-black/50 group"
          >
            <img src={src} alt="Wedding Gallery" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale-[30%] group-hover:grayscale-0" referrerPolicy="no-referrer" />
          </motion.div>
        ))}
      </div>

      <div className="w-px h-24 bg-gradient-to-b from-transparent via-brand/50 to-transparent mb-16"></div>

      <motion.div 
        initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="space-y-12"
      >
        <div className="space-y-4">
          <h2 className="font-serif text-5xl md:text-8xl text-brand tracking-tighter">
            {settings.groom_name} <span className="text-3xl md:text-4xl text-cream/20 font-light">&</span> {settings.bride_name}
          </h2>
          <p className="text-cream/40 uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold font-sans">
            See You on Our Special Day
          </p>
        </div>

        <div className="pt-12 space-y-10">
          <h3 className="font-serif text-4xl md:text-6xl italic text-brand tracking-wide font-light">Terima Kasih</h3>
          
          <p className="max-w-md mx-auto px-4 text-cream/60 text-sm md:text-base leading-relaxed font-light italic">
            "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami."
          </p>
          
          <div className="flex justify-center items-center gap-8 py-4 opacity-30">
            <div className="w-16 h-px bg-brand"></div>
            <Flower2 className="w-5 h-5 text-brand" />
            <div className="w-16 h-px bg-brand"></div>
          </div>

          <div className="pt-8">
            <p className="text-cream/40 uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold font-sans">
              DESIGNED WITH LOVE
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </footer>
);

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Menggunakan musik pilihan user
    audioRef.current = new Audio('/assets/sound/Istimewa.mp3');
    audioRef.current.loop = true;
    
    // Mencoba autoplay (browser modern mungkin memblokir ini sampai ada interaksi user)
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay diblokir oleh browser
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={togglePlay}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 cursor-pointer border border-white/20 backdrop-blur-md ${isPlaying ? 'bg-brand/90 text-white animate-[spin_4s_linear_infinite]' : 'bg-ink/50 text-white/70 hover:bg-ink/70'}`}
      >
        <Music className="w-5 h-5" />
      </button>
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    groom_name: 'Romeo',
    bride_name: 'Juliet',
    event_date: 'Sabtu, 24 Agustus 2026',
    bank_name: 'BCA',
    bank_account: '1234567890',
    bank_owner: 'Nama Mempelai',
    akad_time: '08:00 WIB - Selesai',
    akad_place: 'Masjid Istiqlal Jakarta',
    akad_address: 'RT.01 RW01, Ringin Sari, Tamanmartani, Kalasan, Sleman Regency, Special Region of Yogyakarta 55571',
    akad_maps_url: 'https://maps.google.com/?q=Masjid+Istiqlal+Jakarta',
    resepsi_time: '11:00 WIB - 14:00 WIB',
    resepsi_place: 'Hotel Indonesia Kempinski',
    resepsi_address: 'Jl. M.H. Thamrin No.1, Menteng, Kec. Menteng, Kota Jakarta Pusat',
    resepsi_maps_url: 'https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta',
    short_date: '05 . 05 . 2026',
    countdown_target: '2026-08-24T08:00:00',
    cover_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
    hero_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
    footer_image: '',
    footer_image_2: '',
    footer_image_3: '',
    footer_image_4: '',
  });

  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const galleryImages = useMemo(() => getGalleryImages(siteSettings), [siteSettings.gallery_images]);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedGalleryImage) return;
    const currentIndex = galleryImages.indexOf(selectedGalleryImage);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedGalleryImage(galleryImages[nextIndex]);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedGalleryImage) return;
    const currentIndex = galleryImages.indexOf(selectedGalleryImage);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedGalleryImage(galleryImages[prevIndex]);
  };

  const selectedImageRef = useRef(selectedGalleryImage);
  selectedImageRef.current = selectedGalleryImage;
  const galleryImagesRef = useRef(galleryImages);
  galleryImagesRef.current = galleryImages;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageRef.current) {
        if (e.key === 'ArrowRight') {
          const currentIndex = galleryImagesRef.current.indexOf(selectedImageRef.current);
          if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % galleryImagesRef.current.length;
            setSelectedGalleryImage(galleryImagesRef.current[nextIndex]);
          }
        }
        if (e.key === 'ArrowLeft') {
          const currentIndex = galleryImagesRef.current.indexOf(selectedImageRef.current);
          if (currentIndex !== -1) {
            const prevIndex = (currentIndex - 1 + galleryImagesRef.current.length) % galleryImagesRef.current.length;
            setSelectedGalleryImage(galleryImagesRef.current[prevIndex]);
          }
        }
        if (e.key === 'Escape') setSelectedGalleryImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedGalleryImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedGalleryImage]);

  useEffect(() => {
    fetchMessages();
    fetchSiteSettings();
    
    // Catch URL parameter globally for RSVP to prepopulate
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
    }

    // Set up realtime subscription
    const channel = supabase
      .channel('public:guestbook')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guestbook' }, payload => {
        console.log('Change received!', payload);
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').limit(1).single();
      if (error) {
        console.error('Error fetching settings from Supabase:', error);
      } else if (data) {
        setSiteSettings({
          groom_name: data.groom_name || 'Romeo',
          bride_name: data.bride_name || 'Juliet',
          event_date: data.event_date || 'Sabtu, 24 Agustus 2026',
          bank_name: data.bank_name || 'BCA',
          bank_account: data.bank_account || '1234567890',
          bank_owner: data.bank_owner || 'Nama Mempelai',
          akad_time: data.akad_time || '08:00 WIB - Selesai',
          akad_place: data.akad_place || 'Masjid Istiqlal Jakarta',
          akad_address: data.akad_address || 'RT.01 RW01, Ringin Sari, Tamanmartani, Kalasan, Sleman Regency, Special Region of Yogyakarta 55571',
          akad_maps_url: data.akad_maps_url || 'https://maps.google.com/?q=Masjid+Istiqlal+Jakarta',
          resepsi_time: data.resepsi_time || '11:00 WIB - 14:00 WIB',
          resepsi_place: data.resepsi_place || 'Hotel Indonesia Kempinski',
          resepsi_address: data.resepsi_address || 'Jl. M.H. Thamrin No.1, Menteng, Kec. Menteng, Kota Jakarta Pusat',
          resepsi_maps_url: data.resepsi_maps_url || 'https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta',
          short_date: data.short_date || '05 . 05 . 2026',
          countdown_target: data.countdown_target || '2026-08-24T08:00:00',
          cover_image: data.cover_image || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
          hero_image: data.hero_image || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
          streaming_url: data.streaming_url,
          gift_qr_url: data.gift_qr_url,
          gallery_images: data.gallery_images,
          love_story: data.love_story,
          wallet_name: data.wallet_name || 'DANA / GOPAY',
          wallet_number: data.wallet_number || '0812-XXXX-XXXX',
          wallet_owner: data.wallet_owner || 'Nama Mempelai',
          footer_image: data.footer_image || '',
          footer_image_2: data.footer_image_2 || '',
          footer_image_3: data.footer_image_3 || '',
          footer_image_4: data.footer_image_4 || '',
        });
      }
    } catch (err) {
      console.error('Unexpected error fetching settings:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
      } else if (data) {
        // Map database fields to the UI component properties
        const formattedMessages = data.map((item: any) => {
          // Format date assuming item.created_at is an ISO string from Postgres
          const date = new Date(item.created_at);
          let timeString = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
          
          return {
            id: item.id,
            name: item.name,
            text: item.message || '',
            time: timeString, // Simplified time representation
            attend: item.is_attending ? 'Hadir' : 'Tidak Hadir',
            guests: '1 Orang' // Assuming 1 person by default for MVP if field not in DB
          };
        });
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Unexpected error fetching messages:', error);
    }
  };

  const handleAddMessage = async (formData: any) => {
    try {
      const isAttending = formData.attend === 'Hadir';
      
      // Optimistically add to UI (optional, since realtime will fetch it back)
      setMessages([{
        id: Date.now() as any, // Temporary ID
        name: formData.name,
        text: formData.message,
        time: 'Baru saja',
        attend: formData.attend,
        guests: formData.guests
      }, ...messages]);

      // Insert into Supabase
      const { error } = await supabase
        .from('guestbook')
        .insert([
          {
            name: formData.name,
            is_attending: isAttending,
            message: formData.message
          }
        ]);

      if (error) {
        console.error('Error saving message to Supabase:', error);
        // Better error handling logic could go here e.g. revert optimistic update
      }
    } catch (error) {
      console.error('Unexpected error adding message:', error);
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-cream min-h-screen">
      <FallingPetals />
      <Routes>
        <Route path="/" element={
          <>
            <Cover isOpened={isOpened} onOpen={() => setIsOpened(true)} settings={siteSettings} />
            <Hero settings={siteSettings} />
            <Countdown settings={siteSettings} />
            <EventDetails settings={siteSettings} />
            <LoveStory settings={siteSettings} />
            <Gallery settings={siteSettings} onImageSelect={(src) => setSelectedGalleryImage(src)} />
            <Streaming settings={siteSettings} />
            <WeddingGift settings={siteSettings} />
            <RSVPAndGuestbook messages={messages} onAddMessage={handleAddMessage} guestName={guestName} />
            <Footer settings={siteSettings} />
          </>
        } />
        <Route path="/wishes" element={<AllWishes messages={messages} />} />
        <Route path="/pengelola-c8f2a" element={<Dashboard messages={messages} />} />
      </Routes>
      
      {/* Lightbox rendered at Root Portal level */}
      <AnimatePresence>
        {selectedGalleryImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <motion.button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[10000]"
              onClick={() => setSelectedGalleryImage(null)}
            >
              <X className="w-8 h-8" />
            </motion.button>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 md:bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-brand hover:text-white hover:scale-110 active:scale-95 transition-all z-[10010] cursor-pointer group"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 md:bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-brand hover:text-white hover:scale-110 active:scale-95 transition-all z-[10010] cursor-pointer group"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                </button>
                
                {/* Counter */}
                <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-black/40 md:bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[10px] tracking-[0.3em] font-medium z-[10010] uppercase">
                  {galleryImages.indexOf(selectedGalleryImage!) + 1} / {galleryImages.length}
                </div>
              </>
            )}

            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              key={selectedGalleryImage} // Key helps with re-animating on change
              src={selectedGalleryImage}
              className="max-w-[90vw] max-h-[75vh] md:max-w-[85vw] md:max-h-[85vh] object-contain rounded-2xl shadow-2xl relative z-[10001]"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MusicToggle />
    </div>
  );
}
