export const formatCurency = (money: number) => {
  // Numero positivo o neganico
  const sign = money < 0 ? -1 : 1
  const signText = money < 0 ? '-' : ''
  money = sign * money

  // Pasar el numero a string
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
    return `${signText}${int}${decimalString}`
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

  return `${signText}${internalNumber}${intString}${decimalString}`
}
