"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles, ArrowRight } from "lucide-react";

const AdModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the ad in this session
    const hasSeenAd = localStorage.getItem("seen_promo_v1");
    if (!hasSeenAd) {
      // Delay to show ad after page load for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("seen_promo_v1", "true");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md border-zinc-800 bg-zinc-950 text-white rounded-[2.5rem] p-0 overflow-hidden outline-none">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-md text-zinc-400 hover:text-white transition-colors border border-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Banner Image */}
          <div className="relative group overflow-hidden">
            <Image
              src="/promo-banner.png"
              alt="Promo Banner"
              width={600}
              height={450}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

            <div className="absolute bottom-4 left-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                  Flash Sale Active
                </span>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 -mt-6 relative z-10">
            <AlertDialogHeader className="text-left space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  Welcome Reward
                </span>
              </div>

              <AlertDialogTitle className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                HI! WELCOME TO <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-purple-500">
                  ANJAY STORE
                </span>
              </AlertDialogTitle>

              <AlertDialogDescription className="text-zinc-400 font-medium leading-relaxed text-sm">
                Nikmati penawaran spesial member baru! Dapatkan potongan harga
                hingga <span className="text-white font-bold">50%</span> untuk
                transaksi pertama Anda di platform kami.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-8 grid grid-cols-1 gap-3">
              <a
                href="https://discord.gg/ZkN7FqTF"
                className="flex items-center justify-center w-full bg-white hover:bg-zinc-200 text-black rounded-2xl py-7 text-base font-black uppercase tracking-tight shadow-xl shadow-white/5 group border-none transition-colors"
              >
                <span>JOIN DISCORD</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-zinc-500 hover:text-zinc-300 font-bold uppercase text-[10px] tracking-widest py-4 border-none hover:bg-transparent"
              >
                Mungkin Nanti Saja
              </Button>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdModal;
