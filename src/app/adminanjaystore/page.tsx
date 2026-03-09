"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { productApi } from "@/lib/api";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  LogIn,
  ShieldAlert,
  Loader2,
  X,
  Check,
  Search,
  ToggleLeft,
  ToggleRight,
  ImageIcon,
  Layers,
  ArrowLeft,
  Settings as SettingsIcon,
  Globe,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useAdminLoginMutation,
  useConfig,
  useUpdateConfigMutation,
} from "@/lib/hooks/useConfigQueries";

// ---- Types ----
type PriceMode = "IDR_ONLY" | "DL_ONLY" | "BOTH";

interface Product {
  id: number;
  name: string;
  description?: string;
  image?: string;
  category: string;
  stock: number;
  priceIdr?: number;
  priceDl?: number;
  priceMode: PriceMode;
  isActive: boolean;
  createdAt: string;
}

interface ProductForm {
  name: string;
  description: string;
  image: string;
  category: string;
  stock: number;
  priceIdr: number | "";
  priceDl: number | "";
  priceMode: PriceMode;
  isActive: boolean;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const EMPTY_FORM: ProductForm = {
  name: "",
  description: "",
  image: "",
  category: "",
  stock: 0,
  priceIdr: "",
  priceDl: "",
  priceMode: "IDR_ONLY",
  isActive: true,
};

const formatIdr = (n?: number | null) =>
  n != null ? `Rp ${n.toLocaleString("id-ID")}` : "-";

const PRICE_MODES: { value: PriceMode; label: string; color: string }[] = [
  { value: "IDR_ONLY", label: "IDR Only", color: "bg-blue-500" },
  { value: "DL_ONLY", label: "DL Only", color: "bg-yellow-500" },
  { value: "BOTH", label: "IDR + DL", color: "bg-purple-500" },
];

// ---- Admin Login Screen ----
function AdminLoginScreen({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useAdminLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return setError("Key tidak boleh kosong");

    loginMutation.mutate(key.trim(), {
      onSuccess: () => {
        onLogin(key.trim());
      },
      onError: (err: Error) => {
        const apiError = err as unknown as ApiError;
        setError(apiError?.response?.data?.message || "Admin Key Salah!");
      },
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-4">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Admin Panel
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-1">
            Anjay Store — Restricted Area
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest">
                Admin Key
              </Label>
              <Input
                type="password"
                placeholder="Masukkan admin key..."
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError("");
                }}
                className="bg-zinc-800 border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:border-emerald-500 py-5"
              />
              {error && (
                <p className="text-red-400 text-xs font-bold">{error}</p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-6 rounded-2xl shadow-xl shadow-emerald-500/20"
          >
            {loginMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <LogIn className="w-5 h-5 mr-2" />
            )}
            MASUK ADMIN
          </Button>
        </form>
      </div>
    </div>
  );
}

// ---- Product Form Modal ----
function ProductModal({
  editing,
  form,
  setForm,
  onSave,
  onClose,
  saving,
}: {
  editing: Product | null;
  form: ProductForm;
  setForm: (f: ProductForm) => void;
  onSave: () => void;
  onClose: () => void;
  saving: boolean;
}) {
  const set = (key: keyof ProductForm, value: string | number | boolean) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="font-black text-white text-lg">
              {editing ? "Edit Produk" : "Tambah Produk"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Image Preview */}
          <div>
            <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest block mb-2">
              URL Gambar
            </Label>
            {form.image && (
              <div className="mb-2 rounded-xl overflow-hidden h-40 bg-zinc-800 relative">
                <Image
                  src={form.image}
                  alt="preview"
                  fill
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <Input
              placeholder="https://..."
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              className="bg-zinc-800 border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:border-emerald-500"
            />
          </div>

          {/* Name */}
          <div>
            <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest block mb-2">
              Nama Produk *
            </Label>
            <Input
              placeholder="Contoh: AK47 | FN SCAR-L | ..."
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="bg-zinc-800 border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest block mb-2">
              Deskripsi
            </Label>
            <textarea
              placeholder="Deskripsi singkat produk..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none p-3 text-sm resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest block mb-2">
              Kategori
            </Label>
            <Input
              placeholder="Contoh: Growtopia, Akun, Item, Skin..."
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="bg-zinc-800 border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:border-emerald-500"
            />
          </div>

          {/* Stock */}
          <div>
            <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest block mb-2">
              Stok
            </Label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={form.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
              className="bg-zinc-800 border-zinc-700 rounded-xl text-white focus:border-emerald-500"
            />
          </div>

          {/* Price Mode */}
          <div>
            <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest block mb-2">
              Mode Harga
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {PRICE_MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => set("priceMode", m.value)}
                  className={`py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                    form.priceMode === m.value
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            {(form.priceMode === "IDR_ONLY" || form.priceMode === "BOTH") && (
              <div>
                <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest block mb-2">
                  Harga (Rp) *
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="50000"
                  value={form.priceIdr}
                  onChange={(e) =>
                    set(
                      "priceIdr",
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                  className="bg-zinc-800 border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:border-emerald-500"
                />
              </div>
            )}
            {(form.priceMode === "DL_ONLY" || form.priceMode === "BOTH") && (
              <div>
                <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest block mb-2">
                  Harga (DL) *
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="1"
                  value={form.priceDl}
                  onChange={(e) =>
                    set("priceDl", e.target.value ? Number(e.target.value) : "")
                  }
                  className="bg-zinc-800 border-zinc-700 rounded-xl text-white placeholder:text-zinc-600 focus:border-yellow-500"
                />
              </div>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between bg-zinc-800 rounded-2xl px-4 py-3">
            <div>
              <p className="text-white font-bold text-sm">Produk Aktif</p>
              <p className="text-zinc-500 text-xs">Tampilkan di toko</p>
            </div>
            <button
              type="button"
              onClick={() => set("isActive", !form.isActive)}
            >
              {form.isActive ? (
                <ToggleRight className="w-8 h-8 text-emerald-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-zinc-600" />
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-zinc-700 text-zinc-400 rounded-xl hover:bg-zinc-800"
          >
            Batal
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4 mr-1" />
            )}
            {editing ? "Update" : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Main Admin Page ----
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState<"products" | "settings">(
    "products",
  );

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Config management
  const { data: config } = useConfig();
  const updateConfigMutation = useUpdateConfigMutation();
  const [newDepoWorld, setNewDepoWorld] = useState("");

  useEffect(() => {
    if (config?.depo_world) {
      setNewDepoWorld(config.depo_world);
    }
  }, [config]);

  const handleUpdateConfig = () => {
    if (!adminKey || !newDepoWorld) return;
    updateConfigMutation.mutate(
      {
        adminKey,
        payload: { depo_world: newDepoWorld },
      },
      {
        onSuccess: () => {
          alert("Konfigurasi diperbarui!");
        },
      },
    );
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch {
      setError("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle admin login
  const handleLogin = (key: string) => {
    setAdminKey(key);
    setAuthed(true);
    localStorage.setItem("admin_key", key);
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("admin_key");
    if (savedKey) {
      setAdminKey(savedKey);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchProducts();
  }, [authed, fetchProducts]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      image: p.image || "",
      category: p.category || "",
      stock: p.stock,
      priceIdr: p.priceIdr ?? "",
      priceDl: p.priceDl ?? "",
      priceMode: p.priceMode,
      isActive: p.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!adminKey) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        image: form.image || null,
        category: form.category || "Umum",
        stock: form.stock,
        priceIdr: form.priceIdr !== "" ? form.priceIdr : null,
        priceDl: form.priceDl !== "" ? form.priceDl : null,
        priceMode: form.priceMode,
        isActive: form.isActive,
      };

      if (editing) {
        await productApi.update(adminKey, editing.id, payload);
      } else {
        await productApi.create(adminKey, payload);
      }

      setShowModal(false);
      await fetchProducts();
    } catch (err: unknown) {
      const apiError = err as unknown as ApiError;
      setError(apiError?.response?.data?.message || "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!adminKey) return;
    try {
      await productApi.delete(adminKey, id);
      setDeleteConfirm(null);
      await fetchProducts();
    } catch (err: unknown) {
      const apiError = err as unknown as ApiError;
      setError(apiError?.response?.data?.message || "Gagal menghapus produk");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (!authed) return <AdminLoginScreen onLogin={handleLogin} />;

  const priceModeInfo = (mode: PriceMode) =>
    PRICE_MODES.find((m) => m.value === mode);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-white uppercase tracking-tight leading-none">
                Admin Panel
              </h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">
                Anjay Store
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setActiveTab("products")}
              className={cn(
                "h-10 rounded-xl font-black text-xs uppercase tracking-widest",
                activeTab === "products"
                  ? "bg-zinc-800 text-emerald-400"
                  : "text-zinc-500",
              )}
            >
              <Package className="w-4 h-4 mr-2" />
              Produk
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab("settings")}
              className={cn(
                "h-10 rounded-xl font-black text-xs uppercase tracking-widest",
                activeTab === "settings"
                  ? "bg-zinc-800 text-emerald-400"
                  : "text-zinc-500",
              )}
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <div className="w-px h-6 bg-zinc-800 mx-1" />
            <Link href="/">
              <Button
                variant="outline"
                className="h-10 rounded-xl border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Toko
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem("admin_key");
                window.location.reload();
              }}
              className="h-10 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-400 font-bold"
            >
              LOGOUT
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "products" ? (
          <>
            {/* Search and Action Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
              <div className="flex items-center bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-800 gap-3 w-full md:w-96 focus-within:border-emerald-500 transition-colors shadow-sm">
                <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari produk impian..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-zinc-600 font-medium"
                />
              </div>
              <Button
                onClick={openCreate}
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-emerald-500/20"
              >
                <Plus className="w-5 h-5 mr-2" />
                TAMBAH PRODUK BARU
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total Produk",
                  value: products.length,
                  icon: Package,
                  color: "text-blue-400",
                },
                {
                  label: "Aktif",
                  value: products.filter((p) => p.isActive).length,
                  icon: Check,
                  color: "text-emerald-400",
                },
                {
                  label: "Non-aktif",
                  value: products.filter((p) => !p.isActive).length,
                  icon: X,
                  color: "text-red-400",
                },
                {
                  label: "Stok Habis",
                  value: products.filter((p) => p.stock === 0).length,
                  icon: Layers,
                  color: "text-yellow-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {s.label}
                    </p>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <p className="text-4xl font-black text-white">{s.value}</p>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-6 px-6 py-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-3xl text-sm font-bold flex items-center gap-3">
                <ShieldAlert className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="font-bold text-zinc-500">Memuat data produk...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-zinc-600 bg-zinc-900 rounded-[3rem] border border-zinc-800 border-dashed">
                <Package className="w-20 h-20 mb-4 opacity-10" />
                <p className="font-black text-xl text-zinc-500">
                  Ups! Produk Tidak Ditemukan
                </p>
                <p className="text-sm mt-1 font-medium">
                  Coba gunakan kata kunci pencarian lain
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => {
                  const modeInfo = priceModeInfo(product.priceMode);
                  return (
                    <div
                      key={product.id}
                      className={`bg-zinc-900 rounded-[2.5rem] border overflow-hidden transition-all hover:border-emerald-500/50 group shadow-sm hover:shadow-emerald-500/5 ${
                        product.isActive
                          ? "border-zinc-800"
                          : "border-zinc-800/50 opacity-60"
                      }`}
                    >
                      {/* Image */}
                      <div className="aspect-4/3 relative bg-zinc-800 overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-zinc-700" />
                          </div>
                        )}
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-black px-3 py-1 rounded-xl text-white shadow-lg backdrop-blur-md",
                              modeInfo?.color ? modeInfo.color : "bg-zinc-800",
                            )}
                          >
                            {modeInfo?.label}
                          </span>
                          {!product.isActive && (
                            <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-zinc-950/80 text-zinc-400 border border-zinc-800 backdrop-blur-md">
                              Non-aktif
                            </span>
                          )}
                        </div>
                        {/* Stock badge */}
                        <div
                          className={`absolute bottom-4 left-4 text-[10px] font-black px-3 py-1 rounded-xl shadow-lg backdrop-blur-md ${
                            product.stock === 0
                              ? "bg-red-500 text-white"
                              : product.stock < 10
                                ? "bg-yellow-500 text-black"
                                : "bg-emerald-500 text-white"
                          }`}
                        >
                          STOK: {product.stock}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                            {product.category}
                          </p>
                        </div>
                        <h3 className="font-black text-white text-lg mb-2 truncate leading-tight">
                          {product.name}
                        </h3>

                        {/* Prices */}
                        <div className="bg-zinc-950/50 rounded-2xl p-4 mb-6 space-y-2 border border-zinc-800">
                          {(product.priceMode === "IDR_ONLY" ||
                            product.priceMode === "BOTH") && (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase">
                                Rupiah
                              </span>
                              <span className="text-emerald-400 text-sm font-black">
                                {formatIdr(product.priceIdr)}
                              </span>
                            </div>
                          )}
                          {(product.priceMode === "DL_ONLY" ||
                            product.priceMode === "BOTH") && (
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-500 uppercase">
                                Diamond Lock
                              </span>
                              <span className="text-yellow-400 text-sm font-black">
                                {product.priceDl} DL
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openEdit(product)}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold h-11"
                          >
                            <Pencil className="w-4 h-4 mr-2" /> Edit
                          </Button>
                          {deleteConfirm === product.id ? (
                            <div className="flex gap-1 flex-1">
                              <Button
                                onClick={() => handleDelete(product.id)}
                                className="flex-1 bg-red-500 hover:bg-red-400 text-white rounded-xl font-bold h-11"
                              >
                                YA
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setDeleteConfirm(null)}
                                className="border-zinc-800 bg-zinc-800 rounded-xl h-11"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={() => setDeleteConfirm(product.id)}
                              className="border-zinc-800 bg-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl h-11"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-2xl bg-zinc-900 rounded-[3rem] p-10 border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  KONTROL DUNIA
                </h2>
                <p className="text-zinc-500 font-medium">
                  Atur world deposit untuk pengisian saldo DL
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <Label className="text-zinc-400 text-xs font-black uppercase tracking-widest ml-1">
                  WORLD DEPOSIT (GROWTOPIA)
                </Label>
                <div className="relative group">
                  <Input
                    placeholder="Contoh: GONDOOLA26"
                    value={newDepoWorld}
                    onChange={(e) =>
                      setNewDepoWorld(e.target.value.toUpperCase())
                    }
                    className="bg-zinc-950 border-zinc-800 rounded-2xl text-white placeholder:text-zinc-700 focus:border-emerald-500 h-16 text-xl font-black px-6 transition-all group-hover:border-zinc-700"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-zinc-800 rounded-lg text-[10px] font-black text-emerald-400 border border-zinc-700 tracking-widest">
                    GT WORLD
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 font-medium italic ml-1">
                  * Nama world ini akan muncul secara otomatis di modal Top Up
                  pengguna.
                </p>
              </div>

              <div className="p-6 bg-zinc-950/50 rounded-3xl border border-zinc-800 border-dashed space-y-4">
                <div className="flex items-start gap-4 text-zinc-400">
                  <ShieldAlert className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="text-sm font-black text-zinc-300">
                      Konfirmasi Admin
                    </p>
                    <p className="text-xs leading-relaxed font-medium">
                      Pastikan nama world yang diinput sudah benar dan memiliki{" "}
                      <span className="text-yellow-500 font-bold">
                        Donation Box
                      </span>{" "}
                      aktif di dalamnya.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleUpdateConfig}
                disabled={updateConfigMutation.isPending}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-8 rounded-2xl text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
              >
                {updateConfigMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                ) : (
                  <Save className="w-6 h-6 mr-2" />
                )}
                SIMPAN PERUBAHAN DUNIA
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <ProductModal
          editing={editing}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}
    </div>
  );
}
