var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 3100;
var TCP_PORT = process.env.TCP_PORT || 3101;
var net = require('net');
// var bubSubDecorator = require('./bubSubDecorator');

// class CustomEventSystem {
// }

// const customEventSystem = new CustomEventSystem();
// bubSubDecorator(customEventSystem)

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(PORT, function(){
  console.log('listening on *:' + PORT);
});

var tcpServer = net.createServer(function(socket) {

	socket.setEncoding('utf8');

	socket.on('error', function(err) {
   		console.log(err);
	});

	socket.on('data', function(data) {
		console.log('tcp<-', data);
		io.emit('chat message', `message from tcp->${data}`);
		//socket.write(data); // test for client
	});
});

tcpServer.listen(TCP_PORT, '0.0.0.0');
console.log('tcp server listening on *:' + TCP_PORT);

/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo tcpServer
*/