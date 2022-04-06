'use strict';

require('dotenv').config();
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

const server = new Server(PORT);
const caps = server.of('/caps');
const eventLogger = require('./events/log-event');


server.on('connection', (socket) => {
  console.log('First socket is a go go go!!' + socket.id);
});

caps.on('connection', (socket) => {
  console.log('Successful connection made to CAPS namespace!', socket.id);
  
  socket.on('join', (payload) => {
    socket.join(payload.vendorId);
  });

  socket.on('order', (payload) => {
    socket.to(payload.vendorId).emit(payload);
  });

  socket.on('pickup', (payload) => {
    eventLogger('pickup', payload);
    socket.broadcast.emit('pickup', payload);
  });
  
  socket.on('in-transit', (payload) => {
    eventLogger('in transit', payload);
    socket.broadcast.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    eventLogger('delivered', payload);
    socket.broadcast.emit('delivered', payload);
  });
});
