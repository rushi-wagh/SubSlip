import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import AppLayout from "./components/AppLayout";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/HeroSection";
import Footer from "./components/footer";
import HowItWorks from "./pages/HowItWorks";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import DashboardNavbar from "./components/DashboardNavbar";
import FacultyDashboard from "./pages/FacultyDashboard";
import CCPage from "./components/CCPage";
import HOD_Dashboard from "./pages/HOD_Dashboard";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AppLayout>
          <Navbar />
          <HeroSection />
          <HowItWorks />
          <Footer />
        </AppLayout>
      ),
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/SubjectFacultyDashboard",
      element: (
        <>
          <ProtectedRoute>
            <AppLayout>
              <DashboardNavbar />
              <Outlet />
            </AppLayout>
          </ProtectedRoute>
        </>
      ),
      children: [
        {
          index: true, // ✅ default child route
          element: <FacultyDashboard />,
        },
        {
          path: "ccpage", // ✅ relative path (not /ccpage)
          element: <CCPage />,
        },
      ],
    },
    {
      path: "/HOD_Dashboard",
      element: (
        <>
          <ProtectedRoute>
            <AppLayout>
              <DashboardNavbar />
              <HOD_Dashboard />
            </AppLayout>
          </ProtectedRoute>
        </>
      ),
    },
  ]);

  return (
    <>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          // Smooth animation settings
          style: {
            transition: "all 0.4s ease-in-out",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
