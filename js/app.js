/**
 * CALCULATOR STATE
 * Single source of truth for all calculator inputs and configuration
 */
let calculatorState = {
  // Product inputs
  productPrice: 0,
  productSales: 0,
  productCost: 0,
  
  // Platform selection
  platform: 'gumroad',
  gumroadSaleType: 'direct',
  payhipPlan: 'free',
  
  // Fee configuration
  fees: {
    platformFee: 10,
    platformFixedFee: 0.50,
    paymentProcessing: 2.9,
    paymentFixedFee: 0.30
  },
  
  // Currency
  currency: 'USD'
};

/**
 * Initialize calculator on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  initializeMenuToggle();
  initializeCalculatorInputs();
  initializePlatformSelection();
  initializeFeesEditing();
  initializeActionsButtons();
  initializeResultsDisplay();
  
  // Set initial platform fees and render
  updatePlatformUIVisibility();
  calculateAndRender();
});

/**
 * MENU TOGGLE
 */
function initializeMenuToggle() {
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('#nav');
  
  if (!menuBtn || !nav) return;
  
  menuBtn.addEventListener('click', function() {
    const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    const newState = isOpen ? 'false' : 'true';
    menuBtn.setAttribute('aria-expanded', newState);
    nav.classList.toggle('open', newState === 'true');
  });
  
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      menuBtn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
      menuBtn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
}

/**
 * CALCULATOR INPUT INITIALIZATION
 * Attach event listeners to all input fields
 */
function initializeCalculatorInputs() {
  // Product inputs
  const priceInput = document.querySelector('#price');
  const salesInput = document.querySelector('#sales');
  const costInput = document.querySelector('#cost');
  
  if (priceInput) {
    priceInput.addEventListener('input', handlePriceChange);
    priceInput.addEventListener('change', handlePriceChange);
  }
  
  if (salesInput) {
    salesInput.addEventListener('input', handleSalesChange);
    salesInput.addEventListener('change', handleSalesChange);
  }
  
  if (costInput) {
    costInput.addEventListener('input', handleCostChange);
    costInput.addEventListener('change', handleCostChange);
  }
}

function handlePriceChange(e) {
  calculatorState.productPrice = safeNumber(e.target.value);
  calculateAndRender();
}

function handleSalesChange(e) {
  calculatorState.productSales = safeNumber(e.target.value);
  calculateAndRender();
}

function handleCostChange(e) {
  calculatorState.productCost = safeNumber(e.target.value);
  calculateAndRender();
}

/**
 * PLATFORM SELECTION
 */
function initializePlatformSelection() {
  const platformSelect = document.querySelector('#platform');
  
  if (platformSelect) {
    platformSelect.addEventListener('change', handlePlatformChange);
  }
  
  // Gumroad sale type
  const gumroadSaleTypeSelect = document.querySelector('#gumroad-sale-type');
  if (gumroadSaleTypeSelect) {
    gumroadSaleTypeSelect.addEventListener('change', function(e) {
      calculatorState.gumroadSaleType = e.target.value;
      updateGumroadFeeDisplay();
      calculateAndRender();
    });
  }
  
  // Payhip plan selection
  const payhipPlanSelect = document.querySelector('#payhip-plan');
  if (payhipPlanSelect) {
    payhipPlanSelect.addEventListener('change', function(e) {
      calculatorState.payhipPlan = e.target.value;
      updatePayhipFeesByPlan();
      calculateAndRender();
    });
  }
}

function handlePlatformChange(e) {
  calculatorState.platform = e.target.value;
  updatePlatformUIVisibility();
  loadPlatformPreset(calculatorState.platform);
  calculateAndRender();
}

function updatePlatformUIVisibility() {
  // Hide all platform fee containers
  document.querySelectorAll('.platform-fees-container').forEach(el => {
    el.style.display = 'none';
  });
  
  // Show only the selected platform's container
  const platformId = calculatorState.platform;
  const activeContainer = document.querySelector(`#${platformId}-fees`);
  if (activeContainer) {
    activeContainer.style.display = 'block';
  }
}

function loadPlatformPreset(platform) {
  const preset = getPlatformFees(platform);
  
  calculatorState.fees = {
    platformFee: preset.platformFee || 0,
    platformFixedFee: preset.platformFixedFee || 0,
    paymentProcessing: preset.paymentProcessing || 0,
    paymentFixedFee: preset.paymentFixedFee || 0
  };
  
  // Update display for all platforms
  updateAllFeeDisplays();
}

