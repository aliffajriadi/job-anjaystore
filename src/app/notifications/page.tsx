"use client";

import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  Info,
  MoreHorizontal,
  Clock,
  ArrowLeft,
  Settings,
  CircleCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  useNotifications,
  useMarkReadMutation,
  useMarkReadAllMutation,
  useDeleteNotificationMutation,
} from "@/lib/hooks/useNotificationQueries";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

type Tab = "notifikasi" | "pesan";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Dummy Data Pesan
const MESSAGES = [
  {
    id: 1,
    name: "Admin Anjay Store",
    lastMsg:
      "Siap kak, barang akan segera kami proses untuk pengiriman malam ini.",
    time: "10:30",
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop",
    unread: 2,
  },
  {
    id: 2,
    name: "Support Kurir",
    lastMsg:
      "Mohon konfirmasi lokasinya kak, saya sudah di depan gang perumahan.",
    time: "09:45",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    unread: 0,
  },
  {
    id: 3,
    name: "Official Promo",
    lastMsg:
      "Jangan lewatkan penawaran spesial minggu ini khusus untuk member VIP!",
    time: "Kemarin",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    unread: 0,
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("notifikasi");
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { data: notifications = [], isLoading: notificationsLoading } =
    useNotifications() as { data: Notification[]; isLoading: boolean };
  const markReadMutation = useMarkReadMutation();
  const markReadAllMutation = useMarkReadAllMutation();
  const deleteNotificationMutation = useDeleteNotificationMutation();

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
    }
  }, [token, authLoading, router]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return {
          icon: <CircleCheck className="w-5 h-5 text-emerald-500" />,
          bg: "bg-emerald-50",
          border: "border-emerald-100",
        };
      case "WARNING":
        return {
          icon: <Zap className="w-5 h-5 text-yellow-500" fill="currentColor" />,
          bg: "bg-yellow-50",
          border: "border-yellow-100",
        };
      case "DANGER":
        return {
          icon: <Info className="w-5 h-5 text-red-500" />,
          bg: "bg-red-50",
          border: "border-red-100",
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-500" />,
          bg: "bg-blue-50",
          border: "border-blue-100",
        };
    }
  };

  const unreadCount = notifications.filter(
    (n: Notification) => !n.isRead,
  ).length;

  if (authLoading || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="bg-white border-b sticky top-0 z-40 px-4 py-4 md:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-black text-zinc-900 uppercase tracking-tight">
              Notification Center
            </h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5 text-zinc-400" />
          </Button>
        </div>

        {/* Tab Toggle */}
        <div className="max-w-3xl mx-auto mt-6">
          <div className="flex bg-zinc-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab("notifikasi")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all",
                activeTab === "notifikasi"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800",
              )}
            >
              <Bell
                className={cn(
                  "w-4 h-4",
                  activeTab === "notifikasi" && "fill-emerald-600",
                )}
              />
              NOTIFIKASI
              {unreadCount > 0 && (
                <Badge className="bg-emerald-500 text-[10px] h-5 min-w-5 flex items-center justify-center border-none">
                  {unreadCount}
                </Badge>
              )}
            </button>
            <button
              onClick={() => setActiveTab("pesan")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all",
                activeTab === "pesan"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800",
              )}
            >
              <MessageSquare
                className={cn(
                  "w-4 h-4",
                  activeTab === "pesan" && "fill-emerald-600",
                )}
              />
              PESAN
              <Badge className="bg-emerald-500 text-[10px] h-5 min-w-5 flex items-center justify-center border-none">
                2
              </Badge>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-6 pb-24">
        {activeTab === "notifikasi" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">
                Aktivitas Terbaru
              </h2>
              {unreadCount > 0 && (
                <button
                  onClick={() => markReadAllMutation.mutate()}
                  disabled={markReadAllMutation.isPending}
                  className="text-xs font-bold text-emerald-600 hover:underline disabled:opacity-50"
                >
                  {markReadAllMutation.isPending
                    ? "Memproses..."
                    : "Tandai semua sudah dibaca"}
                </button>
              )}
            </div>

            {notificationsLoading && (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
              </div>
            )}

            {!notificationsLoading && notifications.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-zinc-400 text-center px-12 bg-white rounded-[2.5rem] border shadow-sm">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-sm font-black text-zinc-900 uppercase tracking-widest">
                  BELUM ADA NOTIFIKASI
                </p>
                <p className="text-xs mt-2 font-medium max-w-xs leading-relaxed">
                  Semua pemberitahuan akun & transaksi Anda akan muncul di sini.
                </p>
              </div>
            )}

            {notifications.map((notif: Notification) => {
              const style = getNotifIcon(notif.type);
              return (
                <div
                  key={notif.id}
                  onClick={() =>
                    !notif.isRead && markReadMutation.mutate(notif.id)
                  }
                  className={cn(
                    "flex gap-4 p-5 rounded-[2.5rem] bg-white border transition-all hover:border-emerald-200 cursor-pointer relative group",
                    !notif.isRead
                      ? "border-emerald-100 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/10"
                      : "opacity-80",
                  )}
                >
                  {!notif.isRead && (
                    <div className="absolute top-6 right-6 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  )}

                  <div
                    className={cn(
                      "w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 border",
                      style.bg,
                      style.border,
                    )}
                  >
                    {style.icon}
                  </div>

                  <div className="grow space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                        {notif.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mr-2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          deleteNotificationMutation.mutate(notif.id);
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">
                Chat List
              </h2>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-[10px] font-black h-8 border-zinc-200"
              >
                CHAT BARU
              </Button>
            </div>

            {MESSAGES.map((msg) => (
              <div
                key={msg.id}
                className="flex items-center gap-4 p-4 rounded-[2.5rem] bg-white border hover:border-emerald-200 transition-all cursor-pointer group"
              >
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-zinc-50 group-hover:border-emerald-100 transition-colors">
                    <AvatarImage src={msg.avatar} />
                    <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <div className="grow min-w-0 pr-4">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-zinc-900 truncate group-hover:text-emerald-600 transition-colors">
                      {msg.name}
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 truncate font-medium">
                    {msg.lastMsg}
                  </p>
                </div>

                {msg.unread > 0 && (
                  <div className="h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg shadow-emerald-100">
                    {msg.unread}
                  </div>
                )}

                <div className="hidden group-hover:block transition-all animate-in fade-in zoom-in slide-in-from-right-2">
                  <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                </div>
              </div>
            ))}

            <div className="py-12 flex flex-col items-center justify-center text-zinc-400 text-center px-12">
              <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                <CircleCheck className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest">
                End of Messages
              </p>
              <p className="text-[10px] mt-1 italic">
                Percakapan Anda terenkripsi dengan aman di Anjay Store.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Support */}
      <Button className="fixed bottom-24 right-6 h-14 w-14 rounded-2xl bg-zinc-900 text-white shadow-2xl hover:bg-emerald-600 transition-all hover:scale-110 active:scale-90 border-4 border-white md:hidden">
        <MessageSquare className="w-6 h-6 fill-white" />
      </Button>
    </div>
  );
}
