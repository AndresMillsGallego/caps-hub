'use strict';

module.exports = (event, payload) => {
  let timeStamp = Date(Date.now).toString();
  let newEvent = {
    event: event,
    time: timeStamp,
    payload: payload,
  };
  console.log('EVENT ', newEvent);
};