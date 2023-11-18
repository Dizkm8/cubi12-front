import { CssBaseline, } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Routes from "../router/Routes";
import { CodeProvider } from "../context/SubjectCodeContext";

function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <CodeProvider>
            <Routes />
          </CodeProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
