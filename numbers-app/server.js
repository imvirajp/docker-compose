const express = require("express");
const app = express();
const PORT = 8000;

const { Client } = require("pg");
const client = new Client(process.env.DATABASE_URL);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(
    `<form method="post" action="/number"><input type="text" name="number"><button type="submit">Submit</button></form>`
  );
});

app.get("/numbers", (req, res) => {
  client.query("SELECT numbers from numbers;", null, (err, result) => {
    if (err) {
      res.status(500);
      res.send(err.message);
      return;
    }
    res.json({ numbers: result.rows });
  });
});

app.post("/number", (req, res) => {
  client.query(
    `INSERT INTO numbers(numbers) VALUES(${req.body.number});`,
    null,
    (err, number) => {
      if (err) {
        res.status(500);
        res.end();
      } else {
        res.status(201);
        res.end();
      }
    }
  );
});

client
  .connect()
  .then(function() {
    client.query(
      "CREATE TABLE IF NOT EXISTS numbers(numbers integer);",
      (err, result) => {
        if (err) {
          console.log(`Error occur while creating table ${err.message}`);
        } else {
          app.listen(PORT, () => {
            console.log(`Numbers app listening on ${PORT}`);
          });
        }
      }
    );
  })
  .catch(function(err) {
    console.log(err);
  });
