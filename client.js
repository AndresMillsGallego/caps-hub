'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3000/caps');

socket.emit('pickup', {message: 'Hola Mundo'});
