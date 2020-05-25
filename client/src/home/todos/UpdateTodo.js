import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import 'date-fns';

import DateFnsUtils from '@date-io/date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    // return <Slide direction="up" ref={ref} {...props} />;
    return <Zoom ref={ref} {...props} />
});

const UpdateDialog = ({ isOpen, todo, closeEdit, updateEdit }) => {
    const userToken = localStorage.getItem('token');
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [todoDate, setTodoDate] = useState(todo.time);

    const handleDateChange = (date) => {
        setTodoDate(date);
    };

    const handleClose = () => {
        setOpen(false);
        closeEdit()
    }

    const editTodo = () => {
        const data = { title: title, dueDate: new Date(todoDate).toISOString() }

        axios.put(`/api/todo/${todo.id}`, data, { headers: { 'auth-token': userToken } }).then(res => {
            updateEdit(todo.id, data)
        }).catch(err => {
            console.log(err)
        })

        handleClose();

    }

    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

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
                                value={todoDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Time picker"
                                value={todoDate}
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
                    <Button onClick={editTodo} variant="contained" color="primary">
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default UpdateDialog;