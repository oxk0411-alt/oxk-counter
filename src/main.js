import { generateRandomIntegers } from './random.js'

const MAX_HISTORY_ITEMS = 6

const form = document.querySelector('#generator-form')
const minInput = document.querySelector('#min-value')
const maxInput = document.querySelector('#max-value')
const countInput = document.querySelector('#count-value')
const uniqueInput = document.querySelector('#unique-value')
const errorElement = document.querySelector('#form-error')
const resultOutput = document.querySelector('#result-output')
const resultMeta = document.querySelector('#result-meta')
const copyButton = document.querySelector('#copy-button')
const clearButton = document.querySelector('#clear-button')
const historyList = document.querySelector('#history-list')
const historyCount = document.querySelector('#history-count')

let currentNumbers = []
let history = []

const formatNumber = new Intl.NumberFormat('zh-CN')
const formatDateTime = new Intl.DateTimeFormat('zh-CN', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function readOptions() {
  const min = Number(minInput.value)
  const max = Number(maxInput.value)
  const count = Number(countInput.value)

  if (minInput.value === '' || !Number.isSafeInteger(min)) throw new Error('最小值必须是整数。')
  if (maxInput.value === '' || !Number.isSafeInteger(max)) throw new Error('最大值必须是整数。')
  if (countInput.value === '' || !Number.isSafeInteger(count)) throw new Error('生成数量必须是整数。')
  if (count < 1 || count > 100) throw new Error('生成数量必须在 1 到 100 之间。')

  return { min, max, count, unique: uniqueInput.checked }
}

function showError(message = '') {
  errorElement.textContent = message
}

function renderNumbers(numbers, options) {
  currentNumbers = numbers
  copyButton.disabled = numbers.length === 0
  resultOutput.replaceChildren(
    ...numbers.map((number, index) => {
      const item = document.createElement('span')
      item.className = 'number-chip'
      item.style.setProperty('--delay', `${index * 28}ms`)
      item.textContent = formatNumber.format(number)
      return item
    }),
  )

  resultMeta.textContent = `${numbers.length} 个整数 · ${formatNumber.format(options.min)} 到 ${formatNumber.format(options.max)}${options.unique ? ' · 不重复' : ''}`
}

function renderHistory() {
  historyCount.textContent = `${history.length} 条`
  historyList.replaceChildren()

  if (history.length === 0) {
    const empty = document.createElement('li')
    empty.className = 'empty-state'
    empty.textContent = '还没有生成记录'
    historyList.append(empty)
    return
  }

  history.forEach((entry) => {
    const item = document.createElement('li')
    item.className = 'history-item'

    const meta = document.createElement('div')
    meta.className = 'history-item__meta'
    meta.textContent = `${entry.time} · ${entry.options.count} 个 · ${formatNumber.format(entry.options.min)}–${formatNumber.format(entry.options.max)}`

    const values = document.createElement('div')
    values.className = 'history-item__values'
    values.textContent = entry.numbers.slice(0, 8).map((value) => formatNumber.format(value)).join(' · ') + (entry.numbers.length > 8 ? ' …' : '')

    item.append(meta, values)
    historyList.append(item)
  })
}

function clearResults() {
  currentNumbers = []
  copyButton.disabled = true
  resultOutput.innerHTML = '<span class="empty-state">设置范围后点击“生成随机数”</span>'
  resultMeta.textContent = ''
  showError()
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  showError()

  try {
    const options = readOptions()
    const numbers = generateRandomIntegers(options)
    renderNumbers(numbers, options)

    history = [
      {
        numbers,
        options,
        time: formatDateTime.format(new Date()),
      },
      ...history,
    ].slice(0, MAX_HISTORY_ITEMS)
    renderHistory()
  } catch (error) {
    clearResults()
    showError(error instanceof Error ? error.message : '生成失败，请检查输入。')
  }
})

copyButton.addEventListener('click', async () => {
  if (currentNumbers.length === 0) return

  const text = currentNumbers.join('\n')
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const helper = document.createElement('textarea')
    helper.value = text
    helper.setAttribute('readonly', '')
    helper.style.position = 'fixed'
    helper.style.opacity = '0'
    document.body.append(helper)
    helper.select()
    document.execCommand('copy')
    helper.remove()
  }

  const originalLabel = copyButton.textContent
  copyButton.textContent = '已复制'
  window.setTimeout(() => {
    copyButton.textContent = originalLabel
  }, 1200)
})

clearButton.addEventListener('click', () => {
  history = []
  clearResults()
  renderHistory()
})

renderHistory()
