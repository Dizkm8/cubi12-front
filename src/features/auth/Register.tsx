import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Agent from "../../app/api/agent";
import { useState, useEffect, useContext, FormEvent } from "react";
import { AuthContext } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { startCase } from "lodash";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import { LoadingButton } from "@mui/lab";
import Colors from "../../app/static/colors";
import { useMediaQuery } from "@mui/material";

const rutRegex = /^(\d{1,3}(\.\d{3})*-\d|(\d{1,3}(\.\d{3})*-[Kk]))$/;
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,16}$/;
const emailRegex =
  /^[a-zA-Z]+(?:\.[a-zA-Z]+)?\d*?@(?:([a-zA-Z]+\.)+)?\ucn\.cl$/;
const nameRegex = /^[a-zA-Z]{3,50}$/;
const flNameRegex = /^[a-zA-Z]{3,30}$/;

const nameErrorMsg = "Debe contener entre 3 y 50 caracteres, solo letras.";
const flNameErrorMsg = "Debe contener entre 3 y 30 caracteres, solo letras.";
const rutErrorMsg = "RUT con puntos y guión (Ej: 12.345.678-9)";
const emailErrorMsg = "El correo debe ser del dominio ucn.";
const pwdErrorMsg =
  "Debe contener al menos 10 caracteres, una mayúscula y un número.";
const matchPwdErrorMsg = "La contraseña no coincide.";

const formStyle = {
  mt: 3,
  border: Colors.black,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
  height: "80%",
  width: "50%",
  mb: 3,
  backgroundColor: Colors.secondaryWhite,
};

const defaultTheme = createTheme();

