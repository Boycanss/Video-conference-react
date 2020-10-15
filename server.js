const express = require("express");
const path = require('path')
let app = express();
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const streamRouter = require('./routes/stream')
//import keys config
const db = require("./dbconfig/keys").mongoURI;


//connect to mongo
mongoose
    .connect(
        db,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('CONNECTED, BRO!'))
    .catch(err => console.log(err));

//app.get('/', (req,res) => res.send("HELLO FROM EXPRESS"));

app.use(express.static('public'));

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/client/*', function (req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

app.use('/api', indexRouter);
app.use('/api/users', userRouter);


const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

var io = require('socket.io')
  ({
    path: '/io/webrtc'
  })

io.listen(server)

// default namespace
io.on('connection', socket => {
  console.log('connected')
})

const peers = io.of('/webrtcPeer')

// keep a reference of all socket connections
let connectedPeers = new Map()

peers.on('connection', socket => {

  connectedPeers.set(socket.id, socket)

  console.log(socket.id)
  socket.emit('connection-success', {
    success: socket.id,
    peerCount: connectedPeers.size,
  })

  const broadcast = () => socket.broadcast.emit('joined-peers', {
    peerCount: connectedPeers.size,
  })
  broadcast()

  const disconnectedPeer = (socketID) => socket.broadcast.emit('peer-disconnected', {
    peerCount: connectedPeers.size,
    socketID: socketID
  })

  socket.on('disconnect', () => {
    console.log('disconnected')
    connectedPeers.delete(socket.id)
    disconnectedPeer(socket.id)
  })

  socket.on('onlinePeers', (data) => {
    for (const [socketID, _socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID !== data.socketID.local) {
        console.log('online-peer', data.socketID, socketID)
        socket.emit('online-peer', socketID)
      }
    }
  })

  socket.on('offer', data => {
    for (const [socketID, socket] of connectedPeers.entries()) {
      // don't send to self
      if (socketID === data.socketID.remote) {
        // console.log('Offer', socketID, data.socketID, data.payload.type)
        socket.emit('offer', {
          sdp: data.payload,
          socketID: data.socketID.local
        }
        )
      }
    }
  })

  socket.on('answer', (data) => {
    for (const [socketID, socket] of connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        console.log('Answer', socketID, data.socketID, data.payload.type)
        socket.emit('answer', {
          sdp: data.payload,
          socketID: data.socketID.local
        }
        )
      }
    }
  })

  // socket.on('offerOrAnswer', (data) => {
  //   // send to the other peer(s) if any
  //   for (const [socketID, socket] of connectedPeers.entries()) {
  //     // don't send to self
  //     if (socketID !== data.socketID) {
  //       console.log(socketID, data.payload.type)
  //       socket.emit('offerOrAnswer', data.payload)
  //     }
  //   }
  // })

  socket.on('candidate', (data) => {
    // send candidate to the other peer(s) if any
    for (const [socketID, socket] of connectedPeers.entries()) {
      if (socketID === data.socketID.remote) {
        socket.emit('candidate', {
          candidate: data.payload,
          socketID: data.socketID.local
        })
      }
    }
  })

})