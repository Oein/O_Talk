'use strict';
const io = require('socket.io').listen(50000);

var fs = require('fs');
var express = require("express");

var app = express();

app.get("/server" , (req , res) => {
    fs.readFile('./index.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});

app.get("/" , (req , res) => {
    fs.readFile('./get_into_server.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
});

app.listen(8080);

io.sockets.on('connection', socket => {

    socket.emit('connection', {
        type : 'connected'
    });

    socket.on('connection', data => {

        if(data.type === 'join') {

            socket.join(data.room);

            // depracated
            // socket.set('room', data.room);
            socket.room = data.room;

            socket.emit('system', {
                message : 'welcome to chat room ' + data.room
            });

            socket.broadcast.to(data.room).emit('system', {
                message : `${data.name} is connected`
            });
        }

    });

    socket.on('user', data => {

        // depracated
        // socket.get('room', (error, room) => {
        // });

        var room = socket.room;

        if(room) {
            socket.broadcast.to(room).emit('message', data);
        }
    });

});