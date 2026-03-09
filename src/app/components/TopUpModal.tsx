"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { QrCode, PlusCircle, AlertCircle } from "lucide-react";
import { useUserProfile } from "@/lib/hooks/useAuthQueries";
import { useConfig } from "@/lib/hooks/useConfigQueries";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TopUpModalProps {
  children?: React.ReactNode;
  className?: string;
}

const TopUpModal = ({ children, className }: TopUpModalProps) => {
  const [step, setStep] = useState<"select" | "dl_detail" | "maintenance">(
    "select",
  );
  const { data: profile } = useUserProfile();
  const { data: config } = useConfig();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const depoWorld = config?.depo_world || "GONDOOLA26";

  const handleDLSelect = () => {
    if (!profile?.growid) {
      // Redirect to profile if GrowID is not set
      setIsOpen(false);
      router.push("/profile?focus=growid");
      return;
    }
    setStep("dl_detail");
  };

  const resetModal = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setStep("select"), 300);
    }
  };

  const handleQRISClick = () => {
    setStep("maintenance");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={resetModal}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button
            className={cn(
              "flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-6 font-bold px-8 shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95",
              className,
            )}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Top Up
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2.5rem] p-8 max-w-lg border-none animate-in fade-in zoom-in duration-300">
        {step === "select" ? (
          <>
            <AlertDialogHeader className="items-center text-center">
              <AlertDialogTitle className="text-2xl font-black text-zinc-900 tracking-tight">
                PILIH METODE TOP UP
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-500 font-medium">
                Pilih metode pengisian saldo yang paling nyaman untuk Anda
                gunakan.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <button
                onClick={handleQRISClick}
                className="flex flex-col items-center justify-center p-8 bg-zinc-50 border-2 border-zinc-100 hover:border-emerald-500 hover:bg-emerald-50 rounded-[2rem] transition-all group active:scale-95 text-zinc-900"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <QrCode className="w-8 h-8" />
                </div>
                <span className="font-black tracking-tight uppercase">
                  QRIS / E-WALLET
                </span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-widest text-center leading-tight">
                  Otomatis & Cepat
                </span>
              </button>

              <button
                onClick={handleDLSelect}
                className="flex flex-col items-center justify-center p-8 bg-zinc-50 border-2 border-zinc-100 hover:border-yellow-500 hover:bg-yellow-50 rounded-[2rem] transition-all group active:scale-95 text-zinc-900"
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Image src="/DL.png" alt="Growtopia" width={50} height={50} />
                </div>
                <span className="font-black tracking-tight uppercase">
                  DL GROWTOPIA
                </span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-widest text-center leading-tight">
                  Via World Deposit
                </span>
              </button>
            </div>

            <div className="mt-8 flex justify-center">
              <AlertDialogCancel className="rounded-2xl px-12 py-6 font-bold text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 border-none transition-all">
                Kembali
              </AlertDialogCancel>
            </div>
          </>
        ) : step === "dl_detail" ? (
          <>
            <AlertDialogHeader className="items-center text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-4">
                <Image src="/DL.png" alt="Growtopia" width={40} height={40} />
              </div>
              <AlertDialogTitle className="text-2xl font-black text-zinc-900 tracking-tight">
                DEPOSIT DL GROWTOPIA
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-500 font-medium">
                Silakan lakukan pengiriman DL ke World yang tertera di bawah.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-8 space-y-4">
              <div className="p-6 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    GrowID Kamu
                  </span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                    {profile?.growid}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    World Drop
                  </span>
                  <span className="font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                    {depoWorld}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-blue-800 uppercase tracking-tight">
                    Instruksi Pembayaran
                  </p>
                  <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
                    1. Masuk ke Virtual World{" "}
                    <span className="font-bold underline">{depoWorld}</span> di
                    Growtopia.
                    <br />
                    2. Cari <span className="font-bold">Donation Box</span> yang
                    tersedia.
                    <br />
                    3. Drop Diamond Lock (DL) sesuai nominal yang ingin
                    didepositkan.
                    <br />
                    4. Pastikan <span className="font-bold">GrowID</span>{" "}
                    pengirim sama dengan yang terdaftar.
                    <br />
                    5. Saldo akan masuk otomatis dalam{" "}
                    <span className="font-bold">1-5 menit</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("select")}
                className="rounded-2xl py-6 font-bold text-zinc-500 border-zinc-100 hover:bg-zinc-50"
              >
                Ganti Metode
              </Button>
              <AlertDialogAction className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl py-6 font-bold">
                Saya Faham
              </AlertDialogAction>
            </div>
          </>
        ) : (
          <>
            <AlertDialogHeader className="items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <AlertDialogTitle className="text-2xl font-black text-zinc-900 tracking-tight">
                UNDER MAINTENANCE
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-500 font-medium">
                Sistem pembayaran QRIS sedang dalam pemeliharaan.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-8">
              <div className="p-8 bg-zinc-50 rounded-[2rem] border-2 border-zinc-100 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <p className="font-bold text-zinc-700 leading-relaxed uppercase tracking-tight text-sm">
                  SEMENTARA DALAM MASA MAINTAIN MOHON DI TUNGGU YA UNTUK
                  PEMBAYARAN VIA QRIS
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("select")}
                className="rounded-2xl py-6 font-bold text-zinc-500 border-zinc-100 hover:bg-zinc-50"
              >
                Kembali
              </Button>
              <AlertDialogAction
                className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl py-6 font-bold"
                onClick={() => setIsOpen(false)}
              >
                Siap!
              </AlertDialogAction>
            </div>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TopUpModal;
