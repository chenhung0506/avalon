var express = require('express');
var app = express();
var path = require("path");
var fs = require('fs');

env_path=''

console.log({path: __dirname +'../dev.env'});
try {
    if (fs.existsSync( __dirname +'/../dev.env')) {
        env_path='/../dev.env'
    } else if (fs.existsSync({path: __dirname +'/dev.env'})) {
        env_path='/dev.env'
    } else {
        console.log('dev.env not found')
    }
  } catch(err) {
    console.error(err)
}

require('dotenv').config({path: __dirname + env_path})
app.use(express.static(__dirname + '/view'));

app.post('/healthckeck', function (req, res) {
    res.json({ status: 200, message: "health", result: {} })
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/view/index.html'));
});

app.listen(process.env["PORT"]);
console.log('app is listening at localhost: '+process.env["PORT"]);