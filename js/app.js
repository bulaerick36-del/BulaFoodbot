/* BulaFoodboT - Main App Controller */
window.BulaApp = (function() {
  let activeRestaurantId = "mi-rey";
  let activeCategory = "Todos";

  function init() {
    console.log("Inicializando BulaFoodboT App...");
    
    // Render initial views
    BulaUI.renderHomeView(BulaData.restaurants);
    
    // Listen for cart state updates
    window.addEventListener('cartUpdated', (e) => {
      BulaUI.updateCartUI(e.detail);
    });

    // Listen for restaurant profile updates
    window.addEventListener('restaurantUpdated', (e) => {
      const rest = e.detail;
      if (rest.id === activeRestaurantId) {
        BulaUI.renderRestaurantVitrina(rest, activeCategory);
      }
      BulaUI.renderHomeView(BulaData.restaurants);
    });

    // Initial cart render
    BulaUI.updateCartUI(BulaCart.getSummary());

    // Default: Mostrar siempre el catálogo general de restaurantes al cargar/recargar
    showHomeView();

    // Setup Search listener
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = BulaData.restaurants.filter(r => 
          r.name.toLowerCase().includes(query) || 
          r.tags.some(t => t.toLowerCase().includes(query)) ||
          r.phone.includes(query)
        );
        BulaUI.renderHomeView(filtered);
      });
    }
  }

  function showHomeView() {
    document.getElementById('home-view').classList.add('active');
    document.getElementById('restaurant-view').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openRestaurant(restaurantId) {
    const restaurant = BulaData.getRestaurant(restaurantId);
    if (!restaurant) return;

    activeRestaurantId = restaurantId;
    activeCategory = "Todos";

    BulaUI.renderRestaurantVitrina(restaurant, activeCategory);

    document.getElementById('home-view').classList.remove('active');
    document.getElementById('restaurant-view').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function filterCategory(categoryName) {
    activeCategory = categoryName;
    const restaurant = BulaData.getRestaurant(activeRestaurantId);
    if (restaurant) {
      BulaUI.renderRestaurantVitrina(restaurant, activeCategory);
    }
  }

  function addDishToCart(dishId) {
    const restaurant = BulaData.getRestaurant(activeRestaurantId);
    if (!restaurant) return;

    const dish = restaurant.menu.find(d => d.id === dishId);
    if (!dish) return;

    const added = BulaCart.addItem(dish, restaurant);
    if (added) {
      BulaUI.showToast(`¡${dish.name} agregado!`);
    }
  }

  function toggleCartDrawer(open) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!drawer || !overlay) return;

    if (open) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // --- Autenticación y Sesiones ---
  function isAuthenticated(restaurantId) {
    const sessionToken = sessionStorage.getItem(`bula_auth_${restaurantId}`);
    return sessionToken === 'true';
  }

  function setAuthenticatedSession(restaurantId, isAuth) {
    if (isAuth) {
      sessionStorage.setItem(`bula_auth_${restaurantId}`, 'true');
    } else {
      sessionStorage.removeItem(`bula_auth_${restaurantId}`);
    }
  }

  function openAdminModal(restaurantId) {
    const restId = restaurantId || activeRestaurantId;
    const restaurant = BulaData.getRestaurant(restId);
    if (!restaurant) return;

    // Verificar si el dueño ya se ha autenticado manualmente en esta sesión
    if (!isAuthenticated(restId)) {
      openLoginModal(restaurant);
      return;
    }

    // Si ya inició sesión manualmente, abrir el panel de configuración
    document.getElementById('admin-rest-id').value = restaurant.id;
    document.getElementById('admin-username').value = restaurant.username || restaurant.alias || `${restaurant.id}_admin`;
    document.getElementById('admin-password').value = restaurant.password || `${restaurant.id}123`;
    document.getElementById('admin-name').value = restaurant.name;
    document.getElementById('admin-phone').value = restaurant.phone || '';
    document.getElementById('admin-status').value = restaurant.status || 'Abierto';
    document.getElementById('admin-delivery-fee').value = restaurant.deliveryFee || 0;
    document.getElementById('admin-delivery-time').value = restaurant.deliveryTime || '';
    document.getElementById('admin-address').value = restaurant.address || '';
    document.getElementById('admin-description').value = restaurant.description || '';

    const modal = document.getElementById('admin-modal');
    const overlay = document.getElementById('admin-modal-overlay');
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
    }
  }

  function closeAdminModal() {
    const modal = document.getElementById('admin-modal');
    const overlay = document.getElementById('admin-modal-overlay');
    if (modal && overlay) {
      modal.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  function openLoginModal(restaurant) {
    const rest = restaurant || BulaData.getRestaurant(activeRestaurantId);
    if (!rest) return;

    document.getElementById('login-rest-id').value = rest.id;
    document.getElementById('login-rest-name').textContent = rest.name;
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';

    const demoHint = document.getElementById('login-demo-hint');
    if (demoHint) {
      demoHint.innerHTML = `<i class="fas fa-key"></i> Credenciales Demo (${rest.name}):<br/>Usuario/Email: <b>${rest.email || rest.username || rest.id + '@bulafood.com'}</b> | Clave: <b>${rest.password || rest.id + '123'}</b>`;
    }

    const modal = document.getElementById('login-modal');
    const overlay = document.getElementById('login-modal-overlay');
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
    }
  }

  function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    const overlay = document.getElementById('login-modal-overlay');
    if (modal && overlay) {
      modal.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  async function handleAdminLogin(e) {
    if (e) e.preventDefault();

    const restId = document.getElementById('login-rest-id').value || activeRestaurantId;
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;

    const result = await BulaData.authenticateRestaurant(restId, user, pass);

    if (result.success && result.restaurant) {
      const targetId = result.restaurant.id || restId;
      setAuthenticatedSession(targetId, true);
      closeLoginModal();
      BulaUI.showToast("¡Autenticación exitosa!");
      openAdminModal(targetId);
    } else {
      alert(result.message || "Usuario o contraseña incorrectos.");
    }
  }

  // --- Registro de Nuevo Restaurante con Email y Alias ---
  function openRegisterModal() {
    const modal = document.getElementById('register-modal');
    const overlay = document.getElementById('register-modal-overlay');
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
    }
  }

  function closeRegisterModal() {
    const modal = document.getElementById('register-modal');
    const overlay = document.getElementById('register-modal-overlay');
    if (modal && overlay) {
      modal.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  function handleRestaurantRegistration(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const alias = document.getElementById('reg-alias').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const deliveryFee = document.getElementById('reg-delivery-fee').value;

    if (!name || !phone || !email || !alias || !password) {
      alert("Por favor completa todos los campos obligatorios (*).");
      return;
    }

    const newRest = BulaData.registerRestaurant({
      name,
      phone,
      email,
      alias,
      username: alias,
      password,
      address,
      deliveryFee
    });

    setAuthenticatedSession(newRest.id, true);
    closeRegisterModal();
    BulaUI.showToast("¡Tu Vitrina Digital ha sido creada!");
    openRestaurant(newRest.id);
    openAdminModal(newRest.id);
  }

  function logoutAdmin() {
    const restId = document.getElementById('admin-rest-id').value || activeRestaurantId;
    setAuthenticatedSession(restId, false);
    closeAdminModal();
    BulaUI.showToast("Sesión de administración cerrada");
  }

  function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      if (icon) icon.className = "fas fa-eye-slash";
    } else {
      input.type = "password";
      if (icon) icon.className = "fas fa-eye";
    }
  }

  function saveRestaurantProfile(e) {
    if (e) e.preventDefault();

    const id = document.getElementById('admin-rest-id').value;
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();
    const phone = document.getElementById('admin-phone').value.trim();

    if (!username) {
      alert("El Usuario / Correo de acceso es OBLIGATORIO.");
      document.getElementById('admin-username').focus();
      return;
    }

    if (!password) {
      alert("La Contraseña de acceso es OBLIGATORIA.");
      document.getElementById('admin-password').focus();
      return;
    }

    if (!phone) {
      alert("El número de WhatsApp Business del restaurante es OBLIGATORIO.");
      document.getElementById('admin-phone').focus();
      return;
    }

    const updated = BulaData.updateRestaurantProfile(id, {
      username: username,
      password: password,
      name: document.getElementById('admin-name').value,
      phone: phone,
      status: document.getElementById('admin-status').value,
      deliveryFee: document.getElementById('admin-delivery-fee').value,
      deliveryTime: document.getElementById('admin-delivery-time').value,
      address: document.getElementById('admin-address').value,
      description: document.getElementById('admin-description').value
    });

    if (updated) {
      BulaUI.showToast("¡Perfil y credenciales actualizados!");
      closeAdminModal();
    }
  }

  function testWhatsAppConnection() {
    const phone = document.getElementById('admin-phone').value.trim();
    if (!phone) {
      alert("Por favor ingresa un número de WhatsApp Business primero.");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent("¡Hola! Esta es una prueba de conexión desde la plataforma BulaFoodboT. 🤖📱");
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  }

  // --- Envío de Pedidos al WhatsApp Business del Restaurante ---
  function sendWhatsAppOrder() {
    const summary = BulaCart.getSummary();
    if (summary.items.length === 0) {
      alert("Tu carrito está vacío. Agrega platos antes de realizar el pedido.");
      return;
    }

    const rest = summary.restaurant;
    const dbRest = BulaData.getRestaurant(rest.id) || rest;
    
    if (!dbRest.phone || dbRest.phone.trim() === "") {
      alert(`El restaurante "${dbRest.name}" aún no ha configurado su número de WhatsApp Business para recibir pedidos. Por favor notifícalo o ingresa en "Configurar Local".`);
      return;
    }

    const addressInput = document.getElementById('delivery-address-input');
    const notesInput = document.getElementById('order-notes-input');

    const address = addressInput ? addressInput.value.trim() : "Para recoger en local / A convenir";
    const notes = notesInput ? notesInput.value.trim() : "";

    let message = `*¡Hola ${dbRest.name}! Quisiera realizar el siguiente pedido por BulaFoodboT:* 🛒🍽️\n\n`;
    message += `------------------------------------\n`;

    summary.items.forEach(item => {
      message += `• *${item.qty}x* ${item.name} - ${BulaCart.formatCOP(item.price * item.qty)}\n`;
    });

    message += `------------------------------------\n`;
    message += `*Subtotal:* ${BulaCart.formatCOP(summary.subtotal)}\n`;
    message += `*Costo de Domicilio:* ${BulaCart.formatCOP(summary.deliveryFee)}\n`;
    message += `*TOTAL A PAGAR:* ${BulaCart.formatCOP(summary.total)}\n\n`;

    message += `📍 *Dirección de Entrega:* ${address || 'Por confirmar'}\n`;
    if (notes) {
      message += `📝 *Notas del cliente:* ${notes}\n`;
    }
    message += `\n*Quedo en espera de su confirmación para preparar mi pedido. Gracias!*`;

    const encodedMsg = encodeURIComponent(message);
    const cleanPhone = dbRest.phone.replace(/[^0-9]/g, '');

    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
    window.open(waUrl, '_blank');
  }

  // --- Gestión de Categorías ---
  function openAddCategoryModal() {
    const restaurant = BulaData.getRestaurant(activeRestaurantId);
    if (!restaurant) return;

    if (!isAuthenticated(activeRestaurantId)) {
      openLoginModal(restaurant);
      return;
    }

    const input = document.getElementById('cat-name-input');
    if (input) input.value = '';

    const modal = document.getElementById('category-modal');
    const overlay = document.getElementById('category-modal-overlay');
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
    }
  }

  function closeAddCategoryModal() {
    const modal = document.getElementById('category-modal');
    const overlay = document.getElementById('category-modal-overlay');
    if (modal && overlay) {
      modal.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  function handleAddCategorySubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('cat-name-input');
    if (!input || !input.value.trim()) return;

    const catName = input.value.trim();
    const success = BulaData.addCategory(activeRestaurantId, catName);
    if (success) {
      closeAddCategoryModal();
      BulaUI.showToast(`¡Categoría "${catName}" agregada!`);
      filterCategory(catName);
    }
  }

  // --- Gestión de Platos / Bebidas ---
  let tempUploadedImageData = "";
  let tempUploadedVideoData = "";

  function openAddItemModal(dishToEdit = null) {
    const restaurant = BulaData.getRestaurant(activeRestaurantId);
    if (!restaurant) return;

    if (!isAuthenticated(activeRestaurantId)) {
      openLoginModal(restaurant);
      return;
    }

    // Populate category dropdown
    const catSelect = document.getElementById('item-category');
    if (catSelect) {
      const cats = restaurant.categories || ["Popular", "Platos Fuertes", "Bebidas"];
      catSelect.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    // Reset temporary upload state
    tempUploadedImageData = "";
    tempUploadedVideoData = "";

    const titleEl = document.getElementById('item-modal-title');
    const hiddenId = document.getElementById('item-id-hidden');
    const nameEl = document.getElementById('item-name');
    const descEl = document.getElementById('item-desc');
    const priceEl = document.getElementById('item-price');
    const deliveryEl = document.getElementById('item-delivery');
    const variantsEl = document.getElementById('item-variants');
    const imgUrlEl = document.getElementById('item-image-url');
    const videoUrlEl = document.getElementById('item-video-url');

    const imgPrevContainer = document.getElementById('item-image-preview-container');
    const imgPreview = document.getElementById('item-image-preview');
    const videoPrevContainer = document.getElementById('item-video-preview-container');
    const videoPreview = document.getElementById('item-video-preview');

    if (dishToEdit && typeof dishToEdit === 'object') {
      if (titleEl) titleEl.textContent = 'Editar Plato / Bebida';
      if (hiddenId) hiddenId.value = dishToEdit.id;
      if (nameEl) nameEl.value = dishToEdit.name;
      if (catSelect) catSelect.value = dishToEdit.category || (restaurant.categories ? restaurant.categories[0] : 'Platos Fuertes');
      if (descEl) descEl.value = dishToEdit.description || '';
      if (priceEl) priceEl.value = dishToEdit.price || '';
      if (deliveryEl) deliveryEl.value = dishToEdit.deliveryFee !== undefined && dishToEdit.deliveryFee !== null ? dishToEdit.deliveryFee : '';
      if (variantsEl) variantsEl.value = Array.isArray(dishToEdit.variants) ? dishToEdit.variants.join(', ') : (dishToEdit.variants || '');
      if (imgUrlEl) imgUrlEl.value = dishToEdit.image || '';
      if (videoUrlEl) videoUrlEl.value = dishToEdit.video || '';

      if (dishToEdit.image) {
        tempUploadedImageData = dishToEdit.image;
        if (imgPreview) imgPreview.src = dishToEdit.image;
        if (imgPrevContainer) imgPrevContainer.style.display = 'flex';
      } else {
        if (imgPrevContainer) imgPrevContainer.style.display = 'none';
      }

      if (dishToEdit.video) {
        tempUploadedVideoData = dishToEdit.video;
        if (videoPreview) videoPreview.src = dishToEdit.video;
        if (videoPrevContainer) videoPrevContainer.style.display = 'block';
      } else {
        if (videoPrevContainer) videoPrevContainer.style.display = 'none';
      }
    } else {
      if (titleEl) titleEl.textContent = 'Agregar Plato / Bebida';
      if (hiddenId) hiddenId.value = '';
      if (nameEl) nameEl.value = '';
      if (descEl) descEl.value = '';
      if (priceEl) priceEl.value = '';
      if (deliveryEl) deliveryEl.value = '';
      if (variantsEl) variantsEl.value = '';
      if (imgUrlEl) imgUrlEl.value = '';
      if (videoUrlEl) videoUrlEl.value = '';
      if (imgPrevContainer) imgPrevContainer.style.display = 'none';
      if (videoPrevContainer) videoPrevContainer.style.display = 'none';

      if (activeCategory && activeCategory !== 'Todos' && activeCategory !== 'Popular' && catSelect) {
        catSelect.value = activeCategory;
      }
    }

    const modal = document.getElementById('item-modal');
    const overlay = document.getElementById('item-modal-overlay');
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
    }
  }

  function closeAddItemModal() {
    const modal = document.getElementById('item-modal');
    const overlay = document.getElementById('item-modal-overlay');
    if (modal && overlay) {
      modal.classList.remove('active');
      overlay.classList.remove('active');
    }
  }

  function openEditItemModal(dishId) {
    const restaurant = BulaData.getRestaurant(activeRestaurantId);
    if (!restaurant || !restaurant.menu) return;
    const dish = restaurant.menu.find(d => d.id === dishId);
    if (dish) {
      openAddItemModal(dish);
    }
  }

  function deleteDishItem(dishId) {
    const restaurant = BulaData.getRestaurant(activeRestaurantId);
    if (!restaurant) return;

    if (!isAuthenticated(activeRestaurantId)) {
      openLoginModal(restaurant);
      return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar este producto del menú?")) {
      const deleted = BulaData.deleteDish(activeRestaurantId, dishId);
      if (deleted) {
        BulaUI.showToast("Producto eliminado del menú.");
      }
    }
  }

  function handleImageUrlInput(val) {
    const previewContainer = document.getElementById('item-image-preview-container');
    const previewImg = document.getElementById('item-image-preview');
    if (val && val.trim()) {
      tempUploadedImageData = val.trim();
      if (previewImg) previewImg.src = tempUploadedImageData;
      if (previewContainer) previewContainer.style.display = 'flex';
    } else if (!tempUploadedImageData.startsWith('data:image')) {
      tempUploadedImageData = "";
      if (previewContainer) previewContainer.style.display = 'none';
    }
  }

  function handleImageFileUpload(inputEl) {
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;
    const file = inputEl.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      tempUploadedImageData = e.target.result;
      const previewContainer = document.getElementById('item-image-preview-container');
      const previewImg = document.getElementById('item-image-preview');
      const urlInput = document.getElementById('item-image-url');

      if (previewImg) previewImg.src = tempUploadedImageData;
      if (previewContainer) previewContainer.style.display = 'flex';
      if (urlInput) urlInput.value = '';
    };
    reader.readAsDataURL(file);
  }

  function handleVideoUrlInput(val) {
    const previewContainer = document.getElementById('item-video-preview-container');
    const previewVideo = document.getElementById('item-video-preview');
    if (val && val.trim()) {
      tempUploadedVideoData = val.trim();
      if (previewVideo) previewVideo.src = tempUploadedVideoData;
      if (previewContainer) previewContainer.style.display = 'block';
    } else if (!tempUploadedVideoData.startsWith('data:video')) {
      tempUploadedVideoData = "";
      if (previewContainer) previewContainer.style.display = 'none';
    }
  }

  function handleVideoFileUpload(inputEl) {
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;
    const file = inputEl.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      tempUploadedVideoData = e.target.result;
      const previewContainer = document.getElementById('item-video-preview-container');
      const previewVideo = document.getElementById('item-video-preview');
      const urlInput = document.getElementById('item-video-url');

      if (previewVideo) previewVideo.src = tempUploadedVideoData;
      if (previewContainer) previewContainer.style.display = 'block';
      if (urlInput) urlInput.value = '';
    };
    reader.readAsDataURL(file);
  }

  function handleSaveItemSubmit(e) {
    if (e) e.preventDefault();

    const hiddenId = document.getElementById('item-id-hidden').value;
    const name = document.getElementById('item-name').value.trim();
    const category = document.getElementById('item-category').value;
    const desc = document.getElementById('item-desc').value.trim();
    const price = document.getElementById('item-price').value;
    const delivery = document.getElementById('item-delivery').value;
    const variantsRaw = document.getElementById('item-variants').value.trim();
    const imageUrl = document.getElementById('item-image-url').value.trim();
    const videoUrl = document.getElementById('item-video-url').value.trim();

    if (!name || !category || !desc || !price) {
      alert("Por favor completa los campos obligatorios (*): Nombre, Categoría, Descripción y Precio.");
      return;
    }

    const finalImage = imageUrl || tempUploadedImageData;
    if (!finalImage) {
      alert("La Imagen es OBLIGATORIA para mostrar el producto en la tarjeta. Pegar una URL o subir una foto.");
      return;
    }

    const finalVideo = videoUrl || tempUploadedVideoData;

    const dishPayload = {
      name,
      category,
      description: desc,
      price,
      deliveryFee: delivery ? Number(delivery) : null,
      variants: variantsRaw,
      image: finalImage,
      video: finalVideo
    };

    if (hiddenId) {
      BulaData.updateDish(activeRestaurantId, hiddenId, dishPayload);
      BulaUI.showToast(`¡${name} actualizado en el menú!`);
    } else {
      BulaData.addDish(activeRestaurantId, dishPayload);
      BulaUI.showToast(`¡${name} agregado al menú!`);
    }

    closeAddItemModal();
    filterCategory(category);
  }

  return {
    init,
    showHomeView,
    openRestaurant,
    filterCategory,
    addDishToCart,
    toggleCartDrawer,
    openAdminModal,
    closeAdminModal,
    openLoginModal,
    closeLoginModal,
    handleAdminLogin,
    openRegisterModal,
    closeRegisterModal,
    handleRestaurantRegistration,
    logoutAdmin,
    togglePasswordVisibility,
    saveRestaurantProfile,
    testWhatsAppConnection,
    sendWhatsAppOrder,
    isAuthenticated,
    openAddCategoryModal,
    closeAddCategoryModal,
    handleAddCategorySubmit,
    openAddItemModal,
    closeAddItemModal,
    openEditItemModal,
    deleteDishItem,
    handleImageUrlInput,
    handleImageFileUpload,
    handleVideoUrlInput,
    handleVideoFileUpload,
    handleSaveItemSubmit
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  BulaApp.init();
});
