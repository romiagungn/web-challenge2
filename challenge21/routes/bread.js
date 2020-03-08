var express = require('express');
var router = express.Router();

module.exports = (pool) => {
    /* GET home page. */
    router.get('/', (req, res, next) => {
      let result = [];
      let sql = 'SELECT * from bread';
      let input = req.query;

      if (input.check_id && input.searchid) {
        result.push(`id=${input.searchid}`);
      }
      if (input.check_string && input.searchString) {
        result.push(`string='${input.searchString}'`);
      }
      if (input.check_integer && input.searchInteger){
        result.push(`integer=${input.searchInteger}`);
      }
      if(input.check_float && input.searchFloat) {
        result.push(`float='${input.searchFloat}'`)
      }
      if (input.startDate && input.endDate && input.check_date) {
        console.log('ini masuk');
        result.push(`date BETWEEN '${input.startDate}' AND '${input.endDate}'`);
      }
      if (input.check_boolean && input.boolean) {
        result.push(`boolean = '${input.boolean}'`);
      }
      if (result.length > 0) {
        sql += ` WHERE ${result.join(' AND ')}`
      }
      console.log(result)

      sql += ' order by id asc';
      console.log(sql);
      pool.query(sql, (err, data) => {
        if(err) return res.send(err);
        let result = data.rows.map(item => {
          return item
      });
      res.status(200).json({
        result,
        query: req.query
      })
    })
  })
            router.get('/:id', (req, res, next) => {
              pool.query('SELECT * from bread where id = $1 ', [req.params.id], (err, data) => {
                if (err) return res.send(err);
                res.json(data.rows);
              });
            });

            router.post('/', (req, res, next) => {
              console.log(req.body)
              pool.query(`INSERT INTO bread (string, integer, float, date, boolean) VALUES ($1, $2, $3, $4, $5)`,
                [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean], (err, data) => {
                  if (err) return res.send(err);
                  res.json(data);
                });
            });

            router.put('/:id', (req, res, next) => {
              pool.query(`UPDATE bread SET string = $2 , integer = $3 , float = $4, date = $5 , boolean = $6 WHERE id = $1`,
                [req.params.id, req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean], (err, data) => {
                  if (err) return res.send(err);
                  res.json(data);
                });
            });

            router.delete('/:id', (req, res, next) => {
              console.log(req.params)
              pool.query('DELETE FROM bread WHERE id = $1', [req.params.id], (err, data) => {
                // if(err) return res.send(err);
                if (err) return res.send(err)
                res.json(data);
              });
            });


            return router;
          }