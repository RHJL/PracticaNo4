$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize varibles
  var $window = $(window);
var $tweets = $('.panel-body'); // Messages area
var $info = $('.info'); // Messages area
var $popu = $('.popu'); // Messages area
var $tablap = $('.tablap'); // Messages area
var $paginai = $('.pagina.inicial'); // pagina inical
var $pagina1 = $('.pagina1'); // pagina inical
var $pagina2 = $('.pagina2');
var $paginatabla = $('.paginabuses'); // pagina inical
var $botonp = $('.botonp0'); 
var $botonvt = $('.botonp1'); 
var $botonvet = $('.botonp2'); 
var $botonfac = $('.botonp11'); 
var $botonab = $('.botonab'); 
var $bus_nombre=$('.bus_nombre'); 
var $bus_tipo=$('.bus_tipo'); 
var $boton_eliminar = $('.botoneliminar'); 
var $boton_modificart = $('.botonmodificart');
var $boton_modificard = $('.botonmodificard');  
var $botonreservar = $('.botonreservar'); 
var $botonverfac = $('.botonverfac'); 
 
var $servidornom = $('.servidornom'); 


  var socket = io();
var usado=0;
var libre=0;
$botonp.on('click', function() {
socket.emit('Cerrar');
    $paginai.show();
      $pagina1.fadeOut();
$pagina2.fadeOut();
$paginatabla.fadeOut();
  });

$botonvt.on('click', function() {
socket.emit('Rutas');
$tweets.empty();
$info.empty();
$popu.empty();
    $paginai.fadeOut();
      $pagina1.show();
$pagina2.fadeOut();
$paginatabla.fadeOut();
  });

$botonvet.on('click', function() {
      $paginai.fadeOut();
      $pagina1.fadeOut();
$pagina2.fadeOut();
$paginatabla.show();
  });

$botonfac.on('click', function() {
      $paginai.fadeOut();
      $pagina1.fadeOut();
$paginatabla.fadeOut();
$pagina2.show();
  });


$botonab.on('click', function() {
var contenido={     
    nombre: $('#bus_info_nombre input').val(),
    tipo: $('#bus_info_tipo input').val(),
descripcion: $('#bus_info_des input').val(),
};
socket.emit('Nuevo_bus',contenido);
  });

$boton_eliminar.on('click', function() {
var contenido={     
    placa: $('#bus_placa_eliminar input').val(),
};
socket.emit('bus_eliminar',contenido);
  });

$boton_modificart.on('click', function() {
var contenido={     
    placa: $('#bus_placa_modificar input').val(),
    tipo:$('#bus_tipo_modificar input').val(),
};
socket.emit('bus_modificart',contenido);
  });

$boton_modificard.on('click', function() {
var contenido={     
    placa: $('#bus_placa_modificar input').val(),
    descripcion:$('#bus_des_modificar input').val(),
};
socket.emit('bus_modificard',contenido);
  });

$botonreservar.on('click', function() {
var contenido={     
    nombre: $('#cliente_info_nombre input').val(),
    nit:$('#cliente_info_nit input').val(),
ruta:$('#cliente_info_ruta input').val(),
viaje_inicial:$('#cliente_info_viaje_inicial input').val(),
viaje_final:$('#cliente_info_viaje_final input').val()
};
socket.emit('reservar',contenido);
  });


$(function () {
    $(document).ready(function () {
    });
});

function addtweet (data, options) {
    // Don't fade the message in if there is an 'X was typing'
var ncad=data.nombre+'@'+data.usuario;
    var $nombreDiv = $('<div class="chat-widget-name-left">')
      .text(ncad);
   var mcad=data.mensaje+'#'+data.categoria;
    var $messageBodyDiv = $('<div class="chat-widget-left">')
      .text(mcad);
$tweets.append($nombreDiv);
$tweets.append($messageBodyDiv);
  }

function addtweetElement (el, options) {
    var $el = $(el);
      $tweets.append($el);
    $tweets[0].scrollTop = $tweets[0].scrollHeight;
  }

socket.on('nuevaruta', function (data) {
var $nombrer=$('<td  class="Nombrer"/>')
      .text(data.nombre_ruta);
var $placabus=$('<td class="Bus"/>')
      .text(data.placa_bus);
var $viaje=$('<td class="viaje"/>')
      .text(data.viaje);
var $punto=$('<td class="punto"/>')
      .text(data.punto);
var $punto2=$('<td class="punto2"/>')
      .text(data.punto_siguiente);
var $distancia=$('<td class="distancia"/>')
      .text(data.distancia_kilometros);
var $rutafila = $('<tr class="Ruta"/>');
$rutafila.append($nombrer);
$rutafila.append($placabus);
$rutafila.append($viaje);
$rutafila.append($punto);
$rutafila.append($punto2);
$rutafila.append($distancia);
 $tablap.append($rutafila);
  }); 



socket.on('usuarionum', function (data) {
 var $numerou = $('<li class="Numerou"/>')
      .text('Numero de usuarios: '+data.numero);
 $info.append($numerou);
  }); 

socket.on('tweetsnum', function (data) {
 var $numerot = $('<li class="Numerot"/>')
      .text('Numero de tweets: '+data.numero);
 $info.append($numerot);
  }); 
socket.on('categorianum', function (data) {
 var $numeroc = $('<li class="Numeroc"/>')
      .text('Numero de categorias: '+data.numero);
 $info.append($numeroc);
  }); 
socket.on('usuariopopu', function (data) {
 var $usuariop = $('<li class="Usuariopopu"/>')
      .text('Usuario con más tweets : '+data.user);
 $popu.append($usuariop);
  }); 
socket.on('categoriapopu', function (data) {
 var $categoriap = $('<li class="Categoriapopu"/>')
      .text('Categoria con más tweets : '+data.cate);
 $popu.append($categoriap);
  }); 

socket.on('consulta1', function (data) {
addtweet(data);
socket.emit('respuesta');
  });
 
socket.on('reinicio', function (data) {
var contador=0;
$tweets.empty();
$info.empty();
$popu.empty();
socket.emit('Vertweets');
  });

socket.on('reiniciotabla', function (data) {
var contador=0;
socket.emit('Vertabla');
$tablap.empty();
  });

socket.on('reiniciografica', function (data) {
socket.emit('Vergrafica');
  });

socket.on('grafica', function (data) {
usado=data.usado;
libre=data.libre;
$servidornom.text('Servidor:'+data.server);
  });
}); 


