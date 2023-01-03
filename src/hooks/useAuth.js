import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postLoginUser } from '../services/auth.service';
import LocalStorageService from '../services/localStorage.service';

const authContext = createContext();

// eslint-disable-next-line react/prop-types
export function ProviderAuth({ children }) {
  const auth = useProviderAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error('Context must be used within a Provider');
  return context;
};

function useProviderAuth() {
  const [user, setUser] = useState(LocalStorageService.getUser());
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await postLoginUser({ email, password });
      const data = response?.data || {};
      if (data?.access_token && data?.user) {
        LocalStorageService.setToken(data.access_token);
        LocalStorageService.setUser(data.user);
        setUser(data.user);
        return true;
      }
    } catch (error) {
      // TODO: handle error
      return false;
    }

    return false;
  };

  const logout = () => {
    LocalStorageService.removeAccessToken();
    LocalStorageService.removeUser();
    setUser(null);
  };

  const isLogged = () => Boolean(LocalStorageService.getAccessToken()) && Boolean(LocalStorageService.getUser());

  useEffect(() => {
    if (isLogged()) {
      setUser(LocalStorageService.getUser());
    } else {
      logout();
    }
  }, [navigate]);

  return {
    isAuthenticated: isLogged,
    user,
    login,
    logout,
  };
}
