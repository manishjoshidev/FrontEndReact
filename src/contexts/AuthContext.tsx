import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "trainer" | "student";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock API call - replace with actual API in production
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Demo users
  const users = {
    "admin@example.com": {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin" as const,
    },
    "trainer@example.com": {
      id: "2",
      name: "Trainer User",
      email: "trainer@example.com",
      role: "trainer" as const,
    },
    "student@example.com": {
      id: "3",
      name: "Student User",
      email: "student@example.com",
      role: "student" as const,
    },
  };

  // Check credentials (simple demo logic)
  if (users[email as keyof typeof users] && password === "password") {
    return users[email as keyof typeof users];
  }

  throw new Error("Invalid credentials");
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsAuthReady(true);
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await mockLogin(email, password);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Don't render until auth is checked
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
