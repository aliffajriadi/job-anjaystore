import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://192.168.1.8:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (username: string, password: string) => {
    const { data } = await api.post("/auth/login", { username, password });
    return data;
  },
  register: async (username: string, password: string) => {
    const { data } = await api.post("/auth/register", {
      username,
      password,
    });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
  updateProfile: async (payload: { growid?: string }) => {
    const { data } = await api.put("/auth/profile", payload);
    return data;
  },
  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const { data } = await api.put("/auth/change-password", payload);
    return data;
  },
};

export const productApi = {
  getAll: async () => {
    const { data } = await api.get("/products");
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  create: async (adminKey: string, payload: Record<string, unknown>) => {
    const { data } = await api.post("/products", payload, {
      headers: { "X-Admin-Key": adminKey },
    });
    return data;
  },
  update: async (
    adminKey: string,
    id: number,
    payload: Record<string, unknown>,
  ) => {
    const { data } = await api.put(`/products/${id}`, payload, {
      headers: { "X-Admin-Key": adminKey },
    });
    return data;
  },
  delete: async (adminKey: string, id: number) => {
    const { data } = await api.delete(`/products/${id}`, {
      headers: { "X-Admin-Key": adminKey },
    });
    return data;
  },
};

export const configApi = {
  getConfig: async () => {
    const { data } = await api.get("/config");
    return data;
  },
  updateConfig: async (adminKey: string, payload: { depo_world: string }) => {
    const { data } = await api.put("/config", payload, {
      headers: { "X-Admin-Key": adminKey },
    });
    return data;
  },
  loginAdmin: async (key: string) => {
    const { data } = await api.post("/config/login", { key });
    return data;
  },
};

export const notificationApi = {
  getAll: async () => {
    const { data } = await api.get("/notifications");
    return data;
  },
  markRead: async (id: number) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },
  markReadAll: async () => {
    const { data } = await api.post("/notifications/read-all");
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },
};
