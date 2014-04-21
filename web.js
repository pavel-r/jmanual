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

//get all lessons for manual
app.get('/:userid/lessons', function(request, response) {
	console.log('Incoming get request for lessons');
	var userId = request.params.userid;
	p_db.collection('lessons').find({user_id : ObjectID(userId)}).toArray(function(err, lessons){
		response.setHeader("Access-Control-Allow-Origin", "*");
		//response.setHeader("Access-Control-Allow-Methods", "GET");
		response.send(lessons);
		console.log('Get request for lessons processed:' + lessons);
	});
});

app.get('/:userid/lessons/:id', function(request, response) {
	var userId = request.params.userid;
	var id = request.params.id;
	console.log('Incoming get request for lesson with id: ' + id);
	p_db.collection('lessons').findOne({_id: ObjectID(id), user_id : ObjectID(userId)}, function(err, lesson){
		response.setHeader("Access-Control-Allow-Origin", "*");
		//response.setHeader("Access-Control-Allow-Methods", "GET");
		response.send(lesson);
		console.log('Get request for lesson processed:' + lesson);
	});
});

//add lesson
app.post('/:userid/lessons', function(request, response) {
	var lesson = request.body;
	lesson.user_id = ObjectID(request.params.userid);
	console.log('Adding lesson: ' + JSON.stringify(lesson));
	p_db.collection('lessons').insert(lesson, function(err, result){
		console.log('Lesson added');
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.send('[]');
	});
});

//update lesson
app.put('/:userid/lessons/:id', function(request, response) {
	var id = request.params.id;
	var lesson = request.body;
	console.log('Updating lesson with id ' + id + ': ' + JSON.stringify(lesson));
	p_db.collection('lessons').update({_id : ObjectID(id)}, {$set: lesson}, function(err, result){
		console.log("Lesson updated " + result);
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.send("[]");
	});
});

//delete lesson
app.delete('/:userid/lessons/:id', function(request, response) {
	var id = request.params.id;
	console.log('Deleting lesson with id ' + id);
	p_db.collection('tips').remove({lesson_id : ObjectID(id)}, function(err, result){
		console.log(result + ' tips for lesson ' + id + ' deleted');
		p_db.collection('lessons').remove({_id: ObjectID(id)}, function(err, result){
			console.log('Lesson ' + id + ' deleted');
			response.setHeader("Access-Control-Allow-Origin", "*");
			//response.setHeader("Access-Control-Allow-Methods", "DELETE");
			response.send('[]');
		});
	});
});

//respond to a preflight CORS request
// check https://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing
app.options('/:userid/lessons/:id', function(request, response){
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	response.send('[]');
});
app.options('/:userid/lessons', function(request, response){
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	response.send('[]');
});

//get all tips for lesson
app.get('/:userid/tips', function (request, response) {
		var lesson_id = request.query.lesson_id;
		console.log('Getting all tips for lession: ' + lesson_id);
		p_db.collection('tips').find({lesson_id : ObjectID(lesson_id)}).toArray(function(err, tips){
			response.setHeader("Access-Control-Allow-Origin", "*");
			response.send(tips);
			console.log('Tips found: ' + JSON.stringify(tips));
		});
});

app.get('/:userid/tips/:id', function(request, response) {
	var id = request.params.id;
	console.log('Incoming get request for tip with id: ' + id);
	p_db.collection('tips').findOne({_id: ObjectID(id)}, function(err, tip){
		response.setHeader("Access-Control-Allow-Origin", "*");
		//response.setHeader("Access-Control-Allow-Methods", "GET");
		response.send(tip);
		console.log('Get request for tip processed:' + tip);
	});
});

//add tip
app.post('/:userid/tips', function(request, response) {
	var tip = request.body;
	tip.lesson_id = ObjectID(tip.lesson_id);
	console.log('Adding tip: ' + JSON.stringify(tip));
	p_db.collection('tips').insert(tip, function(err, result){
		console.log('Tip added');
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.send('[]');
	});
});

//update tip
app.put('/:userid/tips/:id', function (request, response) {
    var id = request.params.id;
	var tip = request.body;
	tip.lesson_id = ObjectID(tip.lesson_id);
	console.log('Updating tip with id ' + id + ': ' + JSON.stringify(tip));
	p_db.collection('tips').update({_id : ObjectID(id)}, {$set: tip}, function(err, result){
		console.log("Tip updated " + result);
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.send("[]");
	});
});

//delete tip
app.delete('/:userid/tips/:id', function(request, response) {
	var id = request.params.id;
	console.log('Deleting tip with id ' + id);
	p_db.collection('tips').remove({_id: ObjectID(id)}, function(err, result){
		response.setHeader("Access-Control-Allow-Origin", "*");
		//response.setHeader("Access-Control-Allow-Methods", "DELETE");
		response.send('[]');
	});
});

//respond to a preflight CORS request
// check https://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing
app.options('/:userid/tips/:id', function(request, response){
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	response.send('[]');
});
app.options('/:userid/tips', function(request, response){
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
	response.send('[]');
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