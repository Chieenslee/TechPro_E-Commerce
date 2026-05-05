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
