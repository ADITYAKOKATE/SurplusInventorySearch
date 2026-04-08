/* ─── InventoryFind — Frontend Script ──────────────────────────────────────────
   All communication goes to the same Express server that serves this file.
   Base URL is empty (same-origin), so no CORS issues.
─────────────────────────────────────────────────────────────────────────────── */

const API_BASE = import.meta.env.VITE_API_URL || '';   // Base URL of the backend API (set VITE_API_URL in Vercel)

// ─── DOM references ────────────────────────────────────────────────────────────
const searchInput       = document.getElementById('search-input');
const categorySelect    = document.getElementById('category-select');
const minPriceInput     = document.getElementById('min-price');
const maxPriceInput     = document.getElementById('max-price');
const searchBtn         = document.getElementById('search-btn');
const resetBtn          = document.getElementById('reset-btn');
const resultsContainer  = document.getElementById('results-container');
const noResults         = document.getElementById('no-results');
const loadingSpinner    = document.getElementById('loading-spinner');
const errorBanner       = document.getElementById('error-banner');
const resultsHeader     = document.getElementById('results-header');
const resultsCount      = document.getElementById('results-count');
const headerStats       = document.getElementById('header-stats');

// ─── State ─────────────────────────────────────────────────────────────────────
let hasSearched = false;

// ─── Category → CSS class map ──────────────────────────────────────────────────
const CATEGORY_CLASS = {
  'furniture':       'cat-furniture',
  'electronics':     'cat-electronics',
  'stationery':      'cat-stationery',
  'office supplies': 'cat-office-supplies',
  'appliances':      'cat-appliances'
};

// ─── Build query string ────────────────────────────────────────────────────────
function buildQueryString() {
  const params = new URLSearchParams();
  const q        = searchInput.value.trim();
  const category = categorySelect.value.trim();
  const minPrice = minPriceInput.value.trim();
  const maxPrice = maxPriceInput.value.trim();

  if (q)        params.set('q', q);
  if (category) params.set('category', category);
  if (minPrice) params.set('minPrice', minPrice);
  if (maxPrice) params.set('maxPrice', maxPrice);

  return params.toString();
}

// ─── Show / hide helpers ───────────────────────────────────────────────────────
function showLoading() {
  loadingSpinner.classList.remove('hidden');
  noResults.classList.add('hidden');
  resultsContainer.classList.add('hidden');
  resultsHeader.classList.add('hidden');
  errorBanner.classList.add('hidden');
}

function hideLoading() {
  loadingSpinner.classList.add('hidden');
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.classList.remove('hidden');
  resultsContainer.classList.add('hidden');
  resultsHeader.classList.add('hidden');
  noResults.classList.add('hidden');
}

function showNoResults() {
  noResults.classList.remove('hidden');
  resultsContainer.classList.add('hidden');
  resultsHeader.classList.add('hidden');
}

function showResults(items) {
  noResults.classList.add('hidden');
  resultsContainer.classList.remove('hidden');
  resultsHeader.classList.remove('hidden');
  resultsCount.innerHTML = `Showing <strong>${items.length}</strong> result${items.length !== 1 ? 's' : ''}`;
}

// ─── Render a single product card ──────────────────────────────────────────────
function renderCard(item, index) {
  const catKey   = (item.category || '').toLowerCase();
  const catClass = CATEGORY_CLASS[catKey] || 'cat-furniture';

  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('role', 'listitem');
  card.style.animationDelay = `${index * 60}ms`;

  card.innerHTML = `
    <div class="card-top">
      <span class="card-category ${catClass}">${escapeHtml(item.category)}</span>
      <span class="card-id">#${item.id}</span>
    </div>
    <h3 class="card-name">${escapeHtml(item.productName)}</h3>
    <div class="card-supplier">
      <span class="card-supplier-icon"></span>
      <span>${escapeHtml(item.supplier)}</span>
    </div>
    <div class="card-footer">
      <span class="card-price">$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      <span class="card-stock-badge">In Stock</span>
    </div>
  `;

  return card;
}

// ─── Render all results ─────────────────────────────────────────────────────────
function renderResults(items) {
  resultsContainer.innerHTML = '';
  items.forEach((item, i) => {
    resultsContainer.appendChild(renderCard(item, i));
  });
}

// ─── Main search function ───────────────────────────────────────────────────────
async function searchInventory() {
  const qs = buildQueryString();
  const url = `${API_BASE}/search${qs ? '?' + qs : ''}`;

  searchBtn.disabled = true;
  showLoading();
  hasSearched = true;

  try {
    const response = await fetch(url);
    const data = await response.json();

    hideLoading();

    // Handle API-level errors (e.g. invalid price range → 400)
    if (!response.ok) {
      showError(data.message || 'An error occurred while searching.');
      return;
    }

    const items = data.results || [];

    if (items.length === 0) {
      showNoResults();
    } else {
      renderResults(items);
      showResults(items);
      // Update header stats
      headerStats.innerHTML = `<span class="stat-badge">${items.length} result${items.length !== 1 ? 's' : ''} found</span>`;
    }
  } catch (err) {
    hideLoading();
    showError('Cannot connect to the server. Please ensure the backend is running.');
    console.error('[InventoryFind] Fetch error:', err);
  } finally {
    searchBtn.disabled = false;
  }
}

// ─── Reset all filters ──────────────────────────────────────────────────────────
function resetFilters() {
  searchInput.value    = '';
  categorySelect.value = '';
  minPriceInput.value  = '';
  maxPriceInput.value  = '';

  errorBanner.classList.add('hidden');
  noResults.classList.add('hidden');
  resultsHeader.classList.add('hidden');
  resultsContainer.innerHTML = '';
  resultsContainer.classList.add('hidden');
  headerStats.innerHTML = '<span class="stat-badge">15 products available</span>';

  hasSearched = false;
  searchInput.focus();
}

// ─── XSS protection helper ──────────────────────────────────────────────────────
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Event listeners ────────────────────────────────────────────────────────────
searchBtn.addEventListener('click', searchInventory);

resetBtn.addEventListener('click', resetFilters);

// Search on Enter key in any input field
[searchInput, minPriceInput, maxPriceInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchInventory();
  });
});

// Category change triggers immediate search if user has already searched
categorySelect.addEventListener('change', () => {
  if (hasSearched) searchInventory();
});
