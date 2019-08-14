$(document).ready(function(){

    console.log('JQuery Loaded');
    
    console.log('SocketIO Loaded');

    var socket = io('http://localhost:3000/')
    
    socket.on('news',async function (stuff) {
    
        console.log(stuff.data);
        socket.emit('printer',{ name:'user1' });

        //trying to chain events
        socket.on('printer', function (data) {
            console.log(data);
            $(".input1").val(data.data);
        });

    });

    


    console.log('Functionality Loaded');
    
    $(".input1").keydown(function(event){
    if(event.keyCode === 13)
    console.log("Enter Pressed");
    });

});