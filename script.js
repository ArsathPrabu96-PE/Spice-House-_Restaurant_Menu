// Indian restaurant menu data
const menu = [
  { id: 1, name: 'Butter Chicken', category: 'Main', price: 950.00, desc: 'Creamy tomato-based chicken curry', img: 'images/Butter Chicken.jpg' },
  { id: 2, name: 'Chicken Tikka Masala', category: 'Main', price: 975.00, desc: 'Grilled tikka in spiced gravy', img: 'images/Chicken Tikka Masala.jpg' },
  { id: 3, name: 'Palak Paneer', category: 'Main', price: 650.00, desc: 'Cottage cheese in spinach gravy (vegetarian)', img: 'images/Palak Paneer.jpg' },
  { id: 4, name: 'Dal Makhani', category: 'Main', price: 580.00, desc: 'Slow-cooked black lentils with butter', img: 'images/Dal Makhani.jpg' },
  { id: 5, name: 'Biryani (Chicken)', category: 'Rice & Biryani', price: 820.00, desc: 'Aromatic spiced basmati rice with chicken', img: 'images/Biryani (Chicken).jpg' },
  { id: 6, name: 'Vegetable Biryani', category: 'Rice & Biryani', price: 700.00, desc: 'Fragrant basmati rice with mixed vegetables', img: 'images/Vegetable Biryani.jpg' },
  { id: 7, name: 'Garlic Naan', category: 'Bread', price: 160.00, desc: 'Tandoor-baked flatbread with garlic', img: 'images/Garlic Naan.jpg' },
  { id: 8, name: 'Butter Naan', category: 'Bread', price: 140.00, desc: 'Soft tandoori flatbread with butter', img: 'images/Butter Naan.jpg' },
  { id: 9, name: 'Samosa (2 pcs)', category: 'Starters', price: 260.00, desc: 'Crispy pastry filled with spiced potatoes and peas', img: 'images/Samosa (2 pcs).jpg' },
  { id: 10, name: 'Paneer Tikka', category: 'Starters', price: 420.00, desc: 'Marinated and grilled cottage cheese', img: 'images/Paneer Tikka.jpg' },
  { id: 11, name: 'Tandoori Chicken (Half)', category: 'Starters', price: 590.00, desc: 'Charcoal-grilled spiced chicken', img: 'images/Tandoori Chicken (Half).jpg' },
  { id: 12, name: 'Raita', category: 'Sides', price: 160.00, desc: 'Yogurt with cucumber and spices', img: 'images/Raita.jpg' },
  { id: 13, name: 'Masala Fries', category: 'Sides', price: 220.00, desc: 'French fries tossed with Indian spices', img: 'images/Masala Fries.jpg' },
  { id: 14, name: 'Gulab Jamun (2 pcs)', category: 'Dessert', price: 240.00, desc: 'Deep-fried milk dumplings in syrup', img: 'images/Gulab Jamun (2 pcs).jpg' },
  { id: 15, name: 'Mango Lassi', category: 'Beverages', price: 190.00, desc: 'Sweet mango-yogurt smoothie', img: 'images/Mango Lassi.jpg' },
  { id: 16, name: 'Aloo Gobi', category: 'Main', price: 430.00, desc: 'Potato and cauliflower stir-fry with spices', img: 'images/Aloo Gobi.jpg' },
  { id: 17, name: 'Chole Bhature', category: 'Main', price: 360.00, desc: 'Spiced chickpeas with fried bread', img: 'images/Chole Bhature.jpg' },
  { id: 18, name: 'Pav Bhaji', category: 'Main', price: 320.00, desc: 'Vegetable mash served with buttered rolls', img: 'images/Pav Bhaji.jpg' },
  { id: 19, name: 'Rajma Chawal', category: 'Main', price: 300.00, desc: 'Kidney beans curry with steamed rice', img: 'images/Rajma Chawal.jpg' },
  { id: 20, name: 'Kheer', category: 'Dessert', price: 210.00, desc: 'Rice pudding flavored with cardamom and nuts', img: 'images/Kheer.jpg' }
];

