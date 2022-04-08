'use strict';

require('dotenv').config();
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

const server = new Server(PORT);
const caps = server.of('/caps');
const eventLogger = require('./logger/log-event');
const Queue = require('./lib/queue');
const messageQueue = new Queue();

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
    Object.keys(vendorQueue.data).forEach(orderId => {
      let order = vendorQueue.read(orderId);
      socket.emit(event, order);
    });
  });

  socket.on('pickup', (payload) => {
    let currentQueue = pickupQueue.read(payload.queueId);
    if (!currentQueue) {
      let queueKey = pickupQueue.store(payload.queueId, new Queue());
      currentQueue = pickupQueue.read(queueKey);
    }
    currentQueue.store(payload.orderId, payload);
    caps.emit('pickup', payload);
    // eventLogger('pickup', payload);
  });

  socket.on('received', ({ event, order }) => {
    let currentQueue;
    if (event === 'delivered') {
      currentQueue = deliveredQueue;
    } else if (event === 'pickup') {
      currentQueue = pickupQueue;
    } else {
      console.log('No queue found!');
    }
    let vendorQueue = currentQueue.read(order.vendorId);
    let removedOrder = vendorQueue.remove(order.orderId);
    caps.emit('received', removedOrder);
  });

  socket.on('in-transit', (payload) => {
    // eventLogger('in transit', payload);
    caps.emit('in-transit', payload);
  });
  
  socket.on('delivered', (payload) => {
    let currentQueue = deliveredQueue.read(payload.queueId);
    if (!currentQueue) {
      let queueKey = deliveredQueue.store(payload.queueId, new Queue());
      currentQueue = deliveredQueue.read(queueKey);
    }
    currentQueue.store(payload.orderId, payload);
    caps.emit('delivered', payload);
  });

});


// socket.on('message', (payload) => {
//   let currentQueue = messageQueue.read(payload.queueId);
//   if (!currentQueue) {
//     let queueKey = messageQueue.store(payload.queueId, new Queue());
//     currentQueue = messageQueue.read(queueKey);
//   }
//   currentQueue.store(payload.messageId, payload);
//   caps.emit('message', payload);
// });