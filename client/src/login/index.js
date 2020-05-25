import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';
import { Redirect } from 'react-router-dom';

import { GoogleLogin } from 'react-google-login';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Login = () => {
    const classes = useStyles();
    const [error, setError] = useState(false);
    const [signedIn, setSignedIn] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false)

    const authSuccess = (res) => {
        setIsSigningIn(true)
        let data = {
            id: res.profileObj.googleId,
            email: res.profileObj.email,
            name: res.profileObj.name,
            image: res.profileObj.imageUrl,
        }
        const token = res.getAuthResponse().id_token
        axios.post('/api/login', data, {
            headers: {
                'auth-token': token
            }
        }).then(res => {
            if (res.status === 200) {
                localStorage.setItem('userId', res.data.userId)
                localStorage.setItem('token', token)
                setIsSigningIn(false)
                setSignedIn(true)
            }
        }).catch(err => {
            console.log(err)
            setError(true)
            setIsSigningIn(false)
        });

    };

    const authFailed = (res) => {
        setError(true)
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            {signedIn ? <Redirect to="/" /> : null}
            <Snackbar className={classes.root} open={error} autoHideDuration={6000}>
                <Alert severity="error">
                    Failed to Login using Google
                </Alert>
            </Snackbar>

            <div className={classes.wrapper}>
                <GoogleLogin
                    disabled={isSigningIn}
                    clientId="154178414758-q3ctvhgq39eaourf6c0btj4dod7v42c8.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={authSuccess}
                    onFailure={authFailed}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
                {isSigningIn && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
        </div>
    )
}

export default Login;