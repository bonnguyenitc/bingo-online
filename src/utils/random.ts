import { NUMBER_MAX } from './constans'

export const randomString = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 9)
}

export const randomNumber = () => {
  return window.crypto.getRandomValues(new Uint32Array(1))[0] + ''
}

function getRandomInt(min: number, max: number): number {
  // Create byte array and fill with 1 random number
  const byteArray = new Uint8Array(1)
  window.crypto.getRandomValues(byteArray)

  const range = max - min + 1
  const max_range = 256
  if (byteArray[0] >= Math.floor(max_range / range) * range) return getRandomInt(min, max)
  return min + (byteArray[0] % range)
}

export function createNumbers(): number[] {
  const list: number[] = []
  for (let i = 1; i <= 25; i++) {
    let element = getRandomInt(1, NUMBER_MAX)
    while (list.includes(element)) {
      element = getRandomInt(1, NUMBER_MAX)
    }
    list.push(element)
  }
  list[12] = 0

  return list
}

export function randomBingo(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
