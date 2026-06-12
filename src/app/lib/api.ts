import { projectId, publicAnonKey } from "/utils/supabase/info";
import { supabase } from "./supabase";

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e040eddb`;

const getToken = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || publicAnonKey;
};

const request = async (path: string, options: RequestInit = {}) => {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
};

export const api = {
  books: {
    list: (params?: { search?: string; category?: string }) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set("search", params.search);
      if (params?.category) qs.set("category", params.category);
      return request(`/books${qs.toString() ? `?${qs}` : ""}`);
    },
    get: (id: string) => request(`/books/${id}`),
    create: (data: Record<string, unknown>) =>
      request("/books", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/books/${id}`, { method: "DELETE" }),
  },
  auth: {
    signup: (data: { email: string; password: string; name: string }) =>
      request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  },
  stats: {
    get: () => request("/stats"),
  },
  activity: {
    get: () => request("/activity"),
  },
  digitalLibrary: {
    list: (params?: { search?: string; category?: string }) => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set("search", params.search);
      if (params?.category) qs.set("category", params.category);
      return request(`/digital-library/books${qs.toString() ? `?${qs}` : ""}`);
    },
    get: (id: string) => request(`/digital-library/books/${id}`),
  },
};
