import express from 'express';
import { Server } from 'socket.io';
import {createServer} from 'http';

const PORT = 3001;
const app = express();
const server = new createServer(app)

const io = new Server(server , {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket)=>{
    socket.on('get-document', id =>{
        const data = ""
        socket.join(id)
        socket.emit('load-document', data)

        socket.on('send-changes', delta =>{
            socket.broadcast.to(id).emit('receive-changes', delta)
        })
    })
})

server.listen(PORT, () =>{
console.log(`server is listening on ${PORT}`);
})


