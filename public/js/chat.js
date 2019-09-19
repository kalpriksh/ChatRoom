$(document).ready(() => {

//getting username and location from URL
const { username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

// joining to a room
let socket = io();
let time =('' + new Date()).split(' ')[4].slice(0,this.length-3);

socket.emit('join',{username,room,time},(error) => {
   if(error)
    {
        alert(error);
        location.href = "/";
    }
});

// for UI
   const $sendbutton = $('#send-button');
   const $locationbutton = $('#location-button');
   const $userlist = $('#user-list');
   const $chatinput = $('#chat-input');
   const $chatspace = $('#chat-bubble-space');
   const $roomname = $('#room-name');

socket.on('welcome',(message)=>{
    console.log(message);
})

socket.on('serverchat',({username,room,time,isConnecting}) => {
    
    let message;

    if (isConnecting)
        message = username+' joined '+ room +'!';
    else
        message = username+' left '+ room +'!';

    console.log(message);
    let timestamp = username+' '+ time;
    console.log(timestamp);
    
    let newchatbubble = '<div class="chat-bubble-server text-right mt-2 ml-auto mr-auto"><div class="content text-center">'+message+'</div></div>';
    $chatspace.append(newchatbubble);
})

socket.on('allRoom',({ username, time, content }) => {
   
    let newchatbubble = '<div class="chat-bubble text-right mt-2 ml-2"><small class = "timestamp font-weight-lighter text-right">'+username+'      '+time+'</small><div class="content text-center">'+content+'</div></div>';
    $chatspace.append(newchatbubble);
    $chatspace.animate({scrollTop: $chatspace.prop("scrollHeight")}, 500);
})

socket.on('location',({username, time, content})=>{
    
    content = '<a href="'+content+'" target="_blank">'+content+'</a>';

    let newchatbubble = '<div class="chat-bubble text-right mt-2 ml-2"><small class = "timestamp font-weight-lighter text-right">'+username+'      '+time+'</small><div class="content text-center">'+content+'</div></div>';
    $chatspace.append(newchatbubble);
    $chatspace.animate({scrollTop: $chatspace.prop("scrollHeight")}, 500);
})

// to receive message given to all users
socket.on('all',({time,content})=>{
    let newchatbubble = '<div class="chat-bubble text-right mt-2 ml-2"><small class = "timestamp font-weight-lighter text-right">'+time+'</small><div class="content text-center">'+content+'</div></div>';
    $chatspace.append(newchatbubble);
    $chatspace.animate({scrollTop: $chatspace.prop("scrollHeight")}, 500);
})

// to get the room and users present in that room
socket.on('roomData',({ room, users }) => {
    $roomname.text(room);
    $userlist.html("");
    users.forEach(user => {
        let newUserName = '<p class="font-weight-normal">'+user.username+'</p>'
        $userlist.append(newUserName)
    });
    
})

// function to create a chat bubble
let sendMessage = ()=>{
    let time =('' + new Date()).split(' ')[4].slice(0,this.length-3);
    let content = $chatinput.val();

    socket.emit('messageRoom',{time,content});

    let newchatbubble = '<div class="chat-bubble-mine text-right mt-2 ml-auto"><small class = "timestamp font-weight-lighter text-right">'+username+'         '+time+'</small><div class="content text-center">'+content+'</div></div>';
    $chatspace.append(newchatbubble);

    $chatspace.animate({scrollTop: $chatspace.prop("scrollHeight")}, 500);
    
    $chatinput.val("");
            $chatinput.attr("placeholder", "Type a new message").val("");
            $chatinput.on('blur',function () { 
                var blurEl = $(this); 
                setTimeout(function() {
                    blurEl.focus()
                }, 10);
            });
 
}

// sending location on button click
$locationbutton.click(() =>{

    let time =('' + new Date()).split(' ')[4].slice(0,this.length-3);
    if(!navigator.geolocation){
        return alert('geolocation not supported')
    }

    $locationbutton.attr('disabled',true);

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            'latitude' : position.coords.latitude,
            'longitude' : position.coords.longitude,
            'time' : time
        },()=>{
            $locationbutton.attr('disabled',false);
            console.log('location shared');
        });
    });

    
}) 


    
// sending message on button click 
$sendbutton.click(sendMessage);
$chatinput.keydown((event)=>{
    if(event.keyCode === 13)
            sendMessage();
})


})