var fs = require('fs');
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var app = express();
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: '12345qwerty', key: 'sid'}));
app.use('/admin',express.static('admin'));
app.use('/client',express.static('client'));

//connect to db
var conString = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_app23023408:g45snehu57kfpam45uc3icn0a8@ds045907.mongolab.com:45907/heroku_app23023408';
var conOptions = {server: {auto_reconnect:true}};
console.log(conString);
var p_db = null;
MongoClient.connect(conString, conOptions, function(err, db){
    if(err){
	console.log(err);
    } else {
	console.log('Connected to DB!');
	p_db = db;
    }
});

app.get('/', function (request, response) {
    if(request.session.username){
	var content = fs.readFileSync('index.loggedin.html');
	var contentStr = content.toString();
	contentStr = contentStr.replace('@user@', request.session.username);
	contentStr = contentStr.replace('@sid@', request.session.sid);
	console.log(request.sessionID);
	response.send(contentStr);
    } else {
	var content = fs.readFileSync('index.html');
	response.send(content.toString());
    }
    console.log('Request processed');
});

app.post('/', function (request, response) {
    var username = request.body.email;
    var password = request.body.password;
    console.log('Username : ' + username);
    console.log('Password : ' + password);
    p_db.collection('users').findOne({email : username, password : password}, function(err, user){
        console.log(user);
		if(user){
			request.session.username = username;
			var content = fs.readFileSync('index.loggedin.html');
			var contentStr = content.toString();
			contentStr = contentStr.replace('@user@', request.session.username);
			contentStr = contentStr.replace('@sid@', request.session.sid);
			response.send(contentStr);
		} else {
			var content = fs.readFileSync('index.html');
			response.send(content.toString());
		}
    });
});

app.post('/cors/:id', function (request, response) {
    if(request.body){
		var tipdata = request.body.tipdata;
		console.log(request.body.tipdata);
		//var jscontent = fs.readFileSync('jmanual.client.template.js').toString();
		//check JSON validity
		//jscontent = jscontent.replace("@data@", request.body.tipdata);
		//fs.writeFileSync('client/js/jmanual.client.js', jscontent);
		var userId = request.params.id;
		p_db.collection('users').update({_id : ObjectID(userId)}, {$set: {jsondata:tipdata}}, function(err, result){
			console.log(result + " users updated.");
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
			response.send("[]");
			console.log('CORS POST Request processed');
		});
    }
});

var port = process.env.PORT || 5000;

app.listen(port, function(){
    console.log('Server started on port ' + port);
});
