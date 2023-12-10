import React, { useContext } from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Routes from "../router/Routes";
import { SubjectCodeProvider } from "../context/SubjectCodeContext";
import {jwtDecode} from 'jwt-decode';
import { AuthContext } from "../../app/context/AuthContext";

function App() {
  const token = localStorage.getItem('token');
  const { setAuthenticated } = useContext(AuthContext);

  if (token) {
    const decodedToken: any = jwtDecode(token);
    const currentDate = new Date();
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      localStorage.removeItem('token');
      setAuthenticated(false);
      console.log('Token expirado');
  }
}

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
