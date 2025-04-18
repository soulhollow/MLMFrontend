// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// CSS-Importe
import './App.css';

// Layout-Komponenten
import Layout from './components/layout/Layout';
import LoginLayout from './components/layout/LoginLayout';

// Authentifizierungs-Komponenten
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Hauptseiten
import Dashboard from './pages/Dashboard';
import ContactsPage from './pages/contacts/ContactsPage';
import ContactDetail from './pages/contacts/ContactDetail';
import PipelinesPage from './pages/pipelines/PipelinesPage';
import TasksPage from './pages/tasks/TasksPage';
import TeamPage from './pages/team/TeamPage';
import ProfilePage from './pages/profile/ProfilePage';

// Geschützte Route Komponente
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Lädt...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* Authentifizierte Routen */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="contacts/:contactId" element={<ContactDetail />} />
              <Route path="pipelines" element={<PipelinesPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Öffentliche Routen */}
            <Route path="/" element={<LoginLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
