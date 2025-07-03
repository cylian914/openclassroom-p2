const Books = require("../dbHandler/book")
const fs = require('fs');

exports.books = (req, res, next) => {
    Books.find({}).then((data) => {
        res.status(200).send(data);
    })
}

exports.id = (req, res, next) => {
    Books.findById(req.params.id).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(404).json({ error: err })
    })
}

exports.bestrating = (req, res, next) => {
    Books.find({}).then((data) => {
        data.sort((adata, bdata) => {
            return bdata.averageRating - adata.averageRating;
        });
        res.status(200).send(data.splice(0, 3));
    })
}

function formatBooks(req) {
    reqBook = JSON.parse(req.body.book)
    pYear = parseInt(reqBook.year);
    if (isNaN(pYear)) {
        throw new Error("Invalid year");
    }
    return {
        ...reqBook,
        year: pYear,
        imageUrl: `${req.protocol}://${req.get('host')}/runtime/images/${req.file.filename}`
    };
}

exports.addBooks = (req, res, next) => {
    try {
        book = new Books({ ...formatBooks(req) });
        book.ratings = [{
            userId: reqBook.userId,
            grade: reqBook.ratings[0].grade
        }]
        book.averageRating = reqBook.ratings[0].grade //never belive the client.
        book.save().then(() => {
            res.status(201).json({ message: "file created" })
        }).catch((err) => {
            res.status(400).json({ message: err })
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.modifyBooks = (req, res, next) => {
    try {
        nBook = req.file ? { ...formatBooks(req) } : req.body;
        Books.findById(req.params.id).then((oBook) => {
            if (nBook.userId != oBook.userId)
                return res.status(401).json({ message: 'Not authorized' });
            Books.updateOne({ _id: req.params.id }, { ...nBook, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                .catch(err => res.status(401).json({ message: err }));
        })
    } catch (err) { return res.status(400).json({ message: err }) }
}

exports.deleteBooks = (req, res, next) => {
    Books.findById(req.params.id).then((d) => {
        if (d.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        } else {
            const filename = d.imageUrl.split('/runtime/images/')[1];
            fs.unlink(`${global.baseDir}/runtime/images/${filename}`, () => {
                Books.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                    .catch(err => res.status(401).json({ message: err }));
            })
        }
    })
        .catch(err => {
            res.status(500).json({ message: err });
        });
}

exports.rateBooks = (req, res, next) => {
    if (req.body.rating < 0 || req.body.rating > 5)
        return res.status(400).json({message: "invalid rating"})
    Books.findById(req.params.id).then((book) => {
        if (book.ratings.find((data) => data.userId === req.body.userId))
            return res.status(200).json(book);
        book.ratings.push({
            userId: req.body.userId,
            grade: req.body.rating
        })
        book.averageRating = (req.body.rating + book.averageRating)/2
        book.save().then(() => {
            res.status(200).json(book)
        })
    })
}