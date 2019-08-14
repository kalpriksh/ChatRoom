//#region Code

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function(){
  console.log('listening on port 3000');
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
  
  //on connection log user has connected along with socket id
  console.log('A user has connected '+ socket.id);
  
  //on connection send object {data : Hello + socket ID}
  socket.emit('news',{data:'Hello '+socket.id });

  //when user disconnects
  socket.on('disconnect', function(){
    io.emit('user disconnected! '+socket.id)
  })

});


//#endregion