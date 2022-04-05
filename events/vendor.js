'use strict';

const eventEmitter = require('../event-emitter');


module.exports = (payload) => {
  eventEmitter.emit('pickup', payload);
};

