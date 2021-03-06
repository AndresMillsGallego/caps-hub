'use strict';

require('dotenv').config();
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

const server = new Server(PORT);
const caps = server.of('/caps');
const Queue = require('./lib/queue');

const pickupQueue = new Queue();
const deliveredQueue = new Queue();

caps.on('connection', (socket) => {
  console.log('Successful connection made to CAPS namespace!', socket.id);
  
  socket.onAny((event, payload) => {
    let timeStamp = Date(Date.now).toString();
    console.log('EVENT: ' + event);
    console.log('TIMESTAMP: ' + timeStamp);
    console.log(payload);
  });
  
  socket.on('join', ({ queueId }) => {
    socket.join(queueId);
    socket.emit('join', queueId);
  });
  
  socket.on('getAll', ({vendorId, event}) => {
    let currentQueue;
    if (event === 'delivered') {
      currentQueue = deliveredQueue;
    } else if (event === 'pickup') {
      currentQueue = pickupQueue;
    } else {
      console.log('No queue found!');
    }

    let vendorQueue = currentQueue.read(vendorId);
    if (vendorQueue) {
      Object.keys(vendorQueue.data).forEach(orderId => {
        let order = vendorQueue.read(orderId);
        socket.emit(event, order);
      });
    }
  });

  socket.on('pickup', (payload) => {
    let currentQueue = pickupQueue.read(payload.vendorId);
    if (!currentQueue) {
      let queueKey = pickupQueue.store(payload.vendorId, new Queue());
      currentQueue = pickupQueue.read(queueKey);
    }
    currentQueue.store(payload.orderId, payload);
    socket.to(payload.vendorId).emit('pickup', payload);
  });

  socket.on('received', ({ event, orderId, vendorId }) => {
    let currentQueue = null;
    if (event === 'delivered') {
      currentQueue = deliveredQueue;
    } else if (event === 'pickup') {
      currentQueue = pickupQueue;
    } else {
      console.log('No queue found!');
    }
    let vendorQueue = currentQueue.read(vendorId);
    let removedOrder = vendorQueue.remove(orderId);
    socket.to(vendorId).emit('received', removedOrder);
  });

  socket.on('in-transit', (payload) => {
    console.log('Order in Transit ', payload);
    caps.emit('in-transit', payload);
  });
  
  socket.on('delivered', (payload) => {
    let currentQueue = deliveredQueue.read(payload.vendorId);
    if (!currentQueue) {
      let queueKey = deliveredQueue.store(payload.vendorId, new Queue());
      currentQueue = deliveredQueue.read(queueKey);
    }
    currentQueue.store(payload.orderId, payload);
    socket.to(payload.vendorId).emit('delivered', payload);
  });

});
