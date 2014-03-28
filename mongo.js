var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://heroku_app23023408:g45snehu57kfpam45uc3icn0a8@ds045907.mongolab.com:45907/heroku_app23023408';
var mydb = null;
MongoClient.connect(url, function(err, db){mydb = db});
