'use strict';

require('dotenv').config();
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

const server = new Server(PORT);
const caps = server.of('/caps');
const eventLogger = require('./logger/log-event');
const Queue = require('./lib/queue');
const messageQueue = new Queue();

const driverQueue = new Queue();
const vendorQueue = new Queue();

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

  socket.on('message', (payload) => {
    let currentQueue = messageQueue.read(payload.queueId);
    if (!currentQueue) {
      let queueKey = messageQueue.store(payload.queueId, new Queue());
      currentQueue = messageQueue.read(queueKey);
    }
    currentQueue.store(payload.messageId, payload);
    caps.emit('message', payload);
  });

  socket.on('received', (payload) => {
    let currentQueue = driverQueue.read(payload.queueId);
    if (!currentQueue) {
      throw new Error('No queue found');
    }
    let message = currentQueue.remove(payload.messageId);
    caps.emit('received', message);
  });

  socket.on('pickup', (payload) => {
    let currentQueue = driverQueue.read(payload.queueId);
    if (!currentQueue) {
      let queueKey = driverQueue.store(payload.queueId, new Queue());
      currentQueue = driverQueue.read(queueKey);
    }
    currentQueue.store(payload.messageId, payload);
    caps.emit('pickup', payload);
    // eventLogger('pickup', payload);
  });

  socket.on('getAll', (payload) => {
    let currentQueue = driverQueue.read(payload.queueId);
    Object.keys(currentQueue.data).forEach(messageId => {
      caps.emit('pickup', currentQueue.read(messageId));
    });
  });

  
  socket.on('in-transit', (payload) => {
    // eventLogger('in transit', payload);
    caps.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    let currentQueue = vendorQueue.read(payload.queueId);
    if (!currentQueue) {
      let queueKey = vendorQueue.store(payload.queueId, new Queue());
      currentQueue = vendorQueue.read(queueKey);
    }
    currentQueue.store(payload.messageId, payload);
    caps.emit('delivered', payload);
  });

});
