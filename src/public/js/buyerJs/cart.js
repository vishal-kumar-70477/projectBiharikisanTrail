
/* ==========================================================================
   BIHARI KISAN — Cart Page Logic
   Connected with MongoDB Cart API
   ========================================================================== */

const API_BASE = "/biharikisan/buyer";

const VIEW_CART_ENDPOINT =
  `${API_BASE}/view-Cart`;

const DELETE_CART_ENDPOINT = (productId) =>
  `${API_BASE}/delete-From-Cart/${productId}`;


// ================= FEES =================
// All fees are currently ZERO

const DELIVERY_CHARGE = 0;
const PLATFORM_FEE = 0;
const FARMER_SUPPORT_FEE = 0;

const MIDDLEMAN_CUT_PER_UNIT_RATE = 0.18;


// ================= DOM =================

const cartListEl =
  document.getElementById("cartList");

const savedListEl =
  document.getElementById("savedList");

const emptyCartStateEl =
  document.getElementById("emptyCartState");

const emptySavedStateEl =
  document.getElementById("emptySavedState");

const supportNoteEl =
  document.getElementById("supportNote");

const cartSummaryEl =
  document.getElementById("cartSummary");

const cartCountBadgeEl =
  document.getElementById("cartCountBadge");

const tabCartCountEl =
  document.getElementById("tabCartCount");

const tabSavedCountEl =
  document.getElementById("tabSavedCount");

const cartItemTemplate =
  document.getElementById("cartItemTemplate");

const savedItemTemplate =
  document.getElementById("savedItemTemplate");


// ================= STATE =================

let cart = [];
let saved = [];


// ================= HELPERS =================

function formatRupees(amount) {

  const rounded =
    Math.round(Number(amount) || 0);

  const sign =
    rounded < 0 ? "− " : "";

  return (
    sign +
    "₹" +
    Math.abs(rounded).toLocaleString("en-IN")
  );

}


// ================= LOAD CART FROM DATABASE =================

