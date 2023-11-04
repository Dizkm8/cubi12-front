import { Container } from "@mui/material";
import HomePage from "../../features/home/HomePage";
import Navbar from "../components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ paddingTop: "3rem" }}>
        <HomePage />
      </Container>
    </>
  );
}

export default App;
