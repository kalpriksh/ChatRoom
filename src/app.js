const express = require('express');
const hbs = require('hbs');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const {addUser, removeUser, getUser, getUsersInRoom} = require('../src/utils/users');

const app = express();

app.use(express.static(path.join(__dirname,'../public')));

const server = http.createServer(app);
// socketio initialization
const io = socketio(server);


console.log('namaste');


// paths defined
const viewsPath = path.join(__dirname,'../templates/views');
const partialsPath = path.join(__dirname,'../templates/partials');

// setting views and partials
app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

app.get('/',(req,res) =>{
    res.render('join',{
        data:'working fine'
    })
});
app.get('/chat',(req,res) =>{
    res.render('chat',{
        data:'working fine'
    })
});

message = 'Welcome User!';
io.on('connection',(socket)=>{
    
    socket.emit('welcome',message);

    // joining a room 
    socket.on('join', ({username, room, time}, callback)  => {
        console.log(username);

        const {error,user} = addUser({id: socket.id, username, room});
        const isConnecting = true;

        if(error)
        {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('welcome','you have joined room:'+user.room);
        socket.broadcast.to(room).emit('serverchat',{username : user.username, room : user.room, time, isConnecting});
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();
    })

    socket.on('messageRoom',({ time, content }) => {
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('allRoom',{username:user.username, time, content});
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    });

    // sendlocation on button click
    socket.on('sendLocation',(position,callback) => {
        const user = getUser(socket.id);
        var message = 'http://google.com/maps?q='+position.latitude+"," +position.longitude;
        
        socket.broadcast.to(user.room).emit('location',{
            username:user.username,
            time:position.time,
            content:message
        });
        
        setTimeout(()=>{callback()},2000);
    })

    // user is typing 
    socket.on('isTyping',({userTyping})=>{
        const user = getUser(socket.id);
        socket.broadcast.to(user.room).emit('tempMessage',{ username : user.username, isTyping : userTyping });            
    })

    socket.on('disconnect',() => {
        const user = removeUser(socket.id);
        const isConnecting = false;

        if(user)
        {
            io.to(user.room).emit('roomData',{
                room:user.room,
                users: getUsersInRoom(user.room)
            })
            io.to(user.room).emit('serverchat',{ username: user.username, room: user.room ,time: user.time, isConnecting })
        }

    })
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
  console.log('server on port '+port);
  }
server.listen(port);

