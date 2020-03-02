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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/", express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
    let result = [];
    let dataFilter = false;

    // if (req.query.check_id && req.query.id) {
    //   console.log('id masuk');
    //   result.push(`id = ${parseInt(req.query.id)}`);
    //   dataFilter = true;
    // }
    if (req.query.check_string && req.query.string) {
      console.log('string masuk');
      result.push(`string = '${req.query.string}'`);
      dataFilter = true;
    }

    let sql2 = `SELECT * FROM crud`;
    if(dataFilter == true) {
      sql2 = sql2 + ` WHERE ${result.join(' AND ')}`
      console.log(sql2)
    }
    db.all(sql2, (err, row) => {
    if (err) {
    return console.error(err.message);
        }
        res.render("index", { data: row, query: req.query });
    });
});

app.post('/add',(req, res) => {
  const { string, integer, float, date, boolean } = req.body;
  let sql = `INSERT INTO crud (string, integer, float, date, boolean)
              VALUES ('${string}', '${integer}', '${float}', '${date}', '${boolean}')`;
  db.run(sql, (err,) => {
    if (err) {
    return console.error(err.message);
        }
        res.redirect('/');
    });
});

app.post('/edit', (req,res) => {
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

app.post('/hapus',(req, res) => {
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

