'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3000/caps');

const MessageClient = require('../lib/message-client');
const widgetQueue = new MessageClient('Acme Widgets');
const flowerQueue = new MessageClient('1-800-flowers');


widgetQueue.publish('getAll', { vendorId: 'Acme Widgets', event: 'delivered' });

widgetQueue.subscribe('pickup', (payload) => {
  widgetQueue.publish('received', {
    event: 'pickup',
    vendorId: payload.vendorId,
    orderId: payload.orderId,
  });
  widgetQueue.publish('in-transit', payload);
  setTimeout(() => {
    widgetQueue.publish('delivered', payload);
  }, 2000);
});

flowerQueue.publish('getAll', { vendorId: '1-800-flowers', event: 'delivered' });

flowerQueue.subscribe('pickup', (payload) => {
  flowerQueue.publish('in-transit', payload);
  flowerQueue.publish('received', {
    event: 'pickup',
    vendorId: payload.vendorId,
    orderId: payload.orderId,
  });
  setTimeout(() => {
    flowerQueue.publish('delivered', payload);
  }, 2000);
});

socket.on('pickup', (payload) => {
  console.log(`DRIVER: picked up ${payload.orderId}`);
  socket.emit('in-transit', payload);
  console.log(`DRIVER: delivered ${payload.orderId}`);
  socket.emit('delivered', payload);
});






