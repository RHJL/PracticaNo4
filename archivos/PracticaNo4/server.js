
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
      console.log(result.rows[0].id_tipo_bus);
	id_tipo_bus=result.rows[0].id_tipo_bus;
console.log(id_tipo_bus);
client.query("INSERT INTO bus(placa,descripcion,id_tipo_bus) values($1, $2,$3)", [data.nombre,data.descripcion,id_tipo_bus]);
    })
});

  });
  
  
