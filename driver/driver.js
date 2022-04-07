'use strict';

// const { io } = require('socket.io-client');
// const socket = io('http://localhost:3000/caps');

const MessageClient = require('../lib/message-client');
const driverQueue = new MessageClient('Acme Widgets');

driverQueue.publish('getAll', { queueId: driverQueue.queueId });

driverQueue.subscribe('pickup', (payload) => {
  driverQueue.publish('received', payload);
  driverQueue.publish('in-transit', payload);
  setTimeout(() => {
    driverQueue.publish('delivered', payload);
  }, 2000);
});



// socket.on('pickup', (payload) => {
//   console.log(`DRIVER: picked up ${payload.orderId}`);
//   socket.emit('in-transit', payload);
//   console.log(`DRIVER: delivered ${payload.orderId}`);
//   socket.emit('delivered', payload);
// });






