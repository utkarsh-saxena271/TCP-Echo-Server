import net from "net"

const server = net.createServer((socket) => {
    console.log("Client Connected");
    socket.write("Welcome\n");

    socket.on('data',(data) => {
        console.log('Data Recieved: ', data.toString());
        socket.write(`Server got : ${data}`);
    })
    socket.on('end', () => {
        console.log('Client disconnected');
    });
})

server.listen(3000, () => {
    console.log('TCP Server listening on port 3000');
});