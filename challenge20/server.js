const express = require("express");
const app = express();
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const fs = require("fs");
var bodyParser = require('body-parser');

const db_name = path.join(__dirname, "bread.db");
const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'bread.db'");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use("/", express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  let result = [];
  let dataFilter = false;

  if (req.query.check_id && req.query.id) {
    result.push(`id = ${parseInt(req.query.id)}`);
    dataFilter = true;
  }
  if (req.query.check_string && req.query.string) {
    result.push(`string = '${req.query.string}'`);
    dataFilter = true;
  }
  if (req.query.check_integer && req.query.integer) {
    result.push(`integer = '${req.query.integer}'`)
    dataFilter = true;
  }
  if (req.query.check_float && req.query.float) {
    result.push(`float = '${req.query.float}'`);
    dataFilter = true;
  }
  if (req.query.startDate && req.query.endDate && req.query.check_date) {
    console.log('ini masuk');
    result.push(`date BETWEEN '${req.query.startDate}' AND '${req.query.endDate}'`);
    dataFilter = true;
  }
  if (req.query.check_boolean && req.query.boolean) {
    result.push(`boolean = '${req.query.boolean}'`);
    dataFilter = true;
  }
  let querySql = `SELECT COUNT (*) AS total FROM crud`;
  if (dataFilter == true) {
    querySql = querySql + ` WHERE ${result.join(' AND ')}`;
  }
  db.all(querySql, (err, count) => {
    if (err) throw err;
    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const total = count[0].total;
    // console.log(count)
    // console.log(`ini total = ${total}`);

    const pages = Math.ceil(total / limit);
    // console.log(`ini pages = ${pages}`)

    let sql = `SELECT * FROM crud`;
    if (dataFilter == true) {
      sql = sql + ` WHERE ${result.join(' AND ')}`
      // console.log(sql)
    }
    sql = sql + ` LIMIT ${limit} OFFSET ${offset}`;
    // console.log(sql);

    db.all(sql, (err, row) => {
      if (err) {
        return console.error(err.message);
      }
      res.render("index", {
        data: row,
        query: req.query,
        page,
        pages
      });
    });
  });
});

app.post('/add', (req, res) => {
  const { string, integer, float, date, boolean } = req.body;
  let sql = `INSERT INTO crud (string, integer, float, date, boolean)
              VALUES ('${string}', '${integer}', '${float}', '${date}', '${boolean}')`;
  db.run(sql, (err, ) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});

app.post('/edit', (req, res) => {
  const { string, integer, float, date, boolean, id } = req.body;
  let sqleditData = `UPDATE crud SET string = '${string}', integer = '${integer}', float = '${float}',
                    date = '${date}', boolean = '${boolean}'
                    WHERE id = '${id}';`
  console.log(sqleditData);
  db.run(sqleditData, (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
})

app.post('/hapus', (req, res) => {
  const id = req.body.id;
  let sqlDelete = `DELETE FROM crud WHERE id = ?`;
  db.run(sqlDelete, id, (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});



app.listen(8000, () => {
  console.log("Port ini berjalan di localhost:8000");
});