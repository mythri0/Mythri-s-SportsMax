import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  createdAt: string;
}

interface StoredAccount extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AUTH_STORAGE_KEY = "smx_auth_user";
const ACCOUNTS_STORAGE_KEY = "smx_registered_accounts";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load active session and seed default admin account if not present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }

      const existingAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (!existingAccounts) {
        const seedAccounts: StoredAccount[] = [
          {
            id: "usr_admin",
            name: "Admin User",
            email: "mythrivaishnavik.int2027g3@gmail.com",
            password: "password123",
            role: "Sports Administrator",
            createdAt: new Date().toISOString(),
          },
          {
            id: "usr_demo",
            name: "Alex Jordan",
            email: "athlete@sportsmax.ai",
            password: "password123",
            role: "Performance Analyst",
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(seedAccounts));
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Please enter your email address." };
    }

    try {
      let accounts: StoredAccount[] = [];
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (stored) {
        accounts = JSON.parse(stored);
      }

      let match = accounts.find((a) => a.email.toLowerCase() === cleanEmail);

      // If user exists and password is provided, check password
      if (match && password && match.password && match.password !== password) {
        return { success: false, error: "Incorrect password. Please try again." };
      }

      // If user doesn't exist yet, auto-register for a seamless onboarding experience
      if (!match) {
        const fallbackName = cleanEmail.split("@")[0]?.replace(/[._-]/g, " ") ?? "Member";
        const formattedName = fallbackName
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        match = {
          id: "usr_" + Math.random().toString(36).substring(2, 9),
          name: formattedName || "SportsMax Member",
          email: cleanEmail,
          password: password || "password123",
          role: "Performance Athlete",
          createdAt: new Date().toISOString(),
        };
        accounts.push(match);
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      }

      const sessionUser: User = {
        id: match.id,
        name: match.name,
        email: match.email,
        ...(match.role ? { role: match.role } : {}),
        createdAt: match.createdAt,
      };

      setUser(sessionUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      return { success: true };
    } catch {
      return { success: false, error: "An unexpected error occurred during login." };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!cleanEmail) {
      return { success: false, error: "Please enter your email address." };
    }

    try {
      let accounts: StoredAccount[] = [];
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (stored) {
        accounts = JSON.parse(stored);
      }

      const existingAccount = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
      if (existingAccount) {
        // Update credentials/name if already signed up
        existingAccount.name = cleanName;
        if (password) existingAccount.password = password;
      } else {
        accounts.push({
          id: "usr_" + Math.random().toString(36).substring(2, 9),
          name: cleanName,
          email: cleanEmail,
          password: password || "password123",
          role: "Performance Athlete",
          createdAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));

      const saved = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
      const sessionUser: User = {
        id: saved ? saved.id : "usr_" + Math.random().toString(36).substring(2, 9),
        name: cleanName,
        email: cleanEmail,
        role: "Performance Athlete",
        createdAt: saved ? saved.createdAt : new Date().toISOString(),
      };

      setUser(sessionUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
      return { success: true };
    } catch {
      return { success: false, error: "Failed to create account. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
