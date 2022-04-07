'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3000/caps');

const MessageClient = require('./message-client');
const messageQueue = new MessageClient('messages');

function createOrder(storeName) {
  let id = Math.floor(Math.random() * 1000);
  const payload = {
    store: storeName,
    orderId: id,
    customer: 'Aureliano Buendia',
    address: '1234 5th St Seattle, Wa',
  };
  return payload;
}

setInterval(() => {
  const payload = createOrder('Rocket Pizza');
  socket.emit('pickup', payload);
}, 5000);

socket.on('delivered', (payload) => {
  console.log(`Thank you, ${payload.customer}`);
  process.exit();
});

