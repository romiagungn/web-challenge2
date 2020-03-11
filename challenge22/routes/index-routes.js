const express = require('express');
const router = express.Router();
const dataController = require('../controller/index-controller')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/api', dataController.findAll)
router.get('/api/:id', dataController.findOne)
router.post('/api', dataController.create)
router.put('/api/:id', dataController.update)
router.delete('/api/:id', dataController.deleteData)

module.exports = router;