import { Grid, Typography } from "@mui/material";
// @ts-ignore
import Cubi12Logo from "../../app/static/images/cubi12.svg";

const HomePage = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ height: '100%', marginTop: '4rem' }}
    >
      <Typography variant="h3" component="h1" style ={{ marginBottom: '2rem' }} noWrap>
        ¡Bienvenido a Cubi12!
      </Typography>
      <img alt="Cubi12Logo" src={Cubi12Logo} height="300" />
      <Typography 
        variant="h3" 
        component="h2" 
        sx={{ fontWeight: 600 }} 
        style ={{ marginTop: '2rem', marginBottom: '4rem' }} 
      >
        Estudia - Compara - Aprende
      </Typography>
      <Typography variant="h6" component="h3" marginTop="1rem">
        Aquí encontrarás una malla currícular como ninguna otra, tu propio
        progreso currícular y los recursos de pruebas que tanto necesitabas.
      </Typography>
    </Grid>
  );
};

export default HomePage;