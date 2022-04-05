'use strict';

const eventEmitter = require('./event-emitter');
const vendorHandler = require('./events/vendor');
const driverHandler = require('./events/driver');
const deliveryHandler = require('./events/delivery');
const eventLogger = require('./events/log-event');


eventEmitter.on('store name', vendorHandler);

eventEmitter.on('pickup', (payload) => {
  eventLogger('pickup', payload);
});
eventEmitter.on('pickup', driverHandler);

eventEmitter.on('in transit', (payload) => {
  eventLogger('in transit', payload);
});

eventEmitter.on('delivered', deliveryHandler);
eventEmitter.on('delivered', (payload) => {
  eventLogger('delivered', payload);
});

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
  eventEmitter.emit('store name', payload);
}, 3000);


