"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronRight,
  Loader2,
  Package,
  Wallet,
  Gamepad2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/lib/hooks/useProductQueries";
import { AnimatedNumber } from "./components/AnimatedNumber";
import { BannerCarousel } from "./components/BannerCarousel";
import { useGrowtopiaPlayers } from "@/lib/hooks/useGrowtopia";

interface Product {
  id: number;
  name: string;
  category: string;
  priceIdr?: number;
  priceDl?: number;
  priceMode: "IDR_ONLY" | "DL_ONLY" | "BOTH";
  image: string;
  description?: string;
  stock: number;
  isActive: boolean;
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: playersGT, isLoading: playersLoading } = useGrowtopiaPlayers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic Categories
  const categories = useMemo(() => {
    const activeProducts = (products as Product[]).filter((p) => p.isActive);
    const cats = Array.from(
      new Set(activeProducts.map((p) => p.category).filter(Boolean)),
    ) as string[];
    return ["Semua", ...cats];
  }, [products]);

  // Combined Searching & Filtering
  const filteredProducts = useMemo(() => {
    return (products as Product[]).filter((product) => {
      if (!product.isActive) return false;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Semua" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  if (!mounted) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("Rp", "Rp ");
  };

  const formatDL = (dl: number) => {
    return dl % 1 === 0 ? dl.toString() : dl.toFixed(2);
  };

  const getDisplayPrice = (product: Product) => {
    if (product.priceMode === "IDR_ONLY" || product.priceMode === "BOTH") {
      return (
        <span className="text-xl font-black text-emerald-600">
          {formatPrice(product.priceIdr || 0)}
        </span>
      );
    }
    return (
      <span className="text-xl font-black text-amber-500">
        {product.priceDl || 0} DL
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-[#FDFDFF]">
      {/* 1. CAROUSEL & HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <BannerCarousel
          images={[
            "/banners/proxy.png",
            "/banners/growtopia.png",
            "/banners/bot.png",
            "/banners/script.png",
          ]}
        />

        <section className="group relative bg-white rounded-[3rem] border border-zinc-100 shadow-2xl shadow-zinc-200/50 overflow-hidden mb-16 transition-all hover:shadow-emerald-500/5">
          {/* Decorative Elements */}
          {playersLoading ? (
            <p className="text-center">...</p>
          ) : (
            <p className="text-center text-2xl font-semibold flex items-center justify-center gap-2">
              {/* Bulatan Online */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>

              {playersGT?.count}

              <span className="text-emerald-500 text-sm">
                Players GT Online
              </span>
            </p>
          )}

          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-48 -mt-48 group-hover:bg-emerald-500/10 transition-colors" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
          <CardContent className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-emerald-500/20 p-1 bg-white shadow-lg">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      />
                      <AvatarFallback>{user.username}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>
                  <div className="shrink-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">
                      Welcome Back
                    </p>
                    <h2 className="text-2xl font-black text-zinc-900 leading-none">
                      {user.username}
                    </h2>
                    <p className="text-sm font-medium text-zinc-400 mt-1 uppercase tracking-widest">
                      {user.role} Account
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 bg-zinc-50/50 backdrop-blur-sm px-10 py-6 rounded-[2rem] border border-zinc-100 shadow-sm">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                      <Wallet className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Total Balance
                      </span>
                    </div>
                    <span className="text-2xl font-black text-zinc-900">
                      <AnimatedNumber
                        value={user.balance}
                        formatter={formatPrice}
                        showDelta
                      />
                    </span>
                  </div>
                  <div className="flex flex-col items-center md:items-start border-l-0 md:border-l md:pl-16 border-zinc-200">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                      <Gamepad2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Growtopia DL
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-amber-500">
                        <AnimatedNumber
                          value={user.dl}
                          formatter={formatDL}
                          showDelta
                        />{" "}
                        <span className="text-zinc-400 text-sm align-middle ml-1">
                          DL
                        </span>
                      </span>
                      <div className="p-1 bg-amber-50 rounded-lg border border-amber-100">
                        <Image
                          src="/DL.png"
                          alt="Growtopia"
                          width={24}
                          height={24}
                          className="drop-shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Link href="/profile">
                  <Button className="rounded-2xl px-8 py-7 bg-zinc-900 hover:bg-zinc-800 text-white font-black group shadow-xl shadow-zinc-200 transition-all active:scale-95">
                    BUKA PROFIL
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 py-4">
                <div className="space-y-6 text-center md:text-left max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2 mx-auto md:mx-0 shadow-sm">
                    <Zap className="w-4 h-4 fill-emerald-600 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Premium Marketplace
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black text-zinc-900 tracking-tight leading-none transition-all pt-2">
                    <span className="bg-emerald-500 text-white scale-125">
                      BELANJA{" "}
                    </span>
                    ITEM <br />
                    <Image
                      src="/gtlogo.png"
                      alt="Growtopia"
                      width={300}
                      height={300}
                      className="drop-shadow-sm justify-center items-center md:ps-20 md md:scale-150"
                    />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-emerald-400 leading-normal pb-1 block">
                      TERPERCAYA
                    </span>
                  </h2>
                  <p className="text-zinc-500 font-medium text-lg md:text-xl max-w-lg leading-relaxed">
                    Akses kebutuhan Growtopia terbaik mulai dari Proxy, SOCKS5,
                    hingga layanan Bot dalam satu platform yang aman dan instan.
                  </p>
                </div>
                <div className="shrink-0">
                  <Link href="/login">
                    <Button className="group relative overflow-hidden rounded-[2rem] px-14 py-10 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all active:scale-95 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-linear-to-r from-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative flex items-center gap-4">
                        MULAI SEKARANG
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </section>

        {/* 2. SEARCH & CATEGORIES */}
        <section className="mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase shrink-0">
              Katalog <br />
              <span className="text-emerald-500">Produk Kami</span>
            </h3>

            <div className="relative grow group max-w-xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                placeholder="Cari item spesial kamu di sini..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 rounded-3xl py-8 border-2 border-zinc-100 focus:border-emerald-500 focus:ring-0 shadow-lg shadow-zinc-50 placeholder:text-zinc-300 font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200"
                    : "bg-white text-zinc-400 border border-zinc-100 hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 3. PRODUCT GRID */}
        <section id="products-section" className="space-y-8">
          {/* Loading State */}
          {productsLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
          )}

          {/* Empty State */}
          {!productsLoading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
              <Package className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-black text-lg">Belum ada produk</p>
              <p className="text-sm mt-1">Produk sedang disiapkan untukmu.</p>
            </div>
          )}

          {/* Product Grid */}
          {!productsLoading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
                <Drawer key={product.id}>
                  <DrawerTrigger asChild>
                    <Card
                      onClick={() => setSelectedProduct(product)}
                      className="group cursor-pointer border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white flex flex-col h-full"
                    >
                      <div className="aspect-square relative overflow-hidden bg-zinc-50 shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                            <Package className="w-10 h-10 text-zinc-200" />
                          </div>
                        )}

                        {/* Badge Layers */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                          {product.stock === 0 && (
                            <span className="bg-zinc-900/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-lg">
                              OUT OF STOCK
                            </span>
                          )}
                          {product.stock > 0 && product.stock <= 5 && (
                            <span className="bg-amber-400 text-amber-950 text-[8px] font-black px-2 py-1 rounded-lg">
                              LIMIT STOK
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                      </div>

                      <CardContent className="p-3 md:p-4 flex flex-col grow">
                        <p className="text-[9px] text-zinc-400 font-bold mb-1 uppercase tracking-wider">
                          {product.category}
                        </p>
                        <h4 className="font-bold text-zinc-800 text-sm md:text-base leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                          {product.name}
                        </h4>

                        <div className="mt-auto pt-2">
                          <div className="flex flex-col gap-0.5">
                            {(product.priceMode === "IDR_ONLY" ||
                              product.priceMode === "BOTH") &&
                              product.priceIdr && (
                                <span className="text-emerald-600 font-black text-sm md:text-lg leading-tight">
                                  {formatPrice(product.priceIdr)}
                                </span>
                              )}
                            {(product.priceMode === "DL_ONLY" ||
                              product.priceMode === "BOTH") &&
                              product.priceDl && (
                                <span className="text-amber-500 font-black text-[10px] md:text-xs">
                                  {product.priceDl || 0} DL
                                </span>
                              )}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[10px] text-zinc-400 font-medium">
                                Stok: {product.stock}
                              </span>
                            </div>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-xl w-8 h-8 md:w-9 md:h-9 bg-zinc-50 border-zinc-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300"
                            >
                              <ChevronRight className="size-4 md:size-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DrawerTrigger>
                  <DrawerContent className="focus:outline-none">
                    <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-zinc-300 my-4" />
                    <div className="p-6 max-h-[85vh] overflow-y-auto no-scrollbar">
                      {selectedProduct && selectedProduct.id === product.id && (
                        <div className="max-w-4xl mx-auto w-full pb-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="relative aspect-video md:aspect-square w-full rounded-2xl overflow-hidden shadow-lg bg-zinc-100 border">
                              {selectedProduct.image ? (
                                <Image
                                  src={selectedProduct.image}
                                  alt={selectedProduct.name}
                                  fill
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-16 h-16 text-zinc-300" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-6">
                              <DrawerHeader className="px-0 pt-0">
                                <DrawerTitle className="text-3xl font-black text-zinc-900 leading-tight">
                                  {selectedProduct.name}
                                </DrawerTitle>
                                <div className="mt-2">
                                  {getDisplayPrice(selectedProduct)}
                                </div>
                              </DrawerHeader>

                              <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-full uppercase">
                                    {selectedProduct.category}
                                  </span>
                                  {selectedProduct.stock === 0 && (
                                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase italic">
                                      Stok Habis
                                    </span>
                                  )}
                                </div>

                                <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100">
                                  <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                                    Deskripsi Produk
                                  </h5>
                                  <div className="text-sm text-zinc-600 leading-relaxed">
                                    {(() => {
                                      const text =
                                        selectedProduct.description ||
                                        "Tidak ada deskripsi tersedia.";
                                      const maxLength = 100;
                                      const isLong = text.length > maxLength;

                                      if (!expanded && isLong) {
                                        return (
                                          <span>
                                            {text.slice(0, maxLength)}...{" "}
                                            <button
                                              onClick={() => setExpanded(true)}
                                              className="text-emerald-500 font-bold hover:underline"
                                            >
                                              Baca Selengkapnya
                                            </button>
                                          </span>
                                        );
                                      }

                                      return (
                                        <span>
                                          {text}{" "}
                                          {isLong && (
                                            <button
                                              onClick={() => setExpanded(false)}
                                              className="text-emerald-500 font-bold hover:underline"
                                            >
                                              Sembunyikan
                                            </button>
                                          )}
                                        </span>
                                      );
                                    })()}
                                  </div>
                                </div>

                                <Link
                                  href={`/shop/${selectedProduct.id}`}
                                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-6 rounded-3xl text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 transition-all active:scale-95 no-underline"
                                >
                                  LIHAT DETAIL
                                  <ArrowRight className="w-6 h-6" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </DrawerContent>
                </Drawer>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
