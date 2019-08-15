$(document).ready(function(){

    console.log('JQuery Loaded');
    
    console.log('SocketIO Loaded');

    var socket = io('http://localhost:3000/')
    
    socket.on('news',async function (stuff) {
    
        console.log(stuff.data);
        console.log(stuff.tQuote);

        $("#quoteOfDay").val(stuff.tQuote);
    });

    socket.on('All', function(data){
        console.log(data.msg);
        $("#chatbox").append('<div class="chatbubble right-bubble">'+data.msg+'</div>');
        $("#chatbox").append('<div class="space-bubble"></div>');
    });
    
    console.log('Functionality Loaded');
    
    $("#input1").keydown(function(event){
        if(event.keyCode === 13)
        {
            event.preventDefault();
            socket.emit('myMsg',{msg:$("#input1").val()});
            $("#input1").val("");
            $("#input1").attr("placeholder", "Type a new message").val("").focus().blur();
        }    

    });

    $("#input2").keydown(function(event){
        if(event.keyCode === 13)
            {
                event.preventDefault();
                socket.emit('private message',{msg:$("#input2").val()});
                $("#input2").val("");
                $("#input2").attr("placeholder", "Type a new private message").val("").focus().blur();
            }    
    
        });

});