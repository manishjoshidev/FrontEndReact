import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trainer" | "student";
}

interface TokenPayload {
  sub: string; // user ID
  emailId: string;
  role: "admin" | "trainer" | "student";
  exp: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Check for admin bypass first
    const isAdminBypass = localStorage.getItem("isAdminBypass") === "true";

    if (isAdminBypass) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error("Invalid user data", err);
          logout();
        }
      }
      setIsAuthReady(true);
      return;
    }

    // Regular token-based auth
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);

        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout(); // Token expired
        } else {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    }

    setIsAuthReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    // Special case for admin
    if (email === "admin@dummy.com" && password === "admin123") {
      const userData: User = {
        id: "0",
        name: "Admin",
        email: "admin@dummy.com",
        role: "admin",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAdminBypass", "true");
      return;
    }

    // Regular API login
    const response = await fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailId: email, password }),
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json(); // { token, emailId }

    const decoded: TokenPayload = jwtDecode(data.token);

    const userData: User = {
      id: decoded.sub,
      name: decoded.emailId.split("@")[0],
      email: decoded.emailId,
      role: decoded.role,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    localStorage.removeItem("isAdminBypass"); // Clear admin bypass if they logged in properly
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdminBypass");
  };

  if (!isAuthReady) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
