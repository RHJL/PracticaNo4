
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
if(result.rows.length!=0){
	id_tipo_bus=result.rows[0].id_tipo_bus;
client.query("INSERT INTO bus(placa,descripcion,id_tipo_bus) values($1, $2,$3)", [data.nombre,data.descripcion,id_tipo_bus]);
    }})
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

socket.on('Rutas',function (){
var encabezadojson={
nombre_ruta:'Nombre de la ruta',
placa_bus:'Placa del bus',
viaje:'Numero_viaje',
punto:'Punto de inicio',
punto_siguiente: 'Punto de destino',
distancia_kilometros:'Distancia en kilometros'
}
socket.emit('nuevaruta', encabezadojson);
var query = client.query("select distinct t.nombre_ruta,t.numero_punto, t.placa_bus, t.punto1 as punto,p.nombre as punto_siguiente,t.distancia_kilometro from  (select distinct rp.id_ruta,rp.numero_punto,rp.id_punto_siguiente,r.nombre as nombre_ruta, b.placa as placa_bus, p.nombre as punto1, rp.distancia_kilometro from ruta r,bus b,punto p, ruta_punto rp where rp.id_ruta=r.id_ruta and b.id_bus=r.id_bus and p.id_punto=rp.id_punto) t left join punto p on p.id_punto=t.id_punto_siguiente order by t.nombre_ruta;", function(err, result) {
if(result.rows.length!=0){
var contador=0;
while(contador<result.rows.length){
if(result.rows[contador].punto_siguiente==null){
var ps='Fin';
}
else {
ps=result.rows[contador].punto_siguiente;
}
var rutajson={
nombre_ruta:result.rows[contador].nombre_ruta,
placa_bus:result.rows[contador].placa_bus,
viaje:result.rows[contador].numero_punto,
punto:result.rows[contador].punto,
punto_siguiente: ps,
distancia_kilometros:result.rows[contador].distancia_kilometro
}
socket.emit('nuevaruta', rutajson);	
contador++;
}

 }
    })
});
socket.on('reservar',function (data){

var query = client.query("SELECT id_cliente FROM cliente where nit='"+data.nit+"';", function(err, result) {
if(result.rows.length!=0){
	var id_cliente=result.rows[0].id_cliente; 
console.log(id_cliente);
var query = client.query("SELECT r.id_ruta,r.costo_ruta_quetzales FROM ruta r where r.nombre='"+data.ruta+"';", function(err, result) {
if(result.rows.length!=0){
var id_ruta=result.rows[0].id_ruta;
var costo=result.rows[0].costo_ruta_quetzales;
console.log(id_ruta);
console.log(data.viaje_inicial);
var query = client.query("SELECT rp.id_ruta_punto FROM ruta_punto rp where rp.id_ruta="+id_ruta+" and rp.numero_punto="+data.viaje_inicial+";", function(err, result) {
if(result.rows.length!=0){
var id_ruta_punto1=result.rows[0].id_ruta_punto;
console.log(id_ruta_punto1);	
var query = client.query("SELECT rp.id_ruta_punto FROM ruta_punto rp where rp.id_ruta="+id_ruta+" and rp.numero_punto="+data.viaje_final+";", function(err, result) {
if(result.rows.length!=0){
var id_ruta_punto2=result.rows[0].id_ruta_punto;
console.log(id_ruta_punto2);
	var query = client.query("SELECT rp.id_ruta, sum(rp.distancia_kilometro) as total_distancia FROM ruta_punto rp where rp.id_ruta="+id_ruta+" and rp.numero_punto>="+data.viaje_inicial+" and rp.numero_punto<="+data.viaje_final+" group by rp.id_ruta;", function(err, result) {
if(result.rows.length!=0){
var total_distancia=result.rows[0].total_distancia;
var costo_total=costo*total_distancia;
client.query("INSERT INTO factura(costo,estado,fecha,id_ruta_punto_inicio,id_ruta_punto_fin,id_cliente) values($1, $2,$3,$4,$5,$6)", [costo_total,'sin cancelar','now()',id_ruta_punto1,id_ruta_punto2,id_cliente]);
    }})

    }})
    }})
    }})
	
}
else{
client.query("INSERT INTO cliente(nombre,nit) values($1, $2)", [data.nombre,data.nit]);
var query = client.query("SELECT id_cliente FROM cliente where nit='"+data.nit+"';", function(err, result) {
if(result.rows.length!=0){
	var id_cliente=result.rows[0].id_cliente; 
console.log(id_cliente);
var query = client.query("SELECT r.id_ruta,r.costo_ruta_quetzales FROM ruta r where r.nombre='"+data.ruta+"';", function(err, result) {
if(result.rows.length!=0){
var id_ruta=result.rows[0].id_ruta;
var costo=result.rows[0].costo_ruta_quetzales;
console.log(id_ruta);
var query = client.query("SELECT rp.id_ruta_punto FROM ruta_punto rp where rp.id_ruta="+id_ruta+" and rp.numero_punto="+data.viaje_inicial+";", function(err, result) {
if(result.rows.length!=0){
var id_ruta_punto1=result.rows[0].id_ruta_punto;
console.log(id_ruta_punto1);	
var query = client.query("SELECT rp.id_ruta_punto FROM ruta_punto rp where rp.id_ruta="+id_ruta+" and rp.numero_punto="+data.viaje_final+";", function(err, result) {
if(result.rows.length!=0){
var id_ruta_punto2=result.rows[0].id_ruta_punto;
	var query = client.query("SELECT rp.id_ruta, sum(rp.distancia_kilometro) as total_distancia FROM ruta_punto rp where rp.id_ruta="+id_ruta+" and rp.numero_punto>="+data.viaje_inicial+" and rp.numero_punto<="+data.viaje_final+" group by rp.id_ruta;", function(err, result) {
if(result.rows.length!=0){
var total_distancia=result.rows[0].total_distancia;
var costo_total=costo*total_distancia;
client.query("INSERT INTO factura(costo,estado,fecha,id_ruta_punto_inicio,id_ruta_punto_fin,id_cliente) values($1, $2,$3,$4,$5,$6)", [costo_total,'sin cancelar','now()',id_ruta_punto1,id_ruta_punto2,id_cliente]);
    }})

    }})
    }})
    }})
	
}

    })

}
    })
});

