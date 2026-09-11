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

    // Render Category Pills with Management Buttons (+ Agregar Categoria & + Agregar Plato / Bebida)
    const categories = ['Todos', ...(restaurant.categories || [])];
    const isAuth = window.BulaApp && typeof window.BulaApp.isAuthenticated === 'function' ? window.BulaApp.isAuthenticated(restaurant.id) : false;

    let categoryPillsHTML = categories.map(cat => `
      <button class="category-pill ${cat === selectedCategory ? 'active' : ''}" onclick="BulaApp.filterCategory('${cat}')">
        ${cat}
      </button>
    `).join('');

    categoryPillsHTML += `
      <button class="category-pill category-add-btn" onclick="BulaApp.openAddCategoryModal()" title="Agregar nueva categoría al menú" style="background: rgba(255, 165, 2, 0.15); color: var(--accent); border: 1px dashed rgba(255, 165, 2, 0.5); font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
        <i class="fas fa-folder-plus"></i> + Agregar Categoría
      </button>
      <button class="category-pill item-add-btn" onclick="BulaApp.openAddItemModal()" title="Agregar plato o bebida al menú" style="background: linear-gradient(135deg, var(--primary), var(--accent)); color: #ffffff; border: none; font-weight: 800; box-shadow: 0 4px 12px var(--primary-glow); cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
        <i class="fas fa-utensils"></i> + Agregar Plato / Bebida
      </button>
    `;

    categoryContainer.innerHTML = categoryPillsHTML;

    // Filter dishes by category
    const filteredDishes = selectedCategory === 'Todos'
      ? restaurant.menu
      : restaurant.menu.filter(d => d.category === selectedCategory || (selectedCategory === 'Popular' && d.popular));

    if (!filteredDishes || filteredDishes.length === 0) {
      dishesContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No hay platos en esta categoría. Usa el botón <b>"+ Agregar Plato / Bebida"</b> arriba para publicar productos.</div>`;
      return;
    }

    // Render Dishes Grid with Video Motion & Variant Options
    dishesContainer.innerHTML = filteredDishes.map(dish => {
      const variantsArr = Array.isArray(dish.variants) ? dish.variants : (dish.variants ? String(dish.variants).split(',').map(v => v.trim()).filter(Boolean) : []);
      const hasVideo = Boolean(dish.video && String(dish.video).trim() !== '');

      return `
        <div class="dish-card" id="dish-card-${dish.id}">
          <div class="dish-img-container">
            ${hasVideo 
              ? `<video src="${dish.video}" autoplay loop muted playsinline class="dish-img" onError="this.style.display='none'; this.nextElementSibling.style.display='block';"></video>
                 <img src="${dish.image}" alt="${dish.name}" class="dish-img" style="display: none;" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'" />
                 <span class="badge badge-video" style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.75); color: var(--accent); border: 1px solid var(--accent); font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; backdrop-filter: blur(4px); z-index: 2;"><i class="fas fa-play-circle"></i> Video</span>`
              : `<img src="${dish.image}" alt="${dish.name}" class="dish-img" loading="lazy" onError="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80'" />`
            }
          </div>
          <div class="dish-content">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                <h4 class="dish-title">${dish.name}</h4>
                ${dish.badge ? `<span class="badge badge-popular">${dish.badge}</span>` : ''}
              </div>
              <p class="dish-desc">${dish.description}</p>

              <!-- Variantes Dinámicas Opcionales -->
              ${variantsArr.length > 0 ? `
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; align-items: center;">
                  <span style="font-size: 0.72rem; color: var(--accent); font-weight: 700;"><i class="fas fa-sliders-h"></i> Variantes:</span>
                  ${variantsArr.map(v => `<span class="tag" style="font-size: 0.7rem; background: rgba(255,165,2,0.1); color: var(--accent); border-color: rgba(255,165,2,0.3);">${v}</span>`).join('')}
                </div>
              ` : ''}

              <!-- Costo Domicilio Específico (si aplica) -->
              ${dish.deliveryFee !== null && dish.deliveryFee !== undefined && dish.deliveryFee > 0 ? `
                <div style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 6px;">
                  <i class="fas fa-motorcycle" style="color: var(--primary);"></i> Domicilio propio: <b>${formatCOP(dish.deliveryFee)}</b>
                </div>
              ` : ''}
            </div>
            <div class="dish-footer">
              <span class="dish-price">${formatCOP(dish.price)}</span>
              <div style="display: flex; gap: 6px; align-items: center;">
                ${isAuth ? `
                  <button type="button" onclick="BulaApp.openEditItemModal('${dish.id}')" title="Editar este producto" style="background: rgba(255,255,255,0.08); color: var(--text-main); border: 1px solid var(--border-color); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <i class="fas fa-pencil-alt" style="font-size: 0.8rem;"></i>
                  </button>
                  <button type="button" onclick="BulaApp.deleteDishItem('${dish.id}')" title="Eliminar este producto" style="background: rgba(255,71,87,0.15); color: var(--primary); border: 1px solid rgba(255,71,87,0.3); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <i class="fas fa-trash-alt" style="font-size: 0.8rem;"></i>
                  </button>
                ` : ''}
                <button class="add-dish-btn" onclick="BulaApp.addDishToCart('${dish.id}')">
                  <i class="fas fa-plus"></i> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
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
