import React, { useState, useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';

import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import axios from 'axios';

import { Redirect } from 'react-router-dom';

import Account from './account';
import Todos from './todos'

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(0, 3, 3, 3),
    },

    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
    },
}));


const Home = (props) => {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    const [signedIn, setSignedIn] = useState(true);
    const [loading, setLoading] = useState(true); //true

    const userToken = localStorage.getItem('token');

    useEffect(() => {
        axios.get('/api/user', {
            headers: {
                'auth-token': userToken
            }
        }).then(res => {
            if (res.status === 200) {
                setSignedIn(true)
                setLoading(false)
            }
        }).catch(err => {
            setSignedIn(false)
            setLoading(false)
            console.log(err)
        });
    }, [userToken]);

    return (
        <div className={classes.root}>
            {signedIn ? null : <Redirect to="/login" />}

            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        ToDo App
                    </Typography>
                </Toolbar>
            </AppBar>

            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <Account />
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        <Account />
                    </Drawer>
                </Hidden>
            </nav>

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Todos />
            </main>

            <Backdrop className={classes.backdrop} open={loading} >
                <CircularProgress size={100} color="secondary" />
            </Backdrop>


        </div>
    );
};

export default Home;