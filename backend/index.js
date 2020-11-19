const express =  require("express")
const mongoose = require("mongoose")
const cors =  require("cors")
const socketio = require("socket.io")
const http = require('http')
require("dotenv").config()

const { addUser, removeUser, getUser, getUsersInRoom, getUsers } = require('./Users.js');

const app = express()
app.use(express.json())
app.use(cors())
const server = http.createServer(app)
const io = socketio(server)

io.on('connect',(socket) => {

    socket.on('join', ({userName, roomCode, roomName, isAdmin}, callback )=> {
        const {error, user} = addUser({id: socket.id, userName, roomCode, roomName})

        console.log(getUsers())
        console.log(roomCode)

        if(error) return callback(error)

        socket.emit('message', { user: 'admin', text: `Welcome to the room ${user.roomName} :D`})

        console.log(user.isAdmin)
        if(!user.isAdmin)
        {
            console.log("I sent disable command")
            socket.emit('disable')
        }

        socket.broadcast.to(user.roomCode).emit('message', {user: 'admin', text: `${user.userName} has joined`})

        socket.join(user.roomCode)

        io.to(user.roomCode).emit('roomData', {users: getUsersInRoom(user.roomCode)})
        
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.roomCode).emit('message', { user: user.userName, text: message });

        callback();
    });

    socket.on('issueNotice', (notice, callback) => {
        const user = getUser(socket.id);

        io.to(user.roomCode).emit('message', { user: "notice", text: notice });

        callback();
    });

    socket.on('disconnectRoom', () => {
        const user = removeUser(socket.id)
        console.log("disconnectRoom called")
        if(user){
            io.to(user.roomCode).emit('message', {user: 'admin', text: `${user.userName} has left.`})
            io.to(user.roomCode).emit('roomData', {users: getUsersInRoom(user.roomCode) });
        }
        socket.disconnect();
        console.log(getUsers())
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log("disconnect called")
        if (user) {
            io.to(user.roomCode).emit('message', { user: 'admin', text: `${user.userName} has left.` })
            io.to(user.roomCode).emit('roomData', { users: getUsersInRoom(user.roomCode) });
        }
        socket.disconnect();
        
    })

    socket.on('play', (timerValues, callback) => {
        const user = getUser(socket.id);
        //console.log('play call back')
        //if(user.isAdmin)
        //{
        if(user)
        {
        io.to(user.roomCode).emit('message', {user: 'admin', text: `${user.userName} has started the timer`});
        io.to(user.roomCode).emit('play', {timerValues: timerValues});
        callback()
        }
        //}
    })

    socket.on('stop', (callback) => {
        const user = getUser(socket.id);
        //if(user.isAdmin)
        //{
        if(user)
        {
        io.to(user.roomCode).emit('message', { user: 'admin', text: `${user.userName} has stopped the timer` });
        io.to(user.roomCode).emit('stop');
        callback()
        }
        //}
    })

    socket.on('reset', (callback) => {
        const user = getUser(socket.id);
        //if(user.isAdmin)
        //{
        if(user)
        {
        io.to(user.roomCode).emit('message', { user: 'admin', text: `${user.userName} has reset the timer` });
        io.to(user.roomCode).emit('reset');
        callback()
        }
        //}
    })

    socket.on('handleVisibilityChange', (isVisible,callback) => {
        const user = getUser(socket.id);
        //if(user.isAdmin)
        //{
        if(user && isVisible)
        {
            io.to(user.roomCode).emit('message', { user: 'admin', text: `${user.userName} is back in focus` });
        }
        else
        {
            if(user)
            io.to(user.roomCode).emit('message', { user: 'admin', text: `${user.userName} is not focusing` });
        }
        io.to(user.roomCode).emit('handleVisibility', {isVisible: isVisible, userName: user.userName});

        callback()
        //}
    })

    socket.on('removeUser', (id, callback) => {
        io.to(id).emit('onGettingRemoved')
        let user = removeUser(id)
        console.log("removeUser called")
        if (user) {
            io.to(user.roomCode).emit('message', { user: 'admin', text: `${user.userName} has been removed.` })
            io.to(user.roomCode).emit('roomData', { users: getUsersInRoom(user.roomCode) });
        }
        callback()
    })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`The console has started on port: ${PORT}`));

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (error) => {
        if(error) throw error
        console.log("mongodb connection established")
    })

app.use("/users", require("./routes/userRouter"));      
app.use("/todos", require("./routes/todoRouter"));      
app.use("/room", require("./routes/chatRouter"));

