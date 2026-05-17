import AsyncStorage from "@react-native-async-storage/async-storage";

export async function guardar<T>(clave: string, valor: T): Promise<void> {
  try {
    await AsyncStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // ignorar errores de storage
  }
}

export async function leer<T>(clave: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(clave);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function borrar(clave: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(clave);
  } catch {
    // ignorar
  }
}

export const STORAGE_KEYS = {
  user: "@anime/user",
  usuarios: "@anime/usuarios",
  categorias: (userId: string) => `@anime/categorias/${userId}`,
};
