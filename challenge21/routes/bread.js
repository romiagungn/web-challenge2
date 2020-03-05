var express = require('express');
var router = express.Router();

module.exports = (pool) => {
/* GET home page. */
 router.get('/', (req, res, next) => {
  pool.query('SELECT * from bread', (err, data) => {
    if(err) return res.send(err);
    res.json(data.rows);
  });
});

router.post('/', (req, res, next) => {
  console.log(req.body)
  pool.query(`INSERT INTO bread (string, integer, float, date, boolean) VALUES ($1, $2, $3, $4, $5)`,
  [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean], (err, data) => {
    if(err) return res.send(err);
    res.json(data);
  });
});

router.put('/:id', (req, res, next) => {
  pool.query('UPDATE bread SET string = $1, integer = $2, float = $3, date = $4, boolean = $5 WHERE id = $6',
  [req.body.string, parseInt(req.body.integer), req.body.float, req.body.date, req.body.boolean, parseInt(req.params.id)], (err, data) => {
    if(err) return res.send(err);
    res.json(data);
  });
});

router.delete('/:id', (req, res, next) => {
  pool.query('DELETE FROM bread WHERE id = $1', [parseInt(req.params.id)], (err, data) => {
    // if(err) return res.send(err);
    if(err) return res.send(err)
    res.json(data);
  });
});


return router;
}