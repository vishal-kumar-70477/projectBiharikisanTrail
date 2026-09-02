// ---- Config: adjust these to match your backend routes ----
const API_BASE = "/biharikisan/buyer";

const PRODUCTS_ENDPOINT = `${API_BASE}/browse-Products`;

const ORDER_ENDPOINT = (productId) =>
  `${API_BASE}/place-Order/${productId}`; // -> placeOrder


// ---- State ----
let allProducts = [];
let searchTerm = "";


// ---- DOM refs ----
const skeletonGrid = document.getElementById("skeletonGrid");
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const emptyTitle = document.getElementById("emptyTitle");
const emptySub = document.getElementById("emptySub");
const errorBanner = document.getElementById("errorBanner");
const searchInput = document.getElementById("searchInput");


// ---- Helpers ----
function currency(n) {
  return `\u20B9${Number(n).toLocaleString("en-IN")}`;
}


function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}


function renderSkeletons(count = 6) {
  skeletonGrid.innerHTML = Array.from({ length: count })
    .map(
      () => `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>

        <div class="skeleton-body">
          <div class="skeleton-line" style="width:40%"></div>
          <div class="skeleton-line" style="width:85%"></div>
          <div class="skeleton-line" style="width:60%"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>`
    )
    .join("");
}


function showError(message) {
  errorBanner.textContent = message;
  errorBanner.classList.remove("hidden");
}


function hideError() {
  errorBanner.classList.add("hidden");
}


// ---- Fetch products ----
async function fetchProducts() {

  renderSkeletons();

  skeletonGrid.classList.remove("hidden");
  productGrid.classList.add("hidden");
  emptyState.classList.add("hidden");

  hideError();

  try {

    const res = await fetch(PRODUCTS_ENDPOINT, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok && data.success) {

      allProducts = data.products || [];

      renderProducts();

    } else {

      showError(
        data.message || "Products load nahi ho paaye"
      );

      allProducts = [];

      renderProducts();
    }

  } catch (err) {

    console.error("Fetch products error:", err);

    showError(
      "Server se connect nahi ho paaya"
    );

    allProducts = [];

    renderProducts();

  } finally {

    skeletonGrid.classList.add("hidden");
  }
}


// ---- Render products (applies search filter) ----
function renderProducts() {

  const q = searchTerm.trim().toLowerCase();

  const filtered = !q
    ? allProducts
    : allProducts.filter(
        (p) =>
          p.productDesc?.toLowerCase().includes(q) ||
          p.sellerName?.toLowerCase().includes(q)
      );


  if (filtered.length === 0) {

    productGrid.classList.add("hidden");

    emptyState.classList.remove("hidden");

    if (q) {

      emptyTitle.textContent =
        "Koi crop match nahi hua";

      emptySub.textContent =
        "Kuch aur search karke dekhein";

    } else {

      emptyTitle.textContent =
        "Abhi koi crop listed nahi hai";

      emptySub.textContent =
        "Farmers ke listing karte hi yahan dikhega";
    }

    return;
  }


  emptyState.classList.add("hidden");

  productGrid.classList.remove("hidden");

  productGrid.innerHTML =
    filtered.map((p) => cardTemplate(p)).join("");


  filtered.forEach((p) =>
    attachCardHandlers(p)
  );
}


