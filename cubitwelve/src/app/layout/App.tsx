import { Container } from "@mui/material";
import HomePage from "../../features/home/HomePage";
import Navbar from "../components/Navbar";
import EditProfile from '../../features/profile/edit-profile'; 

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ paddingTop: "3rem" }}>
        <HomePage />
      </Container>
      <EditProfile />
    </>
  );
}

export default App;
