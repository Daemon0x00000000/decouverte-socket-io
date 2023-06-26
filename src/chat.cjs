const http = require('http');
const server = http.createServer();
const { Server } = require("socket.io");
// CORS
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    }
});

const roomsHistory = {};

const send = (msg, room) => {
    io.to(room).emit("chat message", msg);
    if (!roomsHistory[room]) {
        roomsHistory[room] = [];
    }
    roomsHistory[room].push(msg);
}

const typing = (typingValue,id,room='all') => {
    if (room === 'all') {
        io.emit("typing", typingValue,id);
        return;
    }
    io.to(room).emit("typing", typingValue,id);
}

io.use((socket, next) => {
    const user = socket.handshake.auth.user;
    if (!user) {
        return next(new Error("invalid user"));
    }
    socket.user = user;
    // Check if user already exists in other sockets

    io.sockets.sockets.forEach((socket) => {
        if (socket.user.email === user.email) {
            return next(new Error("user already exists"));
        }
    });
    console.log('user', user)
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBd8yhnU-E1Blg3Dae3-UpAYf4LIDEBv8E', {
        method: 'POST',
        body: JSON.stringify({
            idToken: user.idToken
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        console.log(data);
        if (data.error) {
            return next(new Error("invalid user"));
        } else {
            next();
        }
    });
});
io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(socket.rooms);
    socket.on('join', (room) => {
        console.log(socket.user.email, 'joined room', room);
        //send('New user joined room ', room)
        socket.leaveAll();
        socket.join(room);
        send(`${socket.user.email} joined room`, room);
        socket.emit("history", roomsHistory[room]);
    });
    socket.on("chat message", (msg, room) => {
        console.log(socket.user.email, ' : message : ', msg, room);
        send(`${socket.user.email} : ${msg}`, room);

    });
    socket.on("typing", (typingValue, room) => {
        console.log('typing', typingValue, room);
        typing(typingValue,socket.id,room);
    });
    socket.on('disconnect', () => {
        console.log(socket.user.email, 'disconnected');
        typing(false, socket.id);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
