var visitas = 0; //variable contador de visitas
//variable que contiene al servidor
var app = require('http').createServer(index), io = require('socket.io').listen(app) , fs = require('fs');
var pg = require('pg');
var conString = "postgres://postgres:123abc@localhost:5432/postgres";
var client = new pg.Client(conString);
client.connect();
app.listen(3000, function() {
console.log("Inicio de servicio!");
console.log("Conectados2> "+visitas);
});
//función que llamara a la página principal que el cliente podrá visualizar
function index(req, res){
fs.readFile(__dirname + '/index.html', function(err, data){
res.writeHead(200);
res.end(data);
console.log("Conectados> "+visitas);
});
};
// Iniciando Socket.IO
var visitas = 0;
// Evento que ocurre cuando se conecta un cliente
io.on('connection', function(socket){
// Incrementa la variable
visitas++;
var x=visitas+32
client.query("INSERT INTO playground (identificador,valor) VALUES ($1,'funciono');", [x]);
// Se emite la cantidad de visitas en la pagina principal
socket.emit('visits', visitas);
// Envia o total de visitas a todos los usuarios
socket.broadcast.emit('visits', visitas);
// Evento que ocurre cuando se desconecta un suario
socket.on('disconnect', function(){
visitas--;
// Atualiza el total de visitas.
socket.broadcast.emit('message', visitas);
});
});