function updateAllFeeDisplays() {
  updateGumroadFeeDisplay();
  updatePayhipFeeDisplay();
  updateEtsyFeeDisplay();
  updateCustomFeeDisplay();
}

function updateGumroadFeeDisplay() {
  const platformDisplay = document.querySelector('#gumroad-platform-display');
  const paymentDisplay = document.querySelector('#gumroad-payment-display');
  
  if (platformDisplay) {
    platformDisplay.textContent = `${calculatorState.fees.platformFee}% + ${formatMoney(calculatorState.fees.platformFixedFee, calculatorState.currency)}`;
  }
  
  if (paymentDisplay) {
    paymentDisplay.textContent = `${calculatorState.fees.paymentProcessing}% + ${formatMoney(calculatorState.fees.paymentFixedFee, calculatorState.currency)}`;
  }
}

function updatePayhipFeeDisplay() {
  const platformDisplay = document.querySelector('#payhip-platform-display');
  const paymentDisplay = document.querySelector('#payhip-payment-display');
  
  if (platformDisplay) {
    platformDisplay.textContent = `${calculatorState.fees.platformFee}%`;
  }
  
  if (paymentDisplay) {
    paymentDisplay.textContent = `${calculatorState.fees.paymentProcessing}% + ${formatMoney(calculatorState.fees.paymentFixedFee, calculatorState.currency)}`;
  }
}

function updateEtsyFeeDisplay() {
  const transactionDisplay = document.querySelector('#etsy-transaction-display');
  const paymentDisplay = document.querySelector('#etsy-payment-display');
  
  if (transactionDisplay) {
    transactionDisplay.textContent = `${calculatorState.fees.platformFee}% + ${formatMoney(calculatorState.fees.platformFixedFee, calculatorState.currency)}`;
  }
  
  if (paymentDisplay) {
    paymentDisplay.textContent = `${calculatorState.fees.paymentProcessing}% + ${formatMoney(calculatorState.fees.paymentFixedFee, calculatorState.currency)}`;
  }
}

function updateCustomFeeDisplay() {
  const platformDisplay = document.querySelector('#custom-platform-display');
  const paymentDisplay = document.querySelector('#custom-payment-display');
  
  if (platformDisplay) {
    platformDisplay.textContent = `${calculatorState.fees.platformFee}% + ${formatMoney(calculatorState.fees.platformFixedFee, calculatorState.currency)}`;
  }
  
  if (paymentDisplay) {
    paymentDisplay.textContent = `${calculatorState.fees.paymentProcessing}% + ${formatMoney(calculatorState.fees.paymentFixedFee, calculatorState.currency)}`;
  }
}

function updatePayhipFeesByPlan() {
  const preset = getPlatformFees('payhip');
  const planFee = preset.plans ? preset.plans[calculatorState.payhipPlan] : preset.platformFee;
  
  calculatorState.fees.platformFee = planFee;
  updatePayhipFeeDisplay();
}

/**
 * FEES EDITING
 */
function initializeFeesEditing() {
  // Gumroad edit
  attachFeeEditorHandlers('gumroad');
  
  // Payhip edit
  attachFeeEditorHandlers('payhip');
  
  // Etsy edit
  attachFeeEditorHandlers('etsy');
  
  // Custom fees (always visible)
  attachCustomFeeInputHandlers();
}

function attachFeeEditorHandlers(platform) {
  const editBtn = document.querySelector(`#${platform}-edit-btn`);
  const editor = document.querySelector(`#${platform}-editor`);
  const resetBtn = document.querySelector(`#${platform}-reset`);
  
  if (editBtn && editor) {
    editBtn.addEventListener('click', function() {
      const isVisible = editor.style.display !== 'none';
      editor.style.display = isVisible ? 'none' : 'block';
      
      // Populate editor inputs with current values
      populateFeeEditorInputs(platform);
    });
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      loadPlatformPreset(platform);
      if (editor) {
        editor.style.display = 'none';
      }
      calculateAndRender();
    });
  }
  
  // Attach handlers to fee inputs in the editor
  attachFeeInputHandlers(platform);
}

