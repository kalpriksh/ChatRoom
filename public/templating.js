$(document).ready(function(){

    var chatbodyHeaderTemp = Handlebars.compile($("#chatbox-header-template").html());
    
    var chatbodyHeaderContent = {
        "chatting-with":"Kalpriksh"
    }

    $("#chatbox-header").html(chatbodyHeaderTemp(chatbodyHeaderContent))
    
    console.log("Reached here");
    

});