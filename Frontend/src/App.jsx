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
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardNavbar from "./components/DashboardNavbar";
import FacultyDashbaord from "./pages/FacultyDashbaord";
import CCPage from "./components/CCPage";
import HOD_Dashboard from "./pages/HOD_Dashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <AppLayout>
            <Navbar />
            <HeroSection />
            <HowItWorks />
            <Footer />
          </AppLayout>
        </>
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
      path: "/dashboard",
      element: <> 
      <AppLayout>
        <DashboardNavbar />
        <CCPage/>
        {/* <HOD_Dashboard/> */}
      </AppLayout>
      </>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
