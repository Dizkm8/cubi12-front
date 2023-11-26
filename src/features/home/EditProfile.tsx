import React from "react";
import { Paper, Typography, Grid, TextField, Button, MenuItem, Box, FormHelperText, Dialog, DialogTitle, 
    DialogContent, DialogActions, useMediaQuery, useTheme } from "@mui/material";
import { SyntheticEvent, useRef, useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Agent from "../../app/api/agent";
import { startCase } from "lodash";
import { AuthContext } from "../../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Colors from "../../app/static/colors";
import GenerateTabTitle from "../../app/utils/TitleGenerator";

// Regex for password and names
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,16}$/;
const namesRegex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]{3,50}$/;

// Messages
const invalidPwd = "Contraseña inválida";
const invalidNames = "Debe contener mínimo 3 letras, sin caracteres especiales o números";
const updateSuccess = "Actualización exitosa";

const EditProfile = () => {
    document.title = GenerateTabTitle("Editar Perfil");
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // Get authenticated state from context
    const { setAuthenticated } = useContext(AuthContext);

    // Navigate hook
    const navigate = useNavigate();

    // Error message reference
    const errorRef = useRef<HTMLInputElement>(null);

    // Names state
    const [name, setName] = useState("");
    const [firstLastName, setFirstLastName] = useState("");
    const [secondLastName, setSecondLastName] = useState("");

    // User data state
    const [rut, setRut] = useState("");
    const [email, setEmail] = useState("");
    const [career, setCareer] = useState("");

    // Password state
    const [currentPwd, setCurrentPwd] = useState("");
    const [pwd, setPwd] = useState("");
    const [matchPwd, setMatchPwd] = useState("");

    // Valid names state
    const [validName, setValidName] = useState(false);
    const [validFirstLastName, setValidFirstLastName] = useState(false);
    const [validSecondLastName, setValidSecondLastName] = useState(false);

    // Valid password state
    const [validCurrentPwd, setCurrentValidPwd] = useState(true);
    const[validPwd, setValidPwd] = useState(false);
    const [validMatchPwd, setValidMatchPwd] = useState(false);

    // Success message state
    const [success, setSuccess] = useState(false);
    const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

    // Different names state
    const [differentNames, setDifferentNames] = useState(false);

    // Tab state
    const [tab, setTab] = useState("info");

    // User state
    const [user, setUser] = useState({name: "", firstLastName: "", secondLastName: "", rut: "", email: "", career: { id: "", name: "" }});

    
    
    // Load user data
    useEffect(() => {
        Agent.Auth.profile()
            .then(response => {
                setUser(response);
                setName(response.name);
                setFirstLastName(response.firstLastName);
                setSecondLastName(response.secondLastName);
                setRut(response.rut);
                setEmail(response.email);
                setCareer(startCase(response.career.name));
            })
            .catch(error => { console.error("Error loading user:", error); });
    }, []);

    // Check if names are valid
    useEffect(() => {
        if (name === user.name && firstLastName === user.firstLastName && secondLastName === user.secondLastName) {
            setDifferentNames(false);
        } else{
            setDifferentNames(true);
            setSuccess(false);
        }

        if (namesRegex.test(name)) {
            setValidName(true);
        } else {
            setValidName(false);
        }

        if (namesRegex.test(firstLastName)) {
            setValidFirstLastName(true);
        } else {
            setValidFirstLastName(false);
        }

        if (namesRegex.test(secondLastName)) {
            setValidSecondLastName(true);
        } else {
            setValidSecondLastName(false);
        }

    }, [name, firstLastName, secondLastName, user.name, user.firstLastName, user.secondLastName]);

    // Check if password is valid
    useEffect(() => {
        if (pwdRegex.test(pwd)) {
            setValidPwd(true);
        } else {
            setValidPwd(false);
        }

        if(pwd === matchPwd) {
            setValidMatchPwd(true);
        } else {
            setValidMatchPwd(false);
        }
    }, [pwd, matchPwd]);

    // Update URL
    useEffect(() => {
        const getUrl = new URL(window.location.href);
        getUrl.searchParams.set('tab', tab);
        window.history.pushState({}, '', getUrl.href);
        setSuccess(false);
    }, [tab]);
    
    // Clear inputs
    const clearInputs = (names: boolean, password: boolean, cancel: boolean) => {
        // Clear name inputs
        if (names) {
            if(!cancel) {
                user.name = name;
                user.firstLastName = firstLastName;
                user.secondLastName = secondLastName;
            }
            setName(user.name);
            setFirstLastName(user.firstLastName);
            setSecondLastName(user.secondLastName);
        }
        // Clear password inputs
        else if (password) {
            setCurrentPwd("");
            setPwd("");
            setMatchPwd("");
        }
    }

    // Send my info data to server
    const sendMyInfoData = (name: string, firstLastName: string, secondLastName: string) => {
        Agent.Auth.updateProfile({
            name, firstLastName, secondLastName
        })
            .then(response => {
                console.log("Name(s) updated successfully!");
                user.name = name;
                user.firstLastName = firstLastName;
                user.secondLastName = secondLastName;
                setSuccess(true);
                setDifferentNames(false);

            })
            .catch(error => {
                console.error("Error updating profile:", error);
                return;
            });
    }

    // Send password data to server
    const sendPasswordData = (password: string, currentPassword: string, repeatedPassword: string) => {
        Agent.Auth.updatePassword({password, currentPassword, repeatedPassword})
            .then(response => { 
                console.log("Password updated successfully!");
                setChangePasswordSuccess(true);
            })
            .catch(error => {
                console.error("Error updating password:", error);
                setCurrentValidPwd(false);
            });
    }

    const handleCloseDialog = () => {
        setChangePasswordSuccess(false);
        Agent.token = "";
        localStorage.setItem("token", "");
        setAuthenticated(false);
        navigate("/");
    };

    // Handle my info submit
    const handleSubmitMyInfo = async (e: SyntheticEvent) => {
        // Prevent default submit action
        e.preventDefault();

        // Check if inputs are empty
        if ((!name && !firstLastName && !secondLastName)) {
            return;
        } else if (name === user.name && firstLastName === user.firstLastName && secondLastName === user.secondLastName) {
            return;
        }

        // Check if inputs are valids
        if (!namesRegex.test(name) || !namesRegex.test(firstLastName) || !namesRegex.test(secondLastName)) {
            return;
        }

        try {
            // Send data to server
            sendMyInfoData(name, firstLastName, secondLastName);

        } catch (error: any) {
            if (error?.response) {
                if (error.response.status === 409) {
                    console.log("Username Taken");
                } else {
                    console.log("Registration Failed");
                }
            } else {
                console.log("No Server Response");
            }
            
            if (errorRef.current) {
                errorRef.current.focus();
            }
        }
    };

    // Handle password submit
    const handleSubmitPassword = async (e: SyntheticEvent) => {
        // Prevent default submit action
        e.preventDefault();

        // Check if inputs are empty
        if (!pwd) {
            clearInputs(false, true, false);
            return;
        } 
        // Check if passwords match or its valid
        else if (!pwdRegex.test(pwd) || !pwdRegex.test(currentPwd) ||pwd !== matchPwd || !currentPwd) {
            clearInputs(false, true, false);
            return;
        }
    
        try {
            // Send data to server
            sendPasswordData(pwd, currentPwd, matchPwd);

            // Clean password inputs
            clearInputs(false, true, false);

        } catch (error: any) {
            if (error?.response) {
                if (error.response.status === 409 || error.response.status === 400) {
                    console.log("Username Taken");
                }
                else {
                    console.log(error.response);
                    console.log("Registration Failed");
                }
            } else {
                console.log("No Server Response");
            }
            if (errorRef.current) {
                errorRef.current.focus();
            }
        }
    };

    return (
        <Grid container
        direction="column"
        justifyContent="center"
        alignItems="center">
            <Box
                sx={{
                    marginTop: "2%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Paper elevation={3} style={{ 
                    padding: tab === "info" ? "1%" : "1.6%", 
                    border: `1px solid ${Colors.primaryBlue}`, 
                    borderRadius: "8px", 
                    width: tab === "password" && !isSmallScreen ? "64.5%" : tab === "info" && !isSmallScreen ? "40%" : "" &&
                    tab && isSmallScreen ? "60%" : "", 
                    height: "fit-content" 
                }}>
                    {/* Title */}
                    <Grid container style={{ padding: isSmallScreen ? "row" : "column",}}>
                        {/* My info title */}
                        <Grid item style={{ marginLeft: "5%", marginRight: "10%" }}>
                            <Typography
                                fontSize={"180%"}
                                color={tab === "info" ? "black" : "#626262"}
                                variant="h5"
                                style={{ cursor: "pointer" }}
                                onClick={() => setTab("info") }
                            >Mis Datos
                            </Typography>
                        </Grid>
                        {/* Password title */}
                        <Grid item style={{ marginRight: "5%" }}>
                            <Typography
                                fontSize={"180%"}
                                color={tab === "password" ? "black" : "#626262"}
                                variant="h5"
                                style={{ cursor: "pointer", marginLeft: isSmallScreen ? "10%" : "" }}
                                onClick={() => setTab("password") }
                            >Contraseña
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* My info page */}
                    {tab === "info" && (
                        <Box component="form" noValidate onSubmit={handleSubmitMyInfo}>
                            <Grid container spacing={2} sx={{ padding: "2vh", width: "100%", height: "100%" }}>
                                {/* Name input */}
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        Nombre
                                    </Typography>
                                    <TextField
                                    id="name"
                                    name="name"
                                    value={name}
                                    error={!validName}
                                    helperText={!validName ? invalidNames : ""}
                                    required
                                    fullWidth
                                    onChange={(e) => setName(e.target.value)}
                                    />
                                </Grid>
                                {/* DNI input */}
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        RUT
                                    </Typography>
                                    <TextField
                                        id="dni"
                                        name="dni"
                                        value={rut}
                                        label=""
                                        required
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                {/* First Lastname input */}
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        Primer apellido
                                    </Typography>
                                    <TextField
                                    id="firstLastName"
                                    name="firstLastName"
                                    value={firstLastName}
                                    label=""
                                    error={!validFirstLastName}
                                    helperText={!validFirstLastName ? invalidNames : ""}
                                    required
                                    fullWidth
                                    onChange={(e) => setFirstLastName(e.target.value)}
                                    />
                                </Grid>
                                {/* Second Lastname input */}
                                <Grid item xs={12} sm={6}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        Segundo apellido
                                    </Typography>
                                    <TextField
                                    id="secondLastName"
                                    name="secondLastName"
                                    value={secondLastName}
                                    label=""
                                    error={!validSecondLastName}
                                    helperText={!validSecondLastName ? invalidNames : ""}
                                    required
                                    fullWidth
                                    onChange={(e) => setSecondLastName(e.target.value)}
                                    />
                                </Grid>
                                {/* Email input */}
                                <Grid item xs={12}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        Correo electrónico
                                    </Typography>
                                    <TextField
                                    id="email"
                                    name="email"
                                    value={email}
                                    label=""
                                    required
                                    fullWidth
                                    disabled
                                    />
                                </Grid>
                                {/* Career input */}
                                <Grid item xs={12}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        Carrera
                                    </Typography>
                                    <TextField
                                        variant="outlined"
                                        name="career"
                                        value={career}
                                        label=""
                                        select
                                        fullWidth
                                        disabled
                                        onChange={(e) => setCareer(e.target.value)}
                                        >
                                        {<MenuItem value={career}>
                                                {career}
                                        </MenuItem>}
                                    </TextField>
                                </Grid>
                                {/* Buttons */}
                                <Grid item xs={12}>
                                    {/* Success message */}
                                    {success && (
                                        <Typography color="error" style={{ marginBottom: "16px", textAlign: "right" }}>
                                            {updateSuccess}
                                        </Typography>
                                    )}
                                    <Box sx={{ 
                                        marginLeft: "2%",
                                        display: "flex", 
                                        flexDirection: isSmallScreen ? "column" : "row",
                                        marginTop: "2%", 
                                        marginBottom: "2%", 
                                        justifyContent: "flex-end" 
                                    }}>
                                        {/* Cancel button */}
                                        <Button
                                            name="cancel-button"
                                            variant="outlined"
                                            color="secondary"
                                            style={{
                                                color: `${Colors.primaryRed}`,
                                                marginRight: isSmallScreen ? "0" : "16px",
                                                marginBottom: isSmallScreen ? "16px" : "0",
                                                transform: "scale(1.05)",
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: "85%",
                                            }}
                                            onClick={() => { clearInputs(true, false, true) }}
                                        >Cancelar
                                        </Button>
                                        {/* Save button */}
                                        <Button
                                            name="update-button"
                                            type="submit"
                                            variant="contained"
                                            color="warning"
                                            disabled={!validName || !validFirstLastName || !validSecondLastName || !differentNames}
                                            style={{
                                                transform: "scale(1.05)",
                                                color: "black",
                                                backgroundColor: validName && validFirstLastName && validSecondLastName && differentNames ? `${Colors.primaryOrange}` : `${Colors.primaryGray}`,
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: "85%",
                                            }}
                                        >Guardar
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    {/* Password page */}
                    {tab === "password" && (
                        <Box component="form" noValidate onSubmit={handleSubmitPassword}>
                            <Grid container spacing={2} sx={{ padding: "2vh", width: "100%", height: "100%" }}>
                                {/* Password input */}
                                <Grid item xs={12}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        Contraseña Actual
                                    </Typography>
                                    <TextField
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={ currentPwd }
                                        label=""
                                        helperText={!validCurrentPwd ? invalidPwd : ""}
                                        required
                                        fullWidth
                                        onChange={(e) => [setCurrentPwd(e.target.value)]}
                                    />
                                </Grid>
                                {/* New password input */}
                                <Grid item xs={12}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        Nueva Contraseña
                                    </Typography>
                                    <TextField
                                        id="new-password"
                                        name="new-password"
                                        type="password"
                                        value={ pwd }
                                        error={ !pwd ? false : !validPwd }
                                        label=""
                                        required
                                        fullWidth
                                        onChange={ (e) => setPwd(e.target.value) }
                                    />
                                    {(!validPwd && pwd) && (
                                        <FormHelperText id="pwdnote" className={ !validPwd ? "instructions" : "offscreen" } sx={{ ml:3 }}>    
                                        <FontAwesomeIcon icon={ faInfoCircle } style={{ marginRight: "5px" }} />
                                                Contraseña debe contener entre 10 a 16 caracteres, una mayúscula, una minúscula y un número.
                                        </FormHelperText>
                                    )}
                                </Grid>
                                {/* Repeat new password input */}
                                <Grid item xs={12}>
                                    <Typography
                                        style={{
                                            marginRight: "100%",
                                            fontSize: "85%",
                                            fontFamily: "Raleway, sans-serif"
                                        }}
                                    >
                                        Repetir Nueva Contraseña
                                    </Typography>
                                    <TextField
                                        id="repeat-new-password"
                                        name="repeat-new-password"
                                        type="password"
                                        value={ matchPwd }
                                        error={ !validMatchPwd }
                                        label=""
                                        required
                                        fullWidth
                                        onChange={ (e) => setMatchPwd(e.target.value) }
                                    />
                                    {!validMatchPwd && (
                                        <FormHelperText id="pwdnote" className={ !validPwd ? "instructions" : "offscreen" } sx={{ ml:3 }}>    
                                        <FontAwesomeIcon icon={ faInfoCircle } style={{ marginRight: "5px" }} />
                                                Contraseñas no coinciden.
                                        </FormHelperText>
                                    )}
                                </Grid>
                                {/* Buttons */}
                                <Grid item xs={12}>
                                    {/* Success message */}
                                    {success && (
                                        <Typography color="error" style={{ marginBottom: "16px", textAlign: "right" }}>
                                            {updateSuccess}
                                        </Typography>
                                    )}
                                    <Box sx={{ 
                                        marginLeft: "2%",
                                        display: "flex", 
                                        flexDirection: isSmallScreen ? "column" : "row",
                                        marginTop: "2%", 
                                        marginBottom: "2%", 
                                        justifyContent: "flex-end" 
                                    }}>
                                        {/* Cancel button */}
                                        <Button
                                            name="cancel-button"
                                            variant="outlined"
                                            color="secondary"
                                            style={{
                                                color: `${Colors.primaryRed}`,
                                                marginRight: isSmallScreen ? "0" : "16px",
                                                marginBottom: isSmallScreen ? "16px" : "0",
                                                transform: "scale(1.05)",
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: "85%",
                                            }}
                                            onClick={() => { clearInputs(false, true, true) }}
                                        >Cancelar
                                        </Button>
                                        {/* Update button */}
                                        <Button
                                            name="update-button"
                                            type="submit"
                                            variant="contained"
                                            color= "warning"
                                            disabled={!validPwd || !validMatchPwd}
                                            style={{
                                                transform: "scale(1.05)",
                                                color: "black",
                                                backgroundColor: validPwd && validMatchPwd ? `${Colors.primaryOrange}` : `${Colors.primaryGray}`,
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: "85%",
                                            }}
                                        >Actualizar
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            </Box>
            {/* Successful Password Change Dialog */}
            <Dialog open={changePasswordSuccess} onClose={handleCloseDialog}>
                <DialogTitle>Cambio de Contraseña Exitoso</DialogTitle>
                <DialogContent>
                    <Typography>
                        Tu contraseña se ha cambiado exitosamente. Se cerrará la sesión.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cerrar Sesión
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default EditProfile;
