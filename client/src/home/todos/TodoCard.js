import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import axios from 'axios';

import UpdateDialog from './UpdateTodo';



const TodoCard = ({ TodoID, time, title, deleteFromState, updateEdit }) => {
    const userToken = localStorage.getItem('token');
    const [editOpen, setEditOpen] = useState(false);

    const deleteTodo = (id) => {
        deleteFromState(id);
        axios.delete(`/api/todo/${id}`, { headers: { 'auth-token': userToken } }).catch(err => {
            console.log(err);
        })
    };

    const closeDialog = () => {
        setEditOpen(false)
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card variant="outlined">
                <CardContent>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                        {time}
                    </Typography>
                    <Typography variant="h5" >
                        {title}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button color="primary" onClick={() => deleteTodo(TodoID)}>Mark as Done</Button>
                    <Button onClick={() => setEditOpen(true)}>Edit</Button>
                    <UpdateDialog todo={{ "id": TodoID, "time": time, "title": title }} isOpen={editOpen} closeEdit={closeDialog.bind(this)} updateEdit={updateEdit} />
                </CardActions>
            </Card>
        </Grid>
    )
}

export default TodoCard;