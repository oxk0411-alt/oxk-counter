import test from 'node:test'
import assert from 'node:assert/strict'
import { generateRandomIntegers, randomInteger } from '../src/random.js'

function createCrypto(values) {
  let index = 0
  return {
    getRandomValues(array) {
      array[0] = values[index++ % values.length]
      return array
    },
  }
}

test('randomInteger maps a uint32 value into the requested interval', () => {
  assert.equal(randomInteger(1, 100, createCrypto([42])), 43)
  assert.equal(randomInteger(-5, 5, createCrypto([0])), -5)
  assert.equal(randomInteger(-5, 5, createCrypto([10])), 5)
})

test('generateRandomIntegers returns the requested quantity', () => {
  const numbers = generateRandomIntegers(
    { min: 10, max: 20, count: 5 },
    createCrypto([0, 1, 2, 3, 4]),
  )

  assert.deepEqual(numbers, [10, 11, 12, 13, 14])
})

test('generateRandomIntegers can remove duplicate results', () => {
  const numbers = generateRandomIntegers(
    { min: 1, max: 3, count: 3, unique: true },
    createCrypto([0, 0, 1, 2]),
  )

  assert.deepEqual(numbers, [1, 2, 3])
})

test('generateRandomIntegers rejects an impossible unique request', () => {
  assert.throws(
    () => generateRandomIntegers({ min: 1, max: 2, count: 3, unique: true }),
    /不能超过/,
  )
})
