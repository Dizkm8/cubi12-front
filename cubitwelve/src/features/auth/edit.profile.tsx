import React from "react";
import { SyntheticEvent, useRef, useState, useEffect, useContext } from "react";
import { Paper, Typography, Grid, TextField, Button, MenuItem, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Agent from "../../app/api/agent";
import { primary_blue_color, primary_orange_color, primary_red_color } from "../../app/static/colors";

// Regex for password and names
const pwd_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,16}$/;
const names_regex = /^[A-Za-z\s]+$/;

// Messages
const nothing_update = "Nada que actualizar";
const invalid_pwd = "Contraseña(s) inválida(s)";
const invalid_names = "Nombre(s) inválido(s)";

export default function EditProfile() {
    // Error message reference
    const error_ref = useRef<HTMLInputElement>(null);

    // Names state
    let  [name, setName] = useState("");
    let [firstLastName, setFirstLastName] = useState("");
    let [secondLastName, setSecondLastName] = useState("");

    // User data state
    const [rut, set_rut] = useState("");
    const [email, set_email] = useState("");
    const [career, set_career] = useState("");

    // Password state
    let [currentPwd, setCurrentPwd] = useState("");
    let [pwd, setPwd] = useState("");
    let [matchPwd, setMatchPwd] = useState("");

    // Error message state
    const [error_message, set_error_message] = useState("");

    // Tab state
    const [tab, set_tab] = useState("my-info");

    // User state
    const [user, set_user] = useState({name: "", firstLastName: "", secondLastName: "", rut: "", email: "", career: {id: "", name: ""}});

    // const [careers, set_careers] = useState([]);
    // useEffect(() => {
    //     Agent.requests.get("Careers")
    //         .then(response => { set_careers(response.map((career: any) => career.name)); })
    //         .catch(error => { console.error("Error loading careers:", error); });
    // }, []);

    // Load user data
    useEffect(() => {
        Agent.Auth.profile()
            .then(response => {
                set_user(response);
                set_rut(response.rut);
                set_email(response.email);
                set_career(response.career.name);
            })
            .catch(error => { console.error("Error loading user:", error); });
    }, []);

    // Clear inputs
    const clear_inputs = (names: boolean, password: boolean, cancel: boolean) => {
        // Clear error message
        set_error_message("");

        // Clear name inputs
        if (names) {
            if(!cancel) {
                user.name = name;
                user.firstLastName = firstLastName;
                user.secondLastName = secondLastName;
            }
            name = "";
            firstLastName = "";
            secondLastName = "";
            setName("");
            setFirstLastName("");
            setSecondLastName("");
        }
        // Clear password inputs
        else if (password) {
            currentPwd = "";
            pwd = "";
            matchPwd = "";
            setCurrentPwd("");
            setPwd("");
            setMatchPwd("");
        }
    }

    // Send my info data to server
    const send_my_info_data = (name: string, firstLastName: string, secondLastName: string) => {
        Agent.Auth.updateProfile({
            name, firstLastName, secondLastName
        })
            .then(response => {
                console.log(response);
                console.log("Name(s) updated successfully!");
            })
            .catch(error => {
                console.error("Error updating profile:", error);
                return;
            });
    }

    // Send password data to server
    const send_password_data = (password: string, currentPassword: string, repeatedPassword: string) => {
        Agent.Auth.updatePassword({password, currentPassword, repeatedPassword})
            .then(response => { 
                console.log("Password updated successfully!"); 
            })
            .catch(error => {
                console.error("Error updating password:", error);
                set_error_message(invalid_pwd);
            });
    }

    // Handle my info submit
    const handle_submit_my_info = async (e: SyntheticEvent) => {
        // Prevent default submit action
        e.preventDefault();

        // Clear error message
        set_error_message("");

        // Check if inputs are empty
        if ((!name && !firstLastName && !secondLastName)) {
            set_error_message(nothing_update);
            return;
        } else if (name === user.name || firstLastName === user.firstLastName || secondLastName === user.secondLastName) {
            set_error_message(nothing_update);
            return;
        }

        // if inputs are empty, set them to the current user data
        name = name === "" ? user.name : name;
        firstLastName = firstLastName === "" ? user.firstLastName : firstLastName;
        secondLastName = secondLastName === "" ? user.secondLastName : secondLastName;

        // Check if inputs are valids
        if (!names_regex.test(name) || !names_regex.test(firstLastName) || !names_regex.test(secondLastName)) {
            set_error_message(invalid_names);
            return;
        }

        try {
            // Send data to server
            send_my_info_data(name, firstLastName, secondLastName);

            // Clean name inputs
            clear_inputs(true, false, false);

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
            
            if (error_ref.current) {
                error_ref.current.focus();
            }
        }
    };

    // Handle password submit
    const handle_submit_password = async (e: SyntheticEvent) => {
        // Prevent default submit action
        e.preventDefault();

         // Clear error message
        set_error_message("");

        // Check if inputs are empty
        if (!pwd) {
            clear_inputs(false, true, false);
            set_error_message(nothing_update);
            return;
        } 
        // Check if passwords match or its valid
        else if (!pwd_regex.test(pwd) || !pwd_regex.test(currentPwd) ||pwd !== matchPwd || !currentPwd) {
            clear_inputs(false, true, false);
            set_error_message(invalid_pwd);
            return;
        }
    
        try {
            // Send data to server
            send_password_data(pwd, currentPwd, matchPwd);

            // Clean password inputs
            clear_inputs(false, true, false);

        } catch (error: any) {
            if (error?.response) {
                if (error.response.status === 409 || error.response.status === 400) console.log("Username Taken");
                else {
                    console.log(error.response);
                    console.log("Registration Failed");
                }
            } else {
                console.log("No Server Response");
            }
            if (error_ref.current) {
                error_ref.current.focus();
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
                <Paper elevation={3} style={{ padding: "40px", border: `1px solid ${primary_blue_color}`, borderRadius: "8px", width: "60%", height: "fit-content" }}>
                    {/* Title */}
                    <Grid container>
                        {/* My info title */}
                        <Grid item style={{ marginLeft: "5%", marginRight: "10%" }}>
                            <Typography
                                fontSize={38}
                                color={tab === "my-info" ? "black" : "#626262"}
                                variant="h5"
                                style={{ cursor: "pointer" }}
                                onClick={() => { set_tab("my-info") }}
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
                                onClick={() => set_tab("password")}
                            >Contraseña
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* My info page */}
                    {tab === "my-info" && (
                        <Box component="form" noValidate onSubmit={handle_submit_my_info} sx={{ mt: 3 }}>
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
                                    placeholder={user.name}
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
                                        InputProps={{ readOnly: true }}
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
                                    placeholder={user.firstLastName}
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
                                    placeholder={user.secondLastName}
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
                                    InputProps={{ readOnly: true }}
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
                                        onChange={(e) => set_career(e.target.value)}
                                        >
                                        {<MenuItem value={career}>
                                                {career}
                                        </MenuItem>}
                                    </TextField>
                                </Grid>
                                {/* Buttons */}
                                <Grid item xs={12}>
                                    {/* Error message */}
                                    {error_message && (
                                        <Typography color="error" style={{ marginBottom: "16px", textAlign: "right" }}>
                                            {error_message}
                                        </Typography>
                                    )}
                                    <Box sx={{ display: "flex", marginTop: "2%", marginBottom: "2%", justifyContent: "flex-end" }}>
                                        {/* Cancel button */}
                                        <Button
                                            name="cancel-button"
                                            variant="outlined"
                                            color="secondary"
                                            style={{
                                                color: `${primary_red_color}`,
                                                marginRight: "16px",
                                                transform: "scale(1.05)",
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: "1rem",
                                            }}
                                            onClick={() => { clear_inputs(true, false, true) }}
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
                                                backgroundColor: `${primary_orange_color}`,
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
                        <Box component="form" noValidate onSubmit={handle_submit_password} sx={{ mt: 3 }}>
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
                                    {error_message && (
                                        <Typography color="error" style={{ marginBottom: "16px", textAlign: "right" }}>
                                            {error_message}
                                        </Typography>
                                    )}
                                    <Box sx={{ display: "flex", marginTop: "2%", marginBottom: "2%", justifyContent: "flex-end" }}>
                                        {/* Cancel button */}
                                        <Button
                                            name="cancel-button"
                                            variant="outlined"
                                            color="secondary"
                                            style={{
                                                color: `${primary_red_color}`,
                                                marginRight: "16px",
                                                transform: "scale(1.05)",
                                                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                                                fontFamily: "Raleway, sans-serif",
                                                fontSize: ""
                                            }}
                                            onClick={() => { clear_inputs(false, true, true) }}
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
                                                backgroundColor: `${primary_orange_color}`,
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
