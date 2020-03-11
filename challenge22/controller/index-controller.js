const moment = require('moment');
const models = require('../models/models');
moment.locale('id');

// load data
const findAll = (req, res) => {
    // logic filter 
    let input = req.query;
    let querySearch = {}
    // logic filter
    if (input.check_string && input.searchString) {
        querySearch.string = input.searchString
    }
    if (input.check_integer && input.searchInteger) {
        querySearch.integer = input.searchInteger
    }
    if (input.check_float && input.searchFloat) {
        querySearch.float = input.searchFloat
    }
    if (input.check_date && input.startDate && input.endDate) {
        querySearch.date = {$gte: input.startDate, $lte: input.endDate}
    }
    if (input.check_boolean && input.boolean) {
        querySearch.boolean = input.boolean
    }

    // start logic for pagination 
    const currentPage = req.query.page || 1;
    const limit = 5;
    const offset = (currentPage - 1) * limit;
    const url = req.url === '/' ? '/?page=1' : req.url;

    models.find(querySearch, (err, data) => {
        let totalData = data.length
        models.find(querySearch, (err, data) => {
            if (err) res.json(err);

            res.json({
                result: data,
                url,
                currentPage,
                totalPage: Math.ceil(totalData / limit),
                query: req.query
            })
        }).skip(offset).limit(limit)
    })
}

//get data by one ID
const findOne = (req, res) => {
    models.findById(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.id
                });
            }
            res.json({
                result: data
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something wrong while creating the product."
            });
        });
}

//Create new Product
const create = (req, res) => {
    // Request validation
    if (!req.body) {
        return res.status(400).send({
            message: "Product content can not be empty"
        });
    }
    // Save Product in the database
    models.create(req.body)
        .then(post => {
            res.json(post);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something wrong while creating the product."
            });
        });
};

// Update a product
const update = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: "Product content can not be empty"
        });
    }
    // Find and update product with the request body
    models.findByIdAndUpdate(req.params.id, req.body)
        .then(post => {
            if (!post) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.id
                });
            }
            res.json(post);
        }).catch(err => {
            if (err === 'ObjectId') {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something wrong updating note with id " + req.params.id
            });
        });
};

// Delete a note with the specified noteId in the request
const deleteData = (req, res) => {
    models.findByIdAndRemove(req.params.id, req.body)
        .then(post => {
            if (!post) {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.id
                });
            }
            res.json(post);
        }).catch(err => {
            if (err === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Product not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete product with id " + req.params.id
            });
        });
};

module.exports = {
    findAll,
    findOne,
    create,
    update,
    deleteData
}