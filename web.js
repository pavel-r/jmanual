var fs = require('fs');
var express = require('express');
var https = require('https');
var http = require('http');
var app = express();

//common configuration
app.configure(function(){
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: '12345qwerty', key: 'sid'}));
});

var domain;
var clientMain;
var adminMain;

//development configuration
app.configure('development', function(){
	app.use('/app',express.static('widget'));
	domain = "//localhost:5000";
	clientMain = 'widget/client.main.dev.js';
	adminMain = 'widget/admin.main.dev.js';
});

//production configuration
app.configure('production', function(){
	app.use('/app',express.static('build'));
	domain = "//localhost:5000"; //ancient-gorge-2130.herokuapp.com"; //"//54.186.137.81:5000";
	clientMain = 'widget/client.main.js';
	adminMain = 'widget/admin.main.js';
});

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

//connect to db
var conString = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://heroku_app23023408:g45snehu57kfpam45uc3icn0a8@ds045907.mongolab.com:45907/heroku_app23023408';
var conOptions = {server: {auto_reconnect:true}};
console.log(conString);
var p_db;
MongoClient.connect(conString, conOptions, function(err, db){
    if(err){
	console.log(err);
    } else {
	console.log('Connected to DB!');
	p_db = db;
    }
});

//MAIN
//////////////////////////////////////////////////////////

app.get('/', function (request, response) {
	var content = fs.readFileSync('index.html');
	response.send(content.toString());
    console.log('Request processed');
});

app.get('/mypage', function (request, response) {
    if(request.session.username){
		var content = fs.readFileSync('mypage.html');
		var contentStr = content.toString();
		contentStr = contentStr.replace('@user@', request.session.username);
		contentStr = contentStr.replace('@sid@', request.sessionID);
		contentStr = contentStr.replace('@adminfile@', domain + "/" + request.session.userid + "/admin/main.js");
		contentStr = contentStr.replace('@clientfile@', domain + "/" + request.session.userid + "/client/main.js");
		response.send(contentStr);
    } else {
		response.redirect('../login');
    }
    console.log('Request processed');
});

app.get('/login', function(request, response){
	var content = fs.readFileSync('login.html');
	response.send(content.toString());
    console.log('Request processed');
});

app.post('/login', function (request, response) {
    var username = request.body.email;
    var password = request.body.password;
    console.log('Username : ' + username);
    console.log('Password : ' + password);
    p_db.collection('users').findOne({email : username, password : password}, function(err, user){
        console.log(user);
		if(user){
			request.session.username = username;
			request.session.userid = user._id;
			response.redirect('../mypage');
		} else {
			response.redirect('../login');
		}
    });
});

//API
//////////////////////////////////////////////////////////

app.get('/:userid/admin-app.js', function (request, response) {
	var userId = request.params.userid;
    p_db.collection('users').findOne({_id:ObjectID(userId)},function(err, user){
		if(!user) response.send("");
		var content = fs.readFileSync(adminMain);
		var contentStr = content.toString();
		contentStr = contentStr.replace('@userId@', userId);
		contentStr = contentStr.replace('@domain@', domain);
		response.send(contentStr);
		console.log('Request processed');
	});    
});

app.get('/:userid/client-app.js', function (request, response) {
	var userId = request.params.userid;
    p_db.collection('users').findOne({_id:ObjectID(userId)},function(err, user){
		if(!user) response.send("");
		var content = fs.readFileSync(clientMain);
		var contentStr = content.toString();
		contentStr = contentStr.replace('@userId@', userId);
		contentStr = contentStr.replace('@domain@', domain);
		response.send(contentStr);
		console.log('Request processed');
	});    
});

app.post('/cors/:id', function (request, response) {
    if(request.body){
		var tipdata = request.body.tipdata;
		console.log(request.body.tipdata);
		//fs.writeFileSync('client/js/jmanual.client.js', jscontent);
		var userId = request.params.id;
		p_db.collection('users').update({_id : ObjectID(userId)}, {$set: {jsondata:tipdata}}, function(err, result){
			console.log(result + " users updated.");
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.setHeader("Access-Control-Allow-Methods", "POST");
			response.send("[]");
			console.log('CORS POST Request processed');
		});
    }
});

app.get('/cors/:id', function (request, response) {
		var userId = request.params.id;
		p_db.collection('users').findOne({_id : ObjectID(userId)}, function(err, user){
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.setHeader("Access-Control-Allow-Methods", "GET");
			if(user){
				response.send(user.jsondata);
			} else {
				response.send("[]");
			}
			console.log('CORS GET Request processed');
		});
});

var port = process.env.PORT || 5000;
http.createServer(app).listen(port);

//To run https server
/*
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
https.createServer(credentials, app).listen(6000);

/*
app.listen(port, function(){
    console.log('Server started on port ' + port);
});
*/