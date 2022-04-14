'use strict';

// const { io } = require('socket.io-client');
// const socket = io('http://localhost:3000/caps');

const MessageClient = require('../lib/message-client');
const widgetQueue = new MessageClient('Acme Widgets');
const flowerQueue = new MessageClient('1-800-flowers');

widgetQueue.publish('getAll', { vendorId: 'Acme Widgets', event: 'pickup' });

widgetQueue.subscribe('pickup', (payload) => {
  console.log(`DRIVER: picked up order: ${payload.orderId} from ${payload.vendorId}`);
  widgetQueue.publish('received', {
    event: 'pickup',
    vendorId: payload.vendorId,
    orderId: payload.orderId,
  });
  widgetQueue.publish('in-transit', payload);
  setTimeout(() => {
    widgetQueue.publish('delivered', payload);
    console.log(`DRIVER: delivered order: ${payload.orderId} from ${payload.vendorId}`);
  }, 2000);
});

flowerQueue.publish('getAll', { vendorId: '1-800-flowers', event: 'pickup' });

flowerQueue.subscribe('pickup', (payload) => {
  console.log(`DRIVER: picked up order: ${payload.orderId} from ${payload.vendorId}`);
  flowerQueue.publish('in-transit', payload);
  flowerQueue.publish('received', {
    event: 'pickup',
    vendorId: payload.vendorId,
    orderId: payload.orderId,
  });
  setTimeout(() => {
    flowerQueue.publish('delivered', payload);
    console.log(`DRIVER: delivered order: ${payload.orderId} from ${payload.vendorId}`);
  }, 2000);
});








