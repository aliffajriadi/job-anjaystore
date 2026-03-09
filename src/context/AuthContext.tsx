"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { socket } from "../lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface User {
  id: number;
  username: string;
  balance: number;
  wl: number;
  dl: number;
  avatar?: string;
  growid?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? (JSON.parse(savedUser) as User) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });
  const [isLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Webhook listener for Real-time Balance updates
  useEffect(() => {
    if (token && user?.id) {
      if (!socket.connected) {
        console.log("Connecting to socket...");
        socket.connect();
      }

      const balanceUpdateKey = `balance-updated-${user.id}`;
      console.log(`Listening for balance updates on: ${balanceUpdateKey}`);

      const handleBalanceUpdate = (data: {
        wl: number;
        dl: number;
        balance: number;
        message: string;
      }) => {
        console.log("Received Balance Update via Socket:", data);

        // Update local user state
        setUser((prev) => {
          if (!prev) return null;
          const updated = {
            ...prev,
            wl: data.wl,
            dl: data.dl,
            balance: data.balance,
          };
          // Sync back to localStorage
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });

        // Update React Query data immediately for instant UI response
        queryClient.setQueryData(["user"], (old: User | null | undefined) => {
          if (!old) return old;
          return { ...old, wl: data.wl, dl: data.dl, balance: data.balance };
        });

        // Also invalidate to be safe
        queryClient.invalidateQueries({ queryKey: ["user"] });
      };

      socket.on(balanceUpdateKey, handleBalanceUpdate);

      return () => {
        console.log(`Removing listener for: ${balanceUpdateKey}`);
        socket.off(balanceUpdateKey, handleBalanceUpdate);
      };
    }
  }, [user?.id, token, queryClient]);

  // Listener for Real-time Notifications
  useEffect(() => {
    if (token && user?.id) {
      const notificationKey = `new-notification-${user.id}`;

      const handleNewNotification = (notification: {
        title: string;
        message: string;
        type?: string;
      }) => {
        console.log("New Notification Received:", notification);

        // Invalidate notifications query to refresh the list
        queryClient.invalidateQueries({ queryKey: ["notifications"] });

        // Show toast
        toast(notification.title, {
          description: notification.message,
          duration: 5000,
        });
      };

      socket.on(notificationKey, handleNewNotification);

      return () => {
        socket.off(notificationKey, handleNewNotification);
      };
    }
  }, [user?.id, token, queryClient]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    router.push("/");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    socket.disconnect();
    router.push("/login");
  };

  // Redirect if not authenticated on specific pages
  useEffect(() => {
    const protectedRoutes = ["/notifications", "/profile"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (!isLoading && !token && isProtectedRoute) {
      router.push("/login");
    }
  }, [token, pathname, isLoading, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
