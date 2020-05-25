import React, { useEffect, useState } from 'react';

import axios from 'axios';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles';

import TodoCard from './TodoCard';
import CreateTodo from './createTodo';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    title: {
        margin: theme.spacing(2, 0, 2, 0),
    },
}));


const Todos = ({ todos }) => {
    const userToken = localStorage.getItem('token');

    const classes = useStyles();
    const [todolist, setTodoList] = useState([])
    const [dueTodos, setDueTodos] = useState([])
    const [today, setToday] = useState([])
    const [tommorrow, setTommorrow] = useState([])
    const [upcoming, setUpcoming] = useState([])

    useEffect(() => {
        async function fetchData() {
            const result = await axios.get('/api/todos', {
                headers: {
                    'auth-token': userToken
                }
            });
            setTodoList(result.data)
        }
        fetchData();
    }, [userToken]);

    useEffect(() => {
        setDueTodos(todolist.filter(todo => new Date(todo.dueDate).getDate() < new Date().getDate()))
        setToday(todolist.filter(todo => new Date(todo.dueDate).getDate() === new Date().getDate()))
        const tommorrowDate = new Date()
        tommorrowDate.setDate(tommorrowDate.getDate() + 1)
        setTommorrow(
            todolist.filter(todo =>
                new Date(todo.dueDate).getDate() === new Date(new Date().setDate(new Date().getDate() + 1)).getDate()
            )
        )
        setUpcoming(todolist.filter(todo =>
            new Date(todo.dueDate).getDate() > new Date(new Date().setDate(new Date().getDate() + 1)).getDate()
        ))
    }, [todolist])

    const deleteFromState = (id) => {
        setTodoList(todolist.filter(todo => todo.id !== id))
    }

    const updateTodo = (id, data) => {
        data.id = id
        setTodoList(todolist.map(el => (el.id === id ? data : el)));
    }

    const createTodo = (data) => {
        setTodoList([...todolist, data])
    }
    return (
        <div className={classes.root}>
            <CreateTodo createTodo={createTodo.bind(this)} />
            {

            }
            {dueTodos.length > 0 ?
                <div>
                    <Typography variant="h6" className={classes.title}>Due Todos</Typography>
                    <Grid container item xs={12} spacing={2}>
                        {dueTodos.map(todo =>
                            <TodoCard key={todo.id} TodoID={todo.id} time={new Date(todo.dueDate).toLocaleString()} title={todo.title} deleteFromState={deleteFromState.bind(this)} updateEdit={updateTodo.bind(this)} />
                        )}
                    </Grid >
                </div>
                : null
            }

            {today.length > 0 ?
                <div>
                    <Typography variant="h6" className={classes.title}>Today</Typography>
                    <Grid container item xs={12} spacing={2}>
                        {today.map(todo =>
                            <TodoCard key={todo.id} TodoID={todo.id} time={new Date(todo.dueDate).toLocaleString()} title={todo.title} deleteFromState={deleteFromState.bind(this, todo.id)} updateEdit={updateTodo.bind(this)} />
                        )}
                    </Grid >
                </div>
                : null
            }

            {tommorrow.length > 0 ?
                <div>
                    <Typography variant="h6" className={classes.title}>Tommorrow</Typography>
                    <Grid container item xs={12} spacing={2}>
                        {tommorrow.map(todo =>
                            <TodoCard key={todo.id} TodoID={todo.id} time={new Date(todo.dueDate).toLocaleString()} title={todo.title} deleteFromState={deleteFromState.bind(this, todo.id)} updateEdit={updateTodo.bind(this)} />
                        )}
                    </Grid >
                </div>
                : null
            }

            {upcoming.length > 0 ?
                <div>
                    <Typography variant="h6" className={classes.title}>Upcoming</Typography>
                    <Grid container item xs={12} spacing={2}>
                        {upcoming.map(todo =>
                            <TodoCard key={todo.id} TodoID={todo.id} time={new Date(todo.dueDate).toLocaleString()} title={todo.title} deleteFromState={deleteFromState.bind(this, todo.id)} updateEdit={updateTodo.bind(this)} />
                        )}
                    </Grid >
                </div>
                : null
            }
        </div>
    );
};

export default Todos;
