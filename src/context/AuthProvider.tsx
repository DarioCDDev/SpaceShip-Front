import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../models/User";
import { jwtDecode } from "jwt-decode";
import UserService from "../services/user.service";

interface DecodedToken {
  sub: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  decodeToken: (token: string) => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const expirationTime = decoded.exp * 1000;
        const remainingTime = (expirationTime - Date.now()) / 1000 / 60 / 60; // tiempo restante en horas
        console.log("Remaining time:", remainingTime);

        if (remainingTime <= 1) {
          if (decoded.sub) {
            console.log("Token is near expiration. Renewing token...");
            UserService.getUserByEmail(token, decoded.sub)
              .then((response) => {
                setUser(response.data);
                UserService.refreshToken(token)
                  .then((newToken) => {
                    setToken(newToken);
                    localStorage.setItem("token", newToken);
                  })
                  .catch((error) => {
                    console.error("Error renewing token:", error);
                    logout();
                  });
              })
              .catch((error) => {
                console.error("Error fetching user info:", error);
                logout();
              });
          } else {
            console.log("Token expired.");
            logout();
          }
        } else {
          UserService.getUserByEmail(token, decoded.sub).then((response) => {
            setUser(response.data);
          });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const decodeToken = (token: string): string | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.sub || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, setToken, logout, decodeToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
