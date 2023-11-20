import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Register.css";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Agent from "../../app/api/agent";
import { useState, useEffect, useContext, FormEvent } from "react";
import FormHelperText from "@mui/material/FormHelperText";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { startCase } from "lodash";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import { LoadingButton } from "@mui/lab";

const rutRegex = /^(\d{1,3}(\.\d{3})*-\d|(\d{1,3}(\.\d{3})*-[Kk]))$/;
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,16}$/;
const emailRegex =
  /^([A-Z]+|[a-z]+)+[.]([A-Z]+|[a-z]+)+[0-9]*(@(.+[.])*ucn[.]cl){1}$/;
const nameRegex = /^[a-zA-Z]{3,50}$/;
const flNameRegex = /^[a-zA-Z]{3,30}$/;

const defaultTheme = createTheme();

export default function SignUp() {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
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
      .finally(() =>{
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

  const [name, setName] = useState<string>("");
  const [validName, setValidName] = useState<boolean>(false);
  const [nameFocus, setNameFocus] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [validFirstName, setValidFirstName] = useState<boolean>(false);
  const [firstNameFocus, setFirstNameFocus] = useState<boolean>(false);

  const [lastName, setLastName] = useState<string>("");
  const [validLastName, setValidLastName] = useState<boolean>(false);
  const [lastNameFocus, setLastNameFocus] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);

  const [rut, setRut] = useState<string>("");
  const [validRut, setValidRut] = useState<boolean>(false);
  const [rutFocus, setRutFocus] = useState<boolean>(false);

  const [pwd, setPwd] = useState<string>("");
  const [validPwd, setValidPwd] = useState<boolean>(false);
  const [pwdFocus, setPwdFocus] = useState<boolean>(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState<boolean>(false);
  const [matchFocus, setMatchFocus] = useState<boolean>(false);

  const [career, setCareer] = useState<string>("");
  const [careers, setCareers] = useState([]);

  const [checked, setChecked] = React.useState<boolean>(false);
  const [errorType, setErrorType] = useState<
    null | "rut" | "email" | "general"
  >(null);

  const [loading, setLoading] = useState<boolean>(false);

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
          <CssBaseline />

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              border: "#000000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
              height: "80%", //height: 575
              width: "53%",
              mb: 3,
              backgroundColor: "#F5F5F5",
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
                    !validName && nameFocus
                      ? "Debe contener entre 3 y 50 caracteres, solo letras."
                      : ""
                  }
                  aria-describedby="namenote"
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={validName ? "false" : "true"}
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                  value={name}
                  error={!validName && nameFocus}
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
                    boxShadow:
                      (!validName && !nameFocus) || validName
                        ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                        : "none",
                  }}
                />
              </Grid>
              <Grid item xs={12} spacing={1.1} container>
                <Grid item xs={6} md={6}>
                  <TextField
                    helperText={
                      !validFirstName && firstNameFocus
                        ? "Debe contener entre 3 y 30 caracteres, solo letras."
                        : null
                    }
                    aria-describedby="flNote"
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-invalid={validFirstName ? "false" : "true"}
                    onFocus={() => setFirstNameFocus(true)}
                    onBlur={() => setFirstNameFocus(false)}
                    value={firstName}
                    error={!validFirstName && firstNameFocus}
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
                      boxShadow:
                        (!validFirstName && !firstNameFocus) || validFirstName
                          ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                          : "none",
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={6} container>
                  <TextField
                    helperText={
                      !validLastName && lastNameFocus
                        ? "Debe contener entre 3 y 30 caracteres, solo letras."
                        : null
                    }
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    aria-invalid={validLastName ? "false" : "true"}
                    onFocus={() => setLastNameFocus(true)}
                    onBlur={() => setLastNameFocus(false)}
                    value={lastName}
                    error={!validLastName && lastNameFocus}
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
                      },
                    }}
                    sx={{
                      width: "89.5%",
                      mr: 3,
                      // boxShadow: ((!validLastName && !lastNameFocus)|| validLastName )? '0px 2px 2px rgba(0, 0, 0, 0.2)' : 'none',
                      boxShadow:
                        (!validLastName && lastNameFocus) || firstNameFocus
                          ? "none"
                          : "0px 2px 2px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} container>
                <TextField
                  required
                  onChange={(e) => setRut(e.target.value)}
                  aria-invalid={validRut ? "false" : "true"}
                  onFocus={() => setRutFocus(true)}
                  onBlur={() => setRutFocus(false)}
                  value={rut}
                  error={!validRut && rutFocus}
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
                    boxShadow: !validRut
                      ? "0px 2px 2px rgba(0, 0, 0, 0.2)"
                      : "none",
                  }}
                />
                {rutFocus && (
                  <FormHelperText
                    id="rutnote"
                    className={!validRut ? "instructions" : "offscreen"}
                    sx={{
                      ml: 3,
                      mr: 3,
                    }}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ marginRight: "5px" }}
                      />
                      RUT con puntos y guión (Ej: 12.345.678-9)
                    </div>
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} container>
                <TextField
                  error={!validEmail && emailFocus}
                  aria-invalid={validEmail ? "false" : "true"}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
                  }}
                />
                {emailFocus && (
                  <FormHelperText
                    id="emailNote"
                    className={!validEmail ? "instructions" : "offscreen"}
                    sx={{
                      ml: 3,
                      mr: 3,
                    }}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ marginRight: "5px" }}
                      />
                      El correo debe ser del dominio ucn.
                    </div>
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} container>
                <TextField
                  required
                  onChange={(e) => setCareer(e.target.value)}
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
                  required
                  fullWidth
                  aria-invalid={validPwd ? "false" : "true"}
                  onChange={(e) => setPwd(e.target.value)}
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  value={pwd}
                  error={!validPwd && pwdFocus}
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
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
                  }}
                />
                {pwdFocus && (
                  <FormHelperText
                    id="pwdnote"
                    className={!validPwd ? "instructions" : "offscreen"}
                    sx={{
                      ml: 3,
                      mr: 3,
                    }}
                  >
                    <div>
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ marginRight: "5px" }}
                      />
                      Debe contener al menos 10 caracteres, una mayúscula y un
                      número.
                    </div>
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} container>
                <TextField
                  required
                  onChange={(e) => setMatchPwd(e.target.value)}
                  aria-invalid={validMatch ? "false" : "true"}
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  value={matchPwd}
                  error={!validMatch && matchFocus}
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
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
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
                    style={{ color: "#edb84c" }}
                  >
                    Inicia Sesión
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <LoadingButton
              loading={loading}
              type="submit"
              style={{ backgroundColor: "#1C478F", width: "89.5%", height: 50 }}
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
      </ThemeProvider>
    </Paper>
  );
}
