import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./Register.css"
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Agent from '../../app/api/agent';
import { useRef, useState, useEffect, useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpIcon from '@mui/icons-material/Help';
import { styled } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';











// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name: string = data.get("name")?.toString() ?? "";
    const FirstLastName: string = data.get("firstName")?.toString() ?? "";
    const SecondLastName: string = data.get("lastName")?.toString() ?? "";
    const RUT: string = data.get("rut")?.toString() ?? "";
    const CareerId: number = parseInt(data.get("career")?.toString() ?? "");
    const email: string = data.get("email")?.toString() ?? "";
    const Password: string = data.get("password")?.toString() ?? "";
    const RepeatedPassword: string = data.get("repeatPassword")?.toString() ?? "";

    
    
   
    sendData(name,FirstLastName, SecondLastName, RUT, CareerId, email, Password, RepeatedPassword);
    };


    const sendData =(name: string , firstLastName: string, secondLastName: string, rut: string, careerId: number, email: string, password: string, repeatedPassword: string) => {
        Agent.Auth.register({name,firstLastName,secondLastName,rut,email,careerId,password,repeatedPassword})
        .then(res => {
            Agent.token = res;
            localStorage.setItem("token", res);
            setAuthenticated(true);
            navigate("/");
        })
        .catch(err => console.log(err));
        

  };
  
  
  
    useEffect(() => {
        try{
            Agent.requests.get('Careers')
            .then(response => {
                setCareers(response.map((career: any) => career));
                })
                .catch(error => {
                    console.error('Error loading careers:', error);
                });
        }catch(error){
            console.error('Error loading careers:', error);
        }
    }, []);
    


    const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
      <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffffff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    }));  

  const rutRegex = /^\d{1,3}(?:\.\d{3})*(?:\-\d|k)$/i;
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,16}$/;
  const nameRegex = /^[a-zA-Z]{3,50}$/;
  const flNameRegex = /^[a-zA-Z]{3,30}$/;
  


  const [name, setName] = useState('');
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [rut, setRut] = useState('');
  const [validRut, setValidRut] = useState(false);
  const [rutFocus, setRutFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [career, setCareer] = useState('');
  const [careers, setCareers] = useState([]);

  useEffect(() => {
    setValidPwd(pwdRegex.test(pwd));
    setValidMatch(pwd === matchPwd);
}, [pwd, matchPwd])

useEffect(() => {
  setValidRut(rutRegex.test(rut));
}, [rut])

useEffect(() => {
  setValidName(nameRegex.test(name));
}, [name])

useEffect(() => {
  setValidFirstName(flNameRegex.test(firstName));
}, [firstName])

useEffect(() => {
  setValidLastName(flNameRegex.test(lastName));
}, [lastName])


  return (
    <Paper style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        justifyContent:"center", 
        alignItems:"center",
        display:"flex"
    }}>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md" sx={{display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',}}>
        <CssBaseline />
          
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3,
            border:"#000000",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow:'0px 4px 6px rgba(0, 0, 0, 0.5)', 
            height:'80%', //height: 575
            width: 450,
            mb:3,
            backgroundColor: '#F5F5F5',
            
         }}>
    
             <Typography component="h1" variant="h5" className='font-title' sx={{marginBottom:1, mt:3, fontSize:30}}>
               REGÍSTRATE
             </Typography>

        

            <Grid container spacing={1.1} justifyContent="flex-end" >
                <Grid item xs={12} >
                    <TextField

                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={validName ? "false" : "true"}
                    onFocus={() => setNameFocus(true)}
                    onBlur={() => setNameFocus(false)}
                    value={name}
                    error={!validName && nameFocus}

                    variant='filled'
                    id="name"
                    label="Nombre"
                    name="name"
                    required
                    autoComplete="name"
                    size='small'
                    InputLabelProps={{
                        sx: {
                          fontSize: '14px',
                          fontFamily: 'Raleway',
                          
                          
                        }
                    }}
                
                    sx={{
                        
                        width:402,
                        ml:3,
                        mr:3,
                        boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                        
                    }}
                    />
                </Grid>

                  
              <Grid item xs={12} md={6}>
                <TextField
                  onChange={(e) => setFirstName(e.target.value)}
                  aria-invalid={validFirstName ? "false" : "true"}
                  onFocus={() => setFirstNameFocus(true)}
                  onBlur={() => setFirstNameFocus(false)}
                  value={firstName}
                  error={!validFirstName && firstNameFocus}


                  autoComplete="given-name"
                  name="firstName"
                  required
                  variant='filled'
                  
                  id="firstName"
                  label="Primer Apellido"
                  
                  size='small'
                  InputLabelProps={{
                    sx: {
                      fontSize: '14px',
                      fontFamily: 'Raleway',
                      
                      
                    }
                }}
                  sx={{
                    ml:3,
                    boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  aria-invalid={validLastName ? "false" : "true"}
                  onFocus={() => setLastNameFocus(true)}
                  onBlur={() => setLastNameFocus(false)}
                  value={lastName}
                  error={!validLastName && lastNameFocus}

                  id="lastName"
                  variant='filled'
                  label="Segundo Apellido"
                  name="lastName"
                  autoComplete="family-name"
                  size='small'
                  InputLabelProps={{
                    sx: {
                      fontSize: '14px',
                      fontFamily: 'Raleway',
                      
                      
                    }
                }}
                  sx={{
                    mr:3,
                   
                    boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)',
                   
                  }}
                />
              </Grid>
              <Grid item xs={12} >
                
                    <TextField
                    required
                    onChange={(e) => setRut(e.target.value)}
                    aria-invalid={validRut ? "false" : "true"}
                    onFocus={() => setRutFocus(true)}
                    onBlur={() => setRutFocus(false)}
                    value={rut}
                    error={!validRut && rutFocus}

                    
                    
                    variant='filled'
                    id="rut"
                    label="RUT"
                    name="rut"
                    autoComplete="rut"
                    size='small'
                    InputLabelProps={{
                        sx: {
                          fontSize: '14px',
                          fontFamily: 'Raleway',
                          
                          
                        },
                        
                    }}
                    InputProps={{
                      endAdornment: (
                        <HtmlTooltip
                        title={
                          <React.Fragment>
                            <Typography sx={{fontFamily:'Raleway, cursive'}} color="inherit">RUT con puntos y guión</Typography>
                            <u>{'Ej:'}</u> <a>{'11.222.333-4'}</a>.{' '}
                          
                          </React.Fragment>
                        }
                      >
                        <IconButton>
                          <HelpIcon />
                        </IconButton>
                      </HtmlTooltip>
                      ),
                    }}
                    sx={{
                        width:402,
                        ml:3,
                        mr:3,
                        boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                        
                    }}
                    
                    />
                     
                </Grid>
              <Grid item xs={12}>
                <TextField
                  required

                  id="email"
                  label="Correo electrónico"
                  name="email"
                  variant='filled'
                  autoComplete="email"
                  size='small'
                  InputLabelProps={{
                    sx: {
                      fontSize: '14px',
                      fontFamily: 'Raleway',
                      
                      
                      
                    }
                }}
                sx={{
                    width:402,
                    ml:3,
                    mr:3,
                    boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                    
                }}
                />
              </Grid>
              <Grid item xs={12} >
                    <TextField

                    
                    required
                    
                    onChange={(e) => setCareer(e.target.value)}
                    value={career}
                    id="career"
                    select
                    label="Carrera"
                    name="career"
                    
                    size='small'
                    variant='filled'
                    InputLabelProps={{
                        sx: {
                          fontSize: '14px',
                          fontFamily: 'Raleway',
                          
                          
                        }
                    }}
                    sx={{
                        width:402,
                        ml:3,
                        boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                        
                    }}
                    >

                    {careers.map((career,index) => (
                    <MenuItem key={index} value={career['id']}>
                    {career['name']}
                    </MenuItem>
                    ))}
                    </TextField>
                    
                    
                </Grid>
                    
              <Grid item xs={12}>
              
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
                  size='small'
                  variant='filled'
                  InputLabelProps={{
                    sx: {
                      fontSize: '14px',
                      fontFamily: 'Raleway',
                      
                      
                    }
                }}
                sx={{
                    width:402,
                    ml:3,
                    boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                    
                }}
                
                />
                
                {pwdFocus && (
                    <FormHelperText id="pwdnote" className={!validPwd ? "instructions" : "offscreen"} sx={{
                      ml:3,
                    }}>
                      
                      <div>
                            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '5px' }}  />
                            Contraseña debe contener al menos 10 caracteres, una mayúscula y un número.      
                      </div>
                           
                    </FormHelperText>
)}
              </Grid>
              <Grid item xs={12}>
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
                    size='small'
                    variant='filled'
                    InputLabelProps={{
                        sx: {
                          fontSize: '14px',
                          fontFamily: 'Raleway',
                          
                          
                        }
                    }}
                    sx={{
                        width:402,
                        ml:3,
                        mb:1,
                        boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                        
                    }}
                    />
                </Grid>
                <Grid item>
                <Typography variant="body2" color="textPrimary" textAlign="right" >
                    ¿Ya tienes cuenta?{' '}
                    <Link
                        marginRight={3}
                        href="/login"
                        color="primary"
                        underline="hover"
                        fontWeight="600"
                        style={{ color: '#edb84c' }}
                    >
                        Inicia Sesión
                    </Link>
                    </Typography>
                </Grid>
              
            </Grid>
            <Button
              type="submit"
              style={{ backgroundColor: '#1C478F', width:'89%', height:50}}
              variant="contained"
              sx={{ mt: 2, mb: 2, fontFamily: 'Raleway, sans-serif', fontSize: '20px', fontWeight: 300,textTransform: 'none'}}
              disabled={!validPwd || !validMatch || !validRut || !validName || !validFirstName || !validLastName ? true : false}
            >
            Registrarme
            </Button>
            
        </Box>
          
     
        
      </Container>
    </ThemeProvider>
    </Paper>
  );

  
}