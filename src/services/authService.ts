
import type { Admin } from "@/types/admin";
import {
  apiMode,
  apiRequest,
  getAdminToken,
  saveAdminToken,
} from "@/services/api";

const DEMO_KEY = "eventease_demo_admin";

export const authService = {
  login: async (email: string, password: string) => {
    if (!apiMode) {
      throw new Error("The EventEase API is not configured.");
    }

    const response = await apiRequest<{
      success: boolean;
      message: string;
      token: string;
      admin: {
        id: string | number;
        email: string;
      };
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!response.success || !response.token || !response.admin) {
      throw new Error(response.message || "Login failed.");
    }

    saveAdminToken(response.token);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DEMO_KEY);
    }

    return {
      ...response.admin,
      id: String(response.admin.id),
      token: response.token,
    } as Admin;
  },

  enterDemo: () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DEMO_KEY, "true");
    }
  },

  hasSession: () => {
    if (typeof window === "undefined") return false;

    return Boolean(
      getAdminToken() ||
      window.localStorage.getItem(DEMO_KEY)
    );
  },

  isDemo: () =>
    typeof window !== "undefined" &&
    window.localStorage.getItem(DEMO_KEY) === "true",

  logout: () => {
    saveAdminToken(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DEMO_KEY);
    }
  },
};
