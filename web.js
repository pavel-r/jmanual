var fs = require('fs');
var express = require('express');
var app = express();
app.use(express.logger());
app.use(express.bodyParser());
app.use('/templates',express.static('templates'));

app.get('/', function (request, response) {
	var content = fs.readFileSync('index.html');
	response.send(content.toString());
	console.log('Request processed');
});

app.get('/jmanual.admin.js', function (request, response) {
	var content = fs.readFileSync('jmanual.admin.js');
	response.send(content.toString());
	console.log('Request processed');
});

app.get('/jmanual.client.js', function (request, response) {
	var content = fs.readFileSync('jmanual.client.js');
	response.send(content.toString());
	console.log('Request processed');
});

app.post('/', function (request, response){
	console.log("Data: " + request.body.modelData);
	var jscontent = fs.readFileSync('jmanualClientTemplate.js').toString();
	//check JSON validity
	jscontent = jscontent.replace("@data@", request.body.modelData);
	fs.writeFileSync('jmanualClient.js', jscontent);
	var content = fs.readFileSync('index.html');
	response.send(content.toString());
});

var  server = app.listen(8080, function(){
	console.log('Server started');
});