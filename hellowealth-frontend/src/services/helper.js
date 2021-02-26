import * as Yup from 'yup'
import moment from 'moment'

export const EMAIL_REGEX = /^(()|(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+))$/
export const PHONE_REGEX = /^\+?([0-9]{2})\)?([0-9]{8,25})$/

export function dynamicValidation(form) {
  if (!form || !form.length) return false

  // wagtail field types = text, input, url, select, radio, checkbox, hidden, file, email, number

  // loop through fields
  let fields = {}
  form.map((field) => {
    let validate = {
      [field.name]:
        field.type === 'email'
          ? Yup.string().email('Enter a valid email address')
          : field.type === 'phone_number'
          ? Yup.string().matches(
              /^\+?([0-9]{2})\)?([0-9]{8,25})$/,
              'Please enter a valid phone number'
            )
          : field.type === 'number'
          ? Yup.number().nullable()
          : field.type === 'url'
          ? Yup.string().url('Enter a valid http(s) URL')
          : field.type === 'password'
          ? Yup.string().matches(
              /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\d@$!%*#()?&]{8,}$/,
              'Password must be at least eight characters, including at least one letter and one number'
            )
          : field.type === 'email_list'
          ? Yup.string().matches(
              /^(()|(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+))$/,
              'Please enter valid email addresses separated by commas'
            )
          : Yup.string(),
    }

    // add required
    if (field.required && !field.valueType) {
      validate[field.name] = validate[field.name].required(
        field.error
          ? field.error
          : `${field.validationLabel || field.label || 'Field'} is required`
      )
    } else if (field.valueType === 'object') {
      if (field.requiredFieldOfFirstItem) {
        validate[field.name] = Yup.array().of(
          Yup.object().requiredFieldOfFirstItem(
            field.requiredFieldOfFirstItem,
            `${
              field.requiredFieldOfFirstItem || field.label || 'Field'
            } is required`
          )
        )
      } else {
        validate[field.name] = Yup.array().required(
          `${field.validationLabel || field.label || 'Field'} is required`
        )
      }
    }

    // confirm password
    if (field.matched && field.type === 'password') {
      validate[field.name] = validate[field.name].oneOf(
        [Yup.ref(field.matched), null],
        'Passwords must match'
      )
    }

    // max length
    if (field.max > 0) {
      validate[field.name] = validate[field.name].max(
        field.max,
        `Ensure this field has no more than ${field.max} characters.`
      )
    }

    // max value
    if (field.maxValue > 0) {
      validate[field.name] = validate[field.name].max(
        field.maxValue,
        `Max value is ${field.maxValue}.`
      )
    }

    // min value
    if (typeof field.minValue === 'number') {
      validate[field.name] = validate[field.name].min(
        field.minValue,
        `Min value is ${field.minValue}.`
      )
    }

    // max decimals
    if (field.maxDecimals > 0) {
      validate[field.name] = validate[field.name].test(
        'max-decimals',
        `Max ${field.maxDecimals} decimals.`,
        (value) => {
          let val = parseFloat(value)
          let decimals = countDecimals(val)
          return decimals <= field.maxDecimals
        }
      )
    }

    // phone number
    if (field.phone_number === true) {
      validate[field.name] = Yup.string().matches(
        PHONE_REGEX,
        'Please enter a valid phone number'
      )
    }

    // validation if required by another field (empty)
    if (field.ref && field.requiredIfRefEmpty) {
      validate[field.name] = Yup.string().test(
        'requiredIfRefEmpty',
        `${field.validationLabel || field.label || 'Field'} is required`,
        function (value) {
          const refVal = this.parent[field.ref]
          const { path, createError } = this
          if (!refVal) {
            if (value) {
              if (field.name === 'email_address') {
                return (
                  value.match(EMAIL_REGEX) ||
                  createError({
                    path,
                    message: 'Please enter a valid email address',
                  })
                )
              } else if (field.name === 'phone_number') {
                return (
                  value.match(PHONE_REGEX) ||
                  createError({
                    path,
                    message: 'Please enter a valid phone number',
                  })
                )
              }
              return value !== undefined
            } else {
              return value !== undefined
            }
          }
          return true
        }
      )
    }

    // validation if required by another field (equal to)
    if (field.ref && field.requiredIfRefEqualTo) {
      validate[field.name] = Yup.string()
        .nullable()
        .when(field.ref, {
          is: field.requiredIfRefEqualTo,
          then: (fieldSchema) =>
            fieldSchema.required(
              `${field.validationLabel || field.label || 'Field'} is required`
            ),
        })
    }

    // validation if required by another field (exists)
    if (field.requiredIfRefExists) {
      validate[field.name] = Yup.string().when(field.requiredIfRefExists, {
        is: (value) => typeof value && value > 0,
        then: Yup.string().required(
          `${field.validationLabel || field.label || 'Field'} is required`
        ),
      })
    }

    // push field into fields object
    fields = {
      ...fields,
      ...validate,
    }

    return null
  })

  // generate the Yup object
  return Yup.object().shape(fields)
}

//Count the number of digits after a decimal point
export const countDecimals = (value) => {
  if (!value || Math.floor(value) === value) return 0
  return value.toString().split('.')[1].length || 0
}

//Check a variable is null or empty
export const isNullOrEmpty = (input) => {
  // Null or empty
  if (input === null || input === undefined || input === '') {
    return true
  }

  // value = False
  if (input === 'False') {
    return true
  }

  // Array empty
  if (typeof input.length === 'number' && typeof input !== 'function') {
    return !input.length
  }

  // Blank string like '   '
  if (typeof input === 'string' && input.match(/\S/) === null) {
    return true
  }

  // Object empty
  if (input.constructor === Object && Object.keys(input).length === 0) {
    return true
  }

  return false
}

// Map data from API to dropdown list or autocomplete
export const buildEquitiesOptions = (data, key) => {
  if (!isNullOrEmpty(data)) {
    const obj = { label: key, options: [] }
    obj.options = data.map((item) => {
      return {
        value: item.symbol || item.shortname,
        label: `${item.symbol} (${item.longname || item.shortname})`,
        type: key,
        data: item,
      }
    })
    return obj
  }
}


// Map dataframe from APIs to chart data frame
export const buildEquityPriceDataframe = (dataset, timeRange = 6) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
  })

  let currentDate = moment().subtract(timeRange, 'months').unix()
  const rangeData = dataset.filter(
    (data) => data.date >= currentDate
  )

  const priceDf = rangeData.map((data) => {
    let dataDate = moment.unix(data.date).format('D MMM YYYY')
    return[
      dataDate,
      data.low,
      data.open,
      data.close,
      data.high,
      `On date: ${dataDate} \n Open-Close:[${formatter.format(
        data.open
      )}, ${formatter.format(
        data.close
      )}] \n Highest-Lowest:[${formatter.format(
        data.high
      )}, ${formatter.format(
        data.low
      )}] \n Total volume: ${formatter.format(data.volume)}`,
    ]
  })

  return priceDf
}