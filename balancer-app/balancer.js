const express = require("express");
const request = require("request");
const app = express();
const PORT = 5000;
const envHosts = process.env.HOSTS;
// const hosts = envHosts ? envHosts.split(",") : ["http://127.0.0.1:8000"];
const hosts = envHosts.split(",");
let counter = 1;

app.use(express.urlencoded({ extended: true }));

app.get("*", (req, res) => {
  let targetHost = hosts[counter % hosts.length];
  let targetUrl = `${targetHost}${req.url}`;
  request(targetUrl, (err, response, body) => {
    res.send(body);
  });
  counter++;
});

app.post("*", (req, res) => {
  let targetHost = hosts[counter % hosts.length];
  let targetUrl = `${targetHost}${req.url}`;
  request.post(targetUrl, { form: req.body }, (err, response, body) => {
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Proxy app listening on ${PORT}!`);
});
