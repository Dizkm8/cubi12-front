import React from "react";
import { SyntheticEvent, useRef, useState, useEffect } from "react";
import { Paper, Typography, Grid, TextField, Button, MenuItem, Box } from "@mui/material";
import Agent from "../../app/api/agent";
import { primaryBlueColor, primaryOrangeColor, primaryRedColor } from "../../app/static/colors";
import { first, set, startCase } from 'lodash';

// Regex for password and names
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,16}$/;
const namesRegex = /^[A-Za-záéíóúüñÁÉÍÓÚÜÑ\s]+$/;

// Messages
const nothingUpdate = "Nada que actualizar";
const invalidPwd = "Contraseña(s) inválida(s)";
const invalidNames = "Nombre(s) inválido(s)";
const updateSuccess = "Actualización exitosa";

export default function EditProfile() {
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

    // Valid password state
    const[validPwd, setValidPwd] = useState(false);

    // Error message state
    const [message, setMessage] = useState("");

    // Tab state
    const [tab, setTab] = useState("my-info");

    // User state
    const [user, setUser] = useState({name: "", firstLastName: "", secondLastName: "", rut: "", email: "", career: {id: "", name: ""}});
    
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

    useEffect(() => {
        if (pwdRegex.test(pwd)) {
            setValidPwd(true);
            console.log("Valid password");
        } else {
            setValidPwd(false);
        }
    }, [pwd]);

    // Clear inputs
    const clearInputs = (names: boolean, password: boolean, cancel: boolean) => {
        // Clear error message
        setMessage("");

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
                setMessage(updateSuccess);
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
                setMessage(updateSuccess);
            })
            .catch(error => {
                console.error("Error updating password:", error);
                setMessage(invalidPwd);
            });
    }

    // Handle my info submit
    const handleSubmitMyInfo = async (e: SyntheticEvent) => {
        // Prevent default submit action
        e.preventDefault();

        // Clear error message
        setMessage("");
        // Check if inputs are empty
        if ((!name && !firstLastName && !secondLastName)) {
            setMessage(nothingUpdate);
            return;
        } else if (name === user.name && firstLastName === user.firstLastName && secondLastName === user.secondLastName) {
            setMessage(nothingUpdate);
            return;
        }

        // Check if inputs are valids
        if (!namesRegex.test(name) || !namesRegex.test(firstLastName) || !namesRegex.test(secondLastName)) {
            setMessage(invalidNames);
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

         // Clear error message
        setMessage("");

        // Check if inputs are empty
        if (!pwd) {
            clearInputs(false, true, false);
            setMessage(nothingUpdate);
            return;
        } 
        // Check if passwords match or its valid
        else if (!pwdRegex.test(pwd) || !pwdRegex.test(currentPwd) ||pwd !== matchPwd || !currentPwd) {
            clearInputs(false, true, false);
            setMessage(invalidPwd);
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
        alignItems="center"
        gap="2rem">
            <Box
                sx={{
                    marginTop: "2%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Paper elevation={3} style={{ padding: "40px", border: `1px solid ${primaryBlueColor}`, borderRadius: "8px", width: "40%", height: "fit-content" }}>
                    {/* Title */}
                    <Grid container>
                        {/* My info title */}
                        <Grid item style={{ marginLeft: "5%", marginRight: "10%" }}>
                            <Typography
                                fontSize={38}
                                color={tab === "my-info" ? "black" : "#626262"}
                                variant="h5"
                                style={{ cursor: "pointer" }}
                                onClick={() => { setTab("my-info") }}
                            >Mis Datos
                            </Typography>
                        </Grid>
                        {/* Password title */}
                        <Grid item >
                            <Typography
                                fontSize={38}
                                color={tab === "password" ? "black" : "#626262"}
                                variant="h5"
                                style={{ cursor: "pointer" }}
                                id="tab-password"
                                onClick={() => setTab("password")}
                            >Contraseña
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* My info page */}
                    {tab === "my-info" && (
                        <Box component="form" noValidate onSubmit={handleSubmitMyInfo} sx={{ mt: 3 }}>
                            <Grid container spacing={4} sx={{ marginTop: "5px" }}>
                                {/* Name input */}
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor="name" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>Nombre</label>
                                    <TextField
                                    id="name"
                                    name="name"
                                    value={name}
                                    required
                                    fullWidth
                                    onChange={(e) => setName(e.target.value)}
                                    />
                                </Grid>
                                {/* DNI input */}
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor="name" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>RUT</label>
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
                                    <label htmlFor="name" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>Primer apellido</label>
                                    <TextField
                                    id="firstLastName"
                                    name="firstLastName"
                                    value={firstLastName}
                                    label=""
                                    required
                                    fullWidth
                                    onChange={(e) => setFirstLastName(e.target.value)}
                                    />
                                </Grid>
                                {/* Second Lastname input */}
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor="name" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>Segundo apellido</label>
                                    <TextField
                                    id="secondLastName"
                                    name="secondLastName"
                                    value={secondLastName}
                                    label=""
                                    required
                                    fullWidth
                                    onChange={(e) => setSecondLastName(e.target.value)}
                                    />
                                </Grid>
                                {/* Email input */}
                                <Grid item xs={12}>
                                    <label htmlFor="name" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>Correo electrónico</label>
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
                                    <label htmlFor="name" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>Carrera</label>
                                    <TextField
                                        variant="outlined"
                                        name="career"
                                        value={career}
                                        label=""
                                        select
                                        fullWidth
                                        onChange={(e) => setCareer(e.target.value)}
                                        >
                                        {<MenuItem value={career}>
                                                {career}
                                        </MenuItem>}
                                    </TextField>
                                </Grid>
                                {/* Buttons */}
                                <Grid item xs={12}>
                                    {/* Error message */}
                                    {message && (
                                        <Typography color="error" style={{ marginBottom: "16px", textAlign: "right" }}>
                                            {message}
                                        </Typography>
                                    )}
                                    <Box sx={{ display: "flex", marginTop: "2%", marginBottom: "2%", justifyContent: "flex-end" }}>
                                        {/* Cancel button */}
                                        <Button
                                            name="cancel-button"
                                            variant="outlined"
                                            color="secondary"
                                            style={{
                                                color: `${primaryRedColor}`,
                                                marginRight: "16px",
                                                transform: "scale(1.05)",
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: "1rem",
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
                                            style={{
                                                transform: "scale(1.05)",
                                                color: "black",
                                                backgroundColor: `${primaryOrangeColor}`,
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: "1rem",
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
                        <Box component="form" noValidate onSubmit={handleSubmitPassword} sx={{ mt: 3 }}>
                            <Grid container spacing={6} sx={{ marginTop: "5px" }}>
                                {/* Password input */}
                                <Grid item xs={12}>
                                    <label htmlFor="password" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>Contraseña Actual</label>
                                    <TextField
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={currentPwd}
                                        label=""
                                        required
                                        fullWidth
                                        onChange={(e) => [setCurrentPwd(e.target.value)]}
                                    />
                                </Grid>
                                {/* New password input */}
                                <Grid item xs={12}>
                                    <label htmlFor="name" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>Nueva Contraseña</label>
                                    <TextField
                                        id="new-password"
                                        name="new-password"
                                        type="password"
                                        value={pwd}
                                        label=""
                                        required
                                        fullWidth
                                        onChange={(e) => setPwd(e.target.value)}
                                    />
                                </Grid>
                                {/* Repeat new password input */}
                                <Grid item xs={12}>
                                    <label htmlFor="name" style={{
                                        marginRight: "100%",
                                        fontSize: 18,
                                        fontFamily: "Raleway, sans-serif"
                                    }}>Repetir Nueva Contraseña</label>
                                    <TextField
                                        id="repeat-new-password"
                                        name="repeat-new-password"
                                        type="password"
                                        value={matchPwd}
                                        label=""
                                        required
                                        fullWidth
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                    />
                                </Grid>
                                {/* Buttons */}
                                <Grid item xs={12}>
                                    {/* Error message */}
                                    {message && (
                                        <Typography color="error" style={{ marginBottom: "16px", textAlign: "right" }}>
                                            {message}
                                        </Typography>
                                    )}
                                    <Box sx={{ display: "flex", marginTop: "2%", marginBottom: "2%", justifyContent: "flex-end" }}>
                                        {/* Cancel button */}
                                        <Button
                                            name="cancel-button"
                                            variant="outlined"
                                            color="secondary"
                                            style={{
                                                color: `${primaryRedColor}`,
                                                marginRight: "16px",
                                                transform: "scale(1.05)",
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: ""
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
                                            style={{
                                                transform: "scale(1.05)",
                                                color: "black",
                                                backgroundColor: `${primaryOrangeColor}`,
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: "1rem"
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
        </Grid>
    );
}