const state = {
  filter: 'All',
  cart: {}, // id -> qty
};

// load image overrides (data URLs) from localStorage
let imageOverrides = {};
try{ imageOverrides = JSON.parse(localStorage.getItem('restaurant_images_v1')||'{}') || {}; }catch(e){ imageOverrides = {}; }

// If a local image exists in the images folder, preload it into localStorage for a menu item
function preloadLocalImageIfMissing(id, localPath){
  try{
    if(imageOverrides[id]) return; // already have an override
    fetch(localPath).then(res=>{
      if(!res.ok) return;
      return res.blob();
    }).then(blob=>{
      if(!blob) return;
      const reader = new FileReader();
      reader.onload = ()=>{
        try{ imageOverrides[id] = reader.result; localStorage.setItem('restaurant_images_v1', JSON.stringify(imageOverrides)); }catch(e){}
        // re-render if menu is present
        try{ renderMenu(); }catch(e){}
      };
      reader.readAsDataURL(blob);
    }).catch(()=>{});
  }catch(e){}
}

// Preload Butter Naan image (menu id 8) from local images folder if available
preloadLocalImageIfMissing(8, 'images/Butter Naan.jpg');

// track if price edit mode is on
let editMode = false;

// Background images (HD food images from unsplash source)
const bgImages = [
  'https://images.unsplash.com/photo-1604908177453-6f61b3a9f6f2?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1547592180-7a3a9c23c9c2?auto=format&fit=crop&w=1600&q=80'
];

let bgIndex = 0;

function rotateBackground(){
  const el = document.getElementById('bg-rotator');
  if(!el) return;
  el.style.opacity = 0;
  const src = bgImages[bgIndex];
  const img = new Image();
  img.onload = ()=>{
    setTimeout(()=>{
      el.style.backgroundImage = `url('${src}')`;
      el.style.opacity = 1;
      bgIndex = (bgIndex + 1) % bgImages.length;
    }, 600);
  };
  img.onerror = ()=>{
    const fallback = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'><rect width='100%' height='100%' fill='%23f8f4ed'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='36'>Background not available</text></svg>";
    setTimeout(()=>{
      el.style.backgroundImage = `url('${fallback}')`;
      el.style.opacity = 1;
      bgIndex = (bgIndex + 1) % bgImages.length;
    }, 600);
  };
  img.src = src;
}

// start rotation every 10 seconds
setTimeout(()=>{ rotateBackground(); setInterval(rotateBackground, 10000); }, 200);

// currency formatters
const inrFmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits:2 });
const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits:2 });

// conversion base: prices stored in INR. how many INR per 1 unit of currency
const conversionToINR = { INR: 1, USD: 83 };
state.currency = 'INR';

// load cart from localStorage if exists
try{
  const saved = localStorage.getItem('restaurant_cart_v1');
  if(saved) state.cart = JSON.parse(saved) || {};
}catch(e){ /* ignore */ }

// load price overrides if any
try{
  const p = localStorage.getItem('restaurant_prices_v1');
  if(p){
    const parsed = JSON.parse(p);
    menu.forEach(it => { if(parsed[it.id]) it.price = parsed[it.id]; });
  }
}catch(e){}

const menuEl = document.getElementById('menu');
const filtersEl = document.getElementById('filters');
const visibleTotalEl = document.getElementById('visible-total');
const cartTotalEl = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

function uniqueCategories(items) {
  const cats = new Set(items.map(i => i.category));
  return ['All', ...cats];
}

function renderFilters() {
  const cats = uniqueCategories(menu);
  filtersEl.innerHTML = cats.map(cat => `
    <button class="btn btn-sm me-2 ${cat===state.filter? 'btn-primary': 'btn-outline-primary'}" data-cat="${cat}">${cat}</button>
  `).join('');

  filtersEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.getAttribute('data-cat');
      renderFilters();
      renderMenu();
    });
  });
}