// ---- Card markup ----
function cardTemplate(p) {

  const available = p.productQuantity;

  const outOfStock = available <= 0;

  const initial =
    (p.sellerName || "?")
      .trim()
      .charAt(0);


  return `
  <div class="card" data-product-id="${p.productId}">

    <div class="card-image-wrap">

      ${
        p.productImageUri
          ? `
            <img
              src="${escapeHtml(p.productImageUri)}"
              alt="${escapeHtml(p.productDesc)}"
            />
          `
          : `
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E5C8A"
              stroke-width="1.5"
            >
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>

              <path d="m3.3 7 8.7 5 8.7-5"></path>

              <path d="M12 22V12"></path>
            </svg>
          `
      }


      <div class="price-chip">
        ${currency(p.productPrice)}
        <span> /unit</span>
      </div>


      ${
        outOfStock
          ? `<div class="stock-badge">Out of stock</div>`
          : ""
      }

    </div>


    <div class="card-body">

      <div class="card-seller">

        <span class="seller-avatar">
          ${escapeHtml(initial)}
        </span>

        <span class="seller-name">
          ${escapeHtml(p.sellerName)}
        </span>

        <span
          class="available-pill"
          data-available
        >
          ${available} available
        </span>

      </div>


      <p
        class="card-desc"
        title="${escapeHtml(p.productDesc)}"
      >
        ${escapeHtml(p.productDesc)}
      </p>


      <div
        class="card-footer"
        data-footer
      >

        <div class="qty-row">

          <div class="qty-control">

            <button
              type="button"
              data-action="dec"
              ${outOfStock ? "disabled" : ""}
              aria-label="Decrease quantity"
            >

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                ></line>
              </svg>

            </button>


            <input
              type="number"
              value="1"
              min="1"
              max="${available}"
              data-qty-input
              ${outOfStock ? "disabled" : ""}
            />


            <button
              type="button"
              data-action="inc"
              ${outOfStock ? "disabled" : ""}
              aria-label="Increase quantity"
            >

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                ></line>

                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                ></line>
              </svg>

            </button>

          </div>


          <span
            class="qty-total"
            data-total
          >
            Total ${currency(p.productPrice)}
          </span>

        </div>


        <!-- VIEW PRODUCT BUTTON -->
        <button
          type="button"
          class="order-btn"
          data-action="order"
          ${outOfStock ? "disabled" : ""}
        >
          ${outOfStock ? "Out of stock" : "View Product"}
        </button>


        <p
          class="order-error hidden"
          data-error
        ></p>

      </div>

    </div>

  </div>`;
}


// ---- Card interactivity ----
function attachCardHandlers(product) {

  const card =
    productGrid.querySelector(
      `[data-product-id="${product.productId}"]`
    );

  if (!card) return;


  const qtyInput =
    card.querySelector("[data-qty-input]");

  const totalEl =
    card.querySelector("[data-total]");

  const availableEl =
    card.querySelector("[data-available]");

  const decBtn =
    card.querySelector('[data-action="dec"]');

  const incBtn =
    card.querySelector('[data-action="inc"]');

  const orderBtn =
    card.querySelector('[data-action="order"]');

  const errorEl =
    card.querySelector("[data-error]");

  const footer =
    card.querySelector("[data-footer]");


  let available =
    product.productQuantity;


  function clamp(v) {

    if (Number.isNaN(v)) {
      return 1;
    }

    return Math.max(
      1,
      Math.min(available, v)
    );
  }


  function updateTotal() {

    const qty =
      clamp(
        parseInt(
          qtyInput.value,
          10
        )
      );

    qtyInput.value = qty;

    totalEl.textContent =
      `Total ${currency(
        qty * product.productPrice
      )}`;
  }


  // ---- Decrease ----
  decBtn?.addEventListener(
    "click",
    () => {

      qtyInput.value =
        clamp(
          parseInt(
            qtyInput.value,
            10
          ) - 1
        );

      updateTotal();
    }
  );


  // ---- Increase ----
  incBtn?.addEventListener(
    "click",
    () => {

      qtyInput.value =
        clamp(
          parseInt(
            qtyInput.value,
            10
          ) + 1
        );

      updateTotal();
    }
  );


  // ---- Manual quantity ----
  qtyInput?.addEventListener(
    "input",
    updateTotal
  );

// ---- View Product ----
orderBtn?.addEventListener(
  "click",
  () => {

    // View Product par sirf product details page open hoga
    // Koi order API call nahi hogi
    // Quantity decrease/increase nahi hogi

    window.location.href =
      `/viewproduct/${product.productId}`;

  }
);
}


// ---- Search ----
searchInput.addEventListener(
  "input",
  (e) => {

    searchTerm =
      e.target.value;

    renderProducts();
  }
);


// ---- Mobile sidebar drawer ----
const sidebarEl = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");

function openSidebar() {
  sidebarEl?.classList.add("open");
  sidebarOverlay?.classList.add("show");
}

function closeSidebar() {
  sidebarEl?.classList.remove("open");
  sidebarOverlay?.classList.remove("show");
}

menuBtn?.addEventListener("click", openSidebar);
sidebarOverlay?.addEventListener("click", closeSidebar);

document
  .querySelectorAll(".sidebar .nav-link, .sidebar .logout-link")
  .forEach((link) => link.addEventListener("click", closeSidebar));


// ---- Init ----
fetchProducts();