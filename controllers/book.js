const Books = require("../dbHandler/book")

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
            return adata.averageRating - bdata.averageRating;
        });
        res.status(200).send(data.splice(0,2));
    })
}