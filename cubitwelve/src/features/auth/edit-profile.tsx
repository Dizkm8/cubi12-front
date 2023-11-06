import React from 'react';
import { SyntheticEvent, useRef, useState, useEffect, useContext } from 'react';
import { Paper, Typography, Grid, TextField, Button, MenuItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Agent from '../../app/api/agent';
import agent from '../../app/api/agent';

// Regex for password and names
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,16}$/;
const namesRegex = /^[A-Za-z\s]+$/;

export default function EditProfile() {

    // Error message reference
    const errRef = useRef<HTMLInputElement>(null);

    // Names state
    let  [name, setName] = useState('');
    let [firstLastName, setFirstLastName] = useState('');
    let [secondLastName, setSecondLastName] = useState('');

    // User data state
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [career, setCareer] = useState('');

    // Password state
    let [currentPwd, setCurrentPwd] = useState('');
    let [pwd, setPwd] = useState('');
    let [matchPwd, setMatchPwd] = useState('');

    // Error message state
    const [errMsg, setErrMsg] = useState('');

    // Tab state
    const [tab, setTab] = useState('my-info');

    // User state
    const [user, setUser] = useState({name: '', firstLastName: '', secondLastName: '', rut: '', email: '', career: {id: '', name: ''}});


    // const [careers, setCareers] = useState([]);
    // useEffect(() => {
    //     Agent.requests.get('Careers')
    //         .then(response => {
    //             setCareers(response.map((career: any) => career.name));
    //         })
    //         .catch(error => {
    //             console.error('Error loading careers:', error);
    //         });
    // }, []);

    // Load user data
    useEffect(() => {
        Agent.Auth.profile()
            .then(response => {
                setUser(response);
                setRut(response.rut);
                setEmail(response.email);
                setCareer(response.career.name);
            })
            .catch(error => {
                console.error('Error loading user:', error);
            });
    }, []);

    // Clear inputs
    const clearInputs = (names: boolean, password: boolean, cancel: boolean) => {

        // Clear error message
        setErrMsg('');

        // Clear name inputs
        if (names) {
            if(!cancel) {
                user.name = name;
                user.firstLastName = firstLastName;
                user.secondLastName = secondLastName;
            }
            name = '';
            firstLastName = '';
            secondLastName = '';
            setName('');
            setFirstLastName('');
            setSecondLastName('');
        }
        // Clear password inputs
        else if (password) {
            currentPwd = '';
            pwd = '';
            matchPwd = '';
            setCurrentPwd('');
            setPwd('');
            setMatchPwd('');
        }
    }

    // Send my info data to server
    const sendMyInfoData = (name: string, firstLastName: string, secondLastName: string) => {
        agent.Auth.updateProfile({name, firstLastName, secondLastName})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                return;
            });

        console.log('Name(s) updated successfully!');
    }

    // Send password data to server
    const sendPasswordData = (password: string, currentPassword: string, repeatedPassword: string) => {
        agent.Auth.updatePassword({password, currentPassword, repeatedPassword})
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('Error updating password:', error);
                setErrMsg('Contraseña inválida');
            });

        console.log('Password updated successfully!');
    }

    // Handle my info submit
    const handleSubmitMyInfo = async (e: SyntheticEvent) => {
        
        e.preventDefault();

        // Clear error message
        setErrMsg('');

        // Check if inputs are empty
        if ((!name && !firstLastName && !secondLastName)) {
            setErrMsg('Nada que actualizar');
            return;
        } else if (name === user.name || firstLastName === user.firstLastName || secondLastName === user.secondLastName) {
            setErrMsg('Nada que actualizar');
            return;
        }

        // if inputs are empty, set them to the current user data
        name = name === '' ? user.name : name;
        firstLastName = firstLastName === '' ? user.firstLastName : firstLastName;
        secondLastName = secondLastName === '' ? user.secondLastName : secondLastName;

        // Check if inputs are valids
        if (!namesRegex.test(name) || !namesRegex.test(firstLastName) || !namesRegex.test(secondLastName)) {
            setErrMsg('Nombre(s) inválido(s)');
            return;
        }

        try {
            
            // Send data to server
            sendMyInfoData(name, firstLastName, secondLastName);

            // Clean name inputs
            clearInputs(true, false, false);

        } catch (error: any) {
            if (error?.response) {
                if (error.response.status === 409) {
                    console.log('Username Taken');
                } else {
                    console.log('Registration Failed');
                }
            } else {
                console.log('No Server Response');
            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }

    };

    // Handle password submit
    const handleSubmitPassword = async (e: SyntheticEvent) => {
        
        e.preventDefault();

         // Clear error message
        setErrMsg('');

        // Check if inputs are empty
        if (!pwd) {
            clearInputs(false, true, false);
            setErrMsg('Nada que actualizar');
            return;
        } 
        // Check if passwords match or its valid
        else if (!pwdRegex.test(pwd) || !pwdRegex.test(currentPwd) ||pwd !== matchPwd || !currentPwd) {
            clearInputs(false, true, false);
            setErrMsg('Contraseña inválida');
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
                    console.log('Username Taken');
                } 
                else {
                    console.log(error.response);
                    console.log('Registration Failed');
                }
            } else {
                console.log('No Server Response');
            }
            if (errRef.current) {
                errRef.current.focus();
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
                    marginTop: '2%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} style={{ padding: '40px', border: '1px solid #1C478F', borderRadius: '8px', width: '60%', height: 'fit-content' }}>
                    {/* Title */}
                    <Grid container>
                        {/* My info title */}
                        <Grid item style={{ marginLeft: '5%', marginRight: '10%' }}>
                            <Typography
                                fontSize={38}
                                color={tab === 'my-info' ? 'black' : '#626262'}
                                variant='h5'
                                style={{ cursor: 'pointer' }}
                                onClick={() => { setTab('my-info') }}
                            >Mis Datos
                            </Typography>
                        </Grid>
                        {/* Password title */}
                        <Grid item >
                            <Typography
                                fontSize={38}
                                color={tab === 'password' ? 'black' : '#626262'}
                                variant='h5'
                                style={{ cursor: 'pointer' }}
                                id='tab-password'
                                onClick={() => setTab('password')}
                            >Contraseña
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* My info page */}
                    {tab === 'my-info' && (
                        <Box component='form' noValidate onSubmit={handleSubmitMyInfo} sx={{ mt: 3 }}>
                            <Grid container spacing={4} sx={{ marginTop: '5px' }}>
                                {/* Name input */}
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor='name' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>Nombre</label>
                                    <TextField
                                    id='name'
                                    name='name'
                                    value={name}
                                    required
                                    fullWidth
                                    placeholder={user.name}
                                    onChange={(e) => setName(e.target.value)}
                                    />
                                </Grid>
                                {/* DNI input */}
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor='name' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>RUT</label>
                                    <TextField
                                        id='dni'
                                        name='dni'
                                        value={rut}
                                        label=''
                                        required
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                {/* First Lastname input */}
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor='name' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>Primer apellido</label>
                                    <TextField
                                    id='firstLastName'
                                    name='firstLastName'
                                    value={firstLastName}
                                    label=''
                                    required
                                    fullWidth
                                    placeholder={user.firstLastName}
                                    onChange={(e) => setFirstLastName(e.target.value)}
                                    />
                                </Grid>
                                {/* Second Lastname input */}
                                <Grid item xs={12} sm={6}>
                                    <label htmlFor='name' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>Segundo apellido</label>
                                    <TextField
                                    id='secondLastName'
                                    name='secondLastName'
                                    value={secondLastName}
                                    label=''
                                    required
                                    fullWidth
                                    placeholder={user.secondLastName}
                                    onChange={(e) => setSecondLastName(e.target.value)}
                                    />
                                </Grid>
                                {/* Email input */}
                                <Grid item xs={12}>
                                    <label htmlFor='name' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>Correo electrónico</label>
                                    <TextField
                                    id='email'
                                    name='email'
                                    value={email}
                                    label=''
                                    required
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                {/* Career input */}
                                <Grid item xs={12}>
                                    <label htmlFor='name' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>Carrera</label>
                                    <TextField
                                        variant='outlined'
                                        name='career'
                                        value={career}
                                        label=''
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
                                    {errMsg && (
                                        <Typography color='error' style={{ marginBottom: '16px', textAlign: 'right' }}>
                                            {errMsg}
                                        </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', marginTop: '2%', marginBottom: '2%', justifyContent: 'flex-end' }}>
                                        {/* Cancel button */}
                                        <Button
                                            name='cancel-button'
                                            variant='outlined'
                                            color='secondary'
                                            style={{
                                                color: '#D90000',
                                                marginRight: '16px',
                                                transform: 'scale(1.05)',
                                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                                fontFamily: 'Raleway, sans-serif',
                                                fontSize: '1rem',
                                            }}
                                            onClick={() => { clearInputs(true, false, true) }}
                                        >Cancelar
                                        </Button>
                                        {/* Save button */}
                                        <Button
                                            name='update-button'
                                            type='submit'
                                            variant='contained'
                                            color='warning'
                                            style={{
                                                transform: 'scale(1.05)',
                                                color: 'black',
                                                backgroundColor: '#FFC107',
                                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                                fontFamily: 'Raleway, sans-serif',
                                                fontSize: '1rem',
                                            }}
                                        >Guardar
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    {/* Password page */}
                    {tab === 'password' && (
                        <Box component='form' noValidate onSubmit={handleSubmitPassword} sx={{ mt: 3 }}>
                            <Grid container spacing={6} sx={{ marginTop: '5px' }}>
                                {/* Password input */}
                                <Grid item xs={12}>
                                    <label htmlFor='password' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>Contraseña Actual</label>
                                    <TextField
                                        id='password'
                                        name='password'
                                        type='password'
                                        value={currentPwd}
                                        label=''
                                        required
                                        fullWidth
                                        onChange={(e) => [setCurrentPwd(e.target.value)]}
                                    />
                                </Grid>
                                {/* New password input */}
                                <Grid item xs={12}>
                                    <label htmlFor='name' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>Nueva Contraseña</label>
                                    <TextField
                                        id='new-password'
                                        name='new-password'
                                        type='password'
                                        value={pwd}
                                        label=''
                                        required
                                        fullWidth
                                        onChange={(e) => setPwd(e.target.value)}
                                    />
                                </Grid>
                                {/* Repeat new password input */}
                                <Grid item xs={12}>
                                    <label htmlFor='name' style={{
                                        marginRight: '100%',
                                        fontSize: 18,
                                        fontFamily: 'Raleway, sans-serif'
                                    }}>Repetir Nueva Contraseña</label>
                                    <TextField
                                        id='repeat-new-password'
                                        name='repeat-new-password'
                                        type='password'
                                        value={matchPwd}
                                        label=''
                                        required
                                        fullWidth
                                        onChange={(e) => setMatchPwd(e.target.value)}
                                    />
                                </Grid>
                                {/* Buttons */}
                                <Grid item xs={12}>
                                    {/* Error message */}
                                    {errMsg && (
                                        <Typography color='error' style={{ marginBottom: '16px', textAlign: 'right' }}>
                                            {errMsg}
                                        </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', marginTop: '2%', marginBottom: '2%', justifyContent: 'flex-end' }}>
                                        {/* Cancel button */}
                                        <Button
                                            name='cancel-button'
                                            variant='outlined'
                                            color='secondary'
                                            style={{
                                                color: '#D90000',
                                                marginRight: '16px',
                                                transform: 'scale(1.05)',
                                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                                fontFamily: 'Raleway, sans-serif',
                                                fontSize: ''
                                            }}
                                            onClick={() => { clearInputs(false, true, true) }}
                                        >Cancelar
                                        </Button>
                                        {/* Update button */}
                                        <Button
                                            name='update-button'
                                            type='submit'
                                            variant='contained'
                                            color= 'warning'
                                            style={{
                                                transform: 'scale(1.05)',
                                                color: 'black',
                                                backgroundColor: '#FFC107',
                                                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                                fontFamily: 'Raleway, sans-serif',
                                                fontSize: '1rem'
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
