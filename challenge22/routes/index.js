var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'ASEP BAUD SEDUNIA AJA',
    gelar: 'RAJA DARI SEMUA BETON',
    nama: 'ASEP BETON',
    saudara: 'SAUDARA JAUH DARI ASEP BAUD'
  });
});

module.exports = router;
