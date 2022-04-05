'use strict';

const eventEmitter = require('./event-emitter');
const vendorHandler = require('./events/vendor');
const driverHandler = require('./events/driver');



eventEmitter.on('PICKUP', vendorHandler);
eventEmitter.on('IN TRANSIT', driverHandler);
eventEmitter.on('DELIVERED', driverHandler);




setInterval(() => {
  eventEmitter.emit('PICKUP', vendorHandler);
}, 2000);

setInterval(() => {
  
  eventEmitter.emit('IN TRANSIT', driverHandler);
}, 2000);

setInterval(() => {
  eventEmitter.emit('DELIVERED', driverHandler);
}, 2000);
