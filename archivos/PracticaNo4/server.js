
  var express = require('express');
  var app = express();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  var port = process.env.PORT || 3000;
  var url=require('url');
var pg = require('pg');
var conString = "postgres://postgres:123abc@localhost:5432/practicano4";
var client = new pg.Client(conString);
client.connect();
  var ip = process.env.ip; 
var db_server  = process.env.DB_ENV || 'primary';
var vtb=false;
var vtabla=false;
var vgrafica=false;
var servidor='1';
var open = require('open');

  server.listen(port,ip, function () {
    
  });



  
  
  app.use('/js',  express.static(__dirname + '/public/js'));
  app.use('/css', express.static(__dirname + '/public/css'));
  app.use(express.static(__dirname + '/public'));
  
 


app.get('/base', function(req, res){

});




  io.on('connection', function (socket) {
function f() {


}
socket.on('Nuevo_bus',function (data){
var id_tipo_bus;
var query = client.query("SELECT id_tipo_bus FROM tipo_bus where nombre='"+data.tipo+"';", function(err, result) {
	id_tipo_bus=result.rows[0].id_tipo_bus;
client.query("INSERT INTO bus(placa,descripcion,id_tipo_bus) values($1, $2,$3)", [data.nombre,data.descripcion,id_tipo_bus]);
    })
});

socket.on('bus_eliminar',function (data){
var eliminacion="DELETE FROM bus WHERE placa='"+data.placa+"';"
client.query(eliminacion);
});

socket.on('bus_modificart',function (data){
var query = client.query("SELECT id_tipo_bus FROM tipo_bus where nombre='"+data.tipo+"';", function(err, result) {
if(result.rows.length!=0){
	id_tipo_bus=result.rows[0].id_tipo_bus;
var modificacion="UPDATE bus SET id_tipo_bus = "+id_tipo_bus+" WHERE placa = '"+data.placa+"';";
client.query(modificacion); }
    })
});

socket.on('bus_modificard',function (data){
var modificacion="UPDATE bus SET descripcion = '"+data.descripcion+"' WHERE placa = '"+data.placa+"';";
client.query(modificacion);
});

  });
  
  
