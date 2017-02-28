$(document).ready(function(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $('.arrow').css('display','initial');
    }
    var flag=false;
    var enConteo=false;
    var rotation=0;  
    var wsUri="ws://"+document.location.host+document.location.pathname+"rope"; 
    var websocket = new WebSocket(wsUri);
    //se inicializan los metodos principales del web socket
    websocket.onopen=function(evt){onOpen(evt);};
    websocket.onmessage=function(evt){onMessage(evt);};
    websocket.onerror=function(evt){onError(evt);};
    
    //Se envia el movimiento
    function send_move(dato){
        websocket.send(dato);   
    }
    
    //funciones para el ingreso de usuarios
    function onOpen(evt){

    }
    function onError(evt){
    }
    

    //funcion para mover la bola al recibir la informacion
    function onMessage(evt){
        aux=evt.data;
        if(aux==1){
            $('#playerText').html('Jugador Verde, Presione Espacio Para Moverse');
            return;
        }else if(aux==2){
            $('#playerText').html('Jugador Rojo, Presione Espacio Para Moverse\nEnter para comenzar');
            return;
        }else if(aux==3){
            $('#playerText').html('Ya hay dos jugadores en partida intente de nuevo mas tarde');
            $('#contador').hide();
            return;
        }
        if(aux==13 && !flag && !enConteo){
            conteo();
        }else if(aux!=116 && flag){
            mover(aux);
        }else if(aux==116){
            location.reload();
        }
    }
    
    $("body").keydown(function(e) {
        if(e.keyCode === 116) { //reload
            send_move(116);
        }
    });
    $("body").keyup(function(e) {
        if(e.keyCode === 32) {  //space - movimiento
            send_move(32);
        }
    });
    $("body").keyup(function(e) {
        if(e.keyCode === 13) {  //intro - conteo
            send_move(13);
        }
    });
    
    $('#rightButton').on("click touch",function () {
        send_move(39);
    });
    $('#leftButton').on("click touch",function () {
        send_move(37);
    });
    

    function mover(direccion){       
        if(direccion==39){
            $("#ball").offset({top: $("#ball").offset().top,left:$("#ball").offset().left+20});
            $("#ball").rotate({angle:rotation,animateTo:rotation+30});
            rotation+=30;
        }
        else if(direccion==37){
            $("#ball").offset({top: $("#ball").offset().top,left:$("#ball").offset().left-20});
            $("#ball").rotate({angle:rotation,animateTo:rotation-30});
            rotation-=30;
        }
        var position=$("#ball").css("left").substring(0,$("#ball").css("left").length-2);
        if( position>350){
            $("#rightBackground").css("background-color","rgba(189, 27, 46, 0.6)");
            $("#leftBackground").css("background-color","rgba(38, 128, 38, 0.3)");
        }
        else if( position<350){
            $("#leftBackground").css("background-color","rgba(38, 128, 38, 0.6)");
            $("#rightBackground").css("background-color","rgba(189, 27, 46, 0.3)");
        }
        else{
            $("#rightBackground").css("background-color","rgba(189, 27, 46, 0.3)");
            $("#leftBackground").css("background-color","rgba(38, 128, 38, 0.3)");
        }
        if($("#ball").offset().left<$("#left").offset().left-47){
            $("#marcadorL").html(parseInt($("#marcadorL").html())+1);
             $("#ball").css("left","350px");
             $("#leftBackground").css("background-color","rgba(38, 128, 38, 0.3)");
             flag=false;
             $("#contador").html(3); 
             $("#overlay").show();
        }
        if($("#ball").offset().left>$("#right").offset().left+15){
            $("#marcadorR").html(parseInt($("#marcadorR").html())+1);
            $("#ball").css("left","350px");
            $("#rightBackground").css("background-color","rgba(189, 27, 46, 0.3)");
            flag=false;
            $("#contador").html(3); 
            $("#overlay").show();
        }
    }
    function conteo(){
        var cont=3;
        enConteo=true;
        $("#contador").html(cont); 
        var atras = setInterval(function(){
            cont-=1 ;
            $("#contador").html(cont);           
            if(cont===0){
                $("#overlay").hide();
                flag=true;
                enConteo=false;
                clearInterval(atras);
            }
        }, 1000);
    }
});



