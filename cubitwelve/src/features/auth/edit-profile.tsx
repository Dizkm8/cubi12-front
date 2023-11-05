import React from 'react';
import { SyntheticEvent, useRef, useState, useEffect, useContext } from 'react';
import { Paper, Typography, Grid, TextField, Button, MenuItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Agent from '../../app/api/agent';
import agent from '../../app/api/agent';

const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,16}$/;
const namesRegex = /^[A-Za-z\s]+$/;

export default function EditProfile() {

    const errRef = useRef<HTMLInputElement>(null);

    let  [name, setName] = useState('');
    const [rut, setRut] = useState('');
    let [firstLastName, setFirstLastName] = useState('');
    let [secondLastName, setSecondLastName] = useState('');
    const [email, setEmail] = useState('');
    const [career, setCareer] = useState('');

    const [currentPwd, setCurrentPwd] = useState('');
    const [pwd, setPwd] = useState('');
    const [matchPwd, setMatchPwd] = useState('');

    const [errMsg, setErrMsg] = useState('');

    const [tab, setTab] = useState('my-info');

    const [user, setUser] = useState({name: '', firstLastName: '', secondLastName: '', rut: '', email: '', career: {id: '', name: ''}});

    const [careers, setCareers] = useState([]);

    useEffect(() => {
        Agent.requests.get('Careers')
            .then(response => {
                setCareers(response.map((career: any) => career.name));
            })
            .catch(error => {
                console.error('Error loading careers:', error);
            });
    }, []);

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
    }, [user]);

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd]);

    const handleSubmitMyInfo = async (e: SyntheticEvent) => {
        
        e.preventDefault();

        setName('');
        setFirstLastName('');
        setSecondLastName('');
        setErrMsg('');

        if (!name && !firstLastName && !secondLastName) {
            setErrMsg('Nada que actualizar');
            return;
        }

        if(name === ''){
            name = user.name;
        }
        if(firstLastName === ''){
            firstLastName = user.firstLastName;
        }
        if(secondLastName === '' ){
            secondLastName = user.secondLastName;
        }

        if (!namesRegex.test(name) || !namesRegex.test(firstLastName) || !namesRegex.test(secondLastName)) {
            setErrMsg('Nombre inválido');
            return;
        }
        
        console.log({
            name,
            firstLastName,
            secondLastName
        });

        try {
            await Agent.Auth.updateProfile({ name, firstLastName, secondLastName });
            
            console.log('My info updated successfully!');
            setName('');
            setFirstLastName('');
            setSecondLastName('');

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

    const handleSubmitPassword = async (e: SyntheticEvent) => {
        
        e.preventDefault();

        console.log({
            currentPwd,
            pwd,
            matchPwd
        })

        if (!pwd) {
            setErrMsg('Nada que actualizar');
            return;
        } else if (!pwdRegex.test(pwd) || pwd !== matchPwd || !currentPwd) {
            setErrMsg('Contraseña inválida');
            return;
        }
    
        try {
            
            agent.Auth.updatePassword({ currentPwd, pwd, matchPwd });
            
            console.log('Password updated successfully!');
            setCurrentPwd('');
            setPwd('');
            setMatchPwd('');

        } catch (error: any) {
            if (error?.response) {
                if (error.response.status === 409) {
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
        console.log('E!');
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
                                    name='name'
                                    required
                                    fullWidth
                                    id='name'
                                    label=''
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
                                        required
                                        fullWidth
                                        id='dni'
                                        label=''
                                        name='dni'
                                        value={rut}
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
                                    name='firstLastName'
                                    required
                                    fullWidth
                                    id='firstLastName'
                                    label=''
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
                                    required
                                    fullWidth
                                    id='secondLastName'
                                    label=''
                                    name='secondLastName'
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
                                    required
                                    fullWidth
                                    id='email'
                                    label=''
                                    name='email'
                                    value={email}
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
                                        label=''
                                        variant='outlined'
                                        select
                                        fullWidth
                                        name='career'
                                        value={career}
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
                                            onClick={() => { window.location.reload(); }}
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
                                        type='password'
                                        required
                                        fullWidth
                                        id='password'
                                        label=''
                                        name='password'
                                        onChange={(e) => setCurrentPwd(e.target.value)}
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
                                        type='password'
                                        required
                                        fullWidth
                                        id='new-password'
                                        label=''
                                        name='new-password'
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
                                        type='password'
                                        required
                                        fullWidth
                                        id='repeat-new-password'
                                        label=''
                                        name='repeat-new-password'
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
                                            onClick={() => { window.location.reload() }}
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