socket.on('cancelarfac',function (data){
var modificacion="UPDATE factura SET estado = 'cancelada' WHERE  id_factura= '"+data.numero+"';";
client.query(modificacion);
});

socket.on('ver_factuas',function (data){
var encabezadojson={
numero_factura:'Numero de la factura ',
nombre_cliente:'Nombre del cliente',
nombre_ruta:'Nombre de la ruta',
viaje:'Numero_viaje',
punto:'Punto de inicio',
punto_siguiente: 'Punto de destino',
distancia_kilometros:'Distancia en kilometros',
Costo:'Distancia en kilometros'
}
socket.emit('nuevaruta', encabezadojson);
var query = client.query("select distinct t.nombre_ruta,t.numero_punto, t.placa_bus, t.punto1 as punto,p.nombre as punto_siguiente,t.distancia_kilometro from  (select distinct rp.id_ruta,rp.numero_punto,rp.id_punto_siguiente,r.nombre as nombre_ruta, b.placa as placa_bus, p.nombre as punto1, rp.distancia_kilometro from ruta r,bus b,punto p, ruta_punto rp where rp.id_ruta=r.id_ruta and b.id_bus=r.id_bus and p.id_punto=rp.id_punto) t left join punto p on p.id_punto=t.id_punto_siguiente order by t.nombre_ruta;", function(err, result) {
if(result.rows.length!=0){
var contador=0;
while(contador<result.rows.length){
if(result.rows[contador].punto_siguiente==null){
var ps='Fin';
}
else {
ps=result.rows[contador].punto_siguiente;
}
var rutajson={
nombre_ruta:result.rows[contador].nombre_ruta,
placa_bus:result.rows[contador].placa_bus,
viaje:result.rows[contador].numero_punto,
punto:result.rows[contador].punto,
punto_siguiente: ps,
distancia_kilometros:result.rows[contador].distancia_kilometro
}
socket.emit('nuevaruta', rutajson);	
contador++;
}

 }
    })
});

  });
  
  
