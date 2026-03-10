"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  ChevronRight,
  TrendingUp,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/lib/hooks/useProductQueries";

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

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState("terbaru"); // terbaru, murah, mahal

  const { addToCart, setIsCartOpen } = useCart();
  const { data: products = [], isLoading } = useProducts();

  // Dynamic Categories from real data
  const categories = useMemo(() => {
    const activeProducts = (products as Product[]).filter((p) => p.isActive);
    const cats = Array.from(
      new Set(activeProducts.map((p) => p.category).filter(Boolean)),
    ) as string[];
    return ["Semua", ...cats];
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    const result = (products as Product[]).filter((product) => {
      if (!product.isActive) return false;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Semua" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "murah") {
      result.sort((a, b) => {
        const priceA = a.priceIdr || (a.priceDl || 0) * 1000; // Rough conversion for sorting if no IDR
        const priceB = b.priceIdr || (b.priceDl || 0) * 1000;
        return priceA - priceB;
      });
    } else if (sortBy === "mahal") {
      result.sort((a, b) => {
        const priceA = a.priceIdr || (a.priceDl || 0) * 1000;
        const priceB = b.priceIdr || (b.priceDl || 0) * 1000;
        return priceB - priceA;
      });
    } else {
      // "terbaru" - sort by ID or createdAt
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("Rp", "Rp ");
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    // Default to priceIdr if available, else priceDl
    addToCart(product, product.priceMode === "DL_ONLY" ? "DL" : "IDR");
    setIsCartOpen(true);
  };

  return (
    <div className="bg-zinc-50 min-h-screen pb-24 md:pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white border-b sticky top-[68px] md:top-[80px] z-30 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-4 pb-4">
            

            {/* SEARCH & SORT */}
            <div className="flex gap-2">
              <div className="relative grow group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  placeholder="Cari item spesial Anda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 rounded-2xl py-6 bg-zinc-50 border-none focus-visible:ring-2 focus-visible:ring-emerald-500 placeholder:text-zinc-400 font-medium transition-all"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[45px] md:w-[140px] rounded-2xl py-6 border-none bg-zinc-100 font-bold focus:ring-emerald-500">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="hidden md:inline">
                      <SelectValue placeholder="Urutkan" />
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="terbaru">Terbaru</SelectItem>
                  <SelectItem value="murah">Termurah</SelectItem>
                  <SelectItem value="mahal">Termahal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-widest border",
                  selectedCategory === cat
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200"
                    : "bg-white text-zinc-500 border-zinc-100 hover:bg-zinc-50 hover:border-emerald-200",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* PRODUCTS COUNT */}
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-sm font-bold text-zinc-500">
            Menampilkan{" "}
            <span className="text-zinc-900">{filteredProducts.length}</span>{" "}
            Produk
          </p>
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-tighter cursor-pointer hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors">
            Filters Active <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
            <p className="text-zinc-500 font-bold">Memuat katalog...</p>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!isLoading && filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-zinc-300" />
            </div>
            <h3 className="text-xl font-black text-zinc-900">
              Produk Tidak Ditemukan
            </h3>
            <p className="text-zinc-500 mt-1">
              Coba gunakan kata kunci atau kategori yang berbeda.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Semua");
              }}
              className="text-emerald-600 mt-4 font-bold"
            >
              Reset Semua Filter
            </Button>
          </div>
        ) : (
          !isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map((product) => (
                <Drawer key={product.id}>
                  <DrawerTrigger asChild>
                    <Card
                      onClick={() => setSelectedProduct(product)}
                      className={cn(
                        "group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white cursor-pointer",
                        product.stock === 0 && "opacity-75",
                      )}
                    >
                      <div className="aspect-3/4 relative overflow-hidden bg-zinc-100">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                            <Package className="w-12 h-12 text-zinc-300" />
                          </div>
                        )}

                        {/* Badge Overlays */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                          {product.stock === 0 && (
                            <div className="bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-widest">
                              HABIS
                            </div>
                          )}
                          {product.stock > 0 && product.stock <= 5 && (
                            <div className="bg-yellow-400 text-black text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-widest">
                              LIMIT
                            </div>
                          )}
                          <div className="bg-white/80 backdrop-blur-md text-zinc-900 text-[9px] font-black px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest">
                            {product.category}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <CardContent className="p-5 md:p-6">
                        <h4 className="font-bold text-zinc-900 text-sm md:text-base mb-1 truncate leading-tight transition-colors group-hover:text-emerald-600">
                          {product.name}
                        </h4>
                        <p className="text-xs text-zinc-400 mb-4 line-clamp-1 italic">
                          {product.category}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex flex-col">
                            {(product.priceMode === "IDR_ONLY" ||
                              product.priceMode === "BOTH") &&
                              product.priceIdr && (
                                <span className="text-emerald-600 font-extrabold text-lg md:text-xl tracking-tight">
                                  {formatPrice(product.priceIdr)}
                                </span>
                              )}
                            {(product.priceMode === "DL_ONLY" ||
                              product.priceMode === "BOTH") &&
                              product.priceDl && (
                                <span className="text-yellow-600 font-black text-sm">
                                  {product.priceDl} DL
                                </span>
                              )}
                          </div>
                          <Button
                            size="icon"
                            disabled={product.stock === 0}
                            className="w-10 h-10 rounded-2xl bg-zinc-900 hover:bg-emerald-500 text-white transition-all transform group-hover:rotate-12 duration-500"
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </DrawerTrigger>

                  {/* Product Detail Drawer */}
                  <DrawerContent className="p-6 md:p-10 rounded-t-[3rem] focus:outline-none">
                    {selectedProduct && selectedProduct.id === product.id && (
                      <div className="max-w-4xl mx-auto w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl border bg-zinc-100">
                            {selectedProduct.image ? (
                              <Image
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                fill
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-20 h-20 text-zinc-200" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-6">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none font-black text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
                                  {selectedProduct.category}
                                </Badge>
                                {selectedProduct.stock === 0 && (
                                  <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-none font-black text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
                                    STOK HABIS
                                  </Badge>
                                )}
                              </div>
                              <DrawerTitle className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight">
                                {selectedProduct.name}
                              </DrawerTitle>
                              <div className="mt-2 space-y-1">
                                {(selectedProduct.priceMode === "IDR_ONLY" ||
                                  selectedProduct.priceMode === "BOTH") &&
                                  selectedProduct.priceIdr && (
                                    <p className="text-3xl font-black text-emerald-600">
                                      {formatPrice(selectedProduct.priceIdr)}
                                    </p>
                                  )}
                                {(selectedProduct.priceMode === "DL_ONLY" ||
                                  selectedProduct.priceMode === "BOTH") &&
                                  selectedProduct.priceDl && (
                                    <p className="text-xl font-black text-yellow-600 flex items-center gap-2">
                                      {selectedProduct.priceDl}{" "}
                                      <span className="text-sm">DL</span>
                                    </p>
                                  )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h5 className="font-black text-zinc-900 text-sm uppercase tracking-wider">
                                Deskripsi Produk
                              </h5>
                              <p className="text-zinc-500 text-sm leading-relaxed">
                                {selectedProduct.description ||
                                  "Tidak ada deskripsi tersedia."}
                              </p>
                              <p className="text-xs text-zinc-400 font-medium">
                                Stok tersedia:{" "}
                                <span
                                  className={
                                    selectedProduct.stock === 0
                                      ? "text-red-500 font-black"
                                      : "text-emerald-600 font-black"
                                  }
                                >
                                  {selectedProduct.stock}
                                </span>
                              </p>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                              <Button
                                disabled={selectedProduct.stock === 0}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-8 rounded-3xl text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                                onClick={() => {
                                  addToCart(
                                    selectedProduct,
                                    selectedProduct.priceMode === "DL_ONLY"
                                      ? "DL"
                                      : "IDR",
                                  );
                                  setIsCartOpen(true);
                                }}
                              >
                                <ShoppingBag className="w-6 h-6" />
                                {selectedProduct.stock === 0
                                  ? "STOK HABIS"
                                  : "TAMBAHKAN KE KERANJANG"}
                              </Button>
                              <DrawerClose asChild>
                                <Button
                                  variant="outline"
                                  className="w-full rounded-3xl py-7 font-bold border-zinc-200 hover:bg-zinc-50 transition-all"
                                >
                                  Kembali Jelajahi
                                </Button>
                              </DrawerClose>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </DrawerContent>
                </Drawer>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
