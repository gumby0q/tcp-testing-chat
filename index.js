var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 3100;
var TCP_PORT = process.env.TCP_PORT || 3101;
var net = require('net');

var https = require('https');


function sendData(data) {
	const regex1 = /\n/gm;
	const regex2 = /\r/gm;
	const regex3 = / /gm;

	const dataForInject = `/parsers/update/V1?value=${data}`
	const pathForSend = dataForInject.replace(regex1, '').replace(regex2, '').replace(regex3, '')

	// const pathForSend = "/parsers/update/V1?value=" + data
	console.log('typeof', typeof pathForSend)
	const json = JSON.stringify(pathForSend);
	console.log('pathForSend', pathForSend)
	console.log('json', json)

  const req = https.request(
    {
      hostname: "goride-timing-api.herokuapp.com",
      path: pathForSend,
      method: "POST",
    },
    (res) => {
      res.on("data", () => {
        // success
        console.log('success POST to goride-timing-api');
      });
    }
  );

  req.on("error", (error) => {
    console.error(error);
  });

  req.end();
}
// var bubSubDecorator = require('./bubSubDecorator');

// class CustomEventSystem {
// }

// const customEventSystem = new CustomEventSystem();
// bubSubDecorator(customEventSystem)
// var counter = 0;
// setInterval(() => {
// 	counter++
// 	sendData(counter);
// }, 50)

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
		sendData(data);
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