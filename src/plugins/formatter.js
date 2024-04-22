class Formatter {
  price(value) {
    if (typeof value === 'string') {
      value = parseFloat(value)
    } else if (typeof value !== 'number' || isNaN(value)) {
      return value
    }

    return new Intl.NumberFormat('ru').format(value) + ' ₽'
  }
  date = (date) => {
    const days = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `
      ${days < 10 ? '0' + days : days}.${
      month < 10 ? '0' + month : month
    }.${year}
    `
  }
  dateMonthYear = (date) => {
    const month = date.getMonth()
    const year = date.getFullYear()
    const monthList = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь'
    ]

    return `${monthList[month]}, ${year}`
  }
}

export default new Formatter()
