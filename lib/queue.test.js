'use strict';

const Queue = require('./queue');

describe('Testing our Queue class', () => {

  let newQueue = new Queue();

  test('Should add a value to the queue', () => {
    newQueue.store('colombiano', {name: 'Andres'});
    expect(newQueue.data['colombiano']).toEqual({name: 'Andres'});
  });

  test('Should read a value from the queue', () => {
    let value = newQueue.read('colombiano');
    expect(value).toEqual({name: 'Andres'});
  });

  test('Should remove a value from the queue', () => {
    let removedValue = newQueue.remove('colombiano');
    expect(removedValue).toEqual({name: 'Andres'});
    expect(newQueue.data['colombiano']).toBeFalsy();
  });
});