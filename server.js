/*to run, enter in command console: 
node server.js
*/
const http = require('http');
var fs = require("fs");
var express = require('express');
var app = new express();
var path = require('path');
var multer = require("multer");
const hostname = '127.0.0.1';
const port = 3000;

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname  +'/uploads');
    },
    filename: function (req, file, callback) {
        rand = Date.now().toString() + "-" +  file.originalname;
        callback(null,  rand);
    }
});
var upload = multer({ storage : storage})

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/uploadfile', upload.single('userFile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
    //res.end("File uploaded")
});

//static folders
express.static(__dirname);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function() {
    console.log("Server hosted at " + hostname + ":" +port)
});