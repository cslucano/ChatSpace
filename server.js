var express = require('express'),
	swig    = require('swig'),
	cons    = require('consolidate'),
	fs      = require('fs'),
	uuid    = require('node-uuid');

var env = "dev";

var app      = express(),
	baseData = fs.readFileSync('./base-data.json').toString(),
	server   = require('http').createServer(app),
	io       = require('socket.io').listen(server);

var data = JSON.parse(baseData);

swig.init({
	cache : false
});

// View engine
app.engine('.html', cons.swig);
app.set('view engine', 'html');
app.set('views', './app/views');

// Add POST, PUT, DELETE methods to the app
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());

// Static files
app.use( express.static('./public') );

// Routes
app.get('/articles', function(req, res){
	res.send(data);
});

app.post('/articles', function (req, res){
	req.body.id = uuid.v1();
	req.body.votes = 0;
	req.body.image = "/imagenes/img6.jpg";

	data.push(req.body);

	io.sockets.emit('articles::create', req.body);

	res.send(200, {status:"Ok", id: req.body.id});
});

app.put('/articles/', function (req, res){
	var article;

	for (var i = data.length - 1; i >= 0; i--) {
		article = data[i];

		if(article.id === req.body.id){
			data[i] = req.body;
		}
	}

	io.sockets.emit('articles::update', req.body);

	res.send(200, {status:"Ok"});
});

var home = function (req, res) {
	res.render('index',{
		posts : data,
		env   : env
	});
};

app.get('/', home);
app.get('/article/:id', home);

var port = Number(process.env.PORT || 5000);
server.listen(port)