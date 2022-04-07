'use strict';

module.exports = (payload) => {
  console.log(`DRIVER: delivered ${payload.orderId}`);
  console.log(`Thank you, ${payload.customer}`);
};
