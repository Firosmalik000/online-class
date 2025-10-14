/**
 * Converts a number to a formatted currency string.
 * @param {number} value - The number to convert.
 * @param {string} [locale='id-ID'] - The locale for formatting.
 * @param {string} [currency='IDR'] - The currency code.
 * @returns {string} - The formatted currency string.
 */
function numberToCurrency(value, locale = 'id-ID', currency = 'IDR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
}

export { numberToCurrency };