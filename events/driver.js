'use strict';

const eventEmitter = require('../event-emitter');

module.exports = (payload) => {
  console.log(`DRIVER: picked up ${payload.orderId}`);
  eventEmitter.emit('in transit', payload);
  eventEmitter.emit('delivered', payload);
};

