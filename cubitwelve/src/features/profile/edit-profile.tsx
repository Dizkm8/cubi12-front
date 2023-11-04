import React from 'react';
import { SyntheticEvent, useRef, useState, useEffect, useContext } from 'react';
import { Paper, Typography, Grid, TextField, Button, MenuItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Agent from '../../app/api/agent';

const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,16}$/;

export default function EditProfile() {


    const userRef = useRef();
    const errRef = useRef<HTMLInputElement>(null);

    const [career, setCareer] = useState('');
    const [name, setName] = useState('');
    const [firstLastName, setFirstLastName] = useState('');
    const [secondLastName, setSecondLastName] = useState('');

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    const [success, setSuccess] = useState(false);

    const [tab, setTab] = useState('my-info');

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
        setValidPwd(pwdRegex.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd]);

    const handleSubmitMyInfo = async (e: SyntheticEvent) => {
        
        e.preventDefault();

        console.log({
            name,
            firstLastName,
            secondLastName,
            career
        });

    };

    const handleSubmitPassword = async (e: SyntheticEvent) => {
        
        e.preventDefault();

        console.log({
            pwd,
            matchPwd
        })
    
        if (!pwd) {
            setErrMsg('Nada que actualizar');
            return;
        } else if (!pwdRegex.test(pwd)) {
            setErrMsg('Contraseña inválida');
            return;
        } else if (pwd !== matchPwd) {
            setErrMsg('Validación de contraseña inválida');
            return;
        }
    
        try {
            
            await Agent.Auth.updatePassword({ pwd });
            
            console.log('Password updated successfully!');

            setSuccess(true);
            setPwd('');
            setMatchPwd('');

        } catch (error: any) {
            if (error?.response) {
                if (error.response.status === 409) {
                    setErrMsg('Username Taken');
                } else {
                    setErrMsg('Registration Failed');
                }
            } else {
                setErrMsg('No Server Response');
            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }
    };

    return (
        <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} style={{ padding: '40px', border: '1px solid #1C478F', borderRadius: '8px', width: '35%', height: 'fit-content' }}>
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
                                    autoComplete='given-name'
                                    name='name'
                                    required
                                    fullWidth
                                    id='name'
                                    label=''
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
                                    autoComplete='given-name'
                                    name='firstLastName'
                                    required
                                    fullWidth
                                    id='firstLastName'
                                    label=''
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
                                        {careers.map((career, index) => (
                                            <MenuItem key={index} value={career}>
                                                {career}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                {/* Buttons */}
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', marginTop: '2%', marginBottom: '2%', justifyContent: 'flex-end' }}>
                                        {/* Cancel button */}
                                        <Button
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
                                        >Cancelar
                                        </Button>
                                        {/* Save button */}
                                        <Button
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
                                        InputProps={{ readOnly: true }}
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
                                        >Cancelar
                                        </Button>
                                        {/* Update button */}
                                        <Button
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