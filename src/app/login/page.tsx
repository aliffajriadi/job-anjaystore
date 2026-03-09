"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Loader2 } from "lucide-react";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/lib/hooks/useAuthQueries";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Coba login dulu
      loginMutation.mutate(
        { username, password },
        {
          onError: async (err: Error) => {
            const loginErr = err as unknown as ApiError;
            // Jika gagal login karena user tidak ada (400 atau error lain), coba register
            const errorMsg = loginErr.response?.data?.message || "";

            if (
              errorMsg.toLowerCase().includes("salah") ||
              loginErr.response?.status === 400
            ) {
              registerMutation.mutate(
                {
                  username,
                  password,
                },
                {
                  onSuccess: () => {
                    // Setelah register sukses, login kembali
                    loginMutation.mutate({ username, password });
                  },
                  onError: (regErr: Error) => {
                    const apiRegErr = regErr as unknown as ApiError;
                    setError(
                      apiRegErr.response?.data?.message ||
                        "Gagal membuat akun otomatis",
                    );
                  },
                },
              );
            } else {
              setError(errorMsg || "Username atau password salah");
            }
          },
        },
      );
    } catch {
      setError("Koneksi ke server gagal. Pastikan backend berjalan.");
    }
  };

  const loading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="max-w-md mx-auto py-12 px-4 shadow-sm md:shadow-none">
      <div className="text-center">
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">
          SELAMAT DATANG
        </h2>
        <p className="mt-2 text-sm text-zinc-600 font-medium">
          Masuk atau daftar ke akun{" "}
          <span className="text-emerald-500 font-bold uppercase">
            AnjayStore
          </span>
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {(error || loginMutation.error) && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-in fade-in zoom-in">
              {error ||
                (loginMutation.error as unknown as ApiError)?.response?.data
                  ?.message ||
                "Terjadi kesalahan"}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="username" className="font-bold text-zinc-700">
              USERNAME
            </Label>
            <Input
              id="username"
              type="text"
              required
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl py-6 border-zinc-200 focus:border-emerald-500 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                title="password"
                className="font-bold text-zinc-700"
              >
                PASSWORD
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl py-6 border-zinc-200 focus:border-emerald-500 transition-all font-medium"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-900 hover:bg-emerald-600 text-white font-black py-7 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-8"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          MASUK SEKARANG
        </Button>

        <div className="text-center pt-4">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
            Jika kamu belum mendaftar akan otomatis terdaftar demi kemudahan
            belanja Anda.
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
