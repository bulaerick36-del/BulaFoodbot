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
    sendWhatsAppOrder
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  BulaApp.init();
});
