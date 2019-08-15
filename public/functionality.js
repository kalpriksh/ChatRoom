$(document).ready(function(){

    console.log('JQuery Loaded');
    
    console.log('SocketIO Loaded');

    var socket = io('http://localhost:3000/')
    
    socket.on('news',async function (stuff) {
    
        console.log(stuff.data);
        console.log(stuff.tQuote);

        $("#quoteOfDay").val(stuff.tQuote);
            
        
    });
    
    console.log('Functionality Loaded');
    
    $(".input1").keydown(function(event){
    if(event.keyCode === 13)
    console.log("Enter Pressed");
    });

});