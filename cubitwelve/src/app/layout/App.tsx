import { CssBaseline, } from "@mui/material";
import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

const app = () => {
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

export default app;
