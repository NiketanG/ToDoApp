import React, { useState, useEffect } from 'react';


import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { Redirect } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import axios from 'axios';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        zIndex: "0"
    },
    avatar: {
        height: 100,
        width: 100,
        flexShrink: 0,
        flexGrow: 0,
        marginTop: 20
    },
    toolbar: theme.mixins.toolbar,
    username: { fontSize: "20px" },
    email: {
        marginTop: theme.spacing(-2),
        color: theme.palette.text.secondary
    }
}));


const Account = () => {
    const [loggedOut, setLoggedOut] = useState(false)
    const classes = useStyles();
    const [name, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [imageURL, setImageURL] = useState("")

    const userToken = localStorage.getItem('token')

    useEffect(() => {


        axios.get('/api/user', {
            headers: {
                'auth-token': userToken
            }
        }).then(res => {
            if (res.status === 200) {
                setUsername(res.data.user.name)
                setEmail(res.data.user.email)
                setImageURL(res.data.user.image)
            }
        }).catch(err => {
            setLoggedOut(true)
            console.log(err)
        });
    }, [userToken]);

    const logout = () => {
        setLoggedOut(true)
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    return (
        <div className={classes.root}>
            {loggedOut ? <Redirect to="/login" /> : null}

            <div className={classes.toolbar} />
            <Divider />
            <center>
                <Avatar className={classes.avatar} src={imageURL} />
                <p className={classes.username}>{name}</p>
                <p className={classes.email}>{email}</p>
            </center>
            <Divider />
            <List>

                <GoogleLogout
                    clientId="154178414758-q3ctvhgq39eaourf6c0btj4dod7v42c8.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={logout}
                    render={renderProps => (
                        <ListItem button key="Logout"
                            disabled={renderProps.disabled}
                            onClick={renderProps.onClick}
                        >
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    )}
                >
                </GoogleLogout>
            </List>

        </div>
    );
};

export default Account;