"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  ShoppingBag,
  ChevronDown,
  User,
  Bell,
  Monitor,
  Smartphone,
  Headphones,
  Gamepad,
  Camera,
  Layers,
  Zap,
  Home,
  LayoutGrid,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    cart,
    cartCount,
    removeFromCart,
    updateQuantity,
    cartTotalIdr,
    cartTotalDl,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false);
  const [checkoutCurrency, setCheckoutCurrency] = useState<"IDR" | "DL">("IDR");

  const navLinks = [
    { name: "Beranda", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Shop", href: "/shop", icon: <LayoutGrid className="w-4 h-4" /> },
    {
      name: "Track Order",
      href: "/track",
      icon: <Bell className="w-4 h-4" />,
    },
  ];

  const categories = [
    { name: "VPS & RDP", icon: <Monitor className="w-5 h-5 text-blue-500" /> },
    {
      name: "SOCKS5 Pro",
      icon: <Smartphone className="w-5 h-5 text-emerald-500" />,
    },
    { name: "Bot Service", icon: <Zap className="w-5 h-5 text-amber-500" /> },
    {
      name: "Growtopia DL",
      icon: <Gamepad className="w-5 h-5 text-zinc-500" />,
    },
    {
      name: "Social Media",
      icon: <Camera className="w-5 h-5 text-pink-500" />,
    },
    { name: "Streaming", icon: <Layers className="w-5 h-5 text-red-500" /> },
    {
      name: "Software",
      icon: <Headphones className="w-5 h-5 text-purple-500" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown saat pindah halaman
  useEffect(() => {
    // Wrap in setTimeout to avoid synchronous state update lint error
    const timer = setTimeout(() => {
      setShowCategory(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Klik di luar untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("Rp", "Rp ");
  };

  const handleProxyClick = () => {
    const hasProxy = false; // Logic check normally
    if (!hasProxy) {
      setIsProxyModalOpen(true);
    } else {
      router.push("/proxy");
    }
  };

  return (
    <>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* PROXY MANAGER MODAL */}
      <Drawer open={isProxyModalOpen} onOpenChange={setIsProxyModalOpen}>
        <DrawerContent className="max-h-[60vh]">
          <div className="max-w-md mx-auto w-full p-8">
            <DrawerHeader className="px-0 items-center text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 text-emerald-500 ring-8 ring-emerald-50">
                <LayoutGrid className="w-10 h-10" />
              </div>
              <DrawerTitle className="text-2xl font-black text-zinc-900 mb-2">
                PEMBERITAHUAN
              </DrawerTitle>
              <DrawerDescription className="text-base text-zinc-500 font-medium">
                Maaf, sepertinya anda belum membeli proxy / SOCKS5.
              </DrawerDescription>
            </DrawerHeader>

            <div className="mt-8">
              <Link
                href="/#products-section"
                onClick={() => setIsProxyModalOpen(false)}
              >
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-7 font-black text-lg shadow-lg shadow-emerald-200 transition-all active:scale-95">
                  BELI PROXY SEKARANG
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  className="w-full mt-4 rounded-2xl py-6 font-bold text-zinc-400 hover:text-zinc-900"
                >
                  Tutup
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* GLOBAL CART DRAWER */}
      <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DrawerContent className="h-[92vh] rounded-t-[3rem] border-none shadow-2xl focus:outline-none bg-white">
          <div className="max-w-xl mx-auto w-full h-full flex flex-col p-6 overflow-hidden">
            <DrawerHeader className="px-0 relative shrink-0">
              <div className="absolute top-1/2 -translate-y-1/2 left-0">
                <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 border rotate-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
              <div className="pl-16 text-left">
                <DrawerTitle className="text-2xl font-extrabold text-zinc-900 tracking-tight leading-none">
                  Keranjang Belanja
                </DrawerTitle>
                <DrawerDescription className="text-zinc-400 font-medium text-xs mt-1">
                  Kamu punya{" "}
                  <span className="text-emerald-500 font-black">
                    {cartCount} items
                  </span>{" "}
                  dalam antrian checkout.
                </DrawerDescription>
              </div>
            </DrawerHeader>

            <div className="grow overflow-hidden flex flex-col min-h-0 bg-zinc-50/50 rounded-[2rem] border border-zinc-100 mt-4 p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center grow text-zinc-400">
                  <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4 opacity-50">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <p className="font-bold text-lg">Keranjang Kosong</p>
                  <p className="text-sm mt-1">
                    Ayo cari item impianmu sekarang!
                  </p>
                </div>
              ) : (
                <ScrollArea className="grow pr-2">
                  <div className="space-y-4 py-2">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.currency}`}
                        className="flex gap-4 bg-white p-3 rounded-2xl group border border-transparent hover:border-emerald-100 transition-all shadow-sm"
                      >
                        <div className="w-12 h-12 bg-zinc-800 rounded-2xl shrink-0 relative overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Zap className="w-4 h-4 text-zinc-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <div className="flex flex-col justify-between grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-bold text-zinc-900 text-sm leading-tight line-clamp-1">
                                {item.name}
                              </h5>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
                                {item.category}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                removeFromCart(item.id, item.currency)
                              }
                              className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center bg-zinc-100 rounded-xl px-1 py-0.5 border">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.currency, -1)
                                }
                                className="p-1 hover:text-emerald-600 text-zinc-500"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-black text-zinc-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.currency, 1)
                                }
                                className="p-1 hover:text-emerald-600 text-zinc-500"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span
                              className={cn(
                                "font-black text-sm",
                                item.currency === "DL"
                                  ? "text-amber-500"
                                  : "text-zinc-900",
                              )}
                            >
                              {item.currency === "DL"
                                ? `${item.price * item.quantity} DL`
                                : formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div className="mt-4 space-y-1 shrink-0">
              {(() => {
                const hasIdrOnly = cart.some((i) => i.priceMode === "IDR_ONLY");
                const hasDLOnly = cart.some((i) => i.priceMode === "DL_ONLY");
                const allBoth =
                  cart.length > 0 && cart.every((i) => i.priceMode === "BOTH");
                const isConflict = hasIdrOnly && hasDLOnly;

                // For all-BOTH carts, recalculate total based on chosen currency
                const bothTotal = allBoth
                  ? (
                      cart as {
                        priceIdr?: number;
                        priceDl?: number;
                        quantity: number;
                      }[]
                    ).reduce((sum, item) => {
                      const price =
                        checkoutCurrency === "IDR"
                          ? (item.priceIdr ?? 0)
                          : (item.priceDl ?? 0);
                      return sum + price * item.quantity;
                    }, 0)
                  : 0;

                return (
                  <div className="bg-zinc-900 rounded-[2.5rem] p-5 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />

                    {/* Conflict Warning */}
                    {isConflict && (
                      <div className="mb-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                        <span className="text-red-400 text-xl mt-0.5">⚠️</span>
                        <div>
                          <p className="text-red-400 font-black text-sm">
                            Metode Pembayaran Bermasalah!
                          </p>
                          <p className="text-red-300/70 text-xs font-medium mt-0.5">
                            Keranjangmu mengandung produk IDR-only{" "}
                            <strong>dan</strong> DL-only sekaligus. Hapus salah
                            satunya untuk melanjutkan.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Method Selector for all-BOTH carts */}
                    {allBoth && !isConflict && (
                      <div className="mb-4">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                          Pilih Metode Pembayaran
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setCheckoutCurrency("IDR")}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all text-center",
                              checkoutCurrency === "IDR"
                                ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                                : "border-zinc-700 bg-zinc-800 hover:border-emerald-500/50",
                            )}
                          >
                            <span className="text-xs font-black">
                              💰 Rupiah
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              Bayar IDR
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCheckoutCurrency("DL")}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all text-center",
                              checkoutCurrency === "DL"
                                ? "border-amber-500 bg-amber-500/20 text-amber-300"
                                : "border-zinc-700 bg-zinc-800 hover:border-amber-500/50",
                            )}
                          >
                            <span className="text-xs font-black">
                              💎 Diamond Lock
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              Bayar DL
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                        <span>Ringkasan Belanja</span>
                        <span>Estimasi Total</span>
                      </div>
                      <Separator className="bg-white/10" />

                      {allBoth ? (
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 text-xs font-bold">
                            Total{" "}
                            {checkoutCurrency === "IDR"
                              ? "Rupiah (IDR)"
                              : "Diamond Lock (DL)"}
                          </span>
                          <span
                            className={cn(
                              "text-base font-black",
                              checkoutCurrency === "DL"
                                ? "text-amber-400"
                                : "text-white",
                            )}
                          >
                            {checkoutCurrency === "IDR"
                              ? formatPrice(bothTotal)
                              : `${bothTotal} DL`}
                          </span>
                        </div>
                      ) : (
                        <>
                          {cartTotalIdr > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-400 text-xs font-bold">
                                Total Rupiah (IDR)
                              </span>
                              <span className="text-base font-black text-white">
                                {formatPrice(cartTotalIdr)}
                              </span>
                            </div>
                          )}
                          {cartTotalDl > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-400 text-xs font-bold">
                                Total Locks (DL)
                              </span>
                              <span className="text-base font-black text-amber-400">
                                {cartTotalDl} DL
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <Button
                      onClick={() => {
                        if (!isAuthenticated) {
                          setIsCartOpen(false);
                          router.push("/login");
                          return;
                        }

                        if (isConflict) {
                          toast.error(
                            "Tidak bisa checkout produk campuran IDR dan DL!",
                            {
                              description:
                                "Hapus salah satu produk yang berbeda metode pembayarannya.",
                            },
                          );
                          return;
                        }

                        // Balance checks
                        const idrNeed = allBoth
                          ? checkoutCurrency === "IDR"
                            ? bothTotal
                            : 0
                          : cartTotalIdr;
                        const dlNeed = allBoth
                          ? checkoutCurrency === "DL"
                            ? bothTotal
                            : 0
                          : cartTotalDl;

                        if (idrNeed > 0 && idrNeed > (user?.balance || 0)) {
                          toast.error("Saldo Rupiah tidak cukup!", {
                            description: `Kamu butuh ${formatPrice(idrNeed)}, saldo tersedia ${formatPrice(user?.balance || 0)}.`,
                          });
                          return;
                        }
                        if (dlNeed > 0 && dlNeed > (user?.wl || 0) / 100) {
                          toast.error("Saldo Diamond Lock tidak cukup!", {
                            description: `Kamu butuh ${dlNeed} DL, saldo tersedia ${((user?.wl || 0) / 100).toFixed(2)} DL.`,
                          });
                          return;
                        }

                        toast.error("Checkout gagal! ❌", {
                          description:
                            "Maaf Sepertinya ada yang salah, silahkan coba lagi nanti.",
                        });
                      }}
                      disabled={cart.length === 0 || isConflict}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl py-7 font-black text-lg transition-all active:scale-95 shadow-[0_12px_24px_rgba(16,185,129,0.3)] relative z-10 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      PROSES CHECKOUT
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                );
              })()}
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  className="w-full rounded-2xl py-5 font-bold text-zinc-500 hover:text-zinc-900"
                >
                  Batal / Lanjut Belanja
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* DESKTOP NAVBAR - Hidden on Mobile */}
      <nav
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b py-2 shadow-sm"
            : "bg-white border-b py-4",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 text-2xl font-black tracking-tighter text-zinc-900 shrink-0"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-[0_4px_10px_rgba(16,185,129,0.3)]">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <span className="block">
                ANJAY<span className="text-emerald-500">STORE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 ml-8 mr-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-full transition-all",
                    pathname === link.href
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <div
                className="relative h-10 flex items-center px-4"
                ref={dropdownRef}
              >
                <button
                  onMouseEnter={() => setShowCategory(true)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors",
                    showCategory && "text-zinc-900",
                  )}
                >
                  Kategori{" "}
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      showCategory && "rotate-180",
                    )}
                  />
                </button>

                {showCategory && (
                  <div
                    onMouseLeave={() => setShowCategory(false)}
                    className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-2 mt-0 transform origin-top animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="grid gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={`/shop?category=${cat.name}`}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-zinc-100 transition-all">
                            {cat.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">
                              {cat.name}
                            </p>
                            <p className="text-[10px] text-zinc-400 font-medium tracking-tight">
                              Eksklusif Item
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              <Link href="/shop" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-zinc-100"
                >
                  <Search className="w-5 h-5 text-zinc-600" />
                </Button>
              </Link>

              <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block" />

              <Button
                variant="ghost"
                onClick={() => setIsCartOpen(true)}
                className="relative hidden sm:flex items-center gap-2 pr-4 pl-3 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-100/50 group"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-[9px] font-black text-zinc-400 uppercase leading-none mb-0.5">
                    Keranjang
                  </p>
                  <p className="text-xs font-black text-zinc-900 leading-none">
                    {cartCount} Items
                  </p>
                </div>
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2 pl-3">
                  <button
                    onClick={handleProxyClick}
                    className="hidden lg:flex flex-col items-end mr-1 group"
                  >
                    <p className="text-[10px] font-black text-zinc-400 uppercase leading-none mb-0.5">
                      ID: {user?.growid || "None"}
                    </p>
                    <p className="text-xs font-black text-emerald-500 leading-none group-hover:underline">
                      MANAGER PROXY
                    </p>
                  </button>
                  <Link href="/profile">
                    <div className="w-10 h-10 rounded-xl border-2 border-zinc-200 p-0.5 hover:border-emerald-500 transition-colors cursor-pointer">
                      <Image
                        src={
                          user?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`
                        }
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="rounded-lg"
                      />
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 hidden md:flex"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="rounded-xl px-6 py-5 bg-zinc-900 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-zinc-100 transition-all">
                    MASUK AKUN
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
        <div className="flex items-center justify-between bg-zinc-900/95 backdrop-blur-2xl border border-white/10 p-2 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300",
              pathname === "/"
                ? "bg-white text-zinc-900 shadow-[0_8px_15px_rgba(255,255,255,0.1)] scale-105"
                : "text-zinc-500 hover:text-white",
            )}
          >
            <Home
              className={cn("w-5 h-5", pathname === "/" ? "fill-zinc-900" : "")}
            />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              Beranda
            </span>
          </Link>

          <Link
            href="/shop"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300",
              pathname === "/shop"
                ? "bg-white text-zinc-900 shadow-[0_8px_15px_rgba(255,255,255,0.1)] scale-105"
                : "text-zinc-500 hover:text-white",
            )}
          >
            <LayoutGrid
              className={cn(
                "w-5 h-5",
                pathname === "/shop" ? "fill-zinc-900" : "",
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              Katalog
            </span>
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center gap-1 py-2 px-4 group"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.4)] border-4 border-zinc-900 group-active:scale-90 transition-all duration-300">
              <ShoppingBag className="w-6 h-6 fill-white" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-white text-emerald-600 text-[10px] font-black rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-sm">
                  {cartCount}
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tight mt-2 text-zinc-500 group-hover:text-emerald-400">
              Cart
            </span>
          </button>

          <Link
            href="/notifications"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300",
              pathname === "/notifications"
                ? "bg-white text-zinc-900 shadow-[0_8px_15px_rgba(255,255,255,0.1)] scale-105"
                : "text-zinc-500 hover:text-white",
            )}
          >
            <Bell
              className={cn(
                "w-5 h-5",
                pathname === "/notifications" ? "fill-zinc-900" : "",
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              Notif
            </span>
          </Link>

          <Link
            href={isAuthenticated ? "/profile" : "/login"}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300",
              pathname === "/profile" || pathname === "/login"
                ? "bg-white text-zinc-900 shadow-[0_8px_15px_rgba(255,255,255,0.1)] scale-105"
                : "text-zinc-500 hover:text-white",
            )}
          >
            <User
              className={cn(
                "w-5 h-5",
                pathname === "/profile" || pathname === "/login"
                  ? "fill-zinc-900"
                  : "",
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {isAuthenticated ? "Profil" : "Masuk"}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
