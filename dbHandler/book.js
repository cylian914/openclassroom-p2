const db = require('mongoose')

const Book = db.Schema({
    userid: {type: String, required: true},
    title: {type: String, required: true},
    author: {type: String, required: true},
    imageUrl: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: String, required: true},
    rating: [
        {
            userId: {type: String, required: true},
            grade: {type: Number, required: true},
        }
    ],
    averageRating: {type: Number, required: true},
})

module.exports = db.model('Books', Book);