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
    let newEvent = new Event('Pickup', payload);
    eventEmitter.emit('PICKUP', newEvent);
    console.log('VENDOR', newEvent);
  }, 2000);

};

