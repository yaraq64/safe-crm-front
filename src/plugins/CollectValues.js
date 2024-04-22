import Formatter from '@/plugins/formatter'

export default function (values) {
  const fields = {}

  if (typeof values === 'object' && values.length) {
    for (const field of values) {
      const value = (() => {
        if (field.type === 'range-input') {
          return field.value.from || field.value.to ? field.value : null
        } else if (field.type === 'select') {
          return field.value ? field.value.id : null
        } else if (field.type === 'date') {
          if (field.value instanceof Date) {
            return Formatter.date(field.value)
          } else if (typeof field.value === 'object') {
            return {
              from: Formatter.date(field.value[0]),
              to: Formatter.date(field.value[1])
            }
          } else {
            return field.value
          }
        } else {
          return field.value
        }
      })()

      if (value !== null && value !== undefined) {
        fields[field.id] = value
      }
    }
  }

  return JSON.stringify(fields)
}
