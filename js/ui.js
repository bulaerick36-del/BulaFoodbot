/* BulaFoodboT - UI Controller */
window.BulaUI = (function() {
  const formatCOP = BulaCart.formatCOP;

  function renderHomeView(restaurants) {
    const container = document.getElementById('restaurants-container');
    if (!container) return;

    if (!restaurants || restaurants.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No se encontraron restaurantes.</div>`;
      return;
    }

    container.innerHTML = restaurants.map(rest => `
      <div class="restaurant-card" onclick="BulaApp.openRestaurant('${rest.id}')">
        <div class="restaurant-cover" style="background-image: url('${rest.coverImage}');">
          <div class="restaurant-cover-overlay"></div>
          <div class="restaurant-status">
            <span class="badge ${rest.status === 'Abierto' ? 'badge-open' : 'badge-closed'}">
              <i class="fas ${rest.status === 'Abierto' ? 'fa-door-open' : 'fa-door-closed'}"></i> ${rest.status}
            </span>
          </div>
        </div>
        <div class="restaurant-info">
          <h3 class="restaurant-name">${rest.name}</h3>
          <div class="restaurant-meta">
            <span class="rating"><i class="fas fa-star"></i> ${rest.rating} (${rest.reviewsCount})</span>
            <span>•</span>
            <span><i class="far fa-clock"></i> ${rest.deliveryTime}</span>
            <span>•</span>
            <span><i class="fas fa-motorcycle"></i> ${formatCOP(rest.deliveryFee)}</span>
          </div>
          <div style="margin-bottom: 8px; font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px;">
            <i class="fab fa-whatsapp" style="color: #25D366;"></i> WhatsApp: <b>${rest.phone || 'No registrado'}</b>
          </div>
          <div class="restaurant-tags">
            ${rest.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderRestaurantVitrina(restaurant, selectedCategory = 'Todos') {
    const showcaseContainer = document.getElementById('restaurant-showcase');
    const categoryContainer = document.getElementById('categories-scroll');
    const dishesContainer = document.getElementById('dishes-container');

    if (!showcaseContainer || !dishesContainer) return;

    // Render Restaurant Showcase Banner Header
    showcaseContainer.innerHTML = `
      <div class="restaurant-header-showcase">
        <div class="showcase-banner" style="background-image: url('${restaurant.coverImage}');">
          <button class="back-to-home-btn" onclick="BulaApp.showHomeView()">
            <i class="fas fa-arrow-left"></i> Volver a Restaurantes
          </button>
          <button class="admin-edit-btn" onclick="BulaApp.openAdminModal('${restaurant.id}')" title="Configurar WhatsApp y Datos del Local">
            <i class="fas fa-cog"></i> Configurar Local
          </button>
        </div>
        <div class="showcase-details">
          <div class="showcase-title-row">
            <div>
              <h2>${restaurant.name}</h2>
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px; font-size: 0.88rem; color: var(--status-open);">
                <i class="fab fa-whatsapp" style="font-size: 1.1rem; color: #25D366;"></i> WhatsApp de Pedidos: <b>${restaurant.phone || 'No asignado'}</b>
              </div>
            </div>
            <span class="badge ${restaurant.status === 'Abierto' ? 'badge-open' : 'badge-closed'}">
              <i class="fas ${restaurant.status === 'Abierto' ? 'fa-door-open' : 'fa-door-closed'}"></i> ${restaurant.status}
            </span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 12px;">${restaurant.description || ''}</p>
          <div class="showcase-info-bar">
            <div class="showcase-info-item">
              <i class="fas fa-star" style="color: var(--accent);"></i> <b>${restaurant.rating}</b> (${restaurant.reviewsCount} opiniones)
            </div>
            <div class="showcase-info-item">
              <i class="far fa-clock"></i> ${restaurant.deliveryTime}
            </div>
            <div class="showcase-info-item">
              <i class="fas fa-motorcycle"></i> Domicilio: ${formatCOP(restaurant.deliveryFee)}
            </div>
            <div class="showcase-info-item">
              <i class="fas fa-map-marker-alt"></i> ${restaurant.address}
            </div>
          </div>
        </div>
      </div>
    `;

    // Render Category Pills
    const categories = ['Todos', ...restaurant.categories];
    categoryContainer.innerHTML = categories.map(cat => `
      <button class="category-pill ${cat === selectedCategory ? 'active' : ''}" onclick="BulaApp.filterCategory('${cat}')">
        ${cat}
      </button>
    `).join('');

    // Filter dishes by category
    const filteredDishes = selectedCategory === 'Todos'
      ? restaurant.menu
      : restaurant.menu.filter(d => d.category === selectedCategory || (selectedCategory === 'Popular' && d.popular));

    if (filteredDishes.length === 0) {
      dishesContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No hay platos en esta categoría.</div>`;
      return;
    }

    // Render Dishes Grid
    dishesContainer.innerHTML = filteredDishes.map(dish => `
      <div class="dish-card">
        <div class="dish-img-container">
          <img src="${dish.image}" alt="${dish.name}" class="dish-img" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'" />
        </div>
        <div class="dish-content">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
              <h4 class="dish-title">${dish.name}</h4>
              ${dish.badge ? `<span class="badge badge-popular">${dish.badge}</span>` : ''}
            </div>
            <p class="dish-desc">${dish.description}</p>
          </div>
          <div class="dish-footer">
            <span class="dish-price">${formatCOP(dish.price)}</span>
            <button class="add-dish-btn" onclick="BulaApp.addDishToCart('${dish.id}')">
              <i class="fas fa-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function updateCartUI(summary) {
    // Update badge in header
    const cartBadge = document.getElementById('header-cart-badge');
    if (cartBadge) {
      cartBadge.textContent = summary.count;
      cartBadge.classList.remove('pulse-anim');
      void cartBadge.offsetWidth; // trigger reflow
      if (summary.count > 0) cartBadge.classList.add('pulse-anim');
    }

    // Update Mobile Floating Cart Bar
    const floatingBar = document.getElementById('floating-cart-bar');
    if (floatingBar) {
      if (summary.count > 0) {
        floatingBar.style.display = 'flex';
        document.getElementById('floating-cart-count').textContent = `${summary.count} item${summary.count > 1 ? 's' : ''}`;
        document.getElementById('floating-cart-total').textContent = formatCOP(summary.total);
      } else {
        floatingBar.style.display = 'none';
      }
    }

    // Update Drawer Contents
    const drawerBody = document.getElementById('cart-drawer-body');
    const drawerSubtotal = document.getElementById('cart-subtotal');
    const drawerDelivery = document.getElementById('cart-delivery');
    const drawerTotal = document.getElementById('cart-total');
    const destPhoneBadge = document.getElementById('cart-destination-phone');

    if (!drawerBody) return;

    if (summary.items.length === 0) {
      drawerBody.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fas fa-shopping-basket" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.4;"></i>
          <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin-bottom: 6px;">Tu carrito está vacío</p>
          <p style="font-size: 0.85rem;">Explora el menú y agrega tus platos favoritos</p>
        </div>
      `;
      if (destPhoneBadge) destPhoneBadge.innerHTML = '';
    } else {
      drawerBody.innerHTML = summary.items.map(item => `
        <div class="cart-item">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${item.image}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;" />
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p>${formatCOP(item.price)} c/u</p>
            </div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="BulaCart.updateQty('${item.id}', -1)">-</button>
            <span style="font-weight: 700; font-size: 0.9rem; min-width: 16px; text-align: center;">${item.qty}</span>
            <button class="qty-btn" onclick="BulaCart.updateQty('${item.id}', 1)">+</button>
          </div>
        </div>
      `).join('');

      if (destPhoneBadge && summary.restaurant) {
        destPhoneBadge.innerHTML = `
          <div class="whatsapp-dest-badge">
            <i class="fab fa-whatsapp"></i> Destino del pedido: <b>${summary.restaurant.name}</b> (${summary.restaurant.phone || 'No registrado'})
          </div>
        `;
      }
    }

    if (drawerSubtotal) drawerSubtotal.textContent = formatCOP(summary.subtotal);
    if (drawerDelivery) drawerDelivery.textContent = formatCOP(summary.deliveryFee);
    if (drawerTotal) drawerTotal.textContent = formatCOP(summary.total);
  }

  function showToast(message) {
    let toast = document.getElementById('bula-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bula-toast';
      toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        color: var(--text-main);
        border: 1px solid var(--primary);
        padding: 10px 20px;
        border-radius: 30px;
        font-weight: 600;
        font-size: 0.88rem;
        z-index: 300;
        box-shadow: var(--shadow-glow);
        display: flex;
        align-items: center;
        gap: 8px;
        animation: fadeIn 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--status-open);"></i> ${message}`;
    toast.style.display = 'flex';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  }

  return {
    renderHomeView,
    renderRestaurantVitrina,
    updateCartUI,
    showToast
  };
})();
