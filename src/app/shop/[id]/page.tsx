"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  ChevronLeft,
  Package,
  Zap,
  ShieldCheck,
  Clock,
  AlertCircle,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProduct } from "@/lib/hooks/useProductQueries";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const productId = Number(params.id);

  const { data: product, isLoading, error } = useProduct(productId);

  const [quantity, setQuantity] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState<"IDR" | "DL">("IDR");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const maxLengthDescription = 200;
  const [isReadMore, setIsReadMore] = useState(false);
  const isLong = product?.description?.length > maxLengthDescription;
  const displayText = isReadMore
    ? product?.description
    : product?.description?.slice(0, maxLengthDescription) + "...";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set default currency based on product mode
  useEffect(() => {
    if (product) {
      if (product.priceMode === "DL_ONLY") {
        setSelectedCurrency("DL");
      } else {
        setSelectedCurrency("IDR");
      }
    }
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("Rp", "Rp ");
  };

  const handleQuantity = (val: number) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= (product?.stock || 1)) {
      setQuantity(newQty);
    }
  };

  const currentPrice =
    selectedCurrency === "IDR" ? product?.priceIdr : product?.priceDl;
  const totalPrice = (currentPrice || 0) * quantity;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Silahkan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (selectedCurrency === "IDR" && totalPrice > (user?.balance || 0)) {
      toast.error("Saldo Rupiah tidak cukup!");
      return;
    }

    if (selectedCurrency === "DL" && totalPrice > (user?.wl || 0)) {
      toast.error("Saldo Diamond Lock tidak mencukupi!");
      return;
    }

    setIsSubmitting(true);
    try {
      await orderApi.checkout({
        productId,
        quantity,
        currency: selectedCurrency,
      });

      toast.success("Pembelian berhasil!", {
        description: `Kamu telah membeli ${quantity}x ${product?.name}. Pesanan sedang diproses.`,
      });

      // Redirect to profile or home after success
      setTimeout(() => router.push("/profile"), 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Checkout gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4 opacity-20" />
        <h2 className="text-2xl font-black text-zinc-900 mb-2">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-zinc-500 mb-8 max-w-sm">
          Maaf, produk yang Anda cari mungkin sudah dihapus atau tidak tersedia.
        </p>
        <Button
          onClick={() => router.push("/shop")}
          className="rounded-2xl px-8 py-6 bg-zinc-900 font-black"
        >
          KEMBALI KE SHOP
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-20">
      {/* Top Banner / Header */}
      <div className="relative h-48 md:h-64 bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-500/20 to-zinc-950/80" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 h-full flex flex-col justify-end pb-8">
          <button
            onClick={() => router.back()}
            className="absolute top-8 left-4 md:left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">
              Kembali
            </span>
          </button>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
              {product.category}
            </Badge>
            {product.stock > 0 ? (
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                Stok Tersedia
              </Badge>
            ) : (
              <Badge className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                Stok Habis
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Image & Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[3rem] p-4 md:p-8 shadow-2xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
              <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-zinc-50 border shadow-inner">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-20 h-20 text-zinc-200" />
                  </div>
                )}
              </div>

              <div className="mt-10 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                    Tentang Produk
                  </h3>
                  <div className="text-zinc-500 leading-relaxed font-medium">
                    {displayText}
                    {isLong && (
                      <button
                        onClick={() => setIsReadMore(!isReadMore)}
                        className="text-emerald-500 font-bold ml-2"
                      >
                        {isReadMore ? "Baca Kurang" : "Baca Lebih"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-zinc-200/50 border border-zinc-100">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 border-b pb-4 border-zinc-50">
                  Configuraasi Pesanan
                </p>

                {/* Method Selector */}
                {product.priceMode === "BOTH" && (
                  <div className="mb-8">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">
                      Pilih Metode Pembayaran
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedCurrency("IDR")}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all text-center gap-1",
                          selectedCurrency === "IDR"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100"
                            : "border-zinc-50 bg-zinc-50 hover:bg-zinc-100 text-zinc-500",
                        )}
                      >
                        <Wallet
                          className={cn(
                            "w-5 h-5",
                            selectedCurrency === "IDR"
                              ? "fill-emerald-500"
                              : "",
                          )}
                        />
                        <span className="text-xs font-black uppercase tracking-tighter">
                          SALDO IDR
                        </span>
                      </button>
                      <button
                        onClick={() => setSelectedCurrency("DL")}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all text-center gap-1",
                          selectedCurrency === "DL"
                            ? "border-amber-500 bg-amber-50 text-amber-600 shadow-lg shadow-amber-100"
                            : "border-zinc-50 bg-zinc-50 hover:bg-zinc-100 text-zinc-500",
                        )}
                      >
                        <Gamepad2
                          className={cn(
                            "w-5 h-5",
                            selectedCurrency === "DL" ? "fill-amber-500" : "",
                          )}
                        />
                        <span className="text-xs font-black uppercase tracking-tighter">
                          Growtopia DL
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Pricing info */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span>Harga Satuan</span>
                    <span>Stok Item</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "text-3xl font-black tracking-tighter leading-none",
                          selectedCurrency === "IDR"
                            ? "text-emerald-600"
                            : "text-amber-500",
                        )}
                      >
                        {selectedCurrency === "IDR" ? (
                          formatPrice(product.priceIdr || 0)
                        ) : (
                          <div className="flex items-center gap-1.5">
                            {(product.priceDl || 0) / 100}
                            <Image
                              src="/DL.png"
                              alt="DL"
                              width={24}
                              height={24}
                              className="inline-block"
                            />
                            <span className="text-sm font-bold ml-0.5">DL</span>
                          </div>
                        )}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                        Tax Included
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-zinc-900">
                        {product.stock}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-widest">
                        Tersedia
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-10">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3 block">
                    Jumlah Pembelian
                  </label>
                  <div className="flex items-center justify-between p-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <button
                      onClick={() => handleQuantity(-1)}
                      className="w-12 h-12 flex items-center justify-center bg-white rounded-xl border shadow-sm text-zinc-500 hover:text-red-500 active:scale-90 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-black text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantity(1)}
                      className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded-xl text-white shadow-xl hover:bg-emerald-500 active:scale-90 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Total & Checkout */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 border-dashed">
                    <div>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                        Total Pembayaran
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-black tracking-tighter",
                          selectedCurrency === "IDR"
                            ? "text-emerald-600"
                            : "text-amber-500",
                        )}
                      >
                        {selectedCurrency === "IDR"
                          ? formatPrice(totalPrice)
                          : `${(totalPrice / 100).toFixed(2)} DL`}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border shadow-sm">
                      <Zap className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isSubmitting || product.stock === 0}
                    className={cn(
                      "w-full rounded-3xl py-10 font-black text-lg transition-all active:scale-95 shadow-2xl relative overflow-hidden group",
                      selectedCurrency === "IDR"
                        ? "bg-zinc-900 hover:bg-zinc-800 text-white"
                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200",
                    )}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-3">
                        {product.stock === 0 ? "STOK HABIS" : "BAYAR SEKARANG"}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>

                  {isAuthenticated && (
                    <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-4">
                      Saldo Kamu:{" "}
                      <span className="text-zinc-900">
                        {selectedCurrency === "IDR"
                          ? formatPrice(user?.balance || 0)
                          : `${((user?.wl || 0) / 100).toFixed(2)} DL`}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-emerald-500 text-white rounded-[2.5rem] p-6 flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl transition-all group-hover:scale-150" />
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                    Payment Secure
                  </p>
                  <p className="text-sm font-black tracking-tight">
                    Transaksi Aman & Enkripsi
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {[
              {
                icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
                title: "Terpercaya",
                desc: "Telah dipercayai oleh 1000+ pelanggan",
              },
              {
                icon: <Clock className="w-5 h-5 text-emerald-500" />,
                title: "Instan",
                desc: "Pengiriman Super Cepat",
              },
              {
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                title: "24/7 Support",
                desc: "Siap Melayani",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 bg-zinc-50 rounded-3xl border border-zinc-100"
              >
                <div className="mb-3 p-3 bg-white rounded-2xl border shadow-sm">
                  {item.icon}
                </div>
                <p className="font-black text-zinc-900 text-sm uppercase tracking-tight leading-none mb-1">
                  {item.title}
                </p>
                <p className="text-[10px] text-zinc-400 font-bold">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
