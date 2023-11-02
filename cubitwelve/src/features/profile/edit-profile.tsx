import { useRef, useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid, TextField, Select, Button, MenuItem, Box } from '@mui/material';
import axios from '../../app/api/agent';
import { Link } from 'react-router-dom';

const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,16}$/;
const editProfileURL = '/edit-profile';

const EditProfile = () => {
    const userRef = useRef();
    const errRef = useRef();

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

    useEffect(() => {
        setValidPwd(pwdRegex.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd]);

    return (
        <Grid container justifyContent='center' alignItems='center' style={{ height: '100vh' }}>
            <Paper elevation={3} style={{ padding: '16px', border: '1px solid #1C478F', borderRadius: '8px', width: 'fixed', height: 'fixed' }}>
                <Grid container>
                    <Grid item style={{ marginLeft: '5%', marginRight: '20%' }}>
                        <Typography 
                            variant='h5'
                            fontSize={38}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setTab('my-info')}
                        >Mis Datos
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant='h5'
                            fontSize={38}
                            style={{ cursor: 'pointer' }}
                            id='tab-password'
                            onClick={() => setTab('password')}
                        >Contraseña
                        </Typography>
                    </Grid>
                </Grid>
                {/* Info page */}
                {tab === 'my-info' && (
                    <form>
                        {/* Inputs */}
                        <Grid container spacing={4} sx={{ marginTop: '5px' }}>
                            {/* Name input */}
                            <Grid item xs={6}>
                                <label htmlFor='name' style={{ marginRight: '100%', fontSize: 18 }}>Nombre</label>
                                <TextField label='' variant='outlined' fullWidth />
                            </Grid>
                            {/* DNI input */}
                            <Grid item xs={6}>
                                <label htmlFor='name' style={{ marginRight: '100%', fontSize: 18 }}>RUT</label>
                                <TextField label='' variant='outlined' fullWidth InputProps={{ readOnly: true }} />
                            </Grid>
                            {/* First lastname input */}
                            <Grid item xs={6}>
                                <label htmlFor='name' style={{ marginRight: '100%', fontSize: 18 }}>Primer apellido</label>
                                <TextField label='' variant='outlined' fullWidth />
                            </Grid>
                            {/* Second lastname input */}
                            <Grid item xs={6}>
                                <label htmlFor='name' style={{ marginRight: '100%', fontSize: 18 }}>Segundo apellido</label>
                                <TextField label='' variant='outlined' fullWidth />
                            </Grid>
                            {/* Email input */}
                            <Grid item xs={12}>
                                <label htmlFor='name' style={{ marginRight: '100%', fontSize: 18 }}>Correo electrónico</label>
                                <TextField label='' variant='outlined' fullWidth InputProps={{ readOnly: true }} />
                                <span id='email-error' style={{ color: '#F44336' }}></span>
                            </Grid>
                            {/* Career input */}
                            <Grid item xs={12}>
                                <label htmlFor='name' style={{ marginRight: '100%', fontSize: 18 }}>Carrera</label>
                                <TextField label='' variant='outlined' fullWidth select>
                                <MenuItem value='career1'>Carrera 1</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        {/* Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '50px' }}>
                            <Button
                                variant='outlined'
                                color='secondary'
                                style={{ color: 'red', marginRight: '16px', transform: 'scale(1.05)', boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)' }}
                                id='cancel-info-button'
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant='contained'
                                color='warning'
                                style={{ transform: 'scale(1.05)', boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)' }}
                                id='save-button'
                            >
                                Guardar
                            </Button>
                        </Box>
                    </form>
                )}
                {/* Password page */}
                {tab === 'password' && (
                    <form style={{ marginTop: '16px' }} id='content-password'>
                        {/* Current password input */}
                        <Grid container spacing={6} sx={{ marginTop: '5px' }}>
                            <Grid item xs={12}>
                                <label htmlFor='password' style={{ marginRight: '100%', fontSize: 18 }}>Contraseña Actual</label>
                                <TextField label='' variant='outlined' fullWidth />
                                <span id='email-error' style={{ color: '#F44336' }}></span>
                            </Grid>
                            {/* New password input */}
                            <Grid item xs={12}>
                                <label htmlFor='name' style={{ marginRight: '100%', fontSize: 18 }}>Nueva Contraseña</label>
                                <TextField label='' variant='outlined' fullWidth />
                                <span id='email-error' style={{ color: '#F44336' }}></span>
                            </Grid>
                            {/* Confirm password input */}
                            <Grid item xs={12}>
                                <label htmlFor='name' style={{ marginRight: '100%', fontSize: 18 }}>Repetir Nueva Contraseña</label>
                                <TextField label='' variant='outlined' fullWidth />
                                <span id='email-error' style={{ color: '#F44336' }}></span>
                            </Grid>
                            
                        </Grid>
                        {/* Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '50px' }}>
                            <Button
                                variant='outlined'
                                color='secondary'
                                style={{ color: 'red', marginRight: '16px', transform: 'scale(1.05)', boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)' }}
                                id='cancel-info-button'
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant='contained'
                                color='warning'
                                style={{ transform: 'scale(1.05)', boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)' }}
                                id='save-button'
                            >
                                Actualizar
                            </Button>
                        </Box>
                    </form>
                )}
            </Paper>
        </Grid>
    );
};

export default EditProfile;
