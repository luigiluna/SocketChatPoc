const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);



server.listen(80);

app.use(express.static(path.join(__dirname, 'public')));
app.set( __dirname + '/views');
app.set('view engine', 'ejs');

app.get("/", (req,res)=>{
    res.render("index");

})

app.get("/A", (req,res)=>{
    res.render("index");

})

app.get("/B", (req,res)=>{
    res.render("index B");
   
})


let connectedUsers = [];

io.on('connection', (socket) => {
    console.log("Conexão detectada...");

    socket.on('join-request', (username) => {
        socket.username = username;
        connectedUsers.push( username );
        console.log( connectedUsers );

        socket.emit('user-ok', connectedUsers);
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        });
    });

    socket.on('join-request-recon', (username) => {
        socket.username = username;
        connectedUsers.push( username );
        console.log( connectedUsers );

        socket.emit('user-ok-recon', connectedUsers);
        socket.broadcast.emit('list-update-recon', {
            joined: username,
            list: connectedUsers
        });
        
    });

    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(u => u != socket.username);
        console.log(connectedUsers);

        socket.broadcast.emit('list-update-recon', {
            left: socket.username,
            list: connectedUsers
        });

    });

    socket.on('send-msg', (txt) => {
        let obj = {
            username: socket.username,
            message: txt
        };

        //socket.emit('show-msg', obj);
        socket.broadcast.emit('show-msg', obj);
    });


    socket.on('close', () => {
        connectedUsers = connectedUsers.filter(u => u != socket.username);
        console.log(connectedUsers);

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });

    });

    
});