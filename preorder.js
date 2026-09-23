/* Empress Patisserie — custom pre-order builder */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WHATSAPP = '963985122225';
  const hasGsap = typeof gsap !== 'undefined';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ============ OPTIONS ============ */
  const ico = {
    cake: '<path d="M6 20h20v6H6zM8 14h16v6H8zM16 6v8M16 4a1.5 1.5 0 0 1 0 3"/>',
    tart: '<path d="M4 16h24l-3 7H7zM6 16c2-4 18-4 20 0"/><circle cx="12" cy="13" r="1.4"/><circle cx="18" cy="12.5" r="1.4"/>',
    cupcakes: '<path d="M8 16h16l-2.5 10h-11zM8 16c0-5 4-8 8-8s8 3 8 8M16 8V5"/>',
    donuts: '<circle cx="16" cy="16" r="10"/><circle cx="16" cy="16" r="3.5"/>',
    macarons: '<ellipse cx="16" cy="11" rx="10" ry="4"/><ellipse cx="16" cy="21" rx="10" ry="4"/><path d="M6 16h20"/>',
    minis: '<rect x="4" y="12" width="10" height="10" rx="2"/><circle cx="22" cy="17" r="5"/><path d="M9 12V9M22 12V9"/>',
    round: '<circle cx="16" cy="16" r="11"/>',
    square: '<rect x="5" y="5" width="22" height="22" rx="3"/>',
    rectangle: '<rect x="3" y="8" width="26" height="16" rx="3"/>',
    heart: '<path d="M16 27C4 18 4 8 10 7c3-.5 5 1.5 6 4 1-2.5 3-4.5 6-4 6 1 6 11-6 20z"/>',
    number: '<path d="M11 8l5-3v22M22 10a4 4 0 1 1 0 8 4 4 0 1 1 0 8"/>',
    tiered: '<rect x="11" y="4" width="10" height="7" rx="1"/><rect x="8" y="11" width="16" height="7" rx="1"/><rect x="4" y="18" width="24" height="9" rx="1"/>',
  };

  const OPT = {
    product: [
      { v: 'cake', en: 'Cake', ar: 'كيك', icon: 'cake' },
      { v: 'tart', en: 'Tart', ar: 'تارت', icon: 'tart' },
      { v: 'cupcakes', en: 'Cupcakes', ar: 'كب كيك', icon: 'cupcakes' },
      { v: 'donuts', en: 'Donut Box', ar: 'علبة دوناتس', icon: 'donuts' },
      { v: 'macarons', en: 'Macaron Box', ar: 'علبة ماكرون', icon: 'macarons' },
      { v: 'minis', en: 'Mini Pastries', ar: 'حلويات صغيرة', icon: 'minis' },
    ],
    shape: [
      { v: 'round', en: 'Round', ar: 'دائري', icon: 'round' },
      { v: 'square', en: 'Square', ar: 'مربع', icon: 'square' },
      { v: 'rectangle', en: 'Rectangle', ar: 'مستطيل', icon: 'rectangle' },
      { v: 'heart', en: 'Heart', ar: 'قلب', icon: 'heart' },
      { v: 'number', en: 'Number / Letter', ar: 'رقم أو حرف', icon: 'number' },
      { v: 'tiered', en: 'Tiered', ar: 'طبقات', icon: 'tiered' },
    ],
    tiers: [
      { v: 2, en: '2 tiers', ar: 'طبقتين' },
      { v: 3, en: '3 tiers', ar: '٣ طبقات' },
    ],
    size: [
      { v: '6-8', en: '6–8 people', ar: '٦–٨ أشخاص' },
      { v: '10-12', en: '10–12 people', ar: '١٠–١٢ شخص' },
      { v: '15-20', en: '15–20 people', ar: '١٥–٢٠ شخص' },
      { v: '25-30', en: '25–30 people', ar: '٢٥–٣٠ شخص' },
      { v: '40+', en: '40+ people', ar: '+٤٠ شخص' },
    ],
    qty: [
      { v: 6, en: '6 pieces', ar: '٦ قطع' },
      { v: 12, en: '12 pieces', ar: '١٢ قطعة' },
      { v: 24, en: '24 pieces', ar: '٢٤ قطعة' },
      { v: 36, en: '36 pieces', ar: '٣٦ قطعة' },
    ],
    sponge: [
      { v: 'vanilla', en: 'Vanilla', ar: 'فانيلا', c: '#f3dca4' },
      { v: 'chocolate', en: 'Chocolate', ar: 'شوكولا', c: '#5a3526' },
      { v: 'redvelvet', en: 'Red Velvet', ar: 'ريد فيلفت', c: '#9e2a2b' },
      { v: 'pistachio', en: 'Pistachio', ar: 'فستق حلبي', c: '#b8c77a' },
      { v: 'carrot', en: 'Carrot & Walnut', ar: 'جزر وجوز', c: '#d7954a' },
      { v: 'lemon', en: 'Lemon', ar: 'ليمون', c: '#f2e18a' },
      { v: 'coffee', en: 'Coffee', ar: 'قهوة', c: '#8a5f3c' },
    ],
    fillings: [
      { v: 'nutella', en: 'Nutella', ar: 'نوتيلا', c: '#5b3a29' },
      { v: 'pistachio', en: 'Pistachio Cream', ar: 'كريمة الفستق', c: '#9fb35a' },
      { v: 'strawberry', en: 'Fresh Strawberry', ar: 'فراولة طازجة', c: '#d9434f' },
      { v: 'caramel', en: 'Salted Caramel', ar: 'كراميل مملح', c: '#c47f2c' },
      { v: 'lotus', en: 'Lotus Biscoff', ar: 'لوتس', c: '#b9793f' },
      { v: 'mascarpone', en: 'Mascarpone Cream', ar: 'كريمة ماسكاربوني', c: '#f6ecd6' },
      { v: 'raspberry', en: 'Raspberry', ar: 'توت أحمر', c: '#b3264a' },
      { v: 'mango', en: 'Mango', ar: 'مانجو', c: '#f3a93b' },
      { v: 'banana', en: 'Banana', ar: 'موز', c: '#f0d977' },
      { v: 'oreo', en: 'Oreo Cream', ar: 'كريمة أوريو', c: '#8d8683' },
      { v: 'praline', en: 'Hazelnut Praline', ar: 'برالين بندق', c: '#a36b3c' },
      { v: 'kinder', en: 'Kinder', ar: 'كيندر', c: '#e9d6b8' },
    ],
    chocolate: [
      { v: 'dark', en: 'Belgian Dark 70%', ar: 'بلجيكية غامقة', c: '#3b2016' },
      { v: 'milk', en: 'Milk Chocolate', ar: 'شوكولا بالحليب', c: '#7b4a2e' },
      { v: 'white', en: 'White Chocolate', ar: 'شوكولا بيضاء', c: '#f4ead3' },
      { v: 'ruby', en: 'Ruby Chocolate', ar: 'شوكولا روبي', c: '#d97a8f' },
      { v: 'blond', en: 'Caramel Blond', ar: 'شوكولا كراميل', c: '#c98f4f' },
      { v: 'none', en: 'No chocolate', ar: 'بدون شوكولا', c: null },
    ],
    finish: [
      { v: 'drip', en: 'Chocolate Drip', ar: 'تقطير شوكولا' },
      { v: 'mirror', en: 'Mirror Glaze', ar: 'تغطية لامعة' },
      { v: 'whipped', en: 'Whipped Cream', ar: 'كريمة مخفوقة' },
      { v: 'buttercream', en: 'Buttercream', ar: 'زبدة كريمة' },
      { v: 'fondant', en: 'Fondant', ar: 'عجينة سكر' },
      { v: 'naked', en: 'Naked Cake', ar: 'كيك مكشوف' },
    ],
    color: [
      { v: 'ivory', en: 'Ivory', ar: 'عاجي', c: '#fbf5ea' },
      { v: 'blush', en: 'Blush Pink', ar: 'زهري', c: '#f3c6c9' },
      { v: 'blue', en: 'Baby Blue', ar: 'أزرق فاتح', c: '#bcd6ea' },
      { v: 'mint', en: 'Mint', ar: 'نعناعي', c: '#c4e3cf' },
      { v: 'lavender', en: 'Lavender', ar: 'لافندر', c: '#d8c8ea' },
      { v: 'gold', en: 'Royal Gold', ar: 'ذهبي', c: '#d9b56c' },
      { v: 'black', en: 'Midnight', ar: 'أسود', c: '#2a2424' },
    ],
    toppings: [
      { v: 'strawberries', en: 'Fresh Strawberries', ar: 'فراولة' },
      { v: 'macarons', en: 'Macarons', ar: 'ماكرون' },
      { v: 'donuts', en: 'Mini Donuts', ar: 'دوناتس صغيرة' },
      { v: 'goldleaf', en: 'Gold Leaf', ar: 'ورق ذهب' },
      { v: 'fruit', en: 'Seasonal Fruit', ar: 'فواكه' },
      { v: 'nuts', en: 'Roasted Nuts', ar: 'مكسرات' },
      { v: 'shards', en: 'Chocolate Shards', ar: 'قطع شوكولا' },
      { v: 'flowers', en: 'Sugar Flowers', ar: 'ورود سكر' },
      { v: 'oreo', en: 'Oreo', ar: 'أوريو' },
      { v: 'candles', en: 'Candles', ar: 'شموع' },
    ],
  };

  const PRODUCTS_WITH = {
    shape: ['cake', 'tart'],
    size: ['cake', 'tart'],
    qty: ['cupcakes', 'donuts', 'macarons', 'minis'],
    sponge: ['cake', 'cupcakes'],
    fillings: ['cake', 'tart', 'cupcakes', 'donuts', 'macarons', 'minis'],
    chocolate: ['cake', 'tart', 'cupcakes', 'donuts', 'macarons', 'minis'],
    finish: ['cake'],
    color: ['cake', 'tart', 'cupcakes', 'donuts', 'macarons', 'minis'],
    toppings: ['cake', 'tart', 'cupcakes', 'donuts'],
    message: ['cake', 'tart', 'cupcakes', 'donuts', 'macarons', 'minis'],
  };

  const STEPS = [
    { key: 'product', en: 'What are we making?', ar: 'شو بدك نحضّرلك؟', type: 'single', icons: true },
    { key: 'shape', en: 'Choose the shape', ar: 'اختر الشكل', type: 'single', icons: true },
    { key: 'size', en: 'How many guests?', ar: 'لكم شخص؟', type: 'single' },
    { key: 'qty', en: 'How many pieces?', ar: 'كم قطعة؟', type: 'single' },
    { key: 'sponge', en: 'Sponge flavour', ar: 'نكهة الكيك', type: 'single', swatch: true },
    { key: 'fillings', en: 'Fillings', ar: 'الحشوات', type: 'multi', max: 3, swatch: true, hint: 'Pick up to 3 · حتى ٣ حشوات' },
    { key: 'chocolate', en: 'Type of chocolate', ar: 'نوع الشوكولا', type: 'single', swatch: true },
    { key: 'finish', en: 'Outside finish', ar: 'التغطية الخارجية', type: 'single' },
    { key: 'color', en: 'Colour theme', ar: 'لون الكيك', type: 'single', swatch: true },
    { key: 'toppings', en: 'Decorations', ar: 'الزينة', type: 'multi', max: 4, hint: 'Pick up to 4 · حتى ٤', optional: true },
    { key: 'message', en: 'Message on top', ar: 'الكتابة على الكيك', type: 'text', optional: true },
  ];

  const SIGNATURES = [
    { en: 'Strawberry Royale', img: 'cake5.jpg', s: { product: 'cake', shape: 'round', size: '10-12', sponge: 'vanilla', fillings: ['strawberry', 'mascarpone'], chocolate: 'white', finish: 'whipped', color: 'ivory', toppings: ['strawberries'] } },
    { en: 'Noir Macaron', img: 'cake12.jpg', s: { product: 'cake', shape: 'round', size: '10-12', sponge: 'chocolate', fillings: ['nutella', 'praline'], chocolate: 'dark', finish: 'mirror', color: 'black', toppings: ['macarons', 'strawberries', 'goldleaf'] } },
    { en: 'Pink Donut Dream', img: 'cake7.jpg', s: { product: 'cake', shape: 'round', size: '15-20', sponge: 'vanilla', fillings: ['raspberry', 'mascarpone'], chocolate: 'ruby', finish: 'drip', color: 'blush', toppings: ['donuts', 'strawberries', 'macarons'] } },
    { en: 'Chocolate Donut Tower', img: 'cake9.jpg', s: { product: 'cake', shape: 'round', size: '15-20', sponge: 'chocolate', fillings: ['nutella', 'oreo', 'caramel'], chocolate: 'milk', finish: 'drip', color: 'gold', toppings: ['donuts', 'oreo', 'shards'] } },
  ];

  /* ============ STATE ============ */
  const state = {
    product: null, shape: null, tiers: 2, glyph: '1', size: null, qty: null, sponge: null,
    fillings: [], chocolate: null, finish: null, color: null, toppings: [], message: '',
    delivery: 'pickup',
  };
  const find = (key, v) => OPT[key].find(o => o.v === v);

  /* ============ RENDER STEPS ============ */
  const stepsEl = $('#steps');
  const chipHTML = (step, o) => {
    let lead = '';
    if (step.icons && o.icon) lead = `<svg class="opt__icon" viewBox="0 0 32 32">${ico[o.icon]}</svg>`;
    else if (step.swatch) lead = o.c ? `<i class="opt__sw" style="--sw:${o.c}"></i>` : `<i class="opt__sw opt__sw--none"></i>`;
    return `<button type="button" class="opt${step.icons ? ' opt--tile' : ''}" data-key="${step.key}" data-v="${o.v}">
      ${lead}<span class="opt__txt"><span class="opt__en">${o.en}</span><span class="opt__ar" dir="rtl">${o.ar}</span></span></button>`;
  };

  let n = 0;
  stepsEl.innerHTML =
    `<fieldset class="step step--sig">
      <legend class="step__head"><span class="step__num">★</span><span class="step__title">Start from a signature <small dir="rtl">ابدأ من تصاميمنا</small></span></legend>
      <p class="step__hint">Optional. Pick one to pre-fill every choice, then make it yours.</p>
      <div class="sigs">${SIGNATURES.map((s, i) => `<button type="button" class="sig" data-sig="${i}"><img src="assets/img/${s.img}" alt="" /><span>${s.en}</span></button>`).join('')}</div>
    </fieldset>` +
    STEPS.map(step => {
      n++;
      let body = '';
      if (step.type === 'text') {
        body = `<label class="field field--full"><span>Up to 30 characters · حتى ٣٠ حرف</span>
          <input type="text" maxlength="30" id="msgInput" placeholder="Happy Birthday Lama · عيد ميلاد سعيد" /></label>`;
      } else {
        body = `<div class="opts${step.icons ? ' opts--tiles' : ''}">${OPT[step.key].map(o => chipHTML(step, o)).join('')}</div>`;
      }
      if (step.key === 'shape') {
        body += `<div class="sub" id="tiersSub" hidden><span class="sub__label">Tiers · عدد الطبقات</span><div class="opts">${OPT.tiers.map(o => chipHTML({ key: 'tiers' }, o)).join('')}</div></div>
          <div class="sub" id="glyphSub" hidden><label class="field"><span>Which number or letter? · أي رقم أو حرف؟</span><input type="text" id="glyphInput" maxlength="2" value="1" /></label></div>`;
      }
      return `<fieldset class="step" data-step="${step.key}">
        <legend class="step__head"><span class="step__num">${String(n).padStart(2, '0')}</span>
          <span class="step__title">${step.en} <small dir="rtl">${step.ar}</small></span>
          ${step.optional ? '<span class="step__opt">Optional</span>' : ''}</legend>
        ${step.hint ? `<p class="step__hint">${step.hint}</p>` : ''}
        ${body}
      </fieldset>`;
    }).join('');

  /* ============ INTERACTION ============ */
  const pop = el => hasGsap && gsap.fromTo(el, { scale: .92 }, { scale: 1, duration: .6, ease: 'elastic.out(1,.45)' });

  stepsEl.addEventListener('click', e => {
    const sig = e.target.closest('.sig');
    if (sig) { applySignature(+sig.dataset.sig); return; }
    const btn = e.target.closest('.opt');
    if (!btn) return;
    const key = btn.dataset.key;
    const raw = btn.dataset.v;
    const v = key === 'tiers' || key === 'qty' ? +raw : raw;
    const step = STEPS.find(s => s.key === key);
    if (step && step.type === 'multi') {
      const arr = state[key];
      const i = arr.indexOf(v);
      if (i > -1) arr.splice(i, 1);
      else if (arr.length < step.max) arr.push(v);
      else { shake(btn); return; }
    } else {
      state[key] = v;
    }
    pop(btn);
    if (key === 'product') onProductChange();
    sync();
  });

  const shake = el => hasGsap && gsap.fromTo(el, { x: -6 }, { x: 0, duration: .5, ease: 'elastic.out(1,.3)' });

  $('#msgInput').addEventListener('input', e => { state.message = e.target.value; sync(); });
  $('#glyphInput').addEventListener('input', e => { state.glyph = e.target.value.trim().slice(0, 2) || '1'; sync(); });

  $('#deliverySeg').addEventListener('click', e => {
    const b = e.target.closest('.seg__btn');
    if (!b) return;
    state.delivery = b.dataset.v;
    $$('.seg__btn').forEach(x => x.classList.toggle('is-on', x === b));
    $('#addressField').hidden = state.delivery !== 'delivery';
    sync();
  });
  $('#orderForm').addEventListener('input', () => updateProgress());

  // earliest pickup: 48h ahead
  const dateInput = $('input[name="date"]');
  const min = new Date(Date.now() + 2 * 864e5);
  dateInput.min = min.toISOString().slice(0, 10);

  function onProductChange() {
    const p = state.product;
    // clear choices that don't apply to the new product
    if (!PRODUCTS_WITH.shape.includes(p)) state.shape = null;
    if (!PRODUCTS_WITH.size.includes(p)) state.size = null;
    if (!PRODUCTS_WITH.qty.includes(p)) state.qty = null;
    if (!PRODUCTS_WITH.sponge.includes(p)) state.sponge = null;
    if (!PRODUCTS_WITH.finish.includes(p)) state.finish = null;
    if (!PRODUCTS_WITH.toppings.includes(p)) state.toppings = [];
    if (p === 'tart' && state.shape === 'tiered') state.shape = null;
  }

  function applySignature(i) {
    const s = SIGNATURES[i].s;
    Object.assign(state, { shape: null, size: null, qty: null, sponge: null, finish: null }, JSON.parse(JSON.stringify(s)));
    sync();
    const stage = $('#stage');
    if (window.innerWidth < 1000) stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ============ VISIBILITY + CHIP STATE ============ */
  function sync() {
    const p = state.product;
    let layoutChanged = false;
    $$('.step[data-step]').forEach(fs => {
      const key = fs.dataset.step;
      const show = key === 'product' || (p && PRODUCTS_WITH[key]?.includes(p));
      if (fs.hidden === show) {
        fs.hidden = !show;
        if (show && hasGsap) gsap.fromTo(fs, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' });
        layoutChanged = true;
      }
    });
    // tart can't be tiered
    const tieredBtn = $('.opt[data-key="shape"][data-v="tiered"]');
    if (tieredBtn) tieredBtn.hidden = p === 'tart';

    $$('.opt').forEach(b => {
      const key = b.dataset.key;
      const val = key === 'tiers' || key === 'qty' ? +b.dataset.v : b.dataset.v;
      const on = Array.isArray(state[key]) ? state[key].includes(val) : state[key] === val;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on);
    });
    $$('.sig').forEach((b, i) => b.classList.toggle('is-on', JSON.stringify(SIGNATURES[i].s.fillings) === JSON.stringify(state.fillings) && SIGNATURES[i].s.chocolate === state.chocolate && SIGNATURES[i].s.finish === state.finish));
    $('#tiersSub').hidden = state.shape !== 'tiered';
    $('#glyphSub').hidden = state.shape !== 'number';
    $('#msgInput').value = state.message;

    if (layoutChanged && typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
    renderPreview();
    renderSlice();
    renderSummary();
    updateProgress();
  }

  /* ============ PREVIEW (SVG) ============ */
  const svg = $('#cakeSvg');
  const CX = 200, CY = 200;

  const circleD = r => `M${CX - r},${CY} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0Z`;
  const rectD = (w, h, rx) => {
    const x = CX - w / 2, y = CY - h / 2;
    return `M${x + rx},${y}H${x + w - rx}A${rx},${rx} 0 0 1 ${x + w},${y + rx}V${y + h - rx}A${rx},${rx} 0 0 1 ${x + w - rx},${y + h}H${x + rx}A${rx},${rx} 0 0 1 ${x},${y + h - rx}V${y + rx}A${rx},${rx} 0 0 1 ${x + rx},${y}Z`;
  };
  const heartD = r => `M${CX},${CY + r * .95}C${CX - r * 1.55},${CY + r * .05} ${CX - r * 1.05},${CY - r * 1.2} ${CX},${CY - r * .5}C${CX + r * 1.05},${CY - r * 1.2} ${CX + r * 1.55},${CY + r * .05} ${CX},${CY + r * .95}Z`;
  const shapeD = (shape, r) => ({
    square: rectD(r * 1.8, r * 1.8, 16),
    rectangle: rectD(r * 2.15, r * 1.45, 16),
    heart: heartD(r * 1.08),
  }[shape] || circleD(r));

  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    const f = x => Math.max(0, Math.min(255, Math.round(x + amt * 255)));
    return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
  };
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * .299 + ((n >> 8) & 255) * .587 + (n & 255) * .114) / 255; };

  function colors() {
    const choc = state.chocolate && find('chocolate', state.chocolate)?.c;
    const theme = state.color ? find('color', state.color).c : (choc || '#f6eee0');
    const sponge = state.sponge ? find('sponge', state.sponge).c : '#f3dca4';
    return { choc, theme, sponge };
  }

  // points along a path, spaced evenly
  function pointsOn(d, count, offset = 0) {
    const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tmp.setAttribute('d', d);
    svg.appendChild(tmp);
    const L = tmp.getTotalLength();
    const pts = [];
    for (let i = 0; i < count; i++) {
      const p = tmp.getPointAtLength(((i + offset) / count) * L % L);
      pts.push([p.x, p.y]);
    }
    tmp.remove();
    return pts;
  }

  const TOP = {
    strawberries: (i) => `<path d="M0,-10C9,-10 11,2 0,13C-11,2 -9,-10 0,-10Z" fill="#d7263d"/><path d="M0,-10C5,-10 7,-3 3,4" stroke="#ff6b7d" stroke-width="1.4" fill="none" opacity=".6"/><path d="M-6,-10L0,-6L6,-10L2,-11L0,-15L-2,-11Z" fill="#3f8f3a"/><circle cx="-3" cy="-2" r=".8" fill="#ffe08a"/><circle cx="3" cy="2" r=".8" fill="#ffe08a"/><circle cx="-1" cy="6" r=".8" fill="#ffe08a"/>`,
    macarons: (i, c) => { const pal = ['#f6b6c3', '#bfe3c9', c.theme, '#f3d9a4', '#cdbde8']; const m = pal[i % pal.length]; return `<circle r="12" fill="${shade(m, -.12)}"/><circle r="10.5" fill="${m}"/><ellipse cx="-3" cy="-4" rx="5" ry="2.5" fill="#fff" opacity=".35"/>`; },
    donuts: (i, c) => `<circle r="13" fill="#d9a066"/><circle r="11.5" fill="${c.choc || '#f3a6b8'}"/><circle r="4" fill="#caa073"/><circle r="3" fill="${c.choc ? shade(c.choc, -.1) : '#e98aa1'}"/><rect x="-7" y="-8" width="4" height="1.4" rx=".7" fill="#fff" transform="rotate(30)"/><rect x="4" y="3" width="4" height="1.4" rx=".7" fill="#ffd166" transform="rotate(-20)"/><rect x="-2" y="6" width="4" height="1.4" rx=".7" fill="#7bdff2"/>`,
    goldleaf: () => `<path d="M-9,-3L-3,-9L5,-7L10,0L4,7L-5,8Z" fill="#d4af37"/><path d="M-6,-2L2,-5L6,1" stroke="#f7e39a" stroke-width="1" fill="none"/>`,
    fruit: (i) => [
      `<circle r="11" fill="#7cb342"/><circle r="8" fill="#b5d96b"/><circle r="2.5" fill="#f1f8e0"/>${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${5 * Math.cos(a * Math.PI / 180)}" cy="${5 * Math.sin(a * Math.PI / 180)}" r=".9" fill="#222"/>`).join('')}`,
      `<circle r="11" fill="#f39c12"/><circle r="9" fill="#ffc15e"/>${[0, 45, 90, 135].map(a => `<line x1="0" y1="-9" x2="0" y2="9" stroke="#f39c12" stroke-width=".8" transform="rotate(${a})"/>`).join('')}`,
      `<circle r="6" fill="#34407a"/><circle cx="-2" cy="-2" r="1.6" fill="#8b95c9"/>`,
      `<circle r="9" fill="#ffe082"/><circle r="6" fill="#fff3c4"/>`,
    ][i % 4],
    nuts: (i) => `<ellipse rx="8" ry="5" fill="#b07a45" transform="rotate(${i * 40})"/><ellipse rx="5" ry="2" fill="#d4a26a" transform="rotate(${i * 40})"/>`,
    shards: (i, c) => `<path d="M-10,6L-2,-12L11,4Z" fill="${c.choc || '#3b2016'}" transform="rotate(${i * 50})"/><path d="M-2,-12L1,-2L11,4" stroke="#fff" stroke-width=".8" opacity=".3" fill="none" transform="rotate(${i * 50})"/>`,
    flowers: (i) => { const pc = ['#fff', '#f7c5d0', '#fbe3a1'][i % 3]; return [0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-6" rx="4.5" ry="6.5" fill="${pc}" stroke="${shade(pc.length === 4 ? '#ffffff' : pc, -.12)}" stroke-width=".6" transform="rotate(${a})"/>`).join('') + `<circle r="3.5" fill="#e6b94a"/>`; },
    oreo: () => `<circle r="10" fill="#2b2222"/><circle r="7.5" fill="none" stroke="#3d3232" stroke-width="1.5"/><circle r="3" fill="none" stroke="#3d3232" stroke-width="1"/>`,
    candles: (i) => { const cc = ['#f6b6c3', '#bcd6ea', '#fbe3a1'][i % 3]; return `<circle r="5" fill="${cc}" stroke="${shade('#dddddd', -.3)}" stroke-width=".5"/><circle r="2.6" fill="#ffcc4d"/><circle r="1.2" fill="#fff5c2"/>`; },
  };

  function surface(d, c, r = 158) {
    const k = r / 158;
    const f = state.finish;
    const choc = c.choc || '#3b2016';
    let base = c.theme;
    if (f === 'mirror') base = c.choc || c.theme;
    if (f === 'naked') base = c.sponge;
    let out = `<path d="${d}" fill="${base}" filter="url(#sh)"/>`;
    if (f === 'mirror') out += `<path d="${d}" fill="url(#gloss)"/>`;
    if (f === 'naked') out += `<path d="${d}" fill="url(#naked)" opacity=".7"/><path d="${d}" fill="none" stroke="${c.theme}" stroke-width="10" opacity=".55"/>`;
    if (f === 'fondant') out += `<path d="${d}" fill="url(#soft)"/>`;
    if (f === 'drip') {
      out += `<path d="${d}" fill="none" stroke="${choc}" stroke-width="18"/><path d="${d}" fill="none" stroke="#fff" stroke-width="2" opacity=".18" transform="translate(-1.5 -1.5)"/>`;
    }
    const pts = (count, off = 0) => pointsOn(d, count, off);
    if (f === 'whipped') out += pts(Math.max(8, Math.round(26 * k))).map(([x, y]) => `<g transform="translate(${x} ${y})"><circle r="9" fill="${shade(c.theme, .06)}" stroke="${shade(c.theme, -.12)}" stroke-width="1"/><path d="M-5,0A5,5 0 0 1 5,0M-2.5,-3A3,3 0 0 1 3,2" fill="none" stroke="${shade(c.theme, -.15)}" stroke-width="1"/></g>`).join('');
    if (f === 'buttercream') out += pts(Math.max(10, Math.round(34 * k))).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${shade(c.theme, .04)}" stroke="${shade(c.theme, -.14)}" stroke-width="1"/>`).join('');
    if (f === 'fondant') out += pts(Math.max(14, Math.round(44 * k))).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff8e6" stroke="#d9c9a8" stroke-width=".6"/>`).join('');
    if (state.product === 'tart') out += `<path d="${d}" fill="none" stroke="#c98b45" stroke-width="20"/><path d="${d}" fill="none" stroke="#e0a969" stroke-width="10" stroke-dasharray="6 6"/>`;
    return out;
  }

  function toppingsOn(d, c, count, off = 0) {
    if (!state.toppings.length) return '';
    return pointsOn(d, count, off).map(([x, y], i) => {
      const t = state.toppings[i % state.toppings.length];
      return `<g class="tp" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(i * 37) % 360}) scale(1.45)" filter="url(#tsh)">${TOP[t](i, c)}</g>`;
    }).join('');
  }

  function messageText(y, c, size = 28) {
    if (!state.message) return '';
    const bg = state.finish === 'mirror' ? (c.choc || c.theme) : state.finish === 'naked' ? c.sponge : c.theme;
    const ink = lum(bg) > .55 ? '#4a2c22' : '#f7e7c4';
    const words = state.message.split(' ');
    const lines = [];
    let cur = '';
    words.forEach(w => { if ((cur + ' ' + w).trim().length > 14 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    lines.push(cur);
    return lines.slice(0, 3).map((l, i) => `<text x="${CX}" y="${y + (i - (lines.length - 1) / 2) * size * 1.1}" text-anchor="middle" dominant-baseline="middle" font-family="Cormorant Garamond, serif" font-style="italic" font-weight="600" font-size="${size}" fill="${ink}">${esc(l)}</text>`).join('');
  }

  const DEFS = `<defs>
    <radialGradient id="board" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#f2dc9c"/><stop offset=".7" stop-color="#d4af5f"/><stop offset="1" stop-color="#a88235"/></radialGradient>
    <linearGradient id="gloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <radialGradient id="soft" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></radialGradient>
    <radialGradient id="naked" cx="50%" cy="50%" r="50%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#5a3a20" stop-opacity=".35"/></radialGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#2a1a16" flood-opacity=".35"/></filter>
    <filter id="tsh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="#2a1a16" flood-opacity=".4"/></filter>
  </defs>`;

  function renderPreview() {
    const c = colors();
    const p = state.product;
    let body = '';

    if (!p) {
      body = `<circle cx="200" cy="200" r="170" fill="none" stroke="#c6a15b" stroke-width="1.2" stroke-dasharray="4 7"/>
        <text x="200" y="192" text-anchor="middle" font-family="Cormorant Garamond, serif" font-style="italic" font-size="30" fill="#4a322b">Your creation</text>
        <text x="200" y="228" text-anchor="middle" font-family="Amiri, serif" font-size="20" fill="#c6a15b">تصميمك هنا</text>`;
    } else if (PRODUCTS_WITH.shape.includes(p)) {
      body = `<circle cx="200" cy="200" r="192" fill="url(#board)"/><circle cx="200" cy="200" r="184" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>`;
      const shape = state.shape || 'round';
      if (shape === 'number') {
        const txt = esc(state.glyph);
        const fill = state.finish === 'naked' ? c.sponge : state.finish === 'mirror' ? (c.choc || c.theme) : c.theme;
        body += `<text x="200" y="215" text-anchor="middle" dominant-baseline="middle" font-family="Cinzel, serif" font-weight="600" font-size="${txt.length > 1 ? 210 : 290}" fill="${fill}" stroke="${state.finish === 'drip' ? (c.choc || '#3b2016') : shade(fill, -.12)}" stroke-width="${state.finish === 'drip' ? 10 : 3}" paint-order="stroke" filter="url(#sh)">${txt}</text>`;
        body += toppingsOn(circleD(172), c, 16);
        if (state.message) body += `<g transform="translate(0 150)">${messageText(200, { ...c, theme: '#f2dc9c' }, 20)}</g>`;
      } else if (shape === 'tiered') {
        const radii = state.tiers === 3 ? [165, 118, 72] : [160, 100];
        radii.forEach((r, i) => {
          body += surface(circleD(r), c, r);
          const next = radii[i + 1];
          if (next && state.toppings.length) body += toppingsOn(circleD((r + next) / 2 + 2), c, Math.round(r / 20), .5);
        });
        const top = radii[radii.length - 1];
        if (state.toppings.length) body += toppingsOn(circleD(top * .6), c, 5);
        else body += messageText(200, c, 18);
      } else {
        const d = shapeD(shape, 158);
        body += surface(d, c);
        const inner = shapeD(shape, shape === 'heart' ? 118 : 122);
        body += toppingsOn(inner, c, shape === 'rectangle' ? 14 : 12);
        body += messageText(shape === 'heart' ? 190 : 200, c, shape === 'heart' ? 24 : 28);
      }
    } else {
      body = boxPreview(c);
    }

    svg.innerHTML = DEFS + `<g id="cakeG">${body}</g>`;
    if (hasGsap) {
      gsap.fromTo('#cakeG', { scale: .96, transformOrigin: '200px 200px' }, { scale: 1, duration: .6, ease: 'back.out(2)' });
    }
  }

  function boxPreview(c) {
    const p = state.product;
    const qty = state.qty || 6;
    const cols = { 6: 3, 12: 4, 24: 6, 36: 6 }[qty];
    const rows = qty / cols;
    const W = 340, H = 300, x0 = 30, y0 = 60;
    const cw = W / cols, ch = (H - 30) / rows;
    const r = Math.min(cw, ch) * .4;
    const fills = state.fillings.length ? state.fillings.map(f => find('fillings', f).c) : [c.theme];
    let s = `<rect x="${x0 - 8}" y="${y0 - 36}" width="${W + 16}" height="${H + 44}" rx="14" fill="#f7efe2" stroke="#4a322b" stroke-width="2" filter="url(#sh)"/>
      <text x="200" y="${y0 - 12}" text-anchor="middle" font-family="Cinzel, serif" font-size="15" letter-spacing="4" fill="#4a322b">EMPRESS</text>
      <line x1="${x0}" y1="${y0 - 2}" x2="${x0 + W}" y2="${y0 - 2}" stroke="#c6a15b"/>`;
    let k = 0;
    for (let ry = 0; ry < rows; ry++) for (let cx = 0; cx < cols; cx++, k++) {
      const x = x0 + cw * (cx + .5), y = y0 + 12 + ch * (ry + .5);
      const fc = fills[k % fills.length];
      s += `<g class="tp" transform="translate(${x} ${y}) scale(${r / 20})" filter="url(#tsh)">`;
      if (p === 'cupcakes') {
        s += `<circle r="20" fill="${state.color === 'gold' ? '#d9b56c' : '#e8d3b0'}"/>${[...Array(16)].map((_, i) => `<line x1="0" y1="-20" x2="0" y2="-16" stroke="#c9ad7e" transform="rotate(${i * 22.5})"/>`).join('')}
          <circle r="15" fill="${c.theme}"/><circle r="10" fill="${shade(c.theme, .05)}" stroke="${shade(c.theme, -.12)}"/><circle r="5" fill="${shade(c.theme, .08)}" stroke="${shade(c.theme, -.12)}"/>`;
        if (c.choc) s += `<circle r="12.5" fill="none" stroke="${c.choc}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>`;
        if (state.toppings.length) s += `<g transform="scale(.7)">${TOP[state.toppings[k % state.toppings.length]](k, c)}</g>`;
      } else if (p === 'donuts') {
        const glaze = c.choc || c.theme;
        s += `<circle r="20" fill="#d9a066"/><path d="M0,-17C9,-18 17,-8 16,2C18,10 8,18 -2,16C-12,18 -18,6 -16,-2C-18,-10 -9,-18 0,-17Z" fill="${glaze}"/><circle r="6.5" fill="#caa073"/><circle r="5" fill="#f7efe2"/>`;
        s += [...Array(7)].map((_, i) => `<rect x="10" y="-1" width="4.5" height="1.8" rx=".9" fill="${['#fff', '#ffd166', '#7bdff2', fc][i % 4]}" transform="rotate(${i * 51})"/>`).join('');
      } else if (p === 'macarons') {
        const m = state.fillings.length ? shade(fc, .18) : c.theme;
        s += `<circle r="20" fill="${shade(m, -.1)}"/><circle r="17.5" fill="${m}"/><ellipse cx="-5" cy="-7" rx="8" ry="4" fill="#fff" opacity=".3"/>`;
        if (c.choc && k % 2) s += `<path d="M-12,-2Q0,-10 12,0" stroke="${c.choc}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      } else {
        const sq = k % 2;
        s += sq ? `<rect x="-17" y="-17" width="34" height="34" rx="4" fill="${c.choc || c.theme}"/><rect x="-17" y="-17" width="34" height="8" rx="3" fill="${fc}"/>`
          : `<circle r="18" fill="#d9a066"/><circle r="14" fill="${fc}"/><circle r="4" fill="${c.theme}"/>`;
      }
      s += '</g>';
    }
    return s;
  }

  /* ============ SLICE (cross-section) ============ */
  function renderSlice() {
    const el = $('#slice');
    const c = colors();
    const p = state.product;
    const base = p === 'donuts' ? '#d9a066' : p === 'tart' ? '#c98b45' : p === 'macarons' ? c.theme : p === 'minis' ? '#d9a066' : c.sponge;
    const fills = state.fillings.map(f => find('fillings', f).c);
    const layers = [];
    if (!p) { el.innerHTML = '<span class="slice__empty">Choose a product to see inside</span>'; return; }
    if (p === 'tart') { layers.push(['#c98b45', 2]); fills.forEach(f => layers.push([f, 2])); }
    else if (p === 'macarons') { layers.push([base, 2]); layers.push([fills[0] || '#f6ecd6', 1.4]); layers.push([base, 2]); }
    else {
      layers.push([base, 3]);
      (fills.length ? fills : ['#f6ecd6']).forEach(f => { layers.push([f, 1.4]); layers.push([base, 3]); });
    }
    const top = state.finish === 'naked' ? null : state.finish === 'mirror' || state.finish === 'drip' ? (c.choc || c.theme) : (c.choc && p !== 'cake' ? c.choc : c.theme);
    if (top) layers.push([top, 1.1]);
    el.innerHTML = layers.reverse().map(([col, h]) => `<i style="background:${col};flex:${h}"></i>`).join('');
    if (hasGsap) gsap.from($$('i', el), { scaleX: 0, transformOrigin: 'left', duration: .6, stagger: .04, ease: 'power3.out' });
  }

  /* ============ SUMMARY + PROGRESS ============ */
  const label = (key, v) => { const o = find(key, v); return o ? `${o.en} · ${o.ar}` : v; };
  function rows() {
    const p = state.product;
    const r = [];
    if (p) r.push(['Product', 'المنتج', label('product', p)]);
    if (state.shape) {
      let s = label('shape', state.shape);
      if (state.shape === 'tiered') s += ` (${state.tiers} tiers)`;
      if (state.shape === 'number') s += ` "${state.glyph}"`;
      r.push(['Shape', 'الشكل', s]);
    }
    if (state.size) r.push(['Size', 'الحجم', label('size', state.size)]);
    if (state.qty) r.push(['Quantity', 'العدد', label('qty', state.qty)]);
    if (state.sponge) r.push(['Sponge', 'نكهة الكيك', label('sponge', state.sponge)]);
    if (state.fillings.length) r.push(['Fillings', 'الحشوات', state.fillings.map(f => label('fillings', f)).join(' + ')]);
    if (state.chocolate) r.push(['Chocolate', 'الشوكولا', label('chocolate', state.chocolate)]);
    if (state.finish) r.push(['Finish', 'التغطية', label('finish', state.finish)]);
    if (state.color) r.push(['Colour', 'اللون', label('color', state.color)]);
    if (state.toppings.length) r.push(['Decorations', 'الزينة', state.toppings.map(t => label('toppings', t)).join(', ')]);
    if (state.message) r.push(['Message', 'الكتابة', `"${state.message}"`]);
    return r;
  }

  function renderSummary() {
    const ul = $('#summary');
    ul.replaceChildren(...rows().map(([en, ar, val]) => {
      const li = document.createElement('li');
      const k = document.createElement('span'); k.className = 'summary__k'; k.textContent = en;
      const v = document.createElement('span'); v.className = 'summary__v'; v.textContent = val;
      li.append(k, v);
      return li;
    }));
  }

  function requiredKeys() {
    const p = state.product;
    if (!p) return ['product'];
    return ['product', ...STEPS.filter(s => !s.optional && s.key !== 'product' && PRODUCTS_WITH[s.key]?.includes(p)).map(s => s.key)];
  }
  const filled = k => Array.isArray(state[k]) ? state[k].length > 0 : state[k] != null;

  function updateProgress() {
    const keys = requiredKeys();
    const f = $('#orderForm');
    const details = ['name', 'phone', 'date'].map(n => f.elements[n].value.trim() !== '');
    const done = keys.filter(filled).length + details.filter(Boolean).length;
    const total = (state.product ? keys.length : 8) + details.length;
    const pct = Math.round((done / total) * 100);
    $('#pct').textContent = pct;
    if (hasGsap) gsap.to('#pctBar', { scaleX: pct / 100, duration: .6, ease: 'power3.out' });
    else $('#pctBar').style.transform = `scaleX(${pct / 100})`;
  }

  /* ============ SEND ============ */
  $('#sendBtn').addEventListener('click', () => {
    const f = $('#orderForm');
    const err = $('#formErr');
    const missing = requiredKeys().filter(k => !filled(k));
    const missingFields = ['name', 'phone', 'date'].filter(n => !f.elements[n].value.trim());
    if (state.delivery === 'delivery' && !f.elements.address.value.trim()) missingFields.push('address');
    if (f.elements.date.value && f.elements.date.value < dateInput.min) {
      err.textContent = 'Please choose a date at least 48 hours from now · يرجى اختيار موعد بعد ٤٨ ساعة على الأقل';
      f.elements.date.focus();
      return;
    }
    if (missing.length || missingFields.length) {
      const names = [...missing.map(k => STEPS.find(s => s.key === k).en), ...missingFields];
      err.textContent = 'Almost there. Please complete: ' + names.join(', ');
      const target = missing.length ? $(`.step[data-step="${missing[0]}"]`) : f.elements[missingFields[0]];
      $$('.step.is-missing').forEach(s => s.classList.remove('is-missing'));
      missing.forEach(k => $(`.step[data-step="${k}"]`).classList.add('is-missing'));
      missingFields.forEach(n => f.elements[n].closest('.field').classList.add('is-missing'));
      if (window.__lenis) window.__lenis.scrollTo(target.closest('fieldset, .field') || target, { offset: -120 });
      else target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      shake($('#sendBtn'));
      return;
    }
    err.textContent = '';
    const lines = [
      '👑 *Empress Patisserie · Pre-order*',
      '*طلب مسبق — حلويات امبريس*',
      '',
      ...rows().map(([en, ar, v]) => `▫️ *${en} | ${ar}:* ${v}`),
      '',
      `👤 *Name | الاسم:* ${f.elements.name.value.trim()}`,
      `📞 *Phone | الهاتف:* ${f.elements.phone.value.trim()}`,
      `📅 *Date | التاريخ:* ${f.elements.date.value}${f.elements.time.value ? ' · ' + f.elements.time.value : ''}`,
      `🚗 *${state.delivery === 'delivery' ? 'Delivery | توصيل' : 'Pickup | استلام من المحل'}*${state.delivery === 'delivery' ? ': ' + f.elements.address.value.trim() : ''}`,
    ];
    if (f.elements.notes.value.trim()) lines.push(`📝 *Notes | ملاحظات:* ${f.elements.notes.value.trim()}`);
    lines.push('', 'Please confirm price & availability 🙏 · يرجى تأكيد السعر والموعد');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
  $('#orderForm').addEventListener('input', e => e.target.closest('.field')?.classList.remove('is-missing'));
  stepsEl.addEventListener('click', e => e.target.closest('.step')?.classList.remove('is-missing'));

  /* ============ INTRO ANIMATIONS ============ */
  sync();
  if (hasGsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.b-hero__title .split-line > span', { yPercent: 110, duration: 1.3, stagger: .12 }, .1)
      .from('.b-hero__eyebrow, .b-hero__ar, .b-hero__lead, .b-hero__steps li', { y: 30, opacity: 0, duration: 1, stagger: .08 }, .4)
      .from('.preview__card', { y: 80, opacity: 0, duration: 1.4 }, .5);
    $$('.step:not([hidden])').forEach(s => {
      gsap.from(s, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 90%', once: true } });
    });
  }
})();
