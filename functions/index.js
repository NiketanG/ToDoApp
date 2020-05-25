const functions = require('firebase-functions');
const app = require('express')();
const auth = require("./auth/auth");

const { getAllTodos, createTodo, deleteTodo, updateTodo } = require('./api/todos');

const { loginUser, getUser } = require("./api/users");

app.post('/api/login', loginUser);
app.get("/api/user", auth, getUser);

app.get("/api/todos", auth, getAllTodos);
app.post("/api/todos", auth, createTodo);
app.delete("/api/todo/:id", auth, deleteTodo);
app.put("/api/todo/:id", auth, updateTodo);

exports.app = functions.https.onRequest(app);
