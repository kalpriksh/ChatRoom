 $(document).ready(function(){
    console.log('Functionality Loaded');
    console.log('SocketIO Loaded');
    var socket = io('http://localhost:3000/')
    
    socket.on('news',async function (stuff) {
    
        console.log(stuff.data);
        console.log(stuff.tQuote);

        $("#quoteOfDay").val(stuff.tQuote);
    });

    //to display message to all
    socket.on('All', function(data){
        console.log(data.msg);
        $("#chat-field").append('<div class="chatbubble blue-bubble">'+data.msg+'</div>');
        $("#chat-field").append('<div class="space-bubble"></div>');
    });
    //textbox funtionality
    $("#input1").keydown(function(event){
        if(event.keyCode === 13)
        {
            event.preventDefault();
            socket.emit('myMsg',{msg:$("#input1").val()});
            $("#input1").val("");
            $("#input1").attr("placeholder", "Type a new message").val("");

            $('#input1').on('blur',function () { 
                var blurEl = $(this); 
                setTimeout(function() {
                    blurEl.focus()
                }, 10);
            });
            $('#chat-field').animate({scrollTop: $('#chat-field').prop("scrollHeight")}, 500);
        }    

    });

});