export default function SignUp() {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [validName, setValidName] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [validFirstName, setValidFirstName] = useState<boolean>(false);

  const [lastName, setLastName] = useState<string>("");
  const [validLastName, setValidLastName] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [rut, setRut] = useState<string>("");
  const [validRut, setValidRut] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>("");
  const [validPwd, setValidPwd] = useState<boolean>(false);

  const [matchPwd, setMatchPwd] = useState<string>("");
  const [validMatch, setValidMatch] = useState<boolean>(false);

  const [career, setCareer] = useState<string>("");
  const [careers, setCareers] = useState([]);

  const [checked, setChecked] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<
    null | "rut" | "email" | "general"
  >(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name: string = data.get("name")?.toString() ?? "";
    const FirstLastName: string = data.get("firstName")?.toString() ?? "";
    const SecondLastName: string = data.get("lastName")?.toString() ?? "";
    const RUT: string = data.get("rut")?.toString() ?? "";
    const CareerId: number = parseInt(data.get("career")?.toString() ?? "");
    const email: string = data.get("email")?.toString() ?? "";
    const Password: string = data.get("password")?.toString() ?? "";
    const RepeatedPassword: string =
      data.get("repeatPassword")?.toString() ?? "";

    sendData(
      name,
      FirstLastName,
      SecondLastName,
      RUT,
      CareerId,
      email,
      Password,
      RepeatedPassword
    );
  };

  const sendData = (
    name: string,
    firstLastName: string,
    secondLastName: string,
    rut: string,
    careerId: number,
    email: string,
    password: string,
    repeatedPassword: string
  ) => {
    setLoading(true);
    Agent.Auth.register({
      name,
      firstLastName,
      secondLastName,
      rut,
      email,
      careerId,
      password,
      repeatedPassword,
    })
      .then((res) => {
        Agent.token = res;
        localStorage.setItem("token", res);
        setAuthenticated(true);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        if (!err?.response) {
          setChecked(true);
          setErrorType("general");
        } else if (err.response?.status === 400) {
          const errorData = err.response.data;
          if (errorData?.detail === "RUT already in use") {
            setChecked(true);
            setErrorType("rut");
          } else if (errorData?.detail === "Email already in use") {
            setChecked(true);
            setErrorType("email");
          } else {
            setChecked(true);
            setErrorType("general");
          }
        } else {
          setChecked(true);
          setErrorType("general");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    try {
      Agent.requests
        .get("Careers")
        .then((response) => {
          setCareers(response.map((career: any) => career));
        })
        .catch((error) => {
          console.error("Error loading careers:", error);
        });
    } catch (error) {
      console.error("Error loading careers:", error);
    }
  }, []);

  useEffect(() => {
    setValidPwd(pwdRegex.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setValidRut(rutRegex.test(rut));
  }, [rut]);

  useEffect(() => {
    setValidName(nameRegex.test(name));
  }, [name]);

  useEffect(() => {
    setValidFirstName(flNameRegex.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(flNameRegex.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidEmail(emailRegex.test(email));
  }, [email]);

  return (
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
      <Container
        component="main"
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: 0,
        }}
      >
        <CssBaseline />

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            ...formStyle,
            width: isSmallScreen ? "100%" : "50%",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            className="font-title"
            sx={{
              marginBottom: 1,
              mt: 3,
              fontSize: "2rem",
              [defaultTheme.breakpoints.down("md")]: {
                fontSize: "1.5rem",
              },
              [defaultTheme.breakpoints.down("sm")]: {
                fontSize: "1rem",
              },
            }}
          >
            REGÍSTRATE
          </Typography>

          <Grid container spacing={1.1} justifyContent="flex-end">
            <Grid item xs={12} container>
              {checked && (
                <Fade in={checked}>
                  <Alert
                    severity="error"
                    sx={{
                      width: "89.5%",
                      ml: 3,
                      mr: 3,
                      mb: 1,
                      textAlign: "center",
                    }}
                  >
                    {errorType === "rut" && "El RUT ya está registrado"}
                    {errorType === "email" &&
                      "El correo electrónico ya está registrado"}
                    {errorType === "general" &&
                      "Ocurrio un error, intente nuevamente"}
                  </Alert>
                </Fade>
              )}
              <TextField
                helperText={
                  !validName && name.trim() !== "" ? nameErrorMsg : ""
                }
                aria-describedby="namenote"
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setName(e.target.value)}
                aria-invalid={validName && name.trim() !== ""}
                value={name}
                error={!validName && name.trim() !== ""}
                variant="filled"
                id="name"
                label="Nombre"
                name="name"
                required
                autoComplete="off"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow: validName
                    ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                    : "none",
                }}
              />
            </Grid>
            <Grid item xs={12} md={12} spacing={1.1} container>
              <Grid item xs={6} md={6} container>
                <TextField
                  helperText={
                    !validFirstName && firstName.trim() !== ""
                      ? flNameErrorMsg
                      : ""
                  }
                  aria-describedby="flNote"
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setFirstName(e.target.value)}
                  aria-invalid={validFirstName && firstName.trim() !== ""}
                  value={firstName}
                  error={!validFirstName && firstName.trim() !== ""}
                  autoComplete="off"
                  name="firstName"
                  required
                  variant="filled"
                  id="firstName"
                  label="Primer Apellido"
                  size="small"
                  InputLabelProps={{
                    sx: {
                      fontSize: "14px",
                      fontFamily: "Raleway",
                      width: "100%",
                    },
                  }}
                  sx={{
                    ml: 3,
                    boxShadow: validFirstName
                      ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                      : "none",
                  }}
                />
              </Grid>
              <Grid item xs={6} md={6} container>
                <TextField
                  helperText={
                    !validLastName && lastName.trim() !== ""
                      ? flNameErrorMsg
                      : ""
                  }
                  required
                  onChange={(e: {
                    target: { value: React.SetStateAction<string> };
                  }) => setLastName(e.target.value)}
                  aria-invalid={validLastName && lastName.trim() !== ""}
                  value={lastName}
                  error={!validLastName && lastName.trim() !== ""}
                  aria-describedby="flNote"
                  id="lastName"
                  variant="filled"
                  label="Segundo Apellido"
                  name="lastName"
                  autoComplete="off"
                  size="small"
                  InputLabelProps={{
                    sx: {
                      fontSize: "14px",
                      fontFamily: "Raleway",
                      width: "100%",
                    },
                  }}
                  sx={{
                    mr: 3,
                    boxShadow: validLastName
                      ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                      : "none",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <TextField
                helperText={!validRut && rut.trim() !== "" ? rutErrorMsg : ""}
                required
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setRut(e.target.value)}
                aria-invalid={validRut && rut.trim() !== ""}
                value={rut}
                error={!validRut && rut.trim() !== ""}
                aria-describedby="rutnote"
                variant="filled"
                id="rut"
                label="RUT"
                name="rut"
                autoComplete="rut"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow: validRut
                    ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                    : "none",
                }}
              />
            </Grid>
            <Grid item xs={12} container>
              <TextField
                helperText={
                  !validEmail && email.trim() !== "" ? emailErrorMsg : ""
                }
                error={!validEmail && email.trim() !== ""}
                aria-invalid={validEmail && email.trim() !== ""}
                value={email}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setEmail(e.target.value)}
                required
                id="email"
                label="Correo electrónico"
                name="email"
                variant="filled"
                autoComplete="off"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow: validEmail
                    ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                    : "none",
                }}
              />
            </Grid>
            <Grid item xs={12} container>
              <TextField
                required
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setCareer(e.target.value)}
                value={career}
                id="career"
                select
                label="Carrera"
                name="career"
                size="small"
                variant="filled"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                {careers.map((career, index) => (
                  <MenuItem key={index} value={career["id"]}>
                    {startCase(career["name"])}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} container>
              <TextField
                helperText={!validPwd && pwd.trim() !== "" ? pwdErrorMsg : ""}
                required
                fullWidth
                aria-invalid={validPwd && pwd.trim() !== ""}
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setPwd(e.target.value)}
                value={pwd}
                error={!validPwd && pwd.trim() !== ""}
                aria-describedby="pwdnote"
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="new-password"
                size="small"
                variant="filled"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mr: 3,
                  boxShadow: validPwd
                    ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                    : "none",
                }}
              />
            </Grid>
            <Grid item xs={12} container>
              <TextField
                helperText={
                  !validMatch && matchPwd.trim() !== "" ? matchPwdErrorMsg : ""
                }
                required
                onChange={(e: {
                  target: { value: React.SetStateAction<string> };
                }) => setMatchPwd(e.target.value)}
                aria-invalid={validMatch && matchPwd.trim() !== ""}
                value={matchPwd}
                error={!validMatch && matchPwd.trim() !== ""}
                type="password"
                id="repeatPassword"
                label="Repetir contraseña"
                name="repeatPassword"
                autoComplete="RepeatPassword"
                size="small"
                variant="filled"
                InputLabelProps={{
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Raleway",
                  },
                }}
                sx={{
                  width: "89.5%",
                  ml: 3,
                  mb: 1,
                  mr: 3,
                  boxShadow: validMatch
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
                sx={{
                  [defaultTheme.breakpoints.down("md")]: {
                    fontSize: "0.8rem",
                  },
                  [defaultTheme.breakpoints.down("sm")]: {
                    fontSize: "0.7rem",
                    ml: 3,
                    mr: 3,
                  },
                }}
              >
                ¿Ya tienes cuenta?{" "}
                <Link
                  marginRight={3}
                  href="/login"
                  color="primary"
                  underline="hover"
                  fontWeight="600"
                  style={{ color: Colors.primaryOrange }}
                >
                  Inicia Sesión
                </Link>
              </Typography>
            </Grid>
          </Grid>
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
              mt: 2,
              mb: 2,
              fontFamily: "Raleway, sans-serif",
              fontSize: "20px",
              fontWeight: 300,
              textTransform: "none",
            }}
            disabled={
              !validPwd ||
              !validMatch ||
              !validRut ||
              !validName ||
              !validFirstName ||
              !validLastName ||
              !validEmail
                ? true
                : false
            }
          >
            Registrarme
          </LoadingButton>
        </Box>
      </Container>
    </Paper>
  );
}
