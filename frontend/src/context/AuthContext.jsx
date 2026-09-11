import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("pulsedrop_token")
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("pulsedrop_user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (token, user) => {
    setToken(token);
    setUser(user);

    localStorage.setItem("pulsedrop_token", token);
    localStorage.setItem("pulsedrop_user", JSON.stringify(user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("pulsedrop_token");
    localStorage.removeItem("pulsedrop_user");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;