function formatPrice(n){
  return formatForDisplay(n);
}

function formatForDisplay(priceInINR){
  try{
    if(state.currency === 'INR') return inrFmt.format(priceInINR);
    // convert INR -> USD for display
    const usd = priceInINR / conversionToINR['USD'];
    return usdFmt.format(usd);
  }catch(e){ return priceInINR.toFixed(2); }
}

function renderMenu() {
  const items = menu.filter(i => state.filter === 'All' ? true : i.category === state.filter);
  menuEl.innerHTML = items.map((i, idx) => `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100">
        <div class="card-body d-flex flex-column">
          <div class="thumb mb-3">
            <img src="${imageOverrides[i.id] || i.img}" alt="${i.name}" loading="lazy" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'240\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23f8f4ed\\'/><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23999\\' font-size=\\'20\\'>Image not available</text></svg>'"/>
            <div class="mt-2 d-flex gap-2">
              <label class="btn btn-sm btn-outline-secondary mb-0" for="upload-${i.id}"><i class="fa-solid fa-upload"></i> Upload</label>
              <input id="upload-${i.id}" type="file" accept="image/*" style="display:none;" data-id="${i.id}" class="img-uploader" />
              <button class="btn btn-sm btn-outline-danger remove-img" data-id="${i.id}">Remove</button>
            </div>
          </div>
          <h5 class="card-title">${i.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${i.category} • <span class="price-text" data-id="${i.id}">${formatForDisplay(i.price)}</span></h6>
          <p class="card-text flex-grow-1">${i.desc}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div>
              <button class="btn btn-sm btn-outline-secondary me-2 control-btn" data-action="dec" data-id="${i.id}"><i class="fa-solid fa-minus"></i></button>
              <span id="qty-${i.id}">${state.cart[i.id]||0}</span>
              <button class="btn btn-sm btn-outline-secondary ms-2 control-btn" data-action="inc" data-id="${i.id}"><i class="fa-solid fa-plus"></i></button>
            </div>
            <button class="btn btn-sm btn-acc ${['btn-add-1','btn-add-2','btn-add-3','btn-add-4','btn-add-5'][idx % 5]} control-btn" data-action="add" data-id="${i.id}"><i class="fa-solid fa-bowl-food btn-icon"></i> Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // wire up buttons
  menuEl.querySelectorAll('button').forEach(btn => {
    const action = btn.getAttribute('data-action');
    const id = Number(btn.getAttribute('data-id'));
    if (!action) return;
    btn.addEventListener('click', () => {
      // Add glow and shake effect when pressed
      btn.classList.add('btn-pressed');
      setTimeout(()=> btn.classList.remove('btn-pressed'), 450);
      if (action === 'inc') {
        state.cart[id] = (state.cart[id]||0) + 1;
        updateQty(id);
      } else if (action === 'dec') {
        if (state.cart[id]) {
          state.cart[id]--;
          if (state.cart[id] <= 0) delete state.cart[id];
        }
        updateQty(id);
      } else if (action === 'add') {
        state.cart[id] = (state.cart[id]||0) + 1;
        updateQty(id);
      }
      // persist cart
      try{ localStorage.setItem('restaurant_cart_v1', JSON.stringify(state.cart)); }catch(e){}
      updateTotals();
    });
  });

    // price edit handlers (open modal)
    document.querySelectorAll('.price-text').forEach(el=>{
      el.addEventListener('click', (ev)=>{
        if(!editMode) return;
        const id = Number(el.getAttribute('data-id'));
        openPriceModal(id);
      });
    });

    // image upload handlers
    menuEl.querySelectorAll('.img-uploader').forEach(inp=>{
      inp.addEventListener('change', (ev)=>{
        const file = ev.target.files && ev.target.files[0];
        const id = Number(inp.getAttribute('data-id'));
        if(!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
          imageOverrides[id] = reader.result; // data URL
          try{ localStorage.setItem('restaurant_images_v1', JSON.stringify(imageOverrides)); }catch(e){ console.warn('Failed to save image override', e); }
          renderMenu();
        };
        reader.readAsDataURL(file);
      });
    });

    menuEl.querySelectorAll('.remove-img').forEach(b=> b.addEventListener('click', ()=>{
      const id = Number(b.getAttribute('data-id'));
      if(imageOverrides[id]){ delete imageOverrides[id]; try{ localStorage.setItem('restaurant_images_v1', JSON.stringify(imageOverrides)); }catch(e){} renderMenu(); }
    }));

  updateTotals();
}

function updateQty(id) {
  const el = document.getElementById(`qty-${id}`);
  if (el) el.textContent = state.cart[id] || 0;
}

function updateTotals() {
  // visible total now shows cart monetary value (sum price*qty)
  const cartTotalValue = Object.entries(state.cart).reduce((s,[id,qty])=>{
    const it = menu.find(x=>x.id===Number(id));
    return s + (it? it.price * qty : 0);
  }, 0);
  visibleTotalEl.textContent = formatForDisplay(cartTotalValue);

  // cart total now shows number of items in cart
  const itemCount = Object.values(state.cart).reduce((s,q)=>s+q,0);
  cartTotalEl.textContent = itemCount;
  // update header badge too
  const badge = document.getElementById('cart-badge');
  if(badge) badge.textContent = itemCount;
}

clearCartBtn.addEventListener('click', ()=>{
  state.cart = {};
  // update displayed qtys
  menu.forEach(i => updateQty(i.id));
  updateTotals();
  try{ localStorage.removeItem('restaurant_cart_v1'); }catch(e){}
});

// init
renderFilters();
renderMenu();

// UI handlers: currency selector and edit toggle
const currencySelect = document.getElementById('currency-select');
const toggleEditBtn = document.getElementById('toggle-edit-prices');
const openCartBtn = document.getElementById('open-cart');
const cartDrawer = document.getElementById('cart-drawer');
const cartContents = document.getElementById('cart-contents');
const closeCartBtn = document.getElementById('close-cart');
const cartSubtotalEl = document.getElementById('cart-subtotal');
if(currencySelect){
  currencySelect.value = state.currency;
  currencySelect.addEventListener('change', (e)=>{
    state.currency = e.target.value;
    renderMenu();
    updateTotals();
  });
}
if(toggleEditBtn){
  toggleEditBtn.addEventListener('click', ()=>{
    editMode = !editMode;
    toggleEditBtn.textContent = editMode ? 'Done Editing' : 'Edit Prices';
  });
}

// Cart drawer handlers
function renderCartDrawer(){
  if(!cartContents) return;
  const lines = Object.entries(state.cart).map(([id,qty])=>{
    const it = menu.find(m=>m.id===Number(id));
    if(!it) return '';
    return `
      <div class="cart-item" data-id="${id}">
        <img src="${it.img}" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'96\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'%23f8f4ed\\'/><text x=\\'50%\\' y=\\'50%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'%23999\\' font-size=\\'12\\'>No image</text></svg>'" />
        <div style="flex:1">
          <div><strong>${it.name}</strong></div>
          <div class="text-muted small">${inrFmt.format(it.price)}</div>
        </div>
        <div class="text-end">
          <div><button class="btn btn-sm btn-outline-secondary cart-dec" data-id="${id}"><i class="fa-solid fa-minus"></i></button>
          <span class="mx-2">${qty}</span>
          <button class="btn btn-sm btn-outline-secondary cart-inc" data-id="${id}"><i class="fa-solid fa-plus"></i></button></div>
          <div class="mt-2"><button class="btn btn-sm btn-danger cart-remove" data-id="${id}"><i class="fa-solid fa-trash"></i></button></div>
        </div>
      </div>
    `;
  }).join('');
  cartContents.innerHTML = lines || '<div class="text-muted">Your cart is empty</div>';
  // subtotal
  const subtotal = Object.entries(state.cart).reduce((s,[id,qty])=>{ const it = menu.find(m=>m.id===Number(id)); return s + (it? it.price * qty : 0); },0);
  cartSubtotalEl.textContent = formatForDisplay(subtotal);

  // wire drawer buttons
  cartContents.querySelectorAll('.cart-inc').forEach(b=> b.addEventListener('click', ()=>{ const id=Number(b.getAttribute('data-id')); state.cart[id] = (state.cart[id]||0)+1; saveCartAndRefresh(); }));
  cartContents.querySelectorAll('.cart-dec').forEach(b=> b.addEventListener('click', ()=>{ const id=Number(b.getAttribute('data-id')); if(state.cart[id]){ state.cart[id]--; if(state.cart[id]<=0) delete state.cart[id]; } saveCartAndRefresh(); }));
  cartContents.querySelectorAll('.cart-remove').forEach(b=> b.addEventListener('click', ()=>{ const id=Number(b.getAttribute('data-id')); delete state.cart[id]; saveCartAndRefresh(); }));
}

function saveCartAndRefresh(){ try{ localStorage.setItem('restaurant_cart_v1', JSON.stringify(state.cart)); }catch(e){} updateQtysAndTotals(); renderCartDrawer(); }

function updateQtysAndTotals(){ menu.forEach(i => updateQty(i.id)); updateTotals(); }

if(openCartBtn && cartDrawer){ openCartBtn.addEventListener('click', ()=>{ cartDrawer.classList.add('open'); renderCartDrawer(); cartDrawer.setAttribute('aria-hidden','false'); }); }
if(closeCartBtn && cartDrawer){ closeCartBtn.addEventListener('click', ()=>{ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }); }

// --- Price modal logic ---
const priceModal = document.getElementById('price-modal');
const priceModalName = document.getElementById('price-modal-name');
const priceModalCurrency = document.getElementById('price-modal-currency');
const priceModalInput = document.getElementById('price-modal-input');
const priceModalPreview = document.getElementById('price-modal-preview');
const priceModalSave = document.getElementById('price-modal-save');
const priceModalCancel = document.getElementById('price-modal-cancel');
const priceModalClose = document.getElementById('price-modal-close');
let priceModalCurrentId = null;

function openPriceModal(id){
  const item = menu.find(m=>m.id===id);
  if(!item) return;
  priceModalCurrentId = id;
  priceModalName.textContent = item.name;
  priceModalCurrency.textContent = state.currency;
  const displayVal = state.currency === 'INR' ? item.price : (item.price / conversionToINR[state.currency]);
  priceModalInput.value = Number(displayVal.toFixed(2));
  priceModalPreview.textContent = `Preview: ${formatForDisplay(state.currency==='INR'? Number(priceModalInput.value) : Number(priceModalInput.value) * conversionToINR[state.currency])}`;
  priceModal.style.display = 'flex';
}

function closePriceModal(){ priceModal.style.display = 'none'; priceModalCurrentId = null; }

priceModalInput && priceModalInput.addEventListener('input', ()=>{
  const raw = parseFloat(priceModalInput.value);
  if(isNaN(raw)) { priceModalPreview.textContent = 'Invalid value'; return; }
  const asINR = state.currency === 'INR' ? raw : raw * conversionToINR[state.currency];
  priceModalPreview.textContent = `Preview: ${formatForDisplay(asINR)}`;
});
priceModalSave && priceModalSave.addEventListener('click', ()=>{
  const raw = parseFloat(priceModalInput.value);
  if(isNaN(raw) || raw < 0){ alert('Enter a valid positive number'); return; }
  const newInINR = state.currency === 'INR' ? raw : raw * conversionToINR[state.currency];
  const id = priceModalCurrentId;
  const item = menu.find(m=>m.id===id);
  if(!item) return closePriceModal();
  item.price = Number(newInINR.toFixed(2));
  // persist overrides
  try{ const map = JSON.parse(localStorage.getItem('restaurant_prices_v1')||'{}'); map[id]=item.price; localStorage.setItem('restaurant_prices_v1', JSON.stringify(map)); }catch(e){}
  closePriceModal(); renderMenu(); renderCartDrawer(); updateTotals();
});
priceModalCancel && priceModalCancel.addEventListener('click', closePriceModal);
priceModalClose && priceModalClose.addEventListener('click', closePriceModal);

// --- Checkout modal logic ---
const checkoutModal = document.getElementById('checkout-modal');
const checkoutClose = document.getElementById('checkout-close');
const checkoutCancel = document.getElementById('checkout-cancel');
const checkoutSubmit = document.getElementById('checkout-submit');
const checkoutEmail = document.getElementById('checkout-email');
const checkoutSummary = document.getElementById('checkout-summary');
const checkoutBtn = document.getElementById('checkout-btn');
const quickCheckoutBtn = document.getElementById('quick-checkout');
const ordersBadgeEl = document.getElementById('orders-badge');

function openCheckoutModal(){
  // build summary HTML
  const lines = Object.entries(state.cart).map(([id,qty])=>{
    const it = menu.find(m=>m.id===Number(id));
    if(!it) return '';
    return `<div>${qty} x ${it.name} — ${formatForDisplay(it.price * qty)}</div>`;
  }).join('');
  const subtotal = Object.entries(state.cart).reduce((s,[id,qty])=>{ const it = menu.find(m=>m.id===Number(id)); return s + (it? it.price * qty : 0); },0);
  checkoutSummary.innerHTML = lines + `<div class="mt-2"><strong>Total: ${formatForDisplay(subtotal)}</strong></div>`;
  checkoutEmail.value = '';
  checkoutModal.style.display = 'flex';
}

function closeCheckoutModal(){ checkoutModal.style.display = 'none'; }

checkoutBtn && checkoutBtn.addEventListener('click', ()=>{ openCheckoutModal(); });
checkoutClose && checkoutClose.addEventListener('click', closeCheckoutModal);
checkoutCancel && checkoutCancel.addEventListener('click', closeCheckoutModal);

checkoutSubmit && checkoutSubmit.addEventListener('click', ()=>{
  const email = checkoutEmail.value.trim();
  if(!email || !email.includes('@')){ alert('Please enter a valid email'); return; }
  // create order object
  const order = { id: 'order_' + Date.now(), email, items: Object.entries(state.cart).map(([id,qty])=>{ const it = menu.find(m=>m.id===Number(id)); return { id: Number(id), name: it? it.name : 'Unknown', qty, unitPriceINR: it? it.price : 0 }; }), currency:'INR', totalINR: Object.entries(state.cart).reduce((s,[id,qty])=>{ const it = menu.find(m=>m.id===Number(id)); return s + (it? it.price * qty : 0); },0), createdAt: new Date().toISOString() };
  // save to localStorage array
  try{
    const prev = JSON.parse(localStorage.getItem('restaurant_orders_v1')||'[]');
    prev.push(order);
    localStorage.setItem('restaurant_orders_v1', JSON.stringify(prev));
    // update orders badge
    if(ordersBadgeEl) ordersBadgeEl.textContent = prev.length;
  }catch(e){ console.warn('Failed to save order', e); }
  // clear cart
  state.cart = {};
  try{ localStorage.removeItem('restaurant_cart_v1'); }catch(e){}
  updateQtysAndTotals(); renderCartDrawer(); closeCheckoutModal(); alert('Order placed! A copy is saved locally.');
});

// Quick checkout: create order from current cart with a placeholder email
quickCheckoutBtn && quickCheckoutBtn.addEventListener('click', ()=>{
  const itemCount = Object.values(state.cart).reduce((s,q)=>s+q,0);
  if(itemCount === 0){ alert('Cart is empty'); return; }
  const email = 'guest@example.com';
  const order = { id: 'order_' + Date.now(), email, items: Object.entries(state.cart).map(([id,qty])=>{ const it = menu.find(m=>m.id===Number(id)); return { id: Number(id), name: it? it.name : 'Unknown', qty, unitPriceINR: it? it.price : 0 }; }), currency:'INR', totalINR: Object.entries(state.cart).reduce((s,[id,qty])=>{ const it = menu.find(m=>m.id===Number(id)); return s + (it? it.price * qty : 0); },0), createdAt: new Date().toISOString() };
  try{
    const prev = JSON.parse(localStorage.getItem('restaurant_orders_v1')||'[]'); prev.push(order); localStorage.setItem('restaurant_orders_v1', JSON.stringify(prev));
    if(ordersBadgeEl) ordersBadgeEl.textContent = prev.length;
  }catch(e){ console.warn('Failed to save order', e); }
  state.cart = {};
  try{ localStorage.removeItem('restaurant_cart_v1'); }catch(e){}
  updateQtysAndTotals(); renderCartDrawer(); renderOrders(); openModal(ordersModal); alert('Quick order placed (guest).');
});

// --- Brand title / icon width matching ---
function debounce(fn, wait){ let t; return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), wait); }; }

function matchIconWidthToTitle(){
  try{
    const titleEl = document.querySelector('.brand-stack .brand-title');
    const iconEl = document.getElementById('title-icon');
    if(!titleEl || !iconEl) return;
    const rect = titleEl.getBoundingClientRect();
  // Use a fixed size per user request: 140px x 60px
    iconEl.style.width = '140px';
    iconEl.style.height = '60px';
  }catch(e){ /* ignore */ }
}

// run on load and resize
window.addEventListener('load', matchIconWidthToTitle);
window.addEventListener('resize', debounce(matchIconWidthToTitle, 120));

// also call once now in case script runs after load
setTimeout(matchIconWidthToTitle, 200);

// Fetch FX rates from exchangerate.host (no API key) and fall back to existing conversion value
async function fetchRates(){
  try{
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=INR');
    const data = await res.json();
    if(data && data.rates && data.rates.INR){
      const rate = data.rates.INR; // 1 USD = rate INR
      conversionToINR['USD'] = rate;
      console.log('Updated USD->INR rate:', rate);
      renderMenu(); updateTotals(); renderCartDrawer();
    }
  }catch(e){ console.warn('Failed to fetch FX rates', e); }
}

// try fetch rates on load and every 10 minutes
fetchRates(); setInterval(fetchRates, 10*60*1000);

// initialize orders badge
try{
  const savedOrders = JSON.parse(localStorage.getItem('restaurant_orders_v1')||'[]');
  if(ordersBadgeEl) ordersBadgeEl.textContent = savedOrders.length;
}catch(e){}

// --- Accessibility: basic focus trap and Escape-to-close for modals ---
function trapFocus(modalEl){
  const focusable = modalEl.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  if(!focusable.length) return () => {};
  const first = focusable[0]; const last = focusable[focusable.length-1];
  function keyHandler(e){
    if(e.key === 'Tab'){
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  }
  modalEl.addEventListener('keydown', keyHandler);
  // focus first
  setTimeout(()=> first.focus(), 10);
  return ()=> modalEl.removeEventListener('keydown', keyHandler);
}

let activeModal = null; let activeModalUntrap = null;
function openModal(modalEl){ if(!modalEl) return; modalEl.style.display = 'flex'; modalEl.setAttribute('aria-hidden','false'); activeModal = modalEl; activeModalUntrap = trapFocus(modalEl); }
function closeModal(modalEl){ if(!modalEl) return; modalEl.style.display = 'none'; modalEl.setAttribute('aria-hidden','true'); if(activeModalUntrap) activeModalUntrap(); activeModal = null; activeModalUntrap = null; }

document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && activeModal){ closeModal(activeModal); } });

// --- Orders modal logic ---
const ordersBtn = document.getElementById('view-orders-btn');
const ordersModal = document.getElementById('orders-modal');
const ordersClose = document.getElementById('orders-close');
const ordersCancel = document.getElementById('orders-cancel');
const ordersClear = document.getElementById('orders-clear');
const ordersListEl = document.getElementById('orders-list');

function renderOrders(){
  try{
    const arr = JSON.parse(localStorage.getItem('restaurant_orders_v1')||'[]');
    if(!arr.length){ ordersListEl.innerHTML = '<div class="text-muted">No saved orders</div>'; return; }
    ordersListEl.innerHTML = arr.slice().reverse().map(o=>{
      const itemsHtml = o.items.map(it=>{
        const lineTotal = it.unitPriceINR * it.qty;
        return `<div>${it.qty} x ${it.name} — ${formatForDisplay(lineTotal)}</div>`;
      }).join('');
      return `<div class="order"><div><strong>Order ${o.id}</strong></div><div class="meta">${new Date(o.createdAt).toLocaleString()} • ${o.email}</div><div class="mt-1">${itemsHtml}</div><div class="mt-1"><strong>Total: ${formatForDisplay(o.totalINR)}</strong></div></div>`;
    }).join('');
  }catch(e){ ordersListEl.innerHTML = '<div class="text-danger">Failed to load orders</div>'; }
}

ordersBtn && ordersBtn.addEventListener('click', ()=>{ renderOrders(); openModal(ordersModal); });
ordersClose && ordersClose.addEventListener('click', ()=> closeModal(ordersModal));
ordersCancel && ordersCancel.addEventListener('click', ()=> closeModal(ordersModal));
ordersClear && ordersClear.addEventListener('click', ()=>{
  if(!confirm('Clear all saved orders?')) return; try{ localStorage.removeItem('restaurant_orders_v1'); renderOrders(); alert('Orders cleared'); }catch(e){ alert('Failed to clear orders'); }
});

// Ensure price and checkout modals use openModal/closeModal for a11y
priceModal && (priceModalClose.addEventListener('click', ()=> closeModal(priceModal)));
priceModalCancel && (priceModalCancel.addEventListener('click', ()=> closeModal(priceModal)));
priceModalSave && (priceModalSave.addEventListener('click', ()=>{}));

checkoutBtn && (checkoutBtn.addEventListener('click', ()=> openModal(checkoutModal)));
checkoutClose && (checkoutClose.addEventListener('click', ()=> closeModal(checkoutModal)));
checkoutCancel && (checkoutCancel.addEventListener('click', ()=> closeModal(checkoutModal)));

// Use openModal/closeModal in price modal open/save
function openPriceModal(id){
  const item = menu.find(m=>m.id===id);
  if(!item) return;
  priceModalCurrentId = id;
  priceModalName.textContent = item.name;
  priceModalCurrency.textContent = state.currency;
  const displayVal = state.currency === 'INR' ? item.price : (item.price / conversionToINR[state.currency]);
  priceModalInput.value = Number(displayVal.toFixed(2));
  priceModalPreview.textContent = `Preview: ${formatForDisplay(state.currency==='INR'? Number(priceModalInput.value) : Number(priceModalInput.value) * conversionToINR[state.currency])}`;
  openModal(priceModal);
}
priceModalSave && priceModalSave.addEventListener('click', ()=>{
  const raw = parseFloat(priceModalInput.value);
  if(isNaN(raw) || raw < 0){ alert('Enter a valid positive number'); return; }
  const newInINR = state.currency === 'INR' ? raw : raw * conversionToINR[state.currency];
  const id = priceModalCurrentId;
  const item = menu.find(m=>m.id===id);
  if(!item) return closeModal(priceModal);
  item.price = Number(newInINR.toFixed(2));
  try{ const map = JSON.parse(localStorage.getItem('restaurant_prices_v1')||'{}'); map[id]=item.price; localStorage.setItem('restaurant_prices_v1', JSON.stringify(map)); }catch(e){}
  closeModal(priceModal); renderMenu(); renderCartDrawer(); updateTotals();
});

// override previous checkout open handler to use openModal
checkoutBtn && checkoutBtn.addEventListener('click', ()=>{ openModal(checkoutModal); openCheckoutModal(); });
