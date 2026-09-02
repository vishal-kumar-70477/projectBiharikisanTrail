/* =========================================================
   BIHARI KISAN — My Orders
   Frontend logic — fetches live orders from the backend
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     ICONS
  --------------------------------------------------------- */

  const ICONS = {
    'badge-check': `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>`,
    'bell': `<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>`,
    'calendar-clock': `<path d="M16 14v2.2l1.6 1"/><path d="M16 2v3"/><path d="M21 7.338V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2.338"/><path d="M3 9h5.859"/><path d="M8 2v3"/><circle cx="16" cy="16" r="6"/>`,
    'check-circle-2': `<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>`,
    'check': `<path d="M20 6 9 17l-5-5"/>`,
    'chevron-down': `<path d="m6 9 6 6 6-6"/>`,
    'circle-check-big': `<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>`,
    'circle-dot': `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>`,
    'circle-help': `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>`,
    'circle-x': `<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>`,
    'circle': `<circle cx="12" cy="12" r="10"/>`,
    'clipboard-list': `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>`,
    'file-text': `<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
    'flame': `<path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>`,
    'flower': `<circle cx="12" cy="12" r="3"/><path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"/>`,
    'hand-heart': `<path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m2 15 6 6"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91"/>`,
    'info': `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`,
    'layout-grid': `<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>`,
    'leaf': `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>`,
    'loader': `<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>`,
    'log-out': `<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>`,
    'map-pin': `<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>`,
    'menu': `<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>`,
    'package-check': `<path d="M12 22V12"/><path d="m16 17 2 2 4-4"/><path d="M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753"/><path d="M3.29 7 12 12l8.71-5"/>`,
    'package-search': `<path d="M12 22V12"/><path d="M20.27 18.27 22 20"/><path d="M21 10.498V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l.98-.559"/><path d="M3.29 7 12 12l8.71-5"/><circle cx="18.5" cy="16.5" r="2.5"/>`,
    'rotate-cw': `<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>`,
    'search': `<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>`,
    'settings': `<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>`,
    'shopping-basket': `<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>`,
    'sprout': `<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/><path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>`,
    'store': `<path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/>`,
    'truck': `<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>`,
    'user-round': `<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>`,
    'users': `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>`,
    'wallet': `<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>`,
    'wheat': `<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/>`,
    'wifi-off': `<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>`,
    'x-circle': `<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>`,
    'x': `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`
  };

  function icon(name, cls = '') {
    const paths = ICONS[name] || '';

    return `
      <svg
        class="lucide-ico ${cls}"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        ${paths}
      </svg>
    `;
  }

  /* ---------------------------------------------------------
     CONFIG
     Same frontend + backend Render domain
  --------------------------------------------------------- */

  const CONFIG = {
    API_BASE_URL: '',
    ORDERS_ENDPOINT: '/biharikisan/buyer/view-Orders',
    LOGIN_URL: '/'
  };

  const USE_MOCK_DATA = false;

  let ORDERS = [];

  /* ---------------------------------------------------------
     ORDER STATUS
  --------------------------------------------------------- */

  const ORDER_STATUS_MAP = {
    pending: 'Confirmed',
    confirmed: 'Confirmed',
    processing: 'Preparing',
    preparing: 'Preparing',
    pickedup: 'Picked Up',
    picked_up: 'Picked Up',
    shipped: 'Out for Delivery',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    canceled: 'Cancelled'
  };

  const PAYMENT_STATUS_MAP = {
    pending: 'Pending',
    paid: 'Successful',
    successful: 'Successful',
    success: 'Successful',
    failed: 'Failed',
    refunded: 'Refunded'
  };

  const PAYMENT_METHOD_MAP = {
    cod: 'Cash on Delivery',
    upi: 'UPI',
    card: 'Card',
    netbanking: 'Net Banking',
    net_banking: 'Net Banking'
  };

  function normalizeStatus(value) {
    if (!value) return 'Confirmed';

    const key = String(value)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');

    return ORDER_STATUS_MAP[key] || value;
  }

  function normalizePaymentStatus(value) {
    if (!value) return 'Pending';

    const key = String(value).trim().toLowerCase();

    return PAYMENT_STATUS_MAP[key] || value;
  }

  function normalizePaymentMethod(value) {
    if (!value) return 'UPI';

    const key = String(value)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_');

    return PAYMENT_METHOD_MAP[key] || value;
  }

  /* ---------------------------------------------------------
     NORMALIZE BACKEND DATA
  --------------------------------------------------------- */

  function normalizeOrder(raw) {
    const product =
      raw.productId && typeof raw.productId === 'object'
        ? raw.productId
        : {};

    const seller =
      raw.sellerId && typeof raw.sellerId === 'object'
        ? raw.sellerId
        : {};

    // ab sellerAddress order document mein top-level saved hai,
    // isliye populate ki zaroorat nahi — fallback ke liye seller.address bhi check kar rahe hain
    const address = raw.sellerAddress || seller.address || {};

    const quantity = Number(raw.quantity || 1);

    const pricePerUnit = Number(
      raw.priceAtOrder ??
      raw.pricePerUnit ??
      product.productPrice ??
      product.price ??
      0
    );

    const calculatedTotal = quantity * pricePerUnit;

    const locationParts = [
      address.village,
      address.city,
      address.district,
      address.state
    ].filter(Boolean);

    return {
      id: String(raw._id || raw.orderId || raw.id || ''),

      productName:
        raw.productDesc ||
        product.productDesc ||
        product.productName ||
        product.name ||
        raw.productName ||
        'Product',

      quantity,

      unit:
        raw.unit ||
        product.unit ||
        product.productUnit ||
        'KG',

      pricePerUnit,

      farmerName:
        raw.sellerName ||
        seller.sellerName ||
        seller.fullName ||
        seller.name ||
        raw.farmerName ||
        'Farmer',

      farmerLocation:
        locationParts.join(', ') ||
        raw.farmerLocation ||
        'Location not available',

      verified:
        raw.verified ??
        seller.verified ??
        false,

      totalAmount: Number(
        raw.totalAmount ??
        raw.amount ??
        raw.totalPrice ??
        calculatedTotal
      ),

      orderDate:
        raw.orderDate ||
        raw.createdAt ||
        new Date().toISOString(),

      status: normalizeStatus(
        raw.orderStatus ||
        raw.status
      ),

      paymentMethod: normalizePaymentMethod(
        raw.paymentMethod
      ),

      paymentStatus: normalizePaymentStatus(
        raw.paymentStatus
      ),

      expectedDelivery:
        raw.expectedDelivery ||
        raw.deliveryDate ||
        'Will be updated soon',

      deliveredOn:
        raw.deliveredOn ||
        raw.deliveredAt ||
        null
    };
  }

  const PRODUCT_ICONS = {
    'Desi Aloo': 'circle',
    'Fresh Tomato': 'circle-dot',
    'Green Chilli': 'flame',
    'Basmati Rice': 'wheat',
    'Seasonal Onion': 'circle',
    'Fresh Cauliflower': 'flower',
    'Organic Wheat': 'wheat',
    'Mustard Seeds': 'sprout'
  };

  const TRACK_STEPS = [
    'Confirmed',
    'Preparing',
    'Picked Up',
    'Out for Delivery',
    'Delivered'
  ];

  const STATUS_TO_STEP_INDEX = {
    'Confirmed': 0,
    'Preparing': 1,
    'Picked Up': 2,
    'Out for Delivery': 3,
    'Delivered': 4
  };

  const STATUS_BADGE_CLASS = {
    'Confirmed': 'bk-status-badge--confirmed',
    'Preparing': 'bk-status-badge--preparing',
    'Picked Up': 'bk-status-badge--transit',
    'Out for Delivery': 'bk-status-badge--transit',
    'Delivered': 'bk-status-badge--delivered',
    'Cancelled': 'bk-status-badge--cancelled'
  };

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */

  let state = {
    statFilter: 'All',
    statusFilter: 'All',
    dateFilter: 'All',
    sort: 'newest',
    search: '',
    visibleCount: 6
  };

  const PAGE_SIZE = 6;

  /* ---------------------------------------------------------
     DOM REFERENCES
  --------------------------------------------------------- */

  const els = {
    ordersList: document.getElementById('ordersList'),
    emptyState: document.getElementById('emptyState'),
    emptyStateIcon: document.getElementById('emptyStateIcon'),
    emptyStateHeading: document.getElementById('emptyStateHeading'),
    emptyStateMessage: document.getElementById('emptyStateMessage'),
    loadingState: document.getElementById('loadingState'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    orderSearch: document.getElementById('orderSearch'),
    globalSearch: document.getElementById('globalSearch'),
    statusFilter: document.getElementById('statusFilter'),
    dateFilter: document.getElementById('dateFilter'),
    sortOrder: document.getElementById('sortOrder'),
    statCards: document.querySelectorAll('.bk-stat-card'),
    cardTemplate: document.getElementById('orderCardTemplate'),
    trackModal: document.getElementById('trackModal'),
    trackModalBody: document.getElementById('trackModalBody'),
    detailsModal: document.getElementById('detailsModal'),
    detailsModalBody: document.getElementById('detailsModalBody'),
    cancelModal: document.getElementById('cancelModal'),
    confirmCancelBtn: document.getElementById('confirmCancelBtn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    heroTotalCount: document.getElementById('heroTotalCount'),
    sidebar: document.getElementById('sidebar'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    menuToggle: document.getElementById('menuToggle')
  };

  let pendingCancelId = null;
  let toastTimer = null;
  let lastFocusedEl = null;

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */

  function formatCurrency(value) {
    const amount = Number(value);

    if (Number.isNaN(amount)) return '₹0';

    return '₹' + amount.toLocaleString('en-IN');
  }

  function toSafeDate(dateStr) {
    if (!dateStr) return new Date(NaN);

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(String(dateStr));

    return new Date(
      isDateOnly
        ? `${dateStr}T00:00:00`
        : dateStr
    );
  }

  function formatDate(dateStr) {
    const date = toSafeDate(dateStr);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function daysAgo(dateStr) {
    const date = toSafeDate(dateStr);

    if (Number.isNaN(date.getTime())) return Infinity;

    return Math.floor(
      (Date.now() - date.getTime()) /
      (1000 * 60 * 60 * 24)
    );
  }

  function showToast(message) {
    if (!els.toast || !els.toastMessage) return;

    els.toastMessage.textContent = message;
    els.toast.hidden = false;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      els.toast.hidden = true;
    }, 3200);
  }

  /* ---------------------------------------------------------
     STATS
  --------------------------------------------------------- */

  function computeStatCounts() {
    const counts = {
      All: ORDERS.length,
      Preparing: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Cancelled: 0
    };

    ORDERS.forEach(order => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });

    return counts;
  }

  function renderStatCounts() {
    const counts = computeStatCounts();

    document.querySelectorAll('[data-count]').forEach(element => {
      const key = element.getAttribute('data-count');

      element.textContent =
        counts[key] !== undefined
          ? counts[key]
          : 0;
    });

    if (els.heroTotalCount) {
      els.heroTotalCount.textContent = counts.All;
    }
  }

  /* ---------------------------------------------------------
     FILTER / SEARCH / SORT
  --------------------------------------------------------- */

  function getFilteredOrders() {
    let list = [...ORDERS];

    if (state.statFilter !== 'All') {
      list = list.filter(
        order => order.status === state.statFilter
      );
    }

    if (state.statusFilter !== 'All') {
      list = list.filter(
        order => order.status === state.statusFilter
      );
    }

    if (state.dateFilter === '30') {
      list = list.filter(
        order => daysAgo(order.orderDate) <= 30
      );
    }

    if (state.dateFilter === '90') {
      list = list.filter(
        order => daysAgo(order.orderDate) <= 90
      );
    }

    if (state.dateFilter === 'year') {
      const year = new Date().getFullYear();

      list = list.filter(order => {
        const date = toSafeDate(order.orderDate);

        return !Number.isNaN(date.getTime()) &&
          date.getFullYear() === year;
      });
    }

    if (state.search.trim()) {
      const query = state.search.trim().toLowerCase();

      list = list.filter(order =>
        String(order.id).toLowerCase().includes(query) ||
        String(order.productName).toLowerCase().includes(query) ||
        String(order.farmerName).toLowerCase().includes(query) ||
        String(order.farmerLocation).toLowerCase().includes(query)
      );
    }

    list.sort((a, b) => {
      switch (state.sort) {
        case 'oldest':
          return toSafeDate(a.orderDate) - toSafeDate(b.orderDate);

        case 'amount-high':
          return b.totalAmount - a.totalAmount;

        case 'amount-low':
          return a.totalAmount - b.totalAmount;

        case 'newest':
        default:
          return toSafeDate(b.orderDate) - toSafeDate(a.orderDate);
      }
    });

    return list;
  }

  /* ---------------------------------------------------------
     TRACKER
  --------------------------------------------------------- */

  function buildTracker(order) {
    const list = document.createElement('ol');

    list.className = 'bk-tracker';

    const currentIndex =
      STATUS_TO_STEP_INDEX[order.status] ?? 0;

    TRACK_STEPS.forEach((step, index) => {
      const item = document.createElement('li');

      item.className = 'bk-tracker__step';

      if (index < currentIndex) {
        item.classList.add('is-done');
      } else if (index === currentIndex) {
        item.classList.add('is-current');
      }

      const iconName =
        index < currentIndex
          ? 'check'
          : index === currentIndex
            ? 'circle-dot'
            : 'circle';

      item.innerHTML = `
        <span class="bk-tracker__dot">
          ${icon(iconName)}
        </span>
        <span class="bk-tracker__label">${step}</span>
      `;

      list.appendChild(item);
    });

    return list;
  }

  /* ---------------------------------------------------------
     RENDER ORDER CARD
  --------------------------------------------------------- */

  function renderOrderCard(order) {
    if (!els.cardTemplate) return document.createDocumentFragment();

    const node = els.cardTemplate.content.cloneNode(true);

    const card = node.querySelector('.bk-order-card');

    if (card) {
      card.dataset.orderId = order.id;
    }

    const idElement = node.querySelector('.bk-order-card__id');

    if (idElement) {
      idElement.textContent = `Order ID: ${order.id}`;
    }

    const dateElement = node.querySelector('.bk-order-card__date');

    if (dateElement) {
      dateElement.textContent =
        `Ordered on ${formatDate(order.orderDate)}`;
    }

    const badge = node.querySelector('.bk-status-badge');

    if (badge) {
      badge.textContent = order.status;

      const badgeClass = STATUS_BADGE_CLASS[order.status];

      if (badgeClass) {
        badge.classList.add(badgeClass);
      }
    }

    const productIcon = PRODUCT_ICONS[order.productName] || 'leaf';

    const productImage = node.querySelector('.bk-product-img');

    if (productImage) {
      productImage.innerHTML = icon(productIcon);
    }

    const productName = node.querySelector('.bk-product-name');

    if (productName) {
      productName.textContent = order.productName;
    }

    const productQty = node.querySelector('.bk-product-qty');

    if (productQty) {
      productQty.textContent =
        `${order.quantity} ${order.unit} × ₹${order.pricePerUnit} / ${order.unit}`;
    }

    const farmerName = node.querySelector('.bk-farmer-name');

    if (farmerName) {
      farmerName.textContent =
        `Farmer: ${order.farmerName}`;
    }

    const location = node.querySelector('.bk-location-text');

    if (location) {
      location.textContent = order.farmerLocation;
    }

    const verifiedBadge = node.querySelector('.bk-verified-badge');

    if (verifiedBadge && !order.verified) {
      verifiedBadge.style.display = 'none';
    }

    const amount = node.querySelector('.bk-amount-value');

    if (amount) {
      amount.textContent = formatCurrency(order.totalAmount);
    }

    const paymentInfo = node.querySelector('.bk-payment-info');

    if (paymentInfo) {
      const isPaid = order.paymentStatus === 'Successful';

      if (
        order.paymentMethod === 'Cash on Delivery' &&
        !isPaid
      ) {
        paymentInfo.textContent =
          'Cash on Delivery — Payment Pending';
      } else {
        paymentInfo.textContent =
          `Paid via ${order.paymentMethod} — ${isPaid ? 'Payment Successful' : 'Payment Pending'}`;
      }

      paymentInfo.classList.toggle('is-success', isPaid);
      paymentInfo.classList.toggle('is-pending', !isPaid);
    }

    const trackerWrap = node.querySelector('.bk-tracker-wrap');
    const cancelledNote = node.querySelector('.bk-cancelled-note');
    const deliveryNote = node.querySelector('.bk-delivery-note');

    if (order.status === 'Cancelled') {
      if (trackerWrap) trackerWrap.remove();

      if (cancelledNote) {
        cancelledNote.hidden = false;
      }

      if (deliveryNote) {
        deliveryNote.remove();
      }
    } else {
      if (cancelledNote) cancelledNote.remove();

      const oldTracker =
        trackerWrap?.querySelector('.bk-tracker');

      if (oldTracker) {
        oldTracker.replaceWith(buildTracker(order));
      }

      if (deliveryNote) {
        if (order.status === 'Delivered') {
          deliveryNote.innerHTML = `
            ${icon('package-check', 'bk-inline-icon bk-inline-icon--success')}
            Delivered on <strong>${formatDate(order.deliveredOn)}</strong>
          `;
        } else {
          deliveryNote.innerHTML = `
            ${icon('calendar-clock', 'bk-inline-icon bk-inline-icon--sky')}
            Expected Delivery <strong>${order.expectedDelivery}</strong>
          `;
        }
      }
    }

    const actions =
      node.querySelector('.bk-order-card__actions');

    if (actions) {
      actions.appendChild(buildActionButtons(order));
    }

    return node;
  }

  /* ---------------------------------------------------------
     ACTION BUTTONS
  --------------------------------------------------------- */

  function buildActionButtons(order) {
    const fragment = document.createDocumentFragment();

    function createButton(
      label,
      variant,
      iconName,
      handler
    ) {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = `bk-btn bk-btn--${variant}`;

      button.innerHTML =
        `${iconName ? icon(iconName) : ''}${label}`;

      button.addEventListener('click', handler);

      return button;
    }

    const viewDetailsButton = createButton(
      'View Details',
      'outline',
      'file-text',
      () => openDetailsModal(order)
    );

    if (
      order.status === 'Delivered' ||
      order.status === 'Cancelled'
    ) {
      fragment.appendChild(viewDetailsButton);

      fragment.appendChild(
        createButton(
          'Buy Again',
          'primary',
          'rotate-cw',
          () => handleBuyAgain(order)
        )
      );
    } else if (
      order.status === 'Preparing' ||
      order.status === 'Confirmed'
    ) {
      fragment.appendChild(viewDetailsButton);

      fragment.appendChild(
        createButton(
          'Cancel Order',
          'danger',
          'x-circle',
          () => openCancelModal(order.id)
        )
      );
    } else {
      fragment.appendChild(
        createButton(
          'Track Order',
          'primary',
          'map-pin',
          () => openTrackModal(order)
        )
      );

      fragment.appendChild(viewDetailsButton);
    }

    return fragment;
  }

  /* ---------------------------------------------------------
     RENDER ORDERS
  --------------------------------------------------------- */

  function renderOrders() {
    if (!els.ordersList) return;

    const filtered = getFilteredOrders();

    const visible =
      filtered.slice(0, state.visibleCount);

    els.ordersList.innerHTML = '';

    if (filtered.length === 0) {
      showNoResultsState();

      if (els.loadMoreBtn) {
        els.loadMoreBtn.style.display = 'none';
      }

      return;
    }

    if (els.emptyState) {
      els.emptyState.hidden = true;
    }

    visible.forEach(order => {
      els.ordersList.appendChild(
        renderOrderCard(order)
      );
    });

    if (els.loadMoreBtn) {
      els.loadMoreBtn.style.display =
        state.visibleCount < filtered.length
          ? 'inline-flex'
          : 'none';
    }
  }

  /* ---------------------------------------------------------
     EMPTY / ERROR STATES
  --------------------------------------------------------- */

  function showNoResultsState() {
    if (!els.emptyState) return;

    if (els.emptyStateIcon) {
      els.emptyStateIcon.innerHTML =
        icon('package-search');
    }

    if (els.emptyStateHeading) {
      els.emptyStateHeading.textContent =
        'No orders found';
    }

    if (els.emptyStateMessage) {
      els.emptyStateMessage.textContent =
        'Try changing your filters or search for another order.';
    }

    if (els.clearFiltersBtn) {
      els.clearFiltersBtn.textContent = 'Clear Filters';
      els.clearFiltersBtn.dataset.mode = 'clear';
    }

    els.emptyState.hidden = false;
  }

  function showErrorState(message) {
    if (els.ordersList) {
      els.ordersList.innerHTML = '';
    }

    if (els.loadMoreBtn) {
      els.loadMoreBtn.style.display = 'none';
    }

    if (els.emptyStateIcon) {
      els.emptyStateIcon.innerHTML =
        icon('wifi-off');
    }

    if (els.emptyStateHeading) {
      els.emptyStateHeading.textContent =
        "Couldn't load your orders";
    }

    if (els.emptyStateMessage) {
      els.emptyStateMessage.textContent =
        message ||
        'Something went wrong while fetching your orders.';
    }

    if (els.clearFiltersBtn) {
      els.clearFiltersBtn.textContent = 'Retry';
      els.clearFiltersBtn.dataset.mode = 'retry';
    }

    if (els.emptyState) {
      els.emptyState.hidden = false;
    }
  }

  /* ---------------------------------------------------------
     STAT FILTER
  --------------------------------------------------------- */

  function setStatFilter(value) {
    state.statFilter = value;
    state.visibleCount = PAGE_SIZE;

    els.statCards.forEach(card => {
      card.classList.toggle(
        'is-active',
        card.dataset.statFilter === value
      );
    });

    if (els.statusFilter) {
      if (
        [
          'Preparing',
          'Out for Delivery',
          'Delivered',
          'Cancelled'
        ].includes(value)
      ) {
        els.statusFilter.value = value;
        state.statusFilter = value;
      } else {
        els.statusFilter.value = 'All';
        state.statusFilter = 'All';
      }
    }

    renderOrders();
  }

  els.statCards.forEach(card => {
    card.addEventListener('click', () => {
      setStatFilter(card.dataset.statFilter);
    });
  });

  /* ---------------------------------------------------------
     TOOLBAR EVENTS
  --------------------------------------------------------- */

  function syncSearchInputs(value) {
    state.search = value;
    state.visibleCount = PAGE_SIZE;

    if (els.orderSearch) {
      els.orderSearch.value = value;
    }

    if (els.globalSearch) {
      els.globalSearch.value = value;
    }

    renderOrders();
  }

  if (els.orderSearch) {
    els.orderSearch.addEventListener(
      'input',
      event => syncSearchInputs(event.target.value)
    );
  }

  if (els.globalSearch) {
    els.globalSearch.addEventListener(
      'input',
      event => syncSearchInputs(event.target.value)
    );
  }

  if (els.statusFilter) {
    els.statusFilter.addEventListener(
      'change',
      event => {
        state.statusFilter = event.target.value;
        state.statFilter =
          event.target.value === 'All'
            ? 'All'
            : event.target.value;

        state.visibleCount = PAGE_SIZE;

        els.statCards.forEach(card => {
          card.classList.toggle(
            'is-active',
            card.dataset.statFilter === state.statFilter
          );
        });

        renderOrders();
      }
    );
  }

  if (els.dateFilter) {
    els.dateFilter.addEventListener(
      'change',
      event => {
        state.dateFilter = event.target.value;
        state.visibleCount = PAGE_SIZE;
        renderOrders();
      }
    );
  }

  if (els.sortOrder) {
    els.sortOrder.addEventListener(
      'change',
      event => {
        state.sort = event.target.value;
        renderOrders();
      }
    );
  }

  if (els.loadMoreBtn) {
    els.loadMoreBtn.addEventListener('click', () => {
      state.visibleCount += PAGE_SIZE;
      renderOrders();
    });
  }

  if (els.clearFiltersBtn) {
    els.clearFiltersBtn.addEventListener('click', () => {
      if (
        els.clearFiltersBtn.dataset.mode === 'retry'
      ) {
        fetchOrders();
        return;
      }

      state = {
        statFilter: 'All',
        statusFilter: 'All',
        dateFilter: 'All',
        sort: 'newest',
        search: '',
        visibleCount: PAGE_SIZE
      };

      if (els.orderSearch) els.orderSearch.value = '';
      if (els.globalSearch) els.globalSearch.value = '';
      if (els.statusFilter) els.statusFilter.value = 'All';
      if (els.dateFilter) els.dateFilter.value = 'All';
      if (els.sortOrder) els.sortOrder.value = 'newest';

      els.statCards.forEach(card => {
        card.classList.toggle(
          'is-active',
          card.dataset.statFilter === 'All'
        );
      });

      renderOrders();
    });
  }

  /* ---------------------------------------------------------
     SIDEBAR
  --------------------------------------------------------- */

  function openSidebar() {
    if (!els.sidebar) return;

    els.sidebar.classList.add('is-open');

    if (els.sidebarOverlay) {
      els.sidebarOverlay.hidden = false;
    }

    if (els.menuToggle) {
      els.menuToggle.setAttribute(
        'aria-expanded',
        'true'
      );
    }

    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (els.sidebar) {
      els.sidebar.classList.remove('is-open');
    }

    if (els.sidebarOverlay) {
      els.sidebarOverlay.hidden = true;
    }

    if (els.menuToggle) {
      els.menuToggle.setAttribute(
        'aria-expanded',
        'false'
      );
    }

    document.body.style.overflow = '';
  }

  if (els.menuToggle) {
    els.menuToggle.addEventListener('click', () => {
      const isOpen =
        els.sidebar?.classList.contains('is-open');

      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (els.sidebarOverlay) {
    els.sidebarOverlay.addEventListener(
      'click',
      closeSidebar
    );
  }

  document.querySelectorAll('.bk-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    });
  });

  /* ---------------------------------------------------------
     MODALS
  --------------------------------------------------------- */

  function openModal(modalElement) {
    if (!modalElement) return;

    lastFocusedEl = document.activeElement;

    modalElement.hidden = false;
    document.body.style.overflow = 'hidden';

    const closeButton =
      modalElement.querySelector('.bk-modal__close');

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal(modalElement) {
    if (!modalElement) return;

    modalElement.hidden = true;
    document.body.style.overflow = '';

    if (lastFocusedEl) {
      lastFocusedEl.focus();
    }
  }

  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      const modalId =
        button.getAttribute('data-close-modal');

      closeModal(
        document.getElementById(modalId)
      );
    });
  });

  document.querySelectorAll('.bk-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', event => {
      if (event.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;

    if (
      els.sidebar &&
      els.sidebar.classList.contains('is-open')
    ) {
      closeSidebar();
    }

    document
      .querySelectorAll('.bk-modal-overlay')
      .forEach(overlay => {
        if (!overlay.hidden) {
          closeModal(overlay);
        }
      });
  });

  /* ---------------------------------------------------------
     TRACK ORDER
  --------------------------------------------------------- */

  function openTrackModal(order) {
    if (!els.trackModalBody) return;

    const currentIndex =
      STATUS_TO_STEP_INDEX[order.status] ?? 0;

    const timelineData = [
      {
        label: 'Order Confirmed',
        time: formatDate(order.orderDate)
      },
      {
        label: 'Farmer Preparing Produce',
        time:
          currentIndex >= 1
            ? 'Completed'
            : 'Pending'
      },
      {
        label: 'Picked Up',
        time:
          currentIndex >= 2
            ? 'Completed'
            : 'Pending'
      },
      {
        label: 'Out for Delivery',
        time:
          currentIndex >= 3
            ? 'Current Status'
            : 'Pending'
      },
      {
        label: 'Delivered',
        time:
          order.status === 'Delivered'
            ? formatDate(order.deliveredOn)
            : 'Pending'
      }
    ];

    let html = '<ol class="bk-track-timeline">';

    timelineData.forEach((step, index) => {
      let className = '';

      if (index < currentIndex) {
        className = 'is-done';
      } else if (index === currentIndex) {
        className = 'is-current';
      }

      const iconName =
        index < currentIndex
          ? 'check'
          : index === currentIndex
            ? 'circle-dot'
            : 'circle';

      html += `
        <li class="${className}">
          <span class="bk-track-dot">
            ${icon(iconName)}
          </span>

          <div>
            <div class="bk-track-title">
              ${step.label}
            </div>

            <div class="bk-track-time">
              ${step.time}
            </div>
          </div>
        </li>
      `;
    });

    html += '</ol>';

    html += `
      <div class="bk-track-eta">
        ${icon('calendar-clock')}
        <span>
          Expected Delivery
          <strong>${order.expectedDelivery}</strong>
        </span>
      </div>
    `;

    els.trackModalBody.innerHTML = html;

    openModal(els.trackModal);
  }

  /* ---------------------------------------------------------
     VIEW DETAILS
  --------------------------------------------------------- */

  function openDetailsModal(order) {
    if (!els.detailsModalBody) return;

    const productPrice =
      Number(order.quantity) *
      Number(order.pricePerUnit);

    const total =
      Number(order.totalAmount) || productPrice;

    els.detailsModalBody.innerHTML = `
      <div class="bk-detail-section-title">
        Order Info
      </div>

      <div class="bk-detail-row">
        <span>Order ID</span>
        <span>${order.id}</span>
      </div>

      <div class="bk-detail-row">
        <span>Order Date</span>
        <span>${formatDate(order.orderDate)}</span>
      </div>

      <div class="bk-detail-row">
        <span>Status</span>
        <span>${order.status}</span>
      </div>

      <div class="bk-detail-section-title">
        Product
      </div>

      <div class="bk-detail-row">
        <span>Product</span>
        <span>${order.productName}</span>
      </div>

      <div class="bk-detail-row">
        <span>Quantity</span>
        <span>${order.quantity} ${order.unit}</span>
      </div>

      <div class="bk-detail-row">
        <span>Farmer</span>
        <span>${order.farmerName}</span>
      </div>

      <div class="bk-detail-section-title">
        Payment
      </div>

      <div class="bk-detail-row">
        <span>Payment Method</span>
        <span>${order.paymentMethod}</span>
      </div>

      <div class="bk-detail-row">
        <span>Payment Status</span>
        <span>${order.paymentStatus}</span>
      </div>

      <div class="bk-detail-section-title">
        Price Breakdown
      </div>

      <div class="bk-price-breakdown">
        <div class="bk-price-row">
          <span>Product Price</span>
          <span>${formatCurrency(productPrice)}</span>
        </div>

        <div class="bk-price-row total">
          <span>Total Amount</span>
          <span>${formatCurrency(total)}</span>
        </div>
      </div>

      <div class="bk-support-note">
        ${icon('hand-heart')}
        <span>
          You are supporting a local farmer with this purchase.
        </span>
      </div>
    `;

    openModal(els.detailsModal);
  }

  /* ---------------------------------------------------------
     CANCEL ORDER
  --------------------------------------------------------- */

  function openCancelModal(orderId) {
    pendingCancelId = orderId;

    openModal(els.cancelModal);
  }

  if (els.confirmCancelBtn) {
    els.confirmCancelBtn.addEventListener('click', () => {
      const order = ORDERS.find(
        item => item.id === pendingCancelId
      );

      if (order) {
        order.status = 'Cancelled';

        if (
          order.paymentMethod === 'Cash on Delivery'
        ) {
          order.paymentStatus = 'Pending';
        }
      }

      closeModal(els.cancelModal);

      renderStatCounts();
      renderOrders();

      showToast(
        `Order ${pendingCancelId} has been cancelled.`
      );

      pendingCancelId = null;
    });
  }

  /* ---------------------------------------------------------
     BUY AGAIN
  --------------------------------------------------------- */

  function handleBuyAgain(order) {
    showToast(
      `${order.productName} has been added to your order list.`
    );
  }

  /* ---------------------------------------------------------
     FETCH ORDERS
  --------------------------------------------------------- */

  async function fetchOrders() {
    if (els.loadingState) {
      els.loadingState.hidden = false;
    }

    if (els.emptyState) {
      els.emptyState.hidden = true;
    }

    if (els.ordersList) {
      els.ordersList.innerHTML = '';
    }

    if (els.loadMoreBtn) {
      els.loadMoreBtn.style.display = 'none';
    }

    try {
      const url =
        `${CONFIG.API_BASE_URL}${CONFIG.ORDERS_ENDPOINT}`;

      console.log('Fetching orders from:', url);

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/json'
        }
      });

      let data = {};

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error(
          'Invalid JSON response:',
          jsonError
        );
      }

      if (response.status === 401) {
        if (els.loadingState) {
          els.loadingState.hidden = true;
        }

        showErrorState(
          'Your session has expired. Please log in again.'
        );

        setTimeout(() => {
          window.location.href = CONFIG.LOGIN_URL;
        }, 1500);

        return;
      }

      if (response.status === 403) {
        if (els.loadingState) {
          els.loadingState.hidden = true;
        }

        showErrorState(
          'This page is only available to buyer accounts.'
        );

        return;
      }

      if (!response.ok) {
        if (els.loadingState) {
          els.loadingState.hidden = true;
        }

        showErrorState(
          data.message ||
          `Server error (${response.status}).`
        );

        return;
      }

      /*
        Supports:
        {
          success: true,
          orders: [...]
        }

        Also supports:
        {
          orders: [...]
        }

        And direct array:
        [...]
      */

      let rawOrders = [];

      if (Array.isArray(data)) {
        rawOrders = data;
      } else if (Array.isArray(data.orders)) {
        rawOrders = data.orders;
      } else if (
        data.data &&
        Array.isArray(data.data.orders)
      ) {
        rawOrders = data.data.orders;
      }

      ORDERS = rawOrders.map(normalizeOrder);

      if (els.loadingState) {
        els.loadingState.hidden = true;
      }

      renderStatCounts();
      renderOrders();

      console.log(
        'Orders loaded successfully:',
        ORDERS
      );

    } catch (error) {
      console.error(
        'fetchOrders failed:',
        error
      );

      if (els.loadingState) {
        els.loadingState.hidden = true;
      }

      showErrorState(
        'Network error. Please check your connection and try again.'
      );
    }
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */

  function init() {
    fetchOrders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      init
    );
  } else {
    init();
  }

})();