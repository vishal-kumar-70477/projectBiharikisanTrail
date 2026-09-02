/* farmerProduct.js */
 
(() => {
 
  // ---------------- API ENDPOINTS ----------------
 
  const API_BASE = "";
 
  const ENDPOINTS = {
    upload: `${API_BASE}/biharikisan/seller/upload-Products`,
    view: `${API_BASE}/biharikisan/seller/view-Products`,
    delete: (id) => `${API_BASE}/biharikisan/seller/delete-Products/${id}`,
    edit: (id) => `${API_BASE}/biharikisan/seller/edit-Products/${id}`,
  };
 
 
  // ---------------- COMMON SELECTOR ----------------
 
  const $ = (sel, root = document) => root.querySelector(sel);
 
 
  // ---------------- FORM ELEMENTS ----------------
 
  const form = $("#puForm");
 
  if (!form) return;
 
  const dropzone = $("#puDropzone");
  const fileInput = $("#puFileInput");
  const previewImg = $("#puPreviewImg");
  const removeImgBtn = $("#puRemoveImg");
  const dropzoneEmpty = $("#puDropzoneEmpty");
 
  const descField = $("#puDesc");
  const qtyField = $("#puQty");
  const priceField = $("#puPrice");
 
  const submitBtn = $("#puSubmitBtn");
  const formMsg = $("#puFormMsg");
 
  const grid = $("#puGrid");
  const countEl = $("#puCount");
  const refreshBtn = $("#puRefreshBtn");
 
  // Dashboard Total Product counter
  const totalProductCount = $("#totalProductCount");
 
  let selectedFile = null;
 
  // Keep the last-loaded products in memory so the edit modal can be
  // pre-filled without another network call.
  let currentProducts = [];
 
 
  // =========================================================
  // IMAGE PICKING / PREVIEW (upload form)
  // =========================================================
 
  function setImage(file) {
 
    if (!file) return;
 
    if (!file.type.startsWith("image/")) {
      showFieldError(fileInput, "Please choose an image file.");
      return;
    }
 
    selectedFile = file;
 
    const url = URL.createObjectURL(file);
 
    previewImg.src = url;
    previewImg.style.display = "block";
 
    dropzoneEmpty.style.display = "none";
 
    removeImgBtn.style.display = "flex";
 
    dropzone.classList.add("has-image");
  }
 
 
  function clearImage() {
 
    selectedFile = null;
 
    fileInput.value = "";
 
    previewImg.src = "";
 
    previewImg.style.display = "none";
 
    dropzoneEmpty.style.display = "block";
 
    removeImgBtn.style.display = "none";
 
    dropzone.classList.remove("has-image");
  }
 
 
  fileInput.addEventListener("change", (e) => {
    setImage(e.target.files[0]);
  });
 
 
  ["dragenter", "dragover"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("is-dragover");
    });
  });
 
 
  ["dragleave", "drop"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("is-dragover");
    });
  });
 
 
  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files?.[0];
    if (file) setImage(file);
  });
 
 
  removeImgBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearImage();
  });
 
 
  // =========================================================
  // VALIDATION (shared helpers, used by both add + edit forms)
  // =========================================================
 
  function showFieldError(fieldEl, message) {
 
    const wrap =
      fieldEl.closest(".pu-field") ||
      fieldEl.closest(".pu-dropzone")?.parentElement;
 
    if (!wrap) return;
 
    wrap.classList.add("is-invalid");
 
    const errEl = wrap.querySelector(".pu-field-error");
 
    if (errEl) errEl.textContent = message;
  }
 
 
  function clearFieldError(fieldEl) {
    const wrap = fieldEl.closest(".pu-field");
    if (!wrap) return;
    wrap.classList.remove("is-invalid");
  }
 
 
  function clearAllErrorsIn(root) {
    root.querySelectorAll(".pu-field.is-invalid").forEach((f) => {
      f.classList.remove("is-invalid");
    });
  }
 
 
  function validateFields({ fileRequired, file, desc, qty, price }) {
    let ok = true;
 
    if (fileRequired && !file) {
      showFieldError(fileInput, "Product photo is required.");
      ok = false;
    }
 
    if (!desc.value.trim()) {
      showFieldError(desc, "Add a short description.");
      ok = false;
    }
 
    const qtyNum = Number(qty.value);
    if (!qty.value || qtyNum <= 0) {
      showFieldError(qty, "Enter a valid quantity.");
      ok = false;
    }
 
    const priceNum = Number(price.value);
    if (!price.value || priceNum <= 0) {
      showFieldError(price, "Enter a valid price.");
      ok = false;
    }
 
    return ok;
  }
 
 
  // =========================================================
  // FORM MESSAGE (add form)
  // =========================================================
 
  function showFormMsg(type, text) {
    formMsg.className = `pu-form-msg show ${type}`;
    formMsg.innerHTML = `
      <i data-lucide="${type === "success" ? "check-circle" : "alert-circle"}"></i>
      <span>${text}</span>
    `;
    if (window.lucide) lucide.createIcons();
  }
 
  function hideFormMsg() {
    formMsg.className = "pu-form-msg";
    formMsg.innerHTML = "";
  }
 
 
  // =========================================================
  // PRODUCT UPLOAD (add new)
  // =========================================================
 
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideFormMsg();
    clearAllErrorsIn(form);
 
    if (!validateFields({
      fileRequired: true,
      file: selectedFile,
      desc: descField,
      qty: qtyField,
      price: priceField,
    })) {
      return;
    }
 
    const fd = new FormData();
    fd.append("productImage", selectedFile);
    fd.append("productDesc", descField.value.trim());
    fd.append("productQuantity", qtyField.value);
    fd.append("productPrice", priceField.value);
 
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="pu-spin"></span> Uploading...`;
 
    try {
      const res = await fetch(ENDPOINTS.upload, {
        method: "POST",
        credentials: "include",
        body: fd,
      });
 
      const data = await res.json().catch(() => ({}));
 
      if (!res.ok || !data.success) {
        showFormMsg("error", data.message || `Upload failed (${res.status}).`);
        return;
      }
 
      showFormMsg("success", data.message || "Product uploaded successfully.");
      form.reset();
      clearImage();
      loadProducts();
 
    } catch (err) {
      console.error(err);
      showFormMsg("error", "Network error — check your connection and try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i data-lucide="upload"></i> List Product`;
      if (window.lucide) lucide.createIcons();
    }
  });
 
 
  [descField, qtyField, priceField].forEach((f) => {
    f.addEventListener("input", () => clearFieldError(f));
  });
 
 
  // =========================================================
  // FORMAT / RENDER HELPERS
  // =========================================================
 
  function formatPrice(v) {
    const n = Number(v);
    if (Number.isNaN(n)) return v;
    return `₹${n.toLocaleString("en-IN")}`;
  }
 
  function escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }
 
  function skeletonHTML(n = 6) {
    return Array.from({ length: n }).map(() => `
      <div class="pu-skel-card">
        <div class="pu-skel pu-skel-img"></div>
        <div class="pu-skel pu-skel-line w60"></div>
        <div class="pu-skel pu-skel-line w40"></div>
      </div>
    `).join("");
  }
 
  function emptyHTML() {
    return `
      <div class="pu-empty">
        <i data-lucide="package-open"></i>
        <div class="t">No products listed yet</div>
        <div class="d">Upload your first crop photo to get started.</div>
      </div>
    `;
  }
 
  function errorHTML(message) {
    return `
      <div class="pu-list-error">
        <i data-lucide="alert-triangle"></i>
        <div class="t">Couldn't load your products</div>
        <div class="d">${escapeHTML(message)}</div>
        <button id="puRetryBtn" type="button">Try again</button>
      </div>
    `;
  }
 
  // Each card carries data-id so the menu/edit/delete handlers know which
  // product they're acting on. The three-dot button + dropdown are plain
  // markup here; positioning/visibility is handled entirely by CSS classes
  // toggled in JS (see wireCardMenus below).
  function cardHTML(p) {
    const img = p.productImageUri || "";
    const id = p._id || "";
 
    return `
      <div class="pu-card" data-id="${id}">
        <button type="button" class="pu-card-menu-btn" data-menu-toggle aria-label="Product options">
          <i data-lucide="more-vertical"></i>
        </button>
        <div class="pu-card-menu" data-menu>
          <button type="button" data-action="edit"><i data-lucide="pencil"></i> Edit</button>
          <button type="button" class="pu-menu-delete" data-action="delete"><i data-lucide="trash-2"></i> Delete</button>
        </div>
 
        <div class="pu-card-img-wrap">
          ${img ? `<img src="${img}" alt="${escapeHTML(p.productDesc || "Product")}" loading="lazy">` : ""}
        </div>
 
        <div class="pu-card-body">
          <div class="pu-card-desc">${escapeHTML(p.productDesc || "Untitled product")}</div>
          <div class="pu-card-meta">
            <span class="pu-card-qty">${escapeHTML(String(p.productQuantity ?? ""))} qty</span>
            <span class="pu-card-price">${formatPrice(p.productPrice)}</span>
          </div>
        </div>
      </div>
    `;
  }
 
 
  // =========================================================
  // LOAD PRODUCTS
  // =========================================================
 
  async function loadProducts() {
    grid.innerHTML = skeletonHTML();
    refreshBtn?.classList.add("is-loading");
    countEl.textContent = "Loading...";
 
    try {
      const res = await fetch(ENDPOINTS.view, {
        method: "GET",
        credentials: "include",
      });
 
      const data = await res.json().catch(() => ({}));
 
      if (!res.ok || !data.success) {
        grid.innerHTML = errorHTML(data.message || `Request failed (${res.status}).`);
        if (totalProductCount) totalProductCount.textContent = "0";
        bindRetry();
        return;
      }
 
      const products = Array.isArray(data.data) ? data.data : [];
      currentProducts = products;
 
      const totalProducts = products.length;
      countEl.textContent = `${totalProducts} listed`;
      if (totalProductCount) totalProductCount.textContent = totalProducts;
 
      grid.innerHTML = totalProducts === 0 ? emptyHTML() : products.map(cardHTML).join("");
      wireCardMenus();
 
    } catch (err) {
      console.error(err);
      grid.innerHTML = errorHTML("Network error — check your connection and try again.");
      if (totalProductCount) totalProductCount.textContent = "0";
      bindRetry();
    } finally {
      refreshBtn?.classList.remove("is-loading");
      if (window.lucide) lucide.createIcons();
    }
  }
 
  function bindRetry() {
    $("#puRetryBtn")?.addEventListener("click", loadProducts);
  }
 
  refreshBtn?.addEventListener("click", loadProducts);
 
 
  // =========================================================
  // THREE-DOT MENU (open/close per card)
  // =========================================================
 
  function closeAllMenus() {
    grid.querySelectorAll(".pu-card-menu.open").forEach((m) => m.classList.remove("open"));
  }
 
  function wireCardMenus() {
    grid.querySelectorAll(".pu-card").forEach((card) => {
      const toggleBtn = card.querySelector("[data-menu-toggle]");
      const menu = card.querySelector("[data-menu]");
      const id = card.dataset.id;
 
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains("open");
        closeAllMenus();
        if (!isOpen) menu.classList.add("open");
      });
 
      menu.querySelector('[data-action="edit"]').addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllMenus();
        openEditModal(id);
      });
 
      menu.querySelector('[data-action="delete"]').addEventListener("click", (e) => {
        e.stopPropagation();
        closeAllMenus();
        openDeleteConfirm(id);
      });
    });
  }
 
  // Close any open menu when clicking elsewhere on the page
  document.addEventListener("click", closeAllMenus);
 
 
  // =========================================================
  // EDIT MODAL
  // =========================================================
 
  const editOverlay = $("#puEditOverlay");
  const editForm = $("#puEditForm");
  const editCloseBtn = $("#puEditClose");
  const editCancelBtn = $("#puEditCancel");
 
  const editDropzone = $("#puEditDropzone");
  const editFileInput = $("#puEditFileInput");
  const editPreviewImg = $("#puEditPreviewImg");
  const editDropzoneEmpty = $("#puEditDropzoneEmpty");
 
  const editDesc = $("#puEditDesc");
  const editQty = $("#puEditQty");
  const editPrice = $("#puEditPrice");
  const editSubmitBtn = $("#puEditSubmitBtn");
  const editFormMsg = $("#puEditFormMsg");
 
  let editingId = null;
  let editSelectedFile = null;
 
  function openEditModal(id) {
    const product = currentProducts.find((p) => String(p._id) === String(id));
    if (!product) return;
 
    editingId = id;
    editSelectedFile = null;
 
    editDesc.value = product.productDesc || "";
    editQty.value = product.productQuantity ?? "";
    editPrice.value = product.productPrice ?? "";
 
    if (product.productImageUri) {
      editPreviewImg.src = product.productImageUri;
      editPreviewImg.style.display = "block";
      editDropzoneEmpty.style.display = "none";
    } else {
      editPreviewImg.style.display = "none";
      editDropzoneEmpty.style.display = "block";
    }
    editFileInput.value = "";
 
    editFormMsg.className = "pu-form-msg";
    editFormMsg.innerHTML = "";
    clearAllErrorsIn(editForm);
 
    editOverlay?.classList.add("open");
  }
 
  function closeEditModal() {
    editOverlay?.classList.remove("open");
    editingId = null;
  }
 
  editCloseBtn?.addEventListener("click", closeEditModal);
  editCancelBtn?.addEventListener("click", closeEditModal);
  editOverlay?.addEventListener("click", (e) => {
    if (e.target === editOverlay) closeEditModal();
  });
 
  editFileInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showFieldError(editFileInput, "Please choose an image file.");
      return;
    }
    editSelectedFile = file;
    editPreviewImg.src = URL.createObjectURL(file);
    editPreviewImg.style.display = "block";
    editDropzoneEmpty.style.display = "none";
  });
 
  [editDesc, editQty, editPrice].forEach((f) => {
    f?.addEventListener("input", () => clearFieldError(f));
  });
 
  editForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editingId) return;
 
    clearAllErrorsIn(editForm);
 
    // Image is optional on edit — only description/qty/price are required.
    let ok = true;
    if (!editDesc.value.trim()) { showFieldError(editDesc, "Add a short description."); ok = false; }
    const qtyNum = Number(editQty.value);
    if (!editQty.value || qtyNum <= 0) { showFieldError(editQty, "Enter a valid quantity."); ok = false; }
    const priceNum = Number(editPrice.value);
    if (!editPrice.value || priceNum <= 0) { showFieldError(editPrice, "Enter a valid price."); ok = false; }
    if (!ok) return;
 
    const fd = new FormData();
    if (editSelectedFile) fd.append("productImage", editSelectedFile);
    fd.append("productDesc", editDesc.value.trim());
    fd.append("productQuantity", editQty.value);
    fd.append("productPrice", editPrice.value);
 
    editSubmitBtn.disabled = true;
    editSubmitBtn.innerHTML = `<span class="pu-spin"></span> Saving...`;
 
    try {
      const res = await fetch(ENDPOINTS.edit(editingId), {
        method: "PATCH",
        credentials: "include",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
 
      if (!res.ok || !data.success) {
        editFormMsg.className = "pu-form-msg show error";
        editFormMsg.innerHTML = `<i data-lucide="alert-circle"></i><span>${escapeHTML(data.message || `Update failed (${res.status}).`)}</span>`;
        if (window.lucide) lucide.createIcons();
        return;
      }
 
      closeEditModal();
      loadProducts();
 
    } catch (err) {
      console.error(err);
      editFormMsg.className = "pu-form-msg show error";
      editFormMsg.innerHTML = `<i data-lucide="alert-circle"></i><span>Network error — try again.</span>`;
      if (window.lucide) lucide.createIcons();
    } finally {
      editSubmitBtn.disabled = false;
      editSubmitBtn.innerHTML = `<i data-lucide="save"></i> Save Changes`;
      if (window.lucide) lucide.createIcons();
    }
  });
 
 
  // =========================================================
  // DELETE CONFIRM MODAL
  // =========================================================
 
  const deleteOverlay = $("#puDeleteOverlay");
  const deleteCloseBtn = $("#puDeleteClose");
  const deleteCancelBtn = $("#puDeleteCancel");
  const deleteConfirmBtn = $("#puDeleteConfirm");
  const deleteProductName = $("#puDeleteProductName");
 
  let deletingId = null;
 
  function openDeleteConfirm(id) {
    const product = currentProducts.find((p) => String(p._id) === String(id));
    deletingId = id;
    if (deleteProductName) {
      deleteProductName.textContent = product?.productDesc || "this product";
    }
    deleteOverlay?.classList.add("open");
  }
 
  function closeDeleteConfirm() {
    deleteOverlay?.classList.remove("open");
    deletingId = null;
  }
 
  deleteCloseBtn?.addEventListener("click", closeDeleteConfirm);
  deleteCancelBtn?.addEventListener("click", closeDeleteConfirm);
  deleteOverlay?.addEventListener("click", (e) => {
    if (e.target === deleteOverlay) closeDeleteConfirm();
  });
 
  deleteConfirmBtn?.addEventListener("click", async () => {
    if (!deletingId) return;
 
    deleteConfirmBtn.disabled = true;
    deleteConfirmBtn.innerHTML = `<span class="pu-spin"></span> Deleting...`;
 
    try {
      const res = await fetch(ENDPOINTS.delete(deletingId), {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
 
      if (!res.ok || !data.success) {
        alert(data.message || `Delete failed (${res.status}).`);
        return;
      }
 
      closeDeleteConfirm();
      loadProducts();
 
    } catch (err) {
      console.error(err);
      alert("Network error — check your connection and try again.");
    } finally {
      deleteConfirmBtn.disabled = false;
      deleteConfirmBtn.innerHTML = `Delete`;
    }
  });
 
 
  // =========================================================
  // INITIAL LOAD
  // =========================================================
 
  loadProducts();
 
})();
 