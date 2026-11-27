import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const ADMIN_ROLE = 'admin';

export function AuthProvider({ children }) {
  // El token vive en localStorage para sobrevivir a recargas; el usuario se pide al backend.
  const [token, setToken] = useState(() => authService.getStoredToken());
  const [user, setUser] = useState(null);
  // Si hay token guardado, hasta que /auth/me responda no sabemos quién es.
  // ProtectedRoute espera mientras isChecking sea true, para no mandar al login en cada recarga.
  const [isChecking, setIsChecking] = useState(() => Boolean(authService.getStoredToken()));

  // Al montar: validar el token guardado contra el backend.
  useEffect(() => {
    if (!authService.getStoredToken()) return undefined;

    let ignore = false;
    authService
      .getMe()
      .then((me) => {
        if (!ignore) setUser(me);
      })
      .catch((err) => {
        if (ignore) return;
        // Un TypeError es un fallo de red (backend caído): se conserva el token para reintentar.
        // Cualquier otro error (token vencido, inválido, cuenta desactivada) cierra la sesión.
        if (!(err instanceof TypeError)) {
          authService.clearToken();
          setToken(null);
        }
      })
      .finally(() => {
        if (!ignore) setIsChecking(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const startSession = useCallback(({ user: sessionUser, token: sessionToken }) => {
    authService.storeToken(sessionToken);
    setToken(sessionToken);
    setUser(sessionUser);
    return sessionUser;
  }, []);

  const login = useCallback(
    async (credentials) => startSession(await authService.login(credentials)),
    [startSession]
  );

  const register = useCallback(
    async (data) => startSession(await authService.register(data)),
    [startSession]
  );

  const logout = useCallback(() => {
    authService.clearToken();
    setToken(null);
    setUser(null);
  }, []);

  // Para refrescar los datos después de editar el perfil.
  const updateUser = useCallback((nextUser) => setUser(nextUser), []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === ADMIN_ROLE,
      isChecking,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, isChecking, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