async function loadCart() {

  try {

    const response =
      await fetch(
        VIEW_CART_ENDPOINT,
        {
          method: "GET",
          credentials: "include"
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      if (response.status === 404) {

        cart = [];

        renderAll();

        return;

      }

      throw new Error(
        data.message ||
        "Cart load failed"
      );

    }

    if (
      data.success &&
      Array.isArray(data.items)
    ) {

      cart =
        data.items.map(item => ({

          productId:
            item.productId,

          productName:
            item.productDesc ||
            "Fresh Crop",

          productImage:
            item.productImageUri ||
            "",

          sellerName:
            item.sellerName ||
            "Verified Farmer",

          sellerLocation:
            item.sellerLocation ||
            "Bihar, India",

          quantity:
            Number(item.quantity) || 1,

          unit:
            item.unit || "KG",

          pricePerUnit:
            Number(item.price) || 0

        }));

    } else {

      cart = [];

    }

    renderAll();

  } catch (error) {

    console.error(
      "Cart loading error:",
      error
    );

    cart = [];

    renderAll();

  }

}


// ================= CART TOTAL =================

function itemSubtotal(item) {

  return (
    Number(item.quantity) *
    Number(item.pricePerUnit)
  );

}


function cartTotals() {

  const itemsTotal =
    cart.reduce(
      (sum, item) =>
        sum + itemSubtotal(item),
      0
    );


  // All fees are ZERO
  const feesTotal = 0;


  const savings =
    Math.round(
      itemsTotal *
      MIDDLEMAN_CUT_PER_UNIT_RATE
    );


  // Total = Product value only
  const total =
    cart.length
      ? itemsTotal
      : 0;


  const mrpEquivalent =
    cart.length
      ? itemsTotal + savings
      : 0;


  return {
    itemsTotal,
    feesTotal,
    savings,
    total,
    mrpEquivalent
  };

}


// ================= RENDER CART =================

function renderCartList() {

  const hasItems =
    cart.length > 0;


  cartListEl.hidden =
    !hasItems;

  emptyCartStateEl.hidden =
    hasItems;

  supportNoteEl.hidden =
    !hasItems;

  cartSummaryEl.hidden =
    !hasItems;


  cartListEl.innerHTML = "";


  cart.forEach(
    (item, index) => {

      const node =
        cartItemTemplate.content.cloneNode(true);


      const article =
        node.querySelector(
          ".bk-cart-item"
        );


      article.dataset.index =
        index;


      const image =
        node.querySelector(
          ".bk-cart-item__img"
        );


      image.src =
        item.productImage;


      image.alt =
        item.productName;


      node.querySelector(
        ".bk-cart-item__name"
      ).textContent =
        item.productName;


      node.querySelector(
        ".bk-cart-item__seller-name"
      ).textContent =
        item.sellerName;


      node.querySelector(
        ".bk-cart-item__location"
      ).textContent =
        item.sellerLocation;


      node.querySelector(
        ".bk-qty-value"
      ).textContent =
        item.quantity;


      node.querySelector(
        ".bk-cart-item__price"
      ).textContent =
        `${formatRupees(
          item.pricePerUnit
        )} / ${item.unit}`;


      node.querySelector(
        ".bk-cart-item__subtotal"
      ).textContent =
        formatRupees(
          itemSubtotal(item)
        );


      cartListEl.appendChild(node);

    }
  );


  renderSummary();

}


// ================= SUMMARY =================

function renderSummary() {

  const hasItems =
    cart.length > 0;


  const {
    itemsTotal,
    feesTotal,
    savings,
    total,
    mrpEquivalent
  } = cartTotals();


  document.getElementById(
    "summaryItemsLabel"
  ).textContent =
    `Produce Value (${cart.length} item${
      cart.length === 1
        ? ""
        : "s"
    })`;


  document.getElementById(
    "sumProduct"
  ).textContent =
    formatRupees(itemsTotal);


  // Fees = ₹0
  document.getElementById(
    "sumFeesTotal"
  ).textContent =
    formatRupees(0);


  // Delivery = ₹0
  document.getElementById(
    "sumDelivery"
  ).textContent =
    formatRupees(0);


  // Platform = ₹0
  document.getElementById(
    "sumPlatform"
  ).textContent =
    formatRupees(0);


  // Farmer Support = ₹0
  document.getElementById(
    "sumFarmerFee"
  ).textContent =
    formatRupees(0);


  document.getElementById(
    "sumSavings"
  ).textContent =
    formatRupees(-savings);


  // Total = Product Value only
  document.getElementById(
    "sumTotal"
  ).textContent =
    formatRupees(total);


  document.getElementById(
    "savingsAmount"
  ).textContent =
    formatRupees(savings);


  document.getElementById(
    "checkoutMrp"
  ).textContent =
    formatRupees(mrpEquivalent);


  document.getElementById(
    "checkoutTotal"
  ).textContent =
    formatRupees(total);


  document.getElementById(
    "savingsBanner"
  ).hidden =
    savings <= 0;


  document.getElementById(
    "checkoutBtn"
  ).disabled =
    !hasItems;

}


// ================= RENDER SAVED =================

function renderSavedList() {

  const hasSaved =
    saved.length > 0;


  savedListEl.hidden =
    !hasSaved;


  emptySavedStateEl.hidden =
    hasSaved;


  savedListEl.innerHTML = "";


  saved.forEach(
    (item, index) => {

      const node =
        savedItemTemplate.content.cloneNode(true);


      const article =
        node.querySelector(
          ".bk-cart-item"
        );


      article.dataset.index =
        index;


      node.querySelector(
        ".bk-cart-item__img"
      ).src =
        item.productImage;


      node.querySelector(
        ".bk-cart-item__img"
      ).alt =
        item.productName;


      node.querySelector(
        ".bk-cart-item__name"
      ).textContent =
        item.productName;


      node.querySelector(
        ".bk-cart-item__seller-name"
      ).textContent =
        item.sellerName;


      node.querySelector(
        ".bk-cart-item__location"
      ).textContent =
        item.sellerLocation;


      node.querySelector(
        ".bk-cart-item__price"
      ).textContent =
        `${formatRupees(
          item.pricePerUnit
        )} / ${item.unit} · Qty ${item.quantity}`;


      savedListEl.appendChild(node);

    }
  );

}


// ================= COUNTS =================

function renderCounts() {

  cartCountBadgeEl.textContent =
    cart.length;


  tabCartCountEl.textContent =
    `(${cart.length}`;


  tabSavedCountEl.textContent =
    `(${saved.length})`;

}


// ================= RENDER ALL =================

function renderAll() {

  renderCartList();

  renderSavedList();

  renderCounts();

}


// ================= TABS =================

const tabCart =
  document.getElementById(
    "tabCart"
  );

const tabSaved =
  document.getElementById(
    "tabSaved"
  );

const panelCart =
  document.getElementById(
    "panelCart"
  );

const panelSaved =
  document.getElementById(
    "panelSaved"
  );


function activateTab(tab) {

  const isCart =
    tab === "cart";


  tabCart.classList.toggle(
    "is-active",
    isCart
  );


  tabSaved.classList.toggle(
    "is-active",
    !isCart
  );


  tabCart.setAttribute(
    "aria-selected",
    String(isCart)
  );


  tabSaved.setAttribute(
    "aria-selected",
    String(!isCart)
  );


  panelCart.hidden =
    !isCart;


  panelSaved.hidden =
    isCart;


  cartSummaryEl.style.display =
    isCart ? "" : "none";

}


tabCart.addEventListener(
  "click",
  () => activateTab("cart")
);


tabSaved.addEventListener(
  "click",
  () => activateTab("saved")
);


// ================= CART ITEM ACTIONS =================

cartListEl.addEventListener(
  "click",
  async (e) => {

    const article =
      e.target.closest(
        ".bk-cart-item"
      );


    if (!article) return;


    const index =
      Number(article.dataset.index);


    const item =
      cart[index];


    if (!item) return;


    // PLUS
    if (
      e.target.closest(
        ".bk-qty-plus"
      )
    ) {

      item.quantity += 1;

      renderAll();

      return;

    }


    // MINUS
    if (
      e.target.closest(
        ".bk-qty-minus"
      )
    ) {

      if (
        item.quantity > 1
      ) {

        item.quantity -= 1;

        renderAll();

      }

      return;

    }


    // REMOVE
    if (
      e.target.closest(
        ".bk-action-remove"
      )
    ) {

      await deleteCartItem(
        item.productId
      );

      return;

    }


    // SAVE
    if (
      e.target.closest(
        ".bk-action-save"
      )
    ) {

      const [moved] =
        cart.splice(
          index,
          1
        );


      saved.push(moved);

      renderAll();

      return;

    }


    // BUY NOW
    if (
      e.target.closest(
        ".bk-action-buynow"
      )
    ) {

      checkoutWithItems(
        [item]
      );

    }

  }
);


// ================= DELETE CART ITEM =================

async function deleteCartItem(
  productId
) {

  try {

    const response =
      await fetch(
        DELETE_CART_ENDPOINT(
          productId
        ),
        {
          method: "DELETE",
          credentials: "include"
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to remove item"
      );

    }


    cart =
      cart.filter(
        item =>
          String(item.productId) !==
          String(productId)
      );


    renderAll();


  } catch (error) {

    console.error(
      "Delete cart error:",
      error
    );


    alert(
      error.message ||
      "Unable to remove product"
    );

  }

}


// ================= SAVED ITEM ACTIONS =================

savedListEl.addEventListener(
  "click",
  (e) => {

    const article =
      e.target.closest(
        ".bk-cart-item"
      );


    if (!article) return;


    const index =
      Number(article.dataset.index);


    const item =
      saved[index];


    if (!item) return;


    if (
      e.target.closest(
        ".bk-action-remove"
      )
    ) {

      saved.splice(
        index,
        1
      );

      renderAll();

    }


    else if (
      e.target.closest(
        ".bk-action-movetocart"
      )
    ) {

      const [moved] =
        saved.splice(
          index,
          1
        );


      cart.push(moved);

      renderAll();

      activateTab(
        "cart"
      );

    }

  }
);


// ================= CHECKOUT =================

function checkoutWithItems(
  items
) {

  if (!items.length)
    return;


  const itemsTotal =
    items.reduce(
      (sum, item) =>
        sum +
        itemSubtotal(item),
      0
    );


  const primaryItem =
    items[0];


  const order = {

    productId:
      primaryItem.productId,

    productName:
      items.length > 1
        ? `${primaryItem.productName} + ${
            items.length - 1
          } more`
        : primaryItem.productName,

    productImage:
      primaryItem.productImage,

    sellerName:
      primaryItem.sellerName,

    sellerLocation:
      primaryItem.sellerLocation,

    quantity:
      primaryItem.quantity,

    unit:
      primaryItem.unit,

    pricePerUnit:
      primaryItem.pricePerUnit,

    subtotal:
      itemsTotal,

    deliveryCharge:
      0,

    platformFee:
      0,

    farmerSupportFee:
      0,

    total:
      itemsTotal

  };


  localStorage.setItem(
    "bkOrder",
    JSON.stringify(order)
  );


  window.location.href =
    "/orderSummery";

}


// ================= CHECKOUT BUTTON =================

document
  .getElementById(
    "checkoutBtn"
  )
  .addEventListener(
    "click",
    () => {

      checkoutWithItems(
        cart
      );

    }
  );


// ================= ADDRESS =================

document
  .getElementById(
    "changeAddressBtn"
  )
  .addEventListener(
    "click",
    () => {

      alert(
        "Address selection would open here."
      );

    }
  );


// ================= START =================

loadCart();
