"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  User,
  Bell,
  Monitor,
  Smartphone,
  Headphones,
  Gamepad,
  Layers,
  Zap,
  Home,
  LayoutGrid,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCategory, setShowCategory] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wrap state update in setTimeout to avoid synchronous cascading render warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Shop", href: "/shop", icon: <LayoutGrid className="w-4 h-4" /> },
    {
      name: "Notification",
      href: "/notifications",
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
      name: "Proxy & SOCKS5",
      icon: <Smartphone className="w-5 h-5 text-pink-500" />,
    },
    { name: "App Premium", icon: <Layers className="w-5 h-5 text-red-500" /> },
    {
      name: "Software",
      icon: <Headphones className="w-5 h-5 text-purple-500" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCategory(false);
      setShowUserMenu(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategory(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
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
    const hasProxy = false;
    if (!hasProxy) {
      setIsProxyModalOpen(true);
    } else {
      router.push("/proxy");
    }
  };

  if (!mounted) return null;

  return (
    <>
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

      {/* DESKTOP NAVBAR */}
      <nav
        className={cn(
          "sticky top-0 z-50 w-full bg-white border-b py-4 transition-transform duration-300",
          isScrolled && "shadow-sm",
          !isVisible && "-translate-y-full",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 text-md md:text-2xl font-black tracking-tighter text-zinc-900 shrink-0"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)]">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <span className="block italic">
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
                    className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-2 mt-0"
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

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {/* Stats - Desktop Only */}
                  <div className="hidden xl:flex items-center gap-4 bg-zinc-50 border border-zinc-100 rounded-[1.25rem] px-4 py-1.5">
                    <div className="flex flex-col items-end">
                      <p className="text-[9px] font-black text-zinc-400 uppercase leading-none mb-1 tracking-wider">
                        SALDO IDR
                      </p>
                      <p className="text-xs font-black text-zinc-900 leading-none">
                        {formatPrice(user?.balance || 0)}
                      </p>
                    </div>
                    <div className="w-px h-6 bg-zinc-200" />
                    <div className="flex flex-col items-end">
                      <p className="text-[9px] font-black text-zinc-400 uppercase leading-none mb-1 tracking-wider">
                        DIAMOND LOCK
                      </p>
                      <p className="text-xs font-black text-amber-500 leading-none">
                        {((user?.wl || 0) / 100).toFixed(2)} DL
                      </p>
                    </div>
                  </div>

                  {/* User Dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={cn(
                        "flex items-center gap-3 p-1 rounded-[1.25rem] border-2 transition-all group",
                        showUserMenu
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-zinc-100 bg-white hover:border-emerald-200",
                      )}
                    >
                      <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-zinc-100 p-0.5 group-hover:scale-105 transition-transform bg-white">
                        <Image
                          src={
                            user?.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`
                          }
                          alt="Avatar"
                          width={40}
                          height={40}
                          className="rounded-xl object-cover w-full h-full"
                          unoptimized
                        />
                      </div>
                      <div className="text-left hidden lg:block pr-2">
                        <p className="text-sm font-black text-zinc-900 leading-tight truncate max-w-[100px]">
                          {user?.username}
                        </p>
                        <p className="text-[10px] font-bold text-zinc-400 leading-tight uppercase tracking-tight">
                          {user?.growid || "Offline"}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-zinc-400 mr-2 transition-transform hidden lg:block",
                          showUserMenu && "rotate-180 text-emerald-500",
                        )}
                      />
                    </button>

                    {showUserMenu && (
                      <div className="absolute top-full right-0 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-zinc-100 p-3 mt-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3 p-3 mb-2 bg-zinc-50 rounded-2xl">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border shadow-sm shrink-0 overflow-hidden">
                            <Image
                              src={
                                user?.avatar ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`
                              }
                              alt="Avatar"
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-black text-zinc-900 leading-tight truncate">
                              {user?.username}
                            </p>
                            <p className="text-[11px] font-bold text-emerald-500 leading-tight mt-0.5">
                              {user?.growid || "Offline"}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-colors">
                              <User className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-zinc-700">
                              Profil Saya
                            </span>
                          </Link>

                          <button
                            onClick={handleProxyClick}
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-50 transition-colors group text-left w-full"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-colors">
                              <LayoutGrid className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-zinc-700 block text-left">
                                Manager Proxy
                              </span>
                              <span className="text-[10px] font-medium text-zinc-400 block text-left">
                                Kelola SOCKS5 kamu
                              </span>
                            </div>
                          </button>

                          <Separator className="my-2 bg-zinc-100" />

                          <button
                            onClick={logout}
                            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 transition-colors group text-left w-full"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center text-zinc-400 group-hover:text-red-500 group-hover:border-red-100 transition-colors">
                              <LogOut className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-zinc-700 group-hover:text-red-600 transition-colors">
                              Keluar Layanan
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="rounded-2xl px-8 py-6 bg-zinc-900 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-zinc-200 transition-all active:scale-95">
                    MASUK
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <div
        className={cn(
          "md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md transition-all duration-300",
          !isVisible && "translate-y-[150%] opacity-0",
        )}
      >
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
            href="/profile"
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300",
              pathname === "/profile"
                ? "bg-white text-zinc-900 shadow-[0_8px_15px_rgba(255,255,255,0.1)] scale-105"
                : "text-zinc-500 hover:text-white",
            )}
          >
            <User
              className={cn(
                "w-5 h-5",
                pathname === "/profile" ? "fill-zinc-900" : "",
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              Profil
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
