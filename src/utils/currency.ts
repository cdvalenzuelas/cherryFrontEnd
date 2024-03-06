export const formatCurency = (money: number) => {
  const stringMoney = String(money)
  let int: number = 0
  let float: number = 0

  if (stringMoney.includes('.')) {
    const splitMoney = stringMoney.split('.')

    int = parseInt(splitMoney[0])
    float = parseInt(splitMoney[1])
  } else {
    int = parseInt(stringMoney)
    float = money - int
  }

  const decimalString = float === 0 ? '' : `,${float}`

  let intString = ''

  let internalNumber = int

  if (int < 1000) {
    return `${int}${decimalString}`
  }

  if (int === 1000) {
    return '1.000'
  }

  while (internalNumber >= 1000) {
    const base = parseInt(String(internalNumber / 1000))

    const internalNumber2 = internalNumber % 1000 !== 0 ? internalNumber - base * 1000 : '000'

    intString = `.${internalNumber2}` + intString

    internalNumber = base
  }

  return `${internalNumber}${intString}${decimalString}`
}
