const db = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');


const User = db.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
})

User.plugin(uniqueValidator);

module.exports = db.model('User', User);