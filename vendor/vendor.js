'use strict';

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

widgetQueue.publish('pickup', { messageId: getRandomNumber(), ...createOrder('Acme Widgets') });
widgetQueue.subscribe('received', console.log);
widgetQueue.subscribe('delivered', (payload) => {
  widgetQueue.publish('received', {
    event: 'delivered',
    vendorId: payload.vendorId,
    orderId: payload.orderId,
  });
  console.log('Thank you for your order.');
});

widgetQueue.publish('getAll', { vendorId: '1-800-flowers', event: 'delivered' });

flowerQueue.publish('pickup', { messageId: getRandomNumber(), ...createOrder('1-800-flowers') });
flowerQueue.subscribe('received', console.log);
flowerQueue.subscribe('delivered', (payload) => {
  flowerQueue.publish('received', {
    event: 'delivered',
    vendorId: payload.vendorId,
    orderId: payload.orderId,
  });
  console.log('Thank you for your order.');
});

