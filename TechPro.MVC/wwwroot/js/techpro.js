// TechPro Storefront JS

// ── Cart ──────────────────────────────────────────────────────
const API = '/api';

async function addToCart(productId, variantId = null, qty = 1) {
  const res = await fetch(`${API}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, variantId, quantity: qty })
  });
  if (res.ok) {
    const cart = await res.json();
    updateCartBadge(cart.totalItems);
    showToast('Đã thêm vào giỏ hàng!', 'success');
  } else {
    showToast('Không đủ hàng trong kho', 'error');
  }
}

async function updateCartBadge(count) {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    badge.classList.add('bump');
    setTimeout(() => badge.classList.remove('bump'), 300);
  }
}

async function loadCartCount() {
  try {
    const r = await fetch(`${API}/cart/count`);
    if (r.ok) updateCartBadge(await r.json());
  } catch {}
}

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  let toast = document.querySelector('.tp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'tp-toast';
    toast.innerHTML = `<i class="bi"></i><span></span>`;
    document.body.appendChild(toast);
  }
  toast.className = `tp-toast ${type}`;
  toast.querySelector('i').className = `bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`;
  toast.querySelector('span').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Search ────────────────────────────────────────────────────
let searchTimer;
const navSearch = document.getElementById('navSearch');
const suggestions = document.getElementById('searchSuggestions');

if (navSearch) {
  navSearch.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const q = navSearch.value.trim();
    if (q.length < 2) { suggestions?.classList.remove('open'); return; }
    searchTimer = setTimeout(async () => {
      try {
        const r = await fetch(`${API}/products?search=${encodeURIComponent(q)}&pageSize=5`);
        if (!r.ok) return;
        const data = await r.json();
        if (!data.items?.length) { suggestions.classList.remove('open'); return; }
        suggestions.innerHTML = data.items.map(p => `
          <a class="suggestion-item" href="/products/${p.slug}">
            <img src="${p.primaryImage || '/images/placeholder.webp'}" alt="${p.name}">
            <div>
              <div class="suggestion-name">${p.name}</div>
              <div class="suggestion-price">${fmtPrice(p.price)}</div>
            </div>
          </a>`).join('');
        suggestions.classList.add('open');
      } catch {}
    }, 350);
  });

  navSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      window.location.href = `/products?search=${encodeURIComponent(navSearch.value.trim())}`;
    }
    if (e.key === 'Escape') suggestions?.classList.remove('open');
  });

  document.addEventListener('click', e => {
    if (!navSearch.contains(e.target) && !suggestions?.contains(e.target))
      suggestions?.classList.remove('open');
  });
}

// ── Wishlist ──────────────────────────────────────────────────
function toggleWishlist(btn, productId) {
  btn.classList.toggle('active');
  const icon = btn.querySelector('i');
  icon.className = btn.classList.contains('active') ? 'bi bi-heart-fill' : 'bi bi-heart';
  showToast(btn.classList.contains('active') ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích', 'success');
}

// ── Flash Sale Countdown ──────────────────────────────────────
function startCountdown(endTime, prefix = 'cd') {
  const end = new Date(endTime).getTime();
  function tick() {
    const diff = end - Date.now();
    if (diff <= 0) { document.querySelectorAll(`[data-cd="${prefix}"]`).forEach(el => el.textContent = '00'); return; }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const hEl = document.querySelector(`[data-cd="${prefix}-h"]`);
    const mEl = document.querySelector(`[data-cd="${prefix}-m"]`);
    const sEl = document.querySelector(`[data-cd="${prefix}-s"]`);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);
}

// ── Navbar Scroll ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('mainNavbar');
  if (navbar) navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,.5)' : '';
});

// ── Format ────────────────────────────────────────────────────
function fmtPrice(n) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadCartCount();

  // Expose for Razor views
  window.TechPro = { addToCart, showToast, toggleWishlist, startCountdown, fmtPrice };
});

// Extended storefront features
const LS_WISHLIST = 'techpro.wishlist';
const LS_COMPARE = 'techpro.compare';
const LS_VIEWED = 'techpro.viewed';

function readIds(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]').map(Number).filter(Boolean); }
  catch { return []; }
}

function writeIds(key, ids) {
  localStorage.setItem(key, JSON.stringify([...new Set(ids)].slice(0, 30)));
}

function toggleWishlistExtended(btn, productId) {
  let ids = readIds(LS_WISHLIST);
  const exists = ids.includes(productId);
  ids = exists ? ids.filter(id => id !== productId) : [productId, ...ids];
  writeIds(LS_WISHLIST, ids);
  syncWishlistButtons();
  showToast(exists ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích', 'success');
}

function syncWishlistButtons() {
  const ids = readIds(LS_WISHLIST);
  document.querySelectorAll('.product-card__wish').forEach(btn => {
    const match = btn.getAttribute('onclick')?.match(/,\s*(\d+)\)/);
    const id = Number(match?.[1]);
    const active = ids.includes(id);
    btn.classList.toggle('active', active);
    const icon = btn.querySelector('i');
    if (icon) icon.className = active ? 'bi bi-heart-fill' : 'bi bi-heart';
  });
}

function toggleCompare(btn, productId) {
  let ids = readIds(LS_COMPARE);
  const exists = ids.includes(productId);
  if (exists) ids = ids.filter(id => id !== productId);
  else {
    if (ids.length >= 4) {
      showToast('Chỉ so sánh tối đa 4 sản phẩm', 'error');
      return;
    }
    ids = [productId, ...ids];
  }
  writeIds(LS_COMPARE, ids);
  syncCompareButtons();
  renderCompareBar();
  showToast(exists ? 'Đã xóa khỏi so sánh' : 'Đã thêm vào so sánh', 'success');
}

function syncCompareButtons() {
  const ids = readIds(LS_COMPARE);
  document.querySelectorAll('.btn-compare').forEach(btn => {
    const match = btn.getAttribute('onclick')?.match(/,\s*(\d+)\)/);
    const id = Number(match?.[1]);
    const active = ids.includes(id);
    btn.classList.toggle('active', active);
    btn.innerHTML = active ? '<i class="bi bi-check-square-fill"></i> Đã chọn' : '<i class="bi bi-plus-square"></i> So sánh';
  });
}

async function getAllProducts() {
  const r = await fetch(`${API}/products?pageSize=48`);
  if (!r.ok) return [];
  const data = await r.json();
  return data.items || [];
}

function productMiniCard(p) {
  return `
    <article class="product-card">
      <a href="/products/${p.slug}" class="product-card__image"><img src="${p.primaryImage || '/images/placeholder.webp'}" alt="${p.name}"></a>
      <div class="product-card__body">
        <div class="product-card__brand">${p.brandName || ''}</div>
        <a class="product-card__name" href="/products/${p.slug}">${p.name}</a>
        <div class="product-card__price">
          <span class="price-current">${fmtPrice(p.price)}</span>
          ${p.comparePrice ? `<span class="price-old">${fmtPrice(p.comparePrice)}</span>` : ''}
        </div>
        <div class="product-card__footer">
          <button class="btn-cart" type="button" onclick="TechPro.addToCart(${p.id})">Thêm giỏ</button>
          <a class="btn-view" href="/products/${p.slug}"><i class="bi bi-eye"></i></a>
        </div>
      </div>
    </article>`;
}

async function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('wishlistEmpty');
  const countText = document.getElementById('wishlistCountText');
  if (!grid || !empty) return;
  const ids = readIds(LS_WISHLIST);
  const products = (await getAllProducts()).filter(p => ids.includes(p.id));
  grid.innerHTML = products.map(productMiniCard).join('');
  empty.hidden = products.length > 0;
  if (countText) countText.textContent = `${products.length} sản phẩm đã lưu`;
}

async function renderComparePage() {
  const wrap = document.getElementById('compareTableWrap');
  const empty = document.getElementById('compareEmpty');
  if (!wrap || !empty) return;
  const ids = readIds(LS_COMPARE);
  const products = (await getAllProducts()).filter(p => ids.includes(p.id));
  empty.hidden = products.length > 0;
  if (!products.length) { wrap.innerHTML = ''; return; }
  wrap.innerHTML = `
    <table class="compare-table">
      <thead><tr><th>Tiêu chí</th>${products.map(p => `<th><img src="${p.primaryImage}" alt="${p.name}"><a href="/products/${p.slug}">${p.name}</a></th>`).join('')}</tr></thead>
      <tbody>
        <tr><td>Giá bán</td>${products.map(p => `<td class="price-current">${fmtPrice(p.price)}</td>`).join('')}</tr>
        <tr><td>Giá gốc</td>${products.map(p => `<td>${p.comparePrice ? fmtPrice(p.comparePrice) : '-'}</td>`).join('')}</tr>
        <tr><td>Thương hiệu</td>${products.map(p => `<td>${p.brandName}</td>`).join('')}</tr>
        <tr><td>Danh mục</td>${products.map(p => `<td>${p.categoryName}</td>`).join('')}</tr>
        <tr><td>Đánh giá</td>${products.map(p => `<td>${p.averageRating} / 5 (${p.reviewCount})</td>`).join('')}</tr>
        <tr><td>Đã bán</td>${products.map(p => `<td>${p.soldCount}</td>`).join('')}</tr>
        <tr><td></td>${products.map(p => `<td><button class="btn-cart" onclick="TechPro.addToCart(${p.id})">Thêm giỏ</button></td>`).join('')}</tr>
      </tbody>
    </table>`;
}

async function renderCompareBar() {
  let bar = document.getElementById('compareBar');
  const ids = readIds(LS_COMPARE);
  if (!ids.length) { bar?.remove(); return; }
  const products = (await getAllProducts()).filter(p => ids.includes(p.id));
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'compareBar';
    bar.className = 'compare-bar';
    document.body.appendChild(bar);
  }
  bar.innerHTML = `
    <div><strong>So sánh (${products.length}/4)</strong><span>${products.map(p => p.name).join(' | ')}</span></div>
    <a class="btn-primary" href="/compare">So sánh ngay</a>
    <button onclick="localStorage.removeItem('${LS_COMPARE}'); TechPro.renderCompareBar(); TechPro.syncCompareButtons();"><i class="bi bi-x-lg"></i></button>`;
}

function trackViewed(productId) {
  const ids = readIds(LS_VIEWED).filter(id => id !== productId);
  writeIds(LS_VIEWED, [productId, ...ids].slice(0, 10));
}

async function renderRecentlyViewed(gridId, currentId = 0) {
  const grid = document.getElementById(gridId);
  const section = document.getElementById('recentlyViewedSection');
  if (!grid) return;
  const ids = readIds(LS_VIEWED).filter(id => id !== currentId);
  const products = (await getAllProducts()).filter(p => ids.includes(p.id)).slice(0, 5);
  grid.innerHTML = products.map(productMiniCard).join('');
  if (section) section.hidden = products.length === 0;
}

function applyVoucher() {
  const input = document.getElementById('voucherCode');
  const totalEl = document.getElementById('cartTotal');
  const shippingEl = document.getElementById('shippingAmount');
  const discountEl = document.getElementById('discountAmount');
  if (!input || !totalEl || !shippingEl || !discountEl) return;
  const subtotal = Number(totalEl.dataset.subtotal || 0);
  const shipping = Number(totalEl.dataset.shipping || 0);
  const code = input.value.trim().toUpperCase();
  let discount = 0;
  let newShipping = shipping;
  if (code === 'TECHPRO5') discount = Math.round(subtotal * 0.05);
  if (code === 'FREESHIP') newShipping = 0;
  if (!discount && newShipping === shipping) {
    showToast('Mã giảm giá không hợp lệ', 'error');
    return;
  }
  shippingEl.textContent = fmtPrice(newShipping);
  discountEl.textContent = fmtPrice(discount);
  totalEl.textContent = fmtPrice(Math.max(0, subtotal + newShipping - discount));
  showToast('Đã áp dụng mã giảm giá', 'success');
}

window.TechPro = { addToCart, showToast, toggleWishlist: toggleWishlistExtended, startCountdown, fmtPrice, toggleCompare, syncCompareButtons, renderCompareBar, renderWishlistPage, renderComparePage, trackViewed, renderRecentlyViewed, applyVoucher };

document.addEventListener('DOMContentLoaded', () => {
  window.TechPro = { addToCart, showToast, toggleWishlist: toggleWishlistExtended, startCountdown, fmtPrice, toggleCompare, syncCompareButtons, renderCompareBar, renderWishlistPage, renderComparePage, trackViewed, renderRecentlyViewed, applyVoucher };
  syncWishlistButtons();
  syncCompareButtons();
  renderCompareBar();
});
