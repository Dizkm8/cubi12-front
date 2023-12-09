import React from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Routes from "../router/Routes";
import { SubjectCodeProvider } from "../context/SubjectCodeContext";

function App() {
  // Obtener el token y revisar si expiró

  // Si ya expiró, lo borras y seteas el contexto en no logggeado

  // Si no ha expirado, no haces nada
  // LLamar a funcion

  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <SubjectCodeProvider>
            <Routes />
          </SubjectCodeProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
