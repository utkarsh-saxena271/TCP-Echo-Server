import net from 'net'

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.write('Client Connected\n');
    socket.on('data', (data) => {
        const dataStr = data.toString();
        console.log('Data Recieved : ', dataStr);
        socket.write(`Echo : ${dataStr}`);      // Echo response
    })
    socket.on('end',()=>{
        console.log('client left');
    })
    socket.on('error', (err) => {
        console.error(err.message);
    });
})

server.listen(3000, () => {
    console.log('Echo running on port 3000');
})