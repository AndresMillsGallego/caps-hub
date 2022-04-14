'use strict';

// const { io } = require('socket.io-client');
// const socket = io('http://localhost:3000/caps');

const MessageClient = require('../lib/message-client');
const widgetQueue = new MessageClient('Acme Widgets');
const flowerQueue = new MessageClient('1-800-flowers');

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

function getRandomNumber() {
  return Math.floor(Math.random() * 1000);
}

widgetQueue.publish('getAll', { vendorId: 'Acme Widgets', event: 'delivered' });


widgetQueue.subscribe('delivered', (payload) => {
  widgetQueue.publish('received', {
    event: 'delivered',
    vendorId: payload.vendorId,
    orderId: payload.orderId,
  });
  console.log(`Thank you for delivering order: ${payload.orderId} from ${payload.vendorId}`);
});

flowerQueue.publish('getAll', { vendorId: '1-800-flowers', event: 'delivered' });


flowerQueue.subscribe('delivered', (payload) => {
  flowerQueue.publish('received', {
    event: 'delivered',
    vendorId: payload.vendorId,
    orderId: payload.orderId,
  });
  console.log(`Thank you for delivering order: ${payload.orderId} from ${payload.vendorId}`);
});

widgetQueue.publish('pickup', { messageId: getRandomNumber(), ...createOrder('Acme Widgets') });
flowerQueue.publish('pickup', { messageId: getRandomNumber(), ...createOrder('1-800-flowers') });