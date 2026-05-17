import { borrar, guardar, leer, STORAGE_KEYS } from "@/services/storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  cargandoSesion: boolean;
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const HARDCODED_USERS: Record<string, { password: string; user: AuthUser }> = {
  admin: {
    password: "admin",
    user: { id: "u-admin", username: "admin", displayName: "admin" },
  },
  daniel: {
    password: "1234",
    user: { id: "u-daniel", username: "daniel", displayName: "daniel" },
  },
  otaku: {
    password: "anime",
    user: { id: "u-otaku", username: "otaku", displayName: "otaku" },
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  cargandoSesion: true,
  login: () => ({ ok: false, error: "no provider" }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    (async () => {
      const guardado = await leer<AuthUser>(STORAGE_KEYS.user);
      if (guardado) setUser(guardado);
      setCargandoSesion(false);
    })();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      cargandoSesion,
      login: (username, password) => {
        const key = username.trim().toLowerCase();
        const record = HARDCODED_USERS[key];
        if (!record) return { ok: false, error: "usuario no existe" };
        if (record.password !== password) return { ok: false, error: "contraseña incorrecta" };
        setUser(record.user);
        guardar(STORAGE_KEYS.user, record.user);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        borrar(STORAGE_KEYS.user);
      },
    }),
    [user, cargandoSesion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
