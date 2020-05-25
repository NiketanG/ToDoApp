const { db } = require("../util/admin");

exports.loginUser = (req, res) => {
    const user = {
        email: req.body.email,
        name: req.body.name,
        image: req.body.image,
    }
    let userID = req.body.id
    const userRef = db.collection('users').doc(userID.toString())
    userRef.get()
        .then(doc => {
            if (doc.exists) {
                console.log(doc.id)
                return res.json({ user: "exists", userId: doc.id });
            } else {
                db.collection('users').doc(userID.toString()).set(user).then(doc => {
                    console.log(doc)
                    return res.json({ userId: userID });
                }).catch(err => {
                    console.log(err)
                    return res.status(500).json({ error: 'Something went wrong', code: err.code });
                })
            }
            return doc.data();
        }).catch(err => {
            console.log(err)
            return res.status(500).json({ error: 'Something went wrong', code: err.code });
        });
};

exports.getUser = (req, res) => {
    const userRef = db.collection('users').doc(req.user)

    userRef.get().then(doc => {
        return res.json({ user: doc.data() })
    }).catch(err => {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong', code: err.code });
    })
}