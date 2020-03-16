var path      = require('path');
var express   = require('express');
var sqlite3 = require('sqlite3').verbose();

var app    = express();
var router = express.Router();
var db     = new sqlite3.Database('log.db');

app.post('/textrandom/index.html', function(req, res){
  var resolvedPath = path.resolve('./src/textrandom/index.html')
  res.sendFile(resolvedPath);
});
app.post('/passtiles/index.html', function(req, res){
  var resolvedPath = path.resolve('./src/passtiles/index.html')
  res.sendFile(resolvedPath);
});
app.post('/airpass/index.html', function(req, res){
  var resolvedPath = path.resolve('./src/airpass/index.html')
  res.sendFile(resolvedPath);
});

app.use(express.urlencoded({extended: true}))

app.post('/logdata.php', function(req, res){
  var statement = "INSERT INTO log VALUES ($time, $system, $user, $scheme, $condition, $mode, $event, $data)"
  db.run(statement, {
    $time:   req.body.time,
    $system: req.body.system,
    $user:   req.body.user,
    $mode:   req.body.mode,
    $scheme: req.body.scheme,
    $condition: req.body.condition,
    $event:  req.body.event,
    $data: req.body.data
  })
  console.log(req.body)
  res.sendStatus(200);
});

app.use(router);
app.use(express.static('src'));

var port = 7006;
app.listen(port, () => {
  console.log("Listening on port " + port);
});

module.exports = app;
