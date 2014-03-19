var fs = require('fs');
var express = require('express');
var app = express();
app.use(express.logger());
app.use(express.bodyParser());
app.use('/admin',express.static('admin'));
app.use('/client',express.static('client'));


app.get('/', function (request, response) {
    var content = fs.readFileSync('index.html');
    response.send(content.toString());
    console.log('Request processed');
});

app.get('/cors', function (request, response) {
    console.log('CORS GET Request processed');
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    response.send("");
});

app.post('/cors', function (request, response) {
    console.log('CORS POST Request processed');
    console.log(request.tipdata);
    conaole.log(request.data);
    if(request.body){
	console.log(request.body.tipdata);
    }
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    response.send("");
});

app.post('/', function (request, response){
    console.log("Data: " + request.body.modelData);
    var jscontent = fs.readFileSync('jmanual.client.template.js').toString();
    //check JSON validity
    jscontent = jscontent.replace("@data@", request.body.modelData);
    fs.writeFileSync('client/js/jmanual.client.js', jscontent);
    var content = fs.readFileSync('index.html');
    response.send(content.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function(){
    console.log('Server started');
});
