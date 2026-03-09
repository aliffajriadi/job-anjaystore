"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Lock,
  Wallet,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trophy,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUserProfile,
} from "@/lib/hooks/useAuthQueries";
import { cn } from "@/lib/utils";
import TopUpModal from "../components/TopUpModal";
import { AnimatedNumber } from "../components/AnimatedNumber";

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const ProfileContent = () => {
  const { user, logout, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const searchParams = useSearchParams();
  const growidRef = useRef<HTMLInputElement>(null);

  const [growid, setGrowid] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle focusing GrowID and pre-filling message
  useEffect(() => {
    if (searchParams.get("focus") === "growid") {
      growidRef.current?.focus();
      const timer = setTimeout(() => {
        setMessage({
          type: "error",
          text: "Silakan atur GrowID Anda terlebih dahulu!",
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Sync growid state from profile data when it loads
  const profileGrowid = profile?.growid;
  useEffect(() => {
    if (profileGrowid) {
      const timer = setTimeout(() => {
        setGrowid(profileGrowid);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profileGrowid]);

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    updateProfileMutation.mutate(
      { growid },
      {
        onSuccess: () => {
          setMessage({ type: "success", text: "GrowID berhasil diperbarui!" });
        },
        onError: (err: Error) => {
          const apiErr = err as unknown as ErrorResponse;
          setMessage({
            type: "error",
            text: apiErr.response?.data?.message || "Gagal memperbarui GrowID",
          });
        },
      },
    );
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok" });
      return;
    }

    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setMessage({ type: "success", text: "Password berhasil diubah!" });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err: Error) => {
          const apiErr = err as unknown as ErrorResponse;
          setMessage({
            type: "error",
            text: apiErr.response?.data?.message || "Gagal mengubah password",
          });
        },
      },
    );
  };

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <p className="text-zinc-500 font-medium">Memuat profil Anda...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-zinc-400" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 mb-2">
          AKSES DITOLAK
        </h1>
        <p className="text-zinc-500 mb-8 max-w-xs">
          Silakan login terlebih dahulu untuk mengakses halaman profil.
        </p>
        <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-2xl px-8 py-6 font-bold">
          Login Sekarang
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("Rp", "Rp ");
  };

  const formatDL = (dl: number) => {
    // Show up to 2 decimals if not a whole number
    return dl % 1 === 0 ? dl.toString() : dl.toFixed(2);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 bg-white rounded-[2rem] p-8 border shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
            <Zap className="w-40 h-40" />
          </div>

          <div className="relative">
            <div className="w-32 h-32 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 ring-8 ring-emerald-50/50">
              <Avatar className="h-16 w-16 border-2 border-emerald-500 p-1">
                <AvatarImage
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                  }
                />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-lg border">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2 grow">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-200">
              <Trophy className="w-3 h-3" /> User
            </div>
            <h1 className="text-3xl font-black text-zinc-900 uppercase tracking-tight">
              {profile?.username || user.username}
            </h1>
            <p className="text-zinc-500 font-medium">
              Dibuat pada {formatDate(profile?.createdAt)}
            </p>

            <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
              <Button
                variant="outline"
                onClick={logout}
                className="rounded-xl font-bold text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 px-6"
              >
                <LogOut className="w-4 h-4 mr-2" /> Keluar Akun
              </Button>
            </div>
          </div>
        </article>

        <section className="bg-zinc-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />

          <div className="flex items-center justify-between mb-8">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Dompet Saya
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider">
              Saldo Rupiah
            </p>
            <h3 className="text-3xl font-black text-emerald-400 tracking-tight">
              <AnimatedNumber
                value={profile?.balance || user.balance || 0}
                formatter={formatCurrency}
              />
            </h3>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                Saldo Diamond Lock
              </p>
              <div className="text-xl font-black flex items-center gap-2">
                <AnimatedNumber
                  value={profile?.dl || user.dl || 0}
                  formatter={formatDL}
                />{" "}
                DL
                <Image src="/DL.png" alt="Logo" width={20} height={20} />
              </div>
            </div>
            <TopUpModal>
              <Button className="bg-white text-zinc-900 hover:bg-emerald-50 rounded-xl font-black text-[10px] px-4 tracking-tighter">
                TOP UP SALDO
              </Button>
            </TopUpModal>
          </div>
        </section>
      </div>

      {message.text && (
        <div
          className={cn(
            "p-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in-95",
            message.type === "success"
              ? "bg-emerald-50 border-emerald-100 text-emerald-700"
              : "bg-red-50 border-red-100 text-red-700",
          )}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GrowID Settings */}
        <section className="bg-white rounded-[2rem] p-8 border shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 border">
              <Image src="/gtPlayer.png" alt="Logo" width={64} height={64} />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 uppercase">
                PENGATURAN GROWID
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Atur identitas permainan kamu di sini
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="growid"
                className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1"
              >
                GROWID (Growtopia)
              </Label>
              <Input
                id="growid"
                ref={growidRef}
                placeholder="Masukkan GrowID Anda"
                value={growid}
                onChange={(e) => setGrowid(e.target.value)}
                className={cn(
                  "rounded-2xl py-7 border-zinc-200 focus:border-emerald-500 font-bold text-lg",
                  searchParams.get("focus") === "growid" &&
                    "border-red-500 ring-2 ring-red-500/20",
                )}
              />
              <p className="text-[10px] text-zinc-400 p-1 font-medium italic">
                * Pastikan GrowID benar untuk pengiriman produk otomatis.
              </p>
            </div>

            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-7 font-black text-lg transition-transform active:scale-95 shadow-lg shadow-emerald-100"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              SIMPAN PERUBAHAN
            </Button>
          </form>
        </section>

        {/* Change Password */}
        <section className="bg-white rounded-[2rem] p-8 border shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 border">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 uppercase">
                UBAH PASSWORD
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                Jaga keamanan akun kamu secara berkala
              </p>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1"
              >
                Password Saat Ini
              </Label>
              <Input
                id="currentPassword"
                type="password"
                required
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="rounded-2xl py-6 border-zinc-200 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1"
                >
                  Password Baru
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-2xl py-6 border-zinc-200 focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1"
                >
                  Ulangi Password Baru
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-2xl py-6 border-zinc-200 focus:border-emerald-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl py-7 font-black text-lg transition-transform active:scale-95 mt-2"
            >
              {changePasswordMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
              ) : (
                <Lock className="w-5 h-5 mr-2" />
              )}
              UPDATE PASSWORD
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
          <p className="text-zinc-500 font-medium">Memuat profil Anda...</p>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
};

export default ProfilePage;
