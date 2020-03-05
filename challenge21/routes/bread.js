var express = require('express');
var router = express.Router();

module.exports = (pool) => {
/* GET home page. */
router.get('/', (req, res, next) => {
  pool.query('SELECT * from bread ORDER BY id ASC', (err, data) => {
    if(err) return res.send(err);
    res.json(data.rows);
  });
});

router.get('/:id', (req, res, next) => {
  pool.query('SELECT * from bread where id = $1 ',[req.params.id], (err, data) => {
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
  let id = req.params.id;
  const { string, integer, float, date, boolean } = req.body
  let sql = `UPDATE bread SET string = '${string}', integer = ${integer},
            float = '${float}', date = '${date}', boolean = ${boolean} WHERE id = ${id} `;
  console.log(sql)
  pool.query(sql, (err, data) => {
    if(err) return res.send(err);
    res.json(data);
  });
});

router.delete('/:id', (req, res, next) => {
  console.log(req.params)
  pool.query('DELETE FROM bread WHERE id = $1', [req.params.id], (err, data) => {
    // if(err) return res.send(err);
    if(err) return res.send(err)
    res.json(data);
  });
});


return router;
}