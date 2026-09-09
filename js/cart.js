/* BulaFoodboT - Cart Manager */
window.BulaCart = (function() {
  let cart = [];
  let currentRestaurant = null;

  // Load cart from localStorage if exists
  function init() {
    try {
      const savedCart = localStorage.getItem('bula_food_cart');
      const savedRest = localStorage.getItem('bula_food_rest');
      if (savedCart) cart = JSON.parse(savedCart);
      if (savedRest) currentRestaurant = JSON.parse(savedRest);
    } catch (e) {
      console.warn('Could not load cart from localStorage', e);
    }
  }

  function save() {
    try {
      localStorage.setItem('bula_food_cart', JSON.stringify(cart));
      localStorage.setItem('bula_food_rest', JSON.stringify(currentRestaurant));
    } catch (e) {
      console.warn('Could not save cart', e);
    }
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: getSummary() }));
  }

  function addItem(dish, restaurant) {
    // If cart has items from another restaurant, ask or clear
    if (currentRestaurant && currentRestaurant.id !== restaurant.id && cart.length > 0) {
      const confirmClear = confirm(`Tu carrito contiene productos de "${currentRestaurant.name}". ¿Deseas vaciarlo para agregar productos de "${restaurant.name}"?`);
      if (!confirmClear) return false;
      cart = [];
    }

    currentRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      phone: restaurant.phone,
      deliveryFee: restaurant.deliveryFee || 0
    };

    const existingIndex = cart.findIndex(item => item.id === dish.id);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        qty: 1
      });
    }

    save();
    return true;
  }

  function updateQty(dishId, delta) {
    const itemIndex = cart.findIndex(item => item.id === dishId);
    if (itemIndex > -1) {
      cart[itemIndex].qty += delta;
      if (cart[itemIndex].qty <= 0) {
        cart.splice(itemIndex, 1);
      }
    }
    if (cart.length === 0) {
      currentRestaurant = null;
    }
    save();
  }

  function clearCart() {
    cart = [];
    currentRestaurant = null;
    save();
  }

  function getSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const deliveryFee = currentRestaurant ? (currentRestaurant.deliveryFee || 0) : 0;
    const total = subtotal > 0 ? (subtotal + deliveryFee) : 0;

    return {
      items: cart,
      restaurant: currentRestaurant,
      count,
      subtotal,
      deliveryFee,
      total
    };
  }

  // Format currency helper
  function formatCOP(amount) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  init();

  return {
    addItem,
    updateQty,
    clearCart,
    getSummary,
    formatCOP
  };
})();
