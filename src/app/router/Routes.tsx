import React from 'react';
import { useLocation } from "react-router-dom";
import { Routes as Router, Navigate, Outlet, Route } from "react-router-dom";
import EditProfile from "../../features/home/EditProfile";
import Register from "../../features/auth/Register";
import Login from "../../features/auth/Login";
import Navbar from "../components/Navbar";
import HomePage from "../../features/home/HomePage";
import MyProgressPage from '../../features/my-progress/MyProgressPage';
import InteractiveMeshPage from '../../features/interactive-mesh/InteractiveMeshPage';
import NotFound from '../../features/error/NotFound';

type Props = {};

const PrivateRoutes = () => {
  const authenticated = localStorage.getItem("token");
  if (!authenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const Routes = (props: Props) => {
  const location = useLocation();
  const views = ["/", "/edit-profile", "/interactive-mesh", "/my-progress"];
  return (
    <Router>
      <Route
        path="/"
        element={
          <>
            {views.includes(location.pathname) && <Navbar />}
            <Outlet />
          </>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/interactive-mesh" element={<InteractiveMeshPage />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/my-progress" element={<MyProgressPage />} />
        </Route>
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={ <><Navbar /><NotFound /></> } />
    </Router>
  );
};

export default Routes;
