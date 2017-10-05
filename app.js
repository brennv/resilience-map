var express = require('express'); 
var mongoose = require('mongoose'); 
var bodyParser = require('body-parser'); 
var logger = require('./logger');
var path = require("path");

require("dotenv").config();

// var db = mongoose.createConnection(process.env.MONGO_CONNECTION_STRING); 
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useMongoClient:true, promiseLibrary: global.Promise }); 


var app = express(); 
var Pushpin = require('./models/pushpinModel'); 

console.log(process.env.MONGO_CONNECTION_STRING); 

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));  
app.use(express.static("public"));

var pushpinRouter = require('./routes/pushpinRoutes')(Pushpin);
var geoJsonRouter = require('./routes/geoJsonRoutes')(Pushpin); 

app.use('/api/pushpins', pushpinRouter); 
app.use('/api/geojson', geoJsonRouter); 

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/" + "index.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("App is running on " + process.env.PORT)
});