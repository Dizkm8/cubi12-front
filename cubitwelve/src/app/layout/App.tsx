import { CssBaseline, } from "@mui/material";
import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ paddingTop: "3rem" }}>
        <CssBaseline />
        <Outlet />
      </Container>
    </>
  );
}

export default App;
