// const { faker } = require("@faker-js/faker");
const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "college",
  password: "54367bkasH@*",
});
uuidv4();
// let createRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.userName(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };
let port = 8080;
app.listen(port, () => {
  console.log(`App listening on port 8080`);
});

//total number of user
app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    connection.query(q, (err, results) => {
      if (err) {
        throw err;
      }
      let count = results[0]["count(*)"];
      res.render("show.ejs", { count });
    });
  } catch (err) {
    console.log("Error");
  }
});

//data table
app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      let users = result;
      res.render("data.ejs", { users });
    });
  } catch (err) {
    console.log("Error in DB");
  }
});

//edit from
app.get("/user/:id/edit?", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log("Error in DB");
  }
});

//Update route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: newPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = ${id}`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (newPass != user.password) {
        res.send("wrong password");
      } else {
        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = ${id}`;
        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            res.redirect("/user");
          });
        } catch (err) {
          console.log("Error in DB");
        }
      }
    });
  } catch (err) {
    console.log("Error in DB");
  }
});

//Add new user
app.get("/user/add", (req, res) => {
  res.render("add.ejs");
});
app.post("/user", (req, res) => {
  let id = uuidv4();
  let { username, email, password } = req.body;
  let q = `INSERT INTO user VALUES ('${id}',"${username}","${email}","${password}")`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
  } catch (err) {
    console.log("Error in DB");
  }
});

//Delete data
app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM user where id = ${id}`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    res.send("Error in Database");
  }
});
