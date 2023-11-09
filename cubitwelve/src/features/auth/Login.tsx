import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./Login.css"
import Paper from '@mui/material/Paper';
import Agent from '../../app/api/agent';
import { useContext, useState } from "react";
import { AuthContext } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const pwdRegex : RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,16}$/;
const emailRegex : RegExp = /^.+@[^\.].*\.[a-z]{2,}$/;

export default function SignUp() {
  const {authenticated,setAuthenticated} = useContext(AuthContext);
  const navigate = useNavigate();

  const [pwd, setPwd] = useState<string>('');
  const[email,setemail] = useState<string>('');
  
  const [emailError,setEmailError] = useState<boolean>(false);
  const [pwdError,setPwdError] = useState<boolean>(false);
  
  const emailErrorMsg:string = "El email es invalido";
  const pwdErrorMsg:string = "La contraseña es invalida";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const Email: string = data.get("email")?.toString() ?? "";
    const Password: string = data.get("password")?.toString() ?? "";
    sendData(Email, Password);
    };

    const handleFieldChange = (event:any) =>{
      const { name,value} = event.target;
      if (name === "email"){
        setemail(value);
        const isValid = emailRegex.test(value);
        setEmailError(!isValid)
      } else if (name === "password"){
        setPwd(value);
        const isValid = pwdRegex.test(value);
        setPwdError(!isValid)
      }
    }
    const sendData =(email: string, password: string) => {
        Agent.Auth.login({email, password})
        .then((data)=>{
          setAuthenticated(true);
          navigate("/")
        })
        .catch((err)=>{
          console.log(err);
        })
  };



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
            height:450,
            width: 500,
            mb:3,
            backgroundColor: '#F5F5F5',
            
         }}>
    
             <Typography component="h1" variant="h5" className='font-title' sx={{marginBottom:1, mt:3, fontSize:30}}>
               INICIAR SESIÓN
             </Typography>

        

            <Grid container spacing={1.1} justifyContent="flex-end" >
              <Grid item xs={12}>
                <TextField
                  required

                  id="email"
                  label="Correo electrónico"
                  name="email"
                  variant='filled'
                  value= {email}
                  onChange={handleFieldChange}
                  error={emailError}
                  helperText={emailError ? emailErrorMsg:""  }
                  autoComplete="email"
                  size='small'
                  InputLabelProps={{
                    sx: {
                      fontSize: '14px',
                      fontFamily: 'Raleway',
                    }
                }}
                sx={{
                    width:430,
                    ml:4,
                    mr:3,
                    mb:3,
                    boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                    
                }}
                />
              </Grid>
                    
              <Grid item xs={12}>
              
                <TextField
                  required
                  fullWidth
                  onChange={handleFieldChange}
                  error={pwdError}
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  helperText={pwdError ? pwdErrorMsg:""  }
                  autoComplete="password"
                  size='small'
                  variant='filled'
                  InputLabelProps={{
                    sx: {
                      fontSize: '14px',
                      fontFamily: 'Raleway',
                      
                      
                    }
                }}
                sx={{
                    width:430,
                    ml:4,
                    mr:3,
                    mb:1,
                    boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.2)', 
                    
                }}
                />
              </Grid>
                <Grid item>
                <Typography variant="body2" color="textPrimary" textAlign="right" >
                    ¿Eres nuev@?{' '}
                    <Link
                        marginRight={5}
                        href="/register"
                        color="primary"
                        underline="hover"
                        fontWeight="600"
                        style={{ color: '#edb84c' }}
                    >
                        Registrate
                    </Link>
                    </Typography>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    style={{ backgroundColor:'#1C478F',width:432,height:50}}
                    variant="contained"
                    sx={{ mt:3,mr:4.6, fontFamily: 'Raleway, sans-serif', fontSize: '20px', fontWeight: 300,textTransform: 'none'}}
                    
                  >
                  Ingresar
                  </Button>

                </Grid>
                <Grid item>
                  <Button
                    href="/"
                    type="submit"
                    style={{ backgroundColor:'#F5F5F5',width:432,border: '1px solid #1C478F',color:'#1C478F'}}
                    variant="contained"
                    sx={{ mt:1,mr:4.6, fontFamily: 'Raleway, sans-serif', fontSize: '20px', fontWeight: 300,textTransform: 'none'}}
                  >
                  Invitado
                  </Button>
                </Grid>
            </Grid>
        </Box>
      </Container>
    </ThemeProvider>
    </Paper>
  );

  
}