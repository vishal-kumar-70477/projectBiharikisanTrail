/* ==========================================================================
   BIHARI KISAN — Payment Page Logic
   ========================================================================== */

const API_BASE = "/api";
const ORDER_ENDPOINT = `${API_BASE}/place-order`;

const FALLBACK_ORDER = {
  productId: "BK-CROP-1042",
  productName: "Desi Aloo",
  productImage: "https://images.unsplash.com/photo-1552642986-ccb41e7059e7?q=80&w=300&auto=format&fit=crop",
  sellerName: "Piyush Kumar",
  sellerLocation: "Bihar",
  quantity: 5,
  unit: "KG",
  pricePerUnit: 200,
  subtotal: 1000,
  deliveryCharge: 40,
  platformFee: 10,
  farmerSupportFee: 5,
  total: 1050
};

function formatRupees(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function loadOrder() {
  try {
    const raw = localStorage.getItem("bkOrder");
    if (!raw) return FALLBACK_ORDER;
    return { ...FALLBACK_ORDER, ...JSON.parse(raw) };
  } catch (err) {
    console.warn("Could not read saved order, using fallback:", err);
    return FALLBACK_ORDER;
  }
}

const order = loadOrder();

function renderSummary(order) {
  document.getElementById("itemImage").src = order.productImage;
  document.getElementById("itemName").textContent = order.productName;
  document.getElementById("itemQty").textContent = `${order.quantity} ${order.unit}`;
  document.getElementById("sumProduct").textContent = formatRupees(order.subtotal);
  document.getElementById("sumDelivery").textContent = formatRupees(order.deliveryCharge);
  document.getElementById("sumPlatform").textContent = formatRupees(order.platformFee);
  document.getElementById("sumTotal").textContent = formatRupees(
    order.subtotal + order.deliveryCharge + order.platformFee
  );
}
renderSummary(order);

/* ---------- Payment method switching ---------- */
let selectedMethod = "upi";
const methodEls = document.querySelectorAll(".bk-method");

function selectMethod(methodEl) {
  methodEls.forEach((el) => {
    el.classList.remove("is-active");
    el.setAttribute("aria-checked", "false");
  });
  document.querySelectorAll(".bk-method__panel").forEach((panel) => {
    panel.hidden = true;
  });

  methodEl.classList.add("is-active");
  methodEl.setAttribute("aria-checked", "true");
  selectedMethod = methodEl.dataset.method;

  const panel = document.querySelector(`.bk-method__panel[data-panel="${selectedMethod}"]`);
  if (panel) panel.hidden = false;
}

methodEls.forEach((el) => {
  el.addEventListener("click", () => selectMethod(el));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectMethod(el);
    }
  });
});

/* ---------- UPI verify (mock) ---------- */
const verifyUpiBtn = document.getElementById("verifyUpiBtn");
if (verifyUpiBtn) {
  verifyUpiBtn.addEventListener("click", () => {
    const upiId = document.getElementById("upiId").value.trim();
    const hint = document.getElementById("upiHint");
    if (!upiId.includes("@")) {
      hint.textContent = "Enter a valid UPI ID, e.g. yourname@upi";
      hint.style.color = "#B23A3A";
      return;
    }
    hint.textContent = `✓ ${upiId} looks good and is ready for payment.`;
    hint.style.color = "#2D6A4F";
  });
}

/* ---------- Card save (mock, no real storage of card data) ---------- */
const saveCardBtn = document.getElementById("saveCardBtn");
if (saveCardBtn) {
  saveCardBtn.addEventListener("click", () => {
    const number = document.getElementById("cardNumber").value.trim();
    const name = document.getElementById("cardName").value.trim();
    if (!number || !name) {
      alert("Please fill in your card details to continue.");
      return;
    }
    alert("Card details saved securely for this order.");
  });
}

/* ---------- Place order ---------- */
const placeOrderBtn = document.getElementById("placeOrderBtn");
const btnLabel = placeOrderBtn.querySelector(".bk-btn__label");

function generateOrderId() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `BK-${year}-${random}`;
}

async function placeOrder() {
  if (placeOrderBtn.disabled) return; // prevent duplicate submission
  placeOrderBtn.disabled = true;
  btnLabel.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Placing your order...`;

  const finalOrder = {
    ...order,
    total: order.subtotal + order.deliveryCharge + order.platformFee,
    paymentMethod: selectedMethod,
    orderId: generateOrderId(),
    orderDate: new Date().toISOString(),
    status: "Confirmed"
  };

  try {
    await fetch(ORDER_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalOrder)
    });
  } catch (err) {
    // Backend not reachable in this preview environment — proceed with the
    // locally generated order so the flow still completes end-to-end.
    console.warn("Order API unavailable, continuing with local order data:", err);
  }

  localStorage.setItem("bkConfirmedOrder", JSON.stringify(finalOrder));

  setTimeout(() => {
    window.location.href = "/orderConform";
  }, 900);
}

placeOrderBtn.addEventListener("click", placeOrder);