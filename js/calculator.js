function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function calculateFees(input) {
  const price = safeNumber(input.price);
  const sales = safeNumber(input.sales);
  const costPerSale = safeNumber(input.cost);
  const fees = input.fees || {};
  const grossRevenue = price * sales;
  const platformPercentageAmount = grossRevenue * safeNumber(fees.platformFee) / 100;
  const platformFixedAmount = safeNumber(fees.platformFixedFee) * sales;
  const paymentPercentageAmount = grossRevenue * safeNumber(fees.paymentProcessing) / 100;
  const paymentFixedAmount = safeNumber(fees.paymentFixedFee) * sales;
  const totalFees = platformPercentageAmount + platformFixedAmount + paymentPercentageAmount + paymentFixedAmount;
  const productCosts = costPerSale * sales;
  const netProfit = grossRevenue - totalFees - productCosts;
  return {
    grossRevenue, platformPercentageAmount, platformFixedAmount,
    paymentPercentageAmount, paymentFixedAmount, totalFees,
    productCosts, netProfit,
    effectiveFeeRate: grossRevenue ? totalFees / grossRevenue * 100 : 0,
    profitMargin: grossRevenue ? netProfit / grossRevenue * 100 : 0,
    profitPerSale: sales ? netProfit / sales : 0
  };
}
