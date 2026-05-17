import { borrar, guardar, leer, STORAGE_KEYS } from "@/services/storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

interface StoredUser {
  password: string;
  user: AuthUser;
}

type RegisteredUsers = Record<string, StoredUser>;

interface AuthContextType {
  user: AuthUser | null;
  cargandoSesion: boolean;
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  register: (
    username: string,
    password: string,
    displayName?: string
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const HARDCODED_USERS: RegisteredUsers = {
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
  register: () => ({ ok: false, error: "no provider" }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [usuarios, setUsuarios] = useState<RegisteredUsers>({});
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    (async () => {
      const [guardado, registrados] = await Promise.all([
        leer<AuthUser>(STORAGE_KEYS.user),
        leer<RegisteredUsers>(STORAGE_KEYS.usuarios),
      ]);
      if (guardado) setUser(guardado);
      if (registrados) setUsuarios(registrados);
      setCargandoSesion(false);
    })();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      cargandoSesion,
      login: (username, password) => {
        const key = username.trim().toLowerCase();
        const record = HARDCODED_USERS[key] ?? usuarios[key];
        if (!record) return { ok: false, error: "usuario no existe" };
        if (record.password !== password) return { ok: false, error: "contraseña incorrecta" };
        setUser(record.user);
        guardar(STORAGE_KEYS.user, record.user);
        return { ok: true };
      },
      register: (username, password, displayName) => {
        const key = username.trim().toLowerCase();
        if (key.length < 3) return { ok: false, error: "usuario muy corto (mín 3)" };
        if (password.length < 4) return { ok: false, error: "contraseña muy corta (mín 4)" };
        if (HARDCODED_USERS[key] || usuarios[key]) {
          return { ok: false, error: "ese usuario ya existe" };
        }
        const nuevo: StoredUser = {
          password,
          user: {
            id: `u-${key}-${Date.now()}`,
            username: key,
            displayName: displayName?.trim() || key,
          },
        };
        const next = { ...usuarios, [key]: nuevo };
        setUsuarios(next);
        guardar(STORAGE_KEYS.usuarios, next);
        setUser(nuevo.user);
        guardar(STORAGE_KEYS.user, nuevo.user);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        borrar(STORAGE_KEYS.user);
      },
    }),
    [user, cargandoSesion, usuarios]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
