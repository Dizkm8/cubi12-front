import { Container } from "@mui/material";
import Navbar from "../components/Navbar";
import AppRoutes from '../routes/AppRoutes';

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ paddingTop: "3rem" }}>
        <AppRoutes />
      </Container>
    </>
  );
}

export default App;
