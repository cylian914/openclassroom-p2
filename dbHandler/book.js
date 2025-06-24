const db = require('mongoose')

const Book = db.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    author: {type: String, required: true},
    imageUrl: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: String, required: true},
    ratings: [
        {
            userId: {type: String, required: true},
            grade: {type: Number, required: true},
        }
    ],
    averageRating: {type: Number, required: true},
})

module.exports = db.model('Books', Book);