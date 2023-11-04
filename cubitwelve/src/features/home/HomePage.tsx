import { CardMedia, Grid, Typography } from "@mui/material";
// @ts-ignore
import Cubi12Logo from "../../app/static/images/cubi12.svg";

const HomePage = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap="2rem"
    >
      <Typography variant="h3" component="h1" noWrap>
        ¡Bienvenido a Cubi12!
      </Typography>
      <img alt="Cubi12Logo" src={Cubi12Logo} height="300" />
      <Typography variant="h3" component="h2" sx={{ fontWeight: 600 }}>
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
