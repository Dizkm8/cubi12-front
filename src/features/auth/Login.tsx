import React, { FormEvent } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Agent from "../../app/api/agent";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import useMediaQuery from "@mui/material/useMediaQuery";
import GenerateTabTitle from "../../app/utils/TitleGenerator";
import { LoadingButton } from '@mui/lab';
import Colors from "../../app/static/colors";

const defaultTheme = createTheme();

const pwdRegex: RegExp = /^.+$/;
const emailRegex: RegExp =
/^[a-zA-Z]+(?:\.[a-zA-Z]+)?\d*?@(?:([a-zA-Z]+\.)+)?\ucn\.cl$/;


const LogIn = () => {
  document.title = GenerateTabTitle("Iniciar Sesión");
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pwd, setPwd] = useState<string>("");
  const [email, setemail] = useState<string>("");

  const [emailError, setEmailError] = useState<boolean>(false);
  const [pwdError, setPwdError] = useState<boolean>(false);

  const emailErrorMsg: string = "Ingrese un correo electrónico válido";
  const pwdErrorMsg: string = "El campo está vacío";

  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const isMobile = useMediaQuery(defaultTheme.breakpoints.down("sm"));

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const Email: string = data.get("email")?.toString() ?? "";
    const Password: string = data.get("password")?.toString() ?? "";
    sendData(Email, Password);
  };

  useEffect(() => {
    if (emailError || pwdError || !email || !pwd) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [emailError, pwdError, email, pwd]);

  const handleFieldChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "email") {
      setemail(value);
      const isValid = emailRegex.test(value);
      setEmailError(!isValid);
    } else if (name === "password") {
      setPwd(value);
      const isValid = pwdRegex.test(value);
      setPwdError(!isValid);
    }
  };
  const sendData = (email: string, password: string) => {
    setLoading(true);
    Agent.Auth.login({ email, password })
      .then((data) => {
        Agent.token = data;
        localStorage.setItem("token", data);
        setAuthenticated(true);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setChecked(true);
      })
      .finally(()=>{
        setLoading(false);
      });

  };

  return (
    <Grid data-testing="LogIn" className="s">
      <Paper
        style={{
          backgroundImage: "url(/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <ThemeProvider theme={defaultTheme}>
          <Container
            component="main"
            maxWidth="md"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                mt: 3,
                border: Colors.black,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
                height: "100%",
                width: isMobile ? "100%" : 450,
                mb: 3,
                backgroundColor: Colors.secondaryWhite,
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                className="font-title"
                sx={{ marginBottom: 1, mt: 3, fontSize: 30 }}
              >
                INICIAR SESIÓN
              </Typography>
              <Grid container spacing={1.1} justifyContent="flex-end">
                <Grid item xs={12}>
                  {checked && (
                    <Fade in={checked}>
                      <Alert
                        severity="error"
                        sx={{
                          width: "89%",
                          ml: 3,
                          mr: 3,
                          textAlign: "center",
                        }}
                      >
                        Credenciales incorrectas
                      </Alert>
                    </Fade>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    id="email"
                    label="Correo electrónico"
                    name="email"
                    variant="filled"
                    value={email}
                    onChange={handleFieldChange}
                    error={emailError}
                    helperText={emailError ? emailErrorMsg : ""}
                    autoComplete="email"
                    size="small"
                    InputLabelProps={{
                      sx: {
                        fontSize: "14px",
                        fontFamily: "Raleway",
                      },
                    }}
                    sx={{
                      width: "89%",
                      ml: 3,
                      mr: 3,
                      boxShadow: !emailError
                        ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                        : "none",
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    onChange={handleFieldChange}
                    error={pwdError}
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    helperText={pwdError ? pwdErrorMsg : ""}
                    autoComplete="password"
                    size="small"
                    variant="filled"
                    InputLabelProps={{
                      sx: {
                        fontSize: "14px",
                        fontFamily: "Raleway",
                      },
                    }}
                    sx={{
                      width: "89%",
                      ml: 3,
                      mr: 3,
                      mb: 1,
                      boxShadow: !pwdError
                        ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                        : "none",
                    }}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    textAlign="right"
                  >
                    ¿Eres nuev@?{" "}
                    <Link
                      marginRight={5}
                      href="/register"
                      color="primary"
                      underline="hover"
                      fontWeight="600"
                      style={{ color: Colors.primaryOrange }}
                    >
                      Registrate
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton
                    loading={loading}
                    type="submit"
                    style={{
                      backgroundColor: Colors.primaryBlue,
                      width: "89%",
                      height: 50,
                    }}
                    variant="contained"
                    sx={{
                      mt: 1,
                      ml: 3,
                      mr: 3,
                      fontFamily: "Raleway, sans-serif",
                      fontSize: "20px",
                      fontWeight: 300,
                      textTransform: "none",
                    }}
                    disabled={disabled}
                  >
                    Ingresar
                  </LoadingButton>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    href="/"
                    type="submit"
                    style={{
                      backgroundColor: Colors.secondaryWhite,
                      width: "89%",
                      height: 50,
                      border: "1px solid " + Colors.primaryBlue,
                      color: Colors.primaryBlue,
                    }}
                    variant="contained"
                    sx={{
                      ml: 3,
                      mr: 3,
                      mb: 3,
                      fontFamily: "Raleway, sans-serif",
                      fontSize: "20px",
                      fontWeight: 300,
                      textTransform: "none",
                    }}
                  >
                    Invitado
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </ThemeProvider>
      </Paper>
    </Grid>
  );
}

export default LogIn;
