import React, { useState } from 'react';
import 'date-fns';

import axios from 'axios';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import DateFnsUtils from '@date-io/date-fns'

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';


const useStyles = makeStyles((theme) => ({
    fab: {
        position: 'fixed',
        bottom: theme.spacing(3),
        right: theme.spacing(3),
    },
}));


const Transition = React.forwardRef(function Transition(props, ref) {
    // return <Slide direction="up" ref={ref} {...props} />;
    return <Zoom ref={ref} {...props} />
});

const CreateTodo = ({ createTodo }) => {

    const classes = useStyles();
    const theme = useTheme();

    const userToken = localStorage.getItem('token');

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [selectedDate, setSelectedDate] = React.useState(new Date(new Date().toISOString()));

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleClose = () => {
        setTitle("")
        setSelectedDate(new Date().toISOString())
        setOpen(false);
    }

    const addTodo = () => {
        const data = { title, dueDate: new Date(selectedDate).toISOString() }
        axios.post("/api/todos", data, {
            headers: {
                'auth-token': userToken
            },
        }).then(res => {
            createTodo(res.data)
        }).catch(err => {
            console.log(err.message)
        })
        handleClose();
    }

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <div>
            <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}>
                <DialogTitle id="form-dialog-title">Add a new ToDo</DialogTitle>
                <DialogContent>
                    <TextField autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(ev) => setTitle(ev.target.value)}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-between">
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Date picker dialog"
                                format="MM/dd/yyyy"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Time picker"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                            />
                        </Grid>
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={addTodo} variant="contained" color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Zoom
                key='addTodo'
                in={true}
                timeout={transitionDuration}
                style={{
                    transitionDelay: "500ms",
                }}
                unmountOnExit
            >
                <Fab aria-label="Add" className={classes.fab} color="primary" onClick={handleClickOpen}>

                    <AddIcon />
                </Fab>
            </Zoom>
        </div>
    )
}


export default CreateTodo;