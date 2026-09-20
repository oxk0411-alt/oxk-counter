const UINT32_MAX_PLUS_ONE = 0x1_0000_0000
const MAX_COUNT = 100

function assertValidInteger(value, label) {
  if (!Number.isSafeInteger(value)) throw new TypeError(`${label}必须是整数。`)
}

export function randomInteger(min, max, cryptoObject = globalThis.crypto) {
  assertValidInteger(min, '最小值')
  assertValidInteger(max, '最大值')

  if (min > max) throw new RangeError('最小值不能大于最大值。')
  if (!cryptoObject?.getRandomValues) throw new Error('当前浏览器不支持安全的随机数 API。')

  const range = max - min + 1
  if (range > UINT32_MAX_PLUS_ONE) throw new RangeError('可选区间过大，请缩小范围。')

  const buffer = new Uint32Array(1)

  if (range === UINT32_MAX_PLUS_ONE) {
    cryptoObject.getRandomValues(buffer)
    return min + buffer[0]
  }

  const unbiasedLimit = Math.floor(UINT32_MAX_PLUS_ONE / range) * range
  let value

  do {
    cryptoObject.getRandomValues(buffer)
    value = buffer[0]
  } while (value >= unbiasedLimit)

  return min + (value % range)
}

export function generateRandomIntegers(
  { min, max, count, unique = false },
  cryptoObject = globalThis.crypto,
) {
  assertValidInteger(min, '最小值')
  assertValidInteger(max, '最大值')
  assertValidInteger(count, '生成数量')

  if (min > max) throw new RangeError('最小值不能大于最大值。')
  if (count < 1 || count > MAX_COUNT) throw new RangeError(`生成数量必须在 1 到 ${MAX_COUNT} 之间。`)

  const rangeSize = max - min + 1
  if (unique && count > rangeSize) throw new RangeError('不重复模式下，生成数量不能超过区间内整数的总数。')

  if (!unique) return Array.from({ length: count }, () => randomInteger(min, max, cryptoObject))

  const values = new Set()
  while (values.size < count) values.add(randomInteger(min, max, cryptoObject))
  return [...values]
}
