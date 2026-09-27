/** Centralized, editable-by-copy platform presets. */
const platformFees = {
  gumroad: { name: 'Gumroad', platformFee: 10, platformFixedFee: 0.50, paymentProcessing: 2.9, paymentFixedFee: 0.30, lastVerified: 'September 2026' },
  payhip: { name: 'Payhip', platformFee: 5, platformFixedFee: 0, paymentProcessing: 2.9, paymentFixedFee: 0.30, lastVerified: 'September 2026', plans: { free: 5, plus: 2, pro: 0 } },
  etsy: { name: 'Etsy', platformFee: 6.5, platformFixedFee: 0, paymentProcessing: 4.5, paymentFixedFee: 0.30, lastVerified: 'September 2026' },
  custom: { name: 'Custom', platformFee: 5, platformFixedFee: 0.50, paymentProcessing: 2.9, paymentFixedFee: 0.30, lastVerified: null }
};
function getPlatformFees(platform) { return { ...(platformFees[platform] || platformFees.custom) }; }
function getDefaultPreset(platform) { return getPlatformFees(platform); }
