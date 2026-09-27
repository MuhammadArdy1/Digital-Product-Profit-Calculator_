function formatMoney(value, currency) {
  const symbol = currency === 'IDR' ? 'Rp' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const decimals = currency === 'IDR' ? 0 : 2;
  return symbol + Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function renderFeeBreakdown(result, fees, currency) {
  const breakdown = document.querySelector('#breakdown-details dl');
  if (!breakdown) return;
  const rows = [
    ['Platform Fee', `${fees.platformFee}%`, result.platformPercentageAmount],
    ['Platform Fixed Fee', `${formatMoney(fees.platformFixedFee, currency)}/sale`, result.platformFixedAmount],
    ['Payment Processing', `${fees.paymentProcessing}%`, result.paymentPercentageAmount],
    ['Payment Fixed Fee', `${formatMoney(fees.paymentFixedFee, currency)}/sale`, result.paymentFixedAmount]
  ];
  breakdown.innerHTML = rows.map(row => `<div><dt>${row[0]} <small>${row[1]}</small></dt><dd>-${formatMoney(row[2], currency)}</dd></div>`).join('');
}
