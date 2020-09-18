const allConfigs = require('./.config.json');
const configs = allConfigs.production;

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = configs.chatPort || 3100;
const TCP_PORT = configs.tcpPort || 3101;
const REDIRECT_ADDRESS = configs.redirectServerAddress || 'localhost';

var net = require('net');

// var https = require('https');
var sender = require('http');


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

  const req = sender.request(
    {
      hostname: REDIRECT_ADDRESS,
      path: pathForSend,
      method: "POST",
    },
    (res) => {
      res.on("data", () => {
        // success
        console.log(`success POST to ${REDIRECT_ADDRESS}`);
      });
    }
  );

  req.on("error", (error) => {
    console.error(error);
  });

  req.end();
}

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
console.log('tcp data redirecting to ' + REDIRECT_ADDRESS);

/*
And connect with a tcp client from the command line using netcat, the *nix 
utility for reading and writing across tcp/udp network connections.  I've only 
used it for debugging myself.
$ netcat 127.0.0.1 1337
You should see:
> Echo tcpServer
*/