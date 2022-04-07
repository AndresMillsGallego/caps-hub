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
    console.log('EVENT: ' + event);
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
    let currentQueue = messageQueue.read(payload.queueId);
    if (!currentQueue) {
      throw new Error('No queue found');
    }
    let message = currentQueue.remove(payload.messageId);
    caps.emit('received', message);
  });

  socket.on('getAll', (payload) => {
    let currentQueue = messageQueue.read(payload.queueId);
    Object.keys(currentQueue.data).forEach(messageId => {
      caps.emit('message', currentQueue.read(messageId));
    });
  });

  socket.on('pickup', (payload) => {
    eventLogger('pickup', payload);
    caps.emit('pickup', payload);
  });
  
  socket.on('in-transit', (payload) => {
    eventLogger('in transit', payload);
    caps.emit('in-transit', payload);
  });

  socket.on('delivered', (payload) => {
    eventLogger('delivered', payload);
    caps.emit('delivered', payload);
  });

});
