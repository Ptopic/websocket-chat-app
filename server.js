const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require('./messages');
const { userJoin, getCurrentUser } = require('./users');

let connectedUsers = 0;
let allTimeUsers = 0;


const botName = 'Bot';

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({username}) => {
        const user = userJoin(socket.id, username);
        
        socket.join(user);


        socket.emit('send-message', formatMessage(botName, 'Welcome to chat'));
        connectedUsers++;
        allTimeUsers++;
        socket.emit('changeStats', connectedUsers, allTimeUsers);
        socket.broadcast.emit('changeStats', connectedUsers, allTimeUsers);
    
        // Broadcast when server connects
        socket.broadcast.emit('send-message', formatMessage(botName, `${user.username} joined chat`));
    
        // Runs when client disconnects
        socket.on('disconnect', () => {
            io.emit('send-message', formatMessage(botName, `${user.username} has left the chat`));
            connectedUsers--;
            socket.emit('changeStats', connectedUsers, allTimeUsers);
            socket.broadcast.emit('changeStats', connectedUsers, allTimeUsers);
        });
    });

    // Catch chatMessage
    socket.on('send-message', msg => {
        const user = getCurrentUser(socket.id);

        // Emmit entered message to everyone
        socket.emit('send-message-sender', formatMessage(user.username, msg));
        socket.broadcast.emit('send-message', formatMessage(user.username, msg));
    });
})

const PORT = 5500;
// const ip = '192.168.1.200';

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
