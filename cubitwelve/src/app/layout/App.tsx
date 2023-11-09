import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Routes from "../routes/Routes";



function App(){
  return (
    <>
      <CssBaseline/>
      <BrowserRouter>
        <AuthProvider>
          <Routes/>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
