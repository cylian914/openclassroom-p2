const encrypt = require('bcrypt')
const User = require('../dbHandler/user')
const tk = require('jsonwebtoken');


exports.signup = (req, res, next) => {
    encrypt.hash(req.body.password, 10).then((hash) => {
        newUser = new User({
            email: req.body.email,
            password: hash
        });
        newUser.save().then(() => {
            res.status(201)
        }).catch((err) => {
            res.status(400).json({ error: err })
        })
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (!user)
            return res.status(200).json({ message: "user incorect" })
        encrypt.compare(req.body.password, user.password).then(valid => {
            if (!valid)
                return res.status(200).json({ message: "Mdp incorect" })
            res.status(200).json({
                userId: user._id,
                token: tk.sign({ userId: user._id }, process.env.TokenKey, { expiresIn: '24h' })
            })
        }).catch((err) => {
            res.status(400).json({ error: err })
        })
    }).catch((err) => {
        res.status(400).json({ error: err })
    })
}