# TCP with nodejs

## 1. `net.createServer()`

Creates a TCP server.

```js
const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected');
});
```

Equivalent to:

```js
const server = net.createServer();

server.on('connection', (socket) => {
  console.log('Client connected');
});
```

The callback receives a **socket representing that specific client connection**.

---

## 2. `server.listen()`

Starts accepting connections.

```js
server.listen(3000);
```

Or:

```js
server.listen(3000, '0.0.0.0');
```

Common usage:

```js
server.listen(3000, () => {
  console.log('Server running');
});
```

---

## 3. `server.close()`

Stops accepting new clients.

```js
server.close();
```

Important:

```text
Existing clients remain connected.
New clients are rejected.
```

Example:

```js
server.close(() => {
  console.log('Server stopped');
});
```

---

## 4. `server.getConnections()`

Returns number of connected clients.

```js
server.getConnections((err, count) => {
  console.log(count);
});
```

Output:

```text
5
```

Useful for monitoring.

---

## 5. `server.address()`

Returns listening information.

```js
console.log(server.address());
```

Example:

```js
{
  address: '::',
  family: 'IPv6',
  port: 3000
}
```

---

## 6. `server.listening`

Boolean indicating server status.

```js
console.log(server.listening);
```

Output:

```js
true
```

or

```js
false
```

---

## Important Server Events

---

### connection

Most important event.

```js
server.on('connection', (socket) => {
  console.log('Connected');
});
```

Triggered every time a client connects.

```text
Client 1 -> connection
Client 2 -> connection
Client 3 -> connection
```

Three separate socket objects.

---

### listening

Triggered after startup.

```js
server.on('listening', () => {
  console.log('Ready');
});
```

---

### close

Triggered after shutdown.

```js
server.on('close', () => {
  console.log('Server closed');
});
```

---

### error

Always handle it.

```js
server.on('error', (err) => {
  console.error(err);
});
```

Example:

```text
EADDRINUSE
```

means:

```text
Port already being used.
```

---

## The Server-Side Socket

Inside:

```js
server.on('connection', (socket) => {
});
```

everything interesting happens through `socket`.

Each client gets its own socket.

```text
Server
 ├── Socket A
 ├── Socket B
 └── Socket C
```

---

## socket.write()

Send data to that client.

```js
socket.write('Hello');
```

---

## socket.end()

Gracefully disconnect client.

```js
socket.end();
```

Or:

```js
socket.end('Goodbye');
```

---

## socket.destroy()

Force disconnect.

```js
socket.destroy();
```

Useful when:

```text
Protocol violation
Abuse
Timeout
Authentication failure
```

---

## socket.on('data')

Receive bytes from that client.

```js
socket.on('data', (buffer) => {
  console.log(buffer.toString());
});
```

Most TCP servers spend most of their life here.

---

## socket.on('end')

Client closed connection.

```js
socket.on('end', () => {
  console.log('Client left');
});
```

---

## socket.on('close')

Socket completely destroyed.

```js
socket.on('close', () => {
  console.log('Closed');
});
```

Usually follows `end`.

---

## socket.on('error')

Handle client-specific errors.

```js
socket.on('error', (err) => {
  console.error(err.message);
});
```

---

## socket.setTimeout()

Disconnect idle clients.

```js
socket.setTimeout(30000);
```

30 seconds.

```js
socket.on('timeout', () => {
  socket.end();
});
```

Very common in production servers.

---

## socket.pause()

Stop reading data.

```js
socket.pause();
```

Useful when overloaded.

---

## socket.resume()

Continue reading.

```js
socket.resume();
```

---

## socket.setEncoding()

Convert buffers automatically.

Without:

```js
socket.on('data', (buffer) => {
  console.log(buffer.toString());
});
```

With:

```js
socket.setEncoding('utf8');

socket.on('data', (data) => {
  console.log(data);
});
```

Now `data` is already a string.

---

## socket.setKeepAlive()

Enable TCP keepalive.

```js
socket.setKeepAlive(true);
```

Useful for long-running connections.

---

## socket.setNoDelay()

Disable Nagle's algorithm.

```js
socket.setNoDelay(true);
```

Common in:

* Game servers
* Chat servers
* Realtime applications

---

## Client Information

### IP Address

```js
socket.remoteAddress
```

Example:

```text
192.168.1.20
```

---

### Client Port

```js
socket.remotePort
```

Example:

```text
52144
```

---

### Server Port

```js
socket.localPort
```

Example:

```text
3000
```

---

## Tracking Connected Clients

Very common pattern:

```js
const clients = new Set();

server.on('connection', (socket) => {

  clients.add(socket);

  console.log('Connected:', clients.size);

  socket.on('close', () => {
    clients.delete(socket);

    console.log('Connected:', clients.size);
  });

});
```

Now you know exactly how many clients are online.

---

## Broadcasting

Send a message to all connected clients.

```js
const clients = new Set();

server.on('connection', (socket) => {

  clients.add(socket);

  socket.on('data', (msg) => {

    for (const client of clients) {
      client.write(msg);
    }

  });

});
```

This is the foundation of:

* Chat servers
* Multiplayer games
* Live dashboards
* Message brokers

---

## The 90% Server API You'll Use

In real TCP servers, you'll repeatedly use:

```js
server.listen()
server.close()

server.on('connection')

socket.on('data')
socket.write()

socket.on('end')
socket.on('close')
socket.on('error')

socket.end()
socket.destroy()

socket.setTimeout()
```