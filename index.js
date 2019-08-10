var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function(){
  console.log('listening on port 3000');
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('A user has connected '+ socket.id);
});
