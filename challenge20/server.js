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
    const sql = "SELECT * FROM crud";
    db.all(sql, [], (err, db) => {
    if (err) {
    return console.error(err.message);
        }
        res.render("index", { data: db });
    });
});

app.post('/add',(req, res) => {
  let data = {
    id: req.body.id,
    string: req.body.string,
    integer: req.body.integer,
    float: req.body.float,
    date: req.body.date,
    boolean: req.body.boolean
  };
  let sql = "INSERT INTO crud (id, string, integer, float, date, boolean) VALUES (?,?,?,?,?,?)";
  let param = [data.id, data.string, data.integer, data.float, data.date, data.boolean];
  db.run(sql, param, (err,) => {
    if (err) {
    return console.error(err.message);
        }
        res.redirect('/');
    });
});

app.post('/edit', (req,res) => {
  // const data = {
  //   id: req.body.id,
  //   string: req.body.string,
  //   integer: req.body.integer,
  //   float: req.body.float,
  //   date: req.body.date,
  //   boolean: req.body.boolean
  // };

  // let sqleditData = `UPDATE crud SET string = ?, integer = ?, float = ?, date = ?, boolean = ? WHERE id = ?`;
  let sqleditData2 = "UPDATE crud SET  string '"+req.body.string+"' WHERE id = "+req.body.id;
  // let param = [data.string, data.integer, data.float, data.date, data.boolean, data.id];
      db.run(sqleditData2, (err) => {
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

