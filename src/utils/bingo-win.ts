export const checkBingoWin = (bingos: number[], result: number[]) => {
  const rs = result
  const nbs = bingos
  const r1 = [nbs[0], nbs[1], nbs[2], nbs[3], nbs[4]]
  const r2 = [nbs[5], nbs[6], nbs[7], nbs[8], nbs[9]]
  const r3 = [nbs[10], nbs[11], nbs[13], nbs[14]]
  const r4 = [nbs[15], nbs[16], nbs[7], nbs[18], nbs[19]]
  const r5 = [nbs[20], nbs[21], nbs[22], nbs[23], nbs[24]]
  const r6 = [nbs[0], nbs[5], nbs[10], nbs[15], nbs[20]]
  const r7 = [nbs[1], nbs[6], nbs[11], nbs[16], nbs[21]]
  const r8 = [nbs[2], nbs[7], nbs[17], nbs[22]]
  const r9 = [nbs[3], nbs[8], nbs[13], nbs[18], nbs[23]]
  const r10 = [nbs[4], nbs[9], nbs[14], nbs[19], nbs[24]]
  const r11 = [nbs[0], nbs[6], nbs[18], nbs[24]]
  const r12 = [nbs[4], nbs[8], nbs[16], nbs[20]]
  const maybes = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12]
  const wins = []
  for (const item of maybes) {
    let winsTiny = 0
    for (const num of item) {
      if (rs?.includes(num)) {
        winsTiny++
      } else {
        break
      }
    }
    wins.push(winsTiny === item?.length)
  }
  return wins.includes(true)
}
