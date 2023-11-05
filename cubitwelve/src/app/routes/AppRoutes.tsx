import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import HomePage from "../../features/home/HomePage";
import EditProfile from '../../features/auth/edit-profile'; // Asegúrate de importar correctamente el componente

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
