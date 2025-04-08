import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import TrainerDashboard from "./components/dashboards/TrainerDashboard";
import StudentDashboard from "./components/dashboards/StudentDashboard";
import Layout from "./components/Layout";

// Protects routes: if not logged in, redirect to Login page
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

// Dynamically render the dashboard based on the user's role
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const DashboardComponent = {
    admin: AdminDashboard,
    trainer: TrainerDashboard,
    student: StudentDashboard,
  }[user.role];

  if (!DashboardComponent) return <p>Invalid role</p>;

  return <DashboardComponent />;
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
