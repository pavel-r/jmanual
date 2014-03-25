var fs = require('fs');
var express = require('express');
var mongo = require('mongodb');
var app = express();
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: '12345qwerty', key: 'sid'}));
app.use('/admin',express.static('admin'));
app.use('/client',express.static('client'));

//connect to db
var conString = process.env.MONGOLAB_URI || 'mongodb://localhost/mydb';
var db = mongo.Db.connect(conString);

var authFunc = function(email, password){
    var user = db.users.find({ email : email, password : password});
    console.log(user);
    if(user){
	return true;
    } else {
	return false;
    }
};

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
    if(authFunc(username,password)){
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
    console.log('Request processed');
});

app.post('/cors', function (request, response) {
    console.log('CORS POST Request processed');
    if(request.body){
	console.log(request.body.tipdata);
	var jscontent = fs.readFileSync('jmanual.client.template.js').toString();
	//check JSON validity
	jscontent = jscontent.replace("@data@", request.body.tipdata);
	fs.writeFileSync('client/js/jmanual.client.js', jscontent);
    }
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    response.send("[]");
});

var port = process.env.PORT || 5000;
app.listen(port, function(){
    console.log('Server started');
});