function populateFeeEditorInputs(platform) {
  const platformFeeInput = document.querySelector(`#${platform}-platform-fee`);
  const platformFixedInput = document.querySelector(`#${platform}-platform-fixed`);
  const paymentFeeInput = document.querySelector(`#${platform}-payment-fee`);
  const paymentFixedInput = document.querySelector(`#${platform}-payment-fixed`);
  
  if (platformFeeInput) platformFeeInput.value = calculatorState.fees.platformFee;
  if (platformFixedInput) platformFixedInput.value = calculatorState.fees.platformFixedFee;
  if (paymentFeeInput) paymentFeeInput.value = calculatorState.fees.paymentProcessing;
  if (paymentFixedInput) paymentFixedInput.value = calculatorState.fees.paymentFixedFee;
}

function attachFeeInputHandlers(platform) {
  const platformFeeInput = document.querySelector(`#${platform}-platform-fee`);
  const platformFixedInput = document.querySelector(`#${platform}-platform-fixed`);
  const paymentFeeInput = document.querySelector(`#${platform}-payment-fee`);
  const paymentFixedInput = document.querySelector(`#${platform}-payment-fixed`);
  
  if (platformFeeInput) {
    platformFeeInput.addEventListener('input', function(e) {
      calculatorState.fees.platformFee = safeNumber(e.target.value);
      updateAllFeeDisplays();
      calculateAndRender();
    });
  }
  
  if (platformFixedInput) {
    platformFixedInput.addEventListener('input', function(e) {
      calculatorState.fees.platformFixedFee = safeNumber(e.target.value);
      updateAllFeeDisplays();
      calculateAndRender();
    });
  }
  
  if (paymentFeeInput) {
    paymentFeeInput.addEventListener('input', function(e) {
      calculatorState.fees.paymentProcessing = safeNumber(e.target.value);
      updateAllFeeDisplays();
      calculateAndRender();
    });
  }
  
  if (paymentFixedInput) {
    paymentFixedInput.addEventListener('input', function(e) {
      calculatorState.fees.paymentFixedFee = safeNumber(e.target.value);
      updateAllFeeDisplays();
      calculateAndRender();
    });
  }
}

function attachCustomFeeInputHandlers() {
  const platformFeeInput = document.querySelector('#custom-platform-fee');
  const platformFixedInput = document.querySelector('#custom-platform-fixed');
  const paymentFeeInput = document.querySelector('#custom-payment-fee');
  const paymentFixedInput = document.querySelector('#custom-payment-fixed');
  const platformNameInput = document.querySelector('#custom-platform-name');
  
  if (platformFeeInput) {
    platformFeeInput.addEventListener('input', function(e) {
      calculatorState.fees.platformFee = safeNumber(e.target.value);
      updateCustomFeeDisplay();
      calculateAndRender();
    });
  }
  
  if (platformFixedInput) {
    platformFixedInput.addEventListener('input', function(e) {
      calculatorState.fees.platformFixedFee = safeNumber(e.target.value);
      updateCustomFeeDisplay();
      calculateAndRender();
    });
  }
  
  if (paymentFeeInput) {
    paymentFeeInput.addEventListener('input', function(e) {
      calculatorState.fees.paymentProcessing = safeNumber(e.target.value);
      updateCustomFeeDisplay();
      calculateAndRender();
    });
  }
  
  if (paymentFixedInput) {
    paymentFixedInput.addEventListener('input', function(e) {
      calculatorState.fees.paymentFixedFee = safeNumber(e.target.value);
      updateCustomFeeDisplay();
      calculateAndRender();
    });
  }
}

/**
 * RESULTS INITIALIZATION AND RENDERING
 */
function initializeResultsDisplay() {
  // Results are rendered by calculateAndRender()
}

function calculateAndRender() {
  // Prepare input for calculation function
  const input = {
    price: calculatorState.productPrice,
    sales: calculatorState.productSales,
    cost: calculatorState.productCost,
    fees: calculatorState.fees
  };
  
  // Calculate using the existing calculation engine
  const result = calculateFees(input);
  
  // Render results to DOM
  renderResults(result, calculatorState.fees, calculatorState.currency);
}

function renderResults(result, fees, currency) {
  // Gross revenue
  const grossRevenueEl = document.querySelector('#gross-revenue');
  if (grossRevenueEl) {
    grossRevenueEl.textContent = formatMoney(result.grossRevenue, currency);
  }
  
  // Platform fees (percentage + fixed combined)
  const platformFeesEl = document.querySelector('#platform-fees');
  if (platformFeesEl) {
    const totalPlatformFees = result.platformPercentageAmount + result.platformFixedAmount;
    platformFeesEl.textContent = '−' + formatMoney(totalPlatformFees, currency);
  }
  
  // Payment fees (percentage + fixed combined)
  const paymentFeesEl = document.querySelector('#payment-fees');
  if (paymentFeesEl) {
    const totalPaymentFees = result.paymentPercentageAmount + result.paymentFixedAmount;
    paymentFeesEl.textContent = '−' + formatMoney(totalPaymentFees, currency);
  }
  
  // Product costs
  const productCostsEl = document.querySelector('#product-costs');
  if (productCostsEl) {
    productCostsEl.textContent = '−' + formatMoney(result.productCosts, currency);
  }
  
  // Real profit
  const realProfitEl = document.querySelector('#real-profit');
  if (realProfitEl) {
    realProfitEl.textContent = formatMoney(result.netProfit, currency);
  }
  
  // Profit margin
  const profitMarginEl = document.querySelector('#profit-margin');
  if (profitMarginEl) {
    const marginPercent = result.profitMargin.toFixed(1);
    profitMarginEl.textContent = `${marginPercent}% margin`;
  }
  
  // Render fee breakdown if needed
  renderFeeBreakdown(result, fees, currency);
}

/**
 * ACTION BUTTONS: RESET AND SHARE
 */
function initializeActionsButtons() {
  const resultSection = document.querySelector('.results');
  
  if (resultSection) {
    const buttons = resultSection.querySelectorAll('.actions button');
    
    if (buttons.length >= 2) {
      // First button = Reset
      buttons[0].addEventListener('click', handleReset);
      
      // Second button = Share
      buttons[1].addEventListener('click', handleShare);
    }
  }
}

function handleReset() {
  // Reset input values
  const priceInput = document.querySelector('#price');
  const salesInput = document.querySelector('#sales');
  const costInput = document.querySelector('#cost');
  
  if (priceInput) priceInput.value = '';
  if (salesInput) salesInput.value = '';
  if (costInput) costInput.value = '';
  
  // Reset calculator state
  calculatorState.productPrice = 0;
  calculatorState.productSales = 0;
  calculatorState.productCost = 0;
  calculatorState.platform = 'gumroad';
  calculatorState.gumroadSaleType = 'direct';
  calculatorState.payhipPlan = 'free';
  
  // Reset platform selector
  const platformSelect = document.querySelector('#platform');
  if (platformSelect) {
    platformSelect.value = 'gumroad';
  }
  
  // Reset Gumroad sale type
  const gumroadSaleTypeSelect = document.querySelector('#gumroad-sale-type');
  if (gumroadSaleTypeSelect) {
    gumroadSaleTypeSelect.value = 'direct';
  }
  
  // Reset Payhip plan
  const payhipPlanSelect = document.querySelector('#payhip-plan');
  if (payhipPlanSelect) {
    payhipPlanSelect.value = 'free';
  }
  
  // Hide all fee editors
  document.querySelectorAll('.fee-editor').forEach(el => {
    el.style.display = 'none';
  });
  
  // Load default preset
  loadPlatformPreset('gumroad');
  updatePlatformUIVisibility();
  
  // Recalculate and render
  calculateAndRender();
}

function handleShare() {
  const result = calculateFees({
    price: calculatorState.productPrice,
    sales: calculatorState.productSales,
    cost: calculatorState.productCost,
    fees: calculatorState.fees
  });
  
  const shareText = `Digital Product Profit Calculator\n\nGross Revenue: ${formatMoney(result.grossRevenue, calculatorState.currency)}\nTotal Fees: ${formatMoney(result.totalFees, calculatorState.currency)}\nProduct Costs: ${formatMoney(result.productCosts, calculatorState.currency)}\nReal Profit: ${formatMoney(result.netProfit, calculatorState.currency)}\nProfit Margin: ${result.profitMargin.toFixed(1)}%`;
  
  // Try Web Share API
  if (navigator.share) {
    navigator.share({
      title: 'My Digital Product Profit',
      text: shareText
    }).catch(err => {
      // User cancelled
    });
  } else {
    // Fallback: Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Profit summary copied to clipboard!');
    }).catch(err => {
      alert('Could not copy to clipboard: ' + err);
    });
  }
}
