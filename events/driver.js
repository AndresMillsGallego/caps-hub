'use strict';

const eventEmitter = require('../event-emitter');

let store = {
  store: 'Rocket Pizza',
  orderId: '666',
  customer: 'Aureliano Buendia',
  address: '1234 5th St Seattle, Wa.',
};

class Event {
  constructor(event, payload) {
    this.event = event;
    this.time = this.timeStamp();
    this.payload = payload;
  }

  timeStamp() {
    let rightNow = Date(Date.now());
    return rightNow.toString();
  }
}

module.exports = (payload) => {
  payload = store;
  setInterval(() => {
    console.log(`DRIVER: picked up order ${payload.orderId}`);
    let newEvent = new Event('In Transit', payload);
    eventEmitter.emit('IN TRANSIT', newEvent);
    console.log(newEvent);
  }, 2000);
  setInterval(() => {
    console.log(`DRIVER: Delivered order ${payload.orderId}`);
    console.log(`VENDOR: Thank you ${payload.customer}`);
    let newEvent = new Event('Delivered', payload);
    eventEmitter.emit('DELIVERED', newEvent);
    console.log(newEvent);
  }, 2000);
};

