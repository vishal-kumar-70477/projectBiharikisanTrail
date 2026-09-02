/* ==========================================================================
   BIHARI KISAN — Product Details Page Logic
   ========================================================================== */

const API_BASE = "/biharikisan/buyer";

const CART_ENDPOINT = (productId) =>
  `${API_BASE}/add-To-Cart/${productId}`;

const PRODUCT_ENDPOINT = (productId) =>
  `${API_BASE}/order-Page/${productId}`;

const ORDER_ENDPOINT = (productId) =>
  `${API_BASE}/place-Order/${productId}`;

const VIEW_CART_ENDPOINT =
  `${API_BASE}/view-Cart`;


// ================= DOM =================

const qtyValueEl = document.getElementById("qtyValue");
const qtySummaryEl = document.getElementById("qtySummary");
const totalValueEl = document.getElementById("totalValue");

const qtyMinusBtn = document.getElementById("qtyMinus");
const qtyPlusBtn = document.getElementById("qtyPlus");

const addToCartBtn = document.getElementById("addToCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

const mainImage = document.getElementById("mainImage");

const cartBadge = document.getElementById("cartBadge");


// ================= PRODUCT =================

let PRODUCT = {
  productId: PRODUCT_ID,
  productName: "",
  productUnit: "Potato",
  sellerId: "",
  sellerName: "",
  sellerLocation: "",
  pricePerUnit: 0,
  unit: "KG",
  availableStock: 0,
  deliveryCharge: 40,
  platformFee: 10,
  farmerSupportFee: 5,
  image: ""
};


// ================= STATE =================

let quantity = 1;

const MIN_QTY = 1;


// ================= HELPERS =================

function formatRupees(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}


// ================= CART BADGE =================

function setCartBadge(count) {

  if (!cartBadge) return;

  cartBadge.textContent = Number(count);

}


function increaseCartBadge() {

  if (!cartBadge) return;

  const currentCount =
    Number(cartBadge.textContent || 0);

  cartBadge.textContent =
    currentCount + 1;

}


// ================= LOAD CART COUNT =================

async function loadCartCount() {

  try {

    const response = await fetch(
      VIEW_CART_ENDPOINT,
      {
        method: "GET",
        credentials: "include"
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    if (
      data.success &&
      Array.isArray(data.items)
    ) {

      setCartBadge(data.items.length);

    }

  } catch (error) {

    console.error(
      "Cart count loading error:",
      error
    );

  }

}


// ================= CART BUTTON =================

function setupCartButton() {

  const cartButton =
    document.querySelector(".bk-icon-btn[aria-label='Cart']");

  if (!cartButton) return;

  cartButton.addEventListener(
    "click",
    () => {

      window.location.href = "/cart";

    }
  );

}


// ================= LOAD PRODUCT =================

async function loadProduct() {

  try {

    const response = await fetch(
      PRODUCT_ENDPOINT(PRODUCT_ID),
      {
        method: "GET",
        credentials: "include"
      }
    );

    const data = await response.json();

    if (!response.ok) {

      throw new Error(
        data.message || "Product load failed"
      );

    }


    // ================= BACKEND DATA =================

    PRODUCT.productId = PRODUCT_ID;

    PRODUCT.productName =
      data.productDesc || "Fresh Crop";

    PRODUCT.sellerName =
      data.sellerName || "Verified Farmer";

    PRODUCT.pricePerUnit =
      Number(data.price || 0);

    PRODUCT.availableStock =
      Number(data.availableQuantity || 0);

    PRODUCT.image =
      data.productImageUri || "";

    PRODUCT.sellerLocation =
      data.sellerAddress || "";


    // ================= UPDATE PRODUCT NAME =================

    const productNameEl =
      document.querySelector(".bk-product__name");

    if (productNameEl) {

      productNameEl.innerHTML =
        `${PRODUCT.productName}
        <span class="bk-unit-tag">
          ${PRODUCT.productUnit}
        </span>`;

    }


    // ================= UPDATE SELLER =================

    const sellerNameEl =
      document.querySelector(".bk-seller__name");

    if (sellerNameEl) {

      sellerNameEl.innerHTML =
        `${PRODUCT.sellerName}
        <i
          class="fa-solid fa-circle-check bk-verified"
          title="Farm Verified">
        </i>`;

    }


    // ================= UPDATE PRICE =================

    const priceEl =
      document.querySelector(".bk-price");

    if (priceEl) {

      priceEl.innerHTML =
        `${formatRupees(PRODUCT.pricePerUnit)}
        <span class="bk-price__unit">
          / KG
        </span>`;

    }


    // ================= UPDATE STOCK =================

    const stockEl =
      document.querySelector(".bk-stock");

    if (stockEl) {

      stockEl.innerHTML =
        `<i class="fa-solid fa-warehouse"></i>
        ${PRODUCT.availableStock.toLocaleString("en-IN")}
        KG available`;

    }


    // ================= PRODUCT IMAGE =================

    if (PRODUCT.image) {

      mainImage.src =
        PRODUCT.image;

      mainImage.alt =
        PRODUCT.productName;

    }


    // ================= QUANTITY =================

    quantity = 1;

    renderQuantity();


  } catch (error) {

    console.error(
      "Product loading error:",
      error
    );

  }

}


// ================= QUANTITY =================

function renderQuantity() {

  const maxQty =
    PRODUCT.availableStock > 0
      ? PRODUCT.availableStock
      : 1;


  if (quantity > maxQty) {

    quantity = maxQty;

  }


  qtyValueEl.textContent =
    quantity;


  qtySummaryEl.textContent =
    `${quantity} ${PRODUCT.unit}`;


  const total =
    quantity * PRODUCT.pricePerUnit;


  totalValueEl.textContent =
    formatRupees(total);

}


// ================= MINUS =================

qtyMinusBtn.addEventListener(
  "click",
  () => {

    if (quantity > MIN_QTY) {

      quantity -= 1;

      renderQuantity();

    }

  }
);


// ================= PLUS =================

qtyPlusBtn.addEventListener(
  "click",
  () => {

    if (
      quantity < PRODUCT.availableStock
    ) {

      quantity += 1;

      renderQuantity();

    }

  }
);


// ================= ORDER PAYLOAD =================

function buildOrderPayload() {

  const subtotal =
    quantity * PRODUCT.pricePerUnit;


  const total =
    subtotal +
    PRODUCT.deliveryCharge +
    PRODUCT.platformFee +
    PRODUCT.farmerSupportFee;


  return {

    productId:
      PRODUCT.productId,

    productName:
      PRODUCT.productName,

    productImage:
      PRODUCT.image,

    sellerId:
      PRODUCT.sellerId,

    sellerName:
      PRODUCT.sellerName,

    sellerLocation:
      PRODUCT.sellerLocation,

    quantity,

    unit:
      PRODUCT.unit,

    pricePerUnit:
      PRODUCT.pricePerUnit,

    subtotal,

    deliveryCharge:
      PRODUCT.deliveryCharge,

    platformFee:
      PRODUCT.platformFee,

    farmerSupportFee:
      PRODUCT.farmerSupportFee,

    total

  };

}


// ================= SAVE ORDER =================

function saveOrderToStorage() {

  const order =
    buildOrderPayload();


  localStorage.setItem(
    "bkOrder",
    JSON.stringify(order)
  );


  return order;

}


// ================= ADD TO CART =================

addToCartBtn.addEventListener(
  "click",
  async () => {

    addToCartBtn.disabled = true;

    addToCartBtn.innerHTML =
      `<i class="fa-solid fa-spinner fa-spin"></i>
       Adding...`;


    try {

      const response =
        await fetch(
          CART_ENDPOINT(
            PRODUCT.productId
          ),
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              quantity: quantity
            })

          }
        );


      const data =
        await response.json();


      // ================= ERROR =================

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to add product to cart"
        );

      }


      // ================= SUCCESS =================

      /*
         Backend successfully added item.
         Increase header cart count immediately.
      */

      increaseCartBadge();


      saveOrderToStorage();


      addToCartBtn.innerHTML =
        `<i class="fa-solid fa-circle-check"></i>
         Added to Cart`;


    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );


      addToCartBtn.innerHTML =
        `<i class="fa-solid fa-circle-xmark"></i>
         ${error.message || "Failed"}`;


    } finally {

      addToCartBtn.disabled = false;


      setTimeout(
        () => {

          addToCartBtn.innerHTML =
            `<i class="fa-solid fa-basket-shopping"></i>
             Add to Cart`;

        },
        1800
      );

    }

  }
);


