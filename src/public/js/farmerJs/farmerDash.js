function safeCreateIcons(){
    if(window.lucide && typeof lucide.createIcons === 'function'){
      try{ lucide.createIcons(); } catch(err){}
    }
  }
  safeCreateIcons();
  document.getElementById('hamburgerBtn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    console.log("Logout button clicked");

    try {
        const response = await fetch("/biharikisan/auth/logout", {
            method: "get",
            credentials: "include"
        });

        console.log("Status:", response.status);
        console.log("URL:", response.url);

        const text = await response.text();

        console.log("Backend response:", text);

        if (!text) {
            throw new Error("Backend ne empty response diya");
        }

        const data = JSON.parse(text);

        if (data.success) {
            window.location.href = "/";
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.error("LOGOUT ERROR:", error);
        alert("Logout failed: " + error.message);
    }
});

async function loadTotalProducts() {
    try {
        const response = await fetch(
            "/biharikisan/seller/count-Products",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const result = await response.json();

        console.log("TOTAL PRODUCT RESPONSE:", result);

        const countElement =
            document.getElementById("totalProductCount");

        if (!countElement) {
            console.log("totalProductCount element not found");
            return;
        }

        if (result.success) {
            countElement.textContent = result.totalProducts;
        } else {
            countElement.textContent = "0";
            console.log("Count error:", result.message);
        }

    } catch (error) {
        console.error("Total product count error:", error);

        const countElement =
            document.getElementById("totalProductCount");

        if (countElement) {
            countElement.textContent = "0";
        }
    }
}

loadTotalProducts();


// =============================================================
// NEW — Top Products (dashboard preview of the seller's own listings)
// Pulls the same data as the Sell My Crop page, shows the first few.
// =============================================================

function escapeHTMLDash(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
}

function formatPriceDash(v) {
    const n = Number(v);
    if (Number.isNaN(n)) return v;
    return `₹${n.toLocaleString("en-IN")}`;
}

function topProductCardHTML(p) {
    const img = p.productImageUri || "";
    return `
      <div class="product-mini-card">
        <div class="product-mini-img">
          ${img ? `<img src="${img}" alt="${escapeHTMLDash(p.productDesc || "Product")}" loading="lazy">` : ""}
        </div>
        <div class="product-mini-body">
          <div class="product-mini-desc">${escapeHTMLDash(p.productDesc || "Untitled product")}</div>
          <div class="product-mini-meta">
            <span class="product-mini-qty">${escapeHTMLDash(p.productQuantity)} kg</span>
            <span class="product-mini-price">${formatPriceDash(p.productPrice)}</span>
          </div>
        </div>
      </div>
    `;
}

async function loadTopProducts() {
    const grid = document.getElementById("topProductsGrid");
    if (!grid) return;

    grid.innerHTML = `<div class="top-products-loading">Loading your products...</div>`;

    try {
        const response = await fetch(
            "/biharikisan/seller/view-Products",
            {
                method: "GET",
                credentials: "include"
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            grid.innerHTML = `
              <div class="top-products-empty">
                <i data-lucide="alert-triangle"></i>
                <div>Couldn't load products right now.</div>
              </div>
            `;
            safeCreateIcons();
            return;
        }

        const products = Array.isArray(result.data) ? result.data : [];

        if (products.length === 0) {
            grid.innerHTML = `
              <div class="top-products-empty">
                <i data-lucide="package-open"></i>
                <div>No products listed yet — <a href="/farmerProduct" style="color:var(--secondary); font-weight:700;">list your first crop</a>.</div>
              </div>
            `;
            safeCreateIcons();
            return;
        }

        // Show the 3 most recently added products on the dashboard
        const preview = products.slice(-3).reverse();
        grid.innerHTML = preview.map(topProductCardHTML).join("");
        safeCreateIcons();

    } catch (error) {
        console.error("Top products load error:", error);
        grid.innerHTML = `
          <div class="top-products-empty">
            <i data-lucide="alert-triangle"></i>
            <div>Network error — couldn't load products.</div>
          </div>
        `;
        safeCreateIcons();
    }
}

loadTopProducts();
