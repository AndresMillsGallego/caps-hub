'use strict';

const MessageClient = require('./message-client');

const messageQueue = new MessageClient('messages');

messageQueue.publish('getAll', { queueId: messageQueue.queueId });

messageQueue.subscribe('message', (payload) => {
  messageQueue.publish('received', payload);
});