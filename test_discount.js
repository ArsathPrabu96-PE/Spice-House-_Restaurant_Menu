// Quick smoke test for discount logic (10%)
const inrFmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits:2 });

const state = { discountPercent: 10, currency: 'INR' };

function formatForDisplay(priceInINR){
  const pct = (state && typeof state.discountPercent === 'number') ? state.discountPercent : 0;
  const factor = 1 - (pct/100);
  const effectiveINR = Number((priceInINR * factor).toFixed(2));
  if(state.currency === 'INR') return inrFmt.format(effectiveINR);
  return effectiveINR;
}

function renderPriceBlock(item){
  const orig = item.price;
  const pct = state && typeof state.discountPercent === 'number' ? state.discountPercent : 0;
  if(pct > 0){
    const discounted = Number((orig * (1 - pct/100)).toFixed(2));
    return `${inrFmt.format(orig)} -> ${inrFmt.format(discounted)} [${pct}% OFF]`;
  }
  return `${inrFmt.format(orig)}`;
}

function computeOrder(cartItems){
  // cartItems: [{id,price,qty}]
  const pct = state && typeof state.discountPercent === 'number' ? state.discountPercent : 0;
  const items = cartItems.map(it=>{
    const paidUnit = pct>0 ? Number((it.price*(1-pct/100)).toFixed(2)) : it.price;
    return { ...it, paidUnit };
  });
  const total = items.reduce((s,it)=> s + it.paidUnit*it.qty, 0);
  return { items, total: Number(total.toFixed(2)) };
}

// Test item
const item = { id:1, name:'Test Dish', price:1000.00 };
console.log('renderPriceBlock:', renderPriceBlock(item));
console.log('formatForDisplay(1000):', formatForDisplay(1000));

const cart = [{ id:1, price:1000.00, qty:2 }, { id:2, price:500.00, qty:1 }];
const order = computeOrder(cart);
console.log('Order items with paidUnit:');
order.items.forEach(it=> console.log(` - id:${it.id} price:${inrFmt.format(it.price)} paid:${inrFmt.format(it.paidUnit)} qty:${it.qty}`));
console.log('Order total (paid):', inrFmt.format(order.total));

// Format stored paid for display
function formatPaidForDisplay(priceInINR){ try{ return inrFmt.format(Number(priceInINR)); }catch(e){ return Number(priceInINR).toFixed(2); } }
console.log('formatPaidForDisplay(order.total):', formatPaidForDisplay(order.total));
