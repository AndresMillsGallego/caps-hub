'use strict';

// const { io } = require('socket.io-client');
// const socket = io('http://localhost:3000/caps');

const MessageClient = require('../lib/message-client');
const driverQueue = new MessageClient('Acme Widgets');

function createOrder(storeName) {
  let id = Math.floor(Math.random() * 1000);
  const payload = {
    vendorId: storeName,
    orderId: id,
    customer: 'Aureliano Buendia',
    address: '1234 5th St Seattle, Wa',
  };
  return payload;
}
let payload = createOrder('Acme Widgets');
let randomId = Math.floor(Math.random() * 1000);

driverQueue.publish('getAll', { vendorId: 'Acme Widgets', event: 'delivered' });

driverQueue.publish('pickup', { messageId: randomId, ...payload });
driverQueue.subscribe('received', console.log);
driverQueue.subscribe('delivered', (payload) => {
  console.log('Thank you for your order.');
});




// setInterval(() => {
//   const payload = createOrder('Rocket Pizza');
//   socket.emit('pickup', payload);
// }, 5000);

// socket.on('delivered', (payload) => {
//   console.log(`Thank you, ${payload.customer}`);
//   process.exit();
// });

