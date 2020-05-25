const { db, admin } = require('../util/admin');


exports.getAllTodos = (req, res) => {
    db
        .collection('todos')
        .where('userId', '==', req.user)
        .orderBy('dueDate')
        .get()
        .then((data) => {
            let todos = [];
            data.forEach((doc) => {
                todos.push({
                    id: doc.id,
                    title: doc.data().title,
                    priority: doc.data().priority,
                    completed: doc.data().completed,
                    dueDate: doc.data().dueDate.toDate()
                });
            });
            return res.json(todos);
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({ error: err.code });
        });
};

exports.createTodo = (req, res) => {
    if (req.body.title.trim() === '') {
        return res.status(400).json({ title: 'Must not be empty' });
    }
    if (!req.body.dueDate) {
        return res.status(400).json({ dueDate: 'Must not be empty' });
    }
    const todo = {
        userId: req.user,
        title: req.body.title,
        completed: false,
        dueDate: admin.firestore.Timestamp.fromDate(new Date(req.body.dueDate)),
        // req.body.dueDate,
        priority: (req.body.priority || 'low')
    }

    db
        .collection('todos')
        .add(todo)
        .then((doc) => {
            const responseTodo = todo;
            responseTodo.id = doc.id;
            responseTodo.dueDate = responseTodo.dueDate.toDate()
            return res.json(responseTodo);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: 'Something went wrong', code: err.code });
        });
};

exports.deleteTodo = (req, res) => {

    if (!req.params.id) {
        return res.status(400).json({ error: 'ID not specified' });
    }

    const document = db.doc(`/todos/${req.params.id}`);
    document.get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(400).json({ error: 'Todo not found' });
            }
            if (doc.data().userId !== req.user) {
                return res.status(403).json({ error: "Unauthorized" })
            }
            return document.delete();
        })
        .then(() => {
            return res.json({ message: 'Deleted' });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.updateTodo = (req, res) => {
    if (req.body.id) {
        return res.status(403).json({ message: 'Not allowed to edit' })
    }
    let document = db.collection('todos').doc(`${req.params.id}`);
    document.get().then(doc => {
        if (!doc.exists) {
            return res.status(400).json({ error: 'Todo not found' });
        }
        if (doc.data().userId !== req.user) {
            return res.status(403).json({ error: "Unauthorized" })
        }
        return doc.data();
    }).catch(err => {
        console.log(err)
        return res.status(400).send({ error: err.code });
    })

    const data = {
        title: req.body.title,
        dueDate: admin.firestore.Timestamp.fromDate(new Date(req.body.dueDate))
    }
    document.update(data)
        .then(() => {
            return res.json({ message: 'Updated' });
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).send({ error: err.code });
        });
};