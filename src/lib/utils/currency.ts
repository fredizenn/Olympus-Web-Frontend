export const toCurrencyFormat = (value: number) =>
    value?.toLocaleString('en-GH', {
      style: 'currency',
      currency: 'GHS',
    })