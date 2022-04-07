'use strict';

const MessageClient = require('./message-client');

const messageQueue = new MessageClient('messages');

let randomId = Math.floor(Math.random() * 1000);

messageQueue.publish('message', { messageId: randomId, text: 'Hola' });
messageQueue.subscribe('received', console.log);