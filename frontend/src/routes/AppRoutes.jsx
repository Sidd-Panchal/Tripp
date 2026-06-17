import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// Import Pages
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import UploadPage from '../pages/UploadPage.jsx';
import HistoryPage from '../pages/HistoryPage.jsx';
import ItineraryDetailsPage from '../pages/ItineraryDetailsPage.jsx';
import SharedItineraryPage from '../pages/SharedItineraryPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes with Main Navbar Layout */}
      <Route
        path="/"
        element={
          <MainLayout>
            <LandingPage />
          </MainLayout>
        }
      />
      
      {/* Auth Routes: Redirect back to Dashboard if already logged in */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <MainLayout>
              <LoginPage />
            </MainLayout>
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <MainLayout>
              <RegisterPage />
            </MainLayout>
          )
        }
      />

      {/* Public Shared Itinerary Portal */}
      <Route
        path="/share/:shareId"
        element={
          <MainLayout>
            <SharedItineraryPage />
          </MainLayout>
        }
      />

      {/* Protected Routes (Require JWT Session validation) */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/upload"
          element={
            <DashboardLayout>
              <UploadPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/history"
          element={
            <DashboardLayout>
              <HistoryPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/itinerary/:id"
          element={
            <DashboardLayout>
              <ItineraryDetailsPage />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Fallback 404 Route */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