// ================= BUY NOW =================

buyNowBtn.addEventListener(
  "click",
  async () => {

    buyNowBtn.disabled = true;

    buyNowBtn.innerHTML =
      `Processing
       <i class="fa-solid fa-spinner fa-spin"></i>`;


    try {

      const response =
        await fetch(
          ORDER_ENDPOINT(
            PRODUCT.productId
          ),
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              quantity:
                quantity,

              paymentMethod:
                "cod"

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Order place nahi hua"
        );

      }


      saveOrderToStorage();


      window.location.href =
        "/orderSummery";


    } catch (error) {

      console.error(
        "Order error:",
        error
      );


      alert(
        error.message ||
        "Order place nahi hua"
      );


      buyNowBtn.disabled = false;


      buyNowBtn.innerHTML =
        `Buy Now
         <i class="fa-solid fa-arrow-right"></i>`;

    }

  }
);


// ================= GALLERY =================

document
  .querySelectorAll(".bk-thumb")
  .forEach(
    (thumb) => {

      thumb.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(".bk-thumb")
            .forEach(
              (t) =>
                t.classList.remove(
                  "is-active"
                )
            );


          thumb.classList.add(
            "is-active"
          );


          mainImage.src =
            thumb.dataset.img;

        }
      );

    }
  );


// ================= START =================

setupCartButton();

loadProduct();

loadCartCount();