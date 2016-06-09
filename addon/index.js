import $      from 'jquery';
import moment from 'moment';

const THOUSANDS_REGEX = /(\d+)(\d{3})/;

function addThousandSeperators(integer) {
  let string = integer.toString();

  while (integer >= 1000 && THOUSANDS_REGEX.test(string)) {
    string = string.replace(THOUSANDS_REGEX, '$1 $2');
  }

  return string;
}

export function toNumber(value) {
  if (typeof value === 'number') { return value; }

  if (value instanceof Date) { return value.valueOf(); }

  if (typeof value === 'string') {
    const commaIndex = value.indexOf(',');
    const dotIndex   = value.indexOf('.');
    let parsed       = value;

    // Removes the thousands separators
    parsed = parsed.replace(' ', '');
    if (commaIndex < dotIndex) {
      parsed = parsed.replace(',', '');
    } else {
      parsed = parsed.replace('.', '');
    }

    // normalizes decimal seperator to a dot
    parsed = parsed.replace(',', '.');

    return parseFloat(parsed);
  }

  return null;
}

export function formatNumber(value, { decimals } = {}) {
  const originalValue = value;
  value = toNumber(value);

  if (typeof value !== 'number' || isNaN(value)) { return originalValue; }

  const stringValue  = value.toString();
  const integerValue = parseInt(value);

  const decimalIndex = stringValue.indexOf('.');
  let decimalValue = 0;

  if (decimalIndex !== -1) {
    decimalValue = parseFloat('0.' + stringValue.slice(decimalIndex + 1));
  }

  const integerStringValue = addThousandSeperators(integerValue);
  let decimalStringValue;

  if (decimals === 0 || (decimals == null && decimalValue === 0)) {
    return integerStringValue;
  }

  if (decimals == null) {
    decimalStringValue = decimalValue.toString().slice(2);
  } else {
    decimalStringValue = decimalValue.toFixed(decimals).slice(2);
  }

  let negativeZero = '';

  if (integerValue === 0 && value < 0) {
    negativeZero = '-';
  }

  return `${negativeZero}${integerStringValue},${decimalStringValue}`;
}

export function formatDate(value, options) {
  if (!(value instanceof Date)) { return value; }

  if (options === null || typeof options !== 'object') {
    options = {};
  }

  let weekday = '';
  if (options.weekday) {
    weekday         = `${moment(value).format('ddd')} `;
    options.weekday = undefined;
  }

  options = $.extend({
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
    hour:   'numeric',
    minute: 'numeric'
  }, options);

  Object.keys(options).forEach(function(key) {
    if (options.hasOwnProperty(key) && options[key] == null) {
      options[key] = undefined;
    }
  });

  return `${weekday}${value.toLocaleString('nl-NL', options)}`;
}
