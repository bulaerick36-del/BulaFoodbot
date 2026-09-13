/* BulaFoodboT - Data Store & Neon PostgreSQL Connection */
window.BulaData = (function() {

  const defaultRestaurants = [
    {
      id: "mi-rey",
      name: "Restaurante Mi Rey",
      status: "Abierto",
      phone: "+573001234567",
      username: "mirey_admin",
      alias: "mirey_admin",
      email: "mirey@bulafood.com",
      password: "mirey123",
      rating: "4.9",
      reviewsCount: 142,
      deliveryFee: 3500,
      deliveryTime: "25-35 min",
      minOrder: 12000,
      address: "Calle 15 # 4-22, Centro, Montería",
      coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
      tags: ["Gastronomía Local", "Comida Criolla", "Asados", "Favorito"],
      description: "Especialistas en la auténtica comida costeña y criolla. ¡Sabor casero, sazón único!",
      categories: ["Popular", "Entradas", "Platos Fuertes", "Bebidas", "Postres"],
      menu: [
        {
          id: "mr-1",
          name: "Papas Criollas con Suero Costeño y Picante",
          category: "Entradas",
          price: 12900,
          description: "Crujientes papitas criollas sazonadas al sartén, acompañadas con auténtico suero costeño de la casa y ají picante criollo artesanal.",
          image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80",
          popular: true,
          badge: "Estrella"
        },
        {
          id: "mr-2",
          name: "Bandeja Especial Mi Rey",
          category: "Platos Fuertes",
          price: 28500,
          description: "Carne asada a la parrilla, chicharrón crocante, arroz con coco costeño, patacones pisaos, ensalada fresca y suero costeño.",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
          popular: true,
          badge: "Más Vendido"
        }
      ]
    },
    {
      id: "sabor-costeno",
      name: "Sabor Costeño Express",
      status: "Abierto",
      phone: "+573019876543",
      username: "sabor_express",
      alias: "sabor_express",
      email: "sabor@bulafood.com",
      password: "sabor123",
      rating: "4.7",
      reviewsCount: 98,
      deliveryFee: 4000,
      deliveryTime: "30-45 min",
      minOrder: 15000,
      address: "Cra 10 # 18-05, Montería",
      coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=200&q=80",
      tags: ["Mariscos", "Arroces", "Jugos"],
      categories: ["Popular", "Platos Fuertes", "Bebidas"],
      menu: []
    }
  ];

  let restaurants = [];

  function normalizeRestaurant(raw) {
    if (!raw) return null;
    const defaultMenu = [
      {
        id: `${raw.id || 'rest'}-1`,
        name: "Plato Especial de la Casa",
        category: "Platos Fuertes",
        price: 22000,
        description: "Nuestra especialidad insigne recién preparada.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
        popular: true,
        badge: "Nuevo"
      }
    ];

    let parsedMenu = [];
    if (Array.isArray(raw.menu)) {
      parsedMenu = raw.menu;
    } else if (typeof raw.menu === 'string' && raw.menu.trim() !== '') {
      try { parsedMenu = JSON.parse(raw.menu); } catch (e) { parsedMenu = defaultMenu; }
    } else {
      parsedMenu = defaultMenu;
    }

    let parsedCategories = ["Popular", "Platos Fuertes", "Bebidas"];
    if (Array.isArray(raw.categories)) {
      parsedCategories = raw.categories;
    } else if (typeof raw.categories === 'string' && raw.categories.trim() !== '') {
      try { parsedCategories = JSON.parse(raw.categories); } catch (e) {}
    }

    let parsedTags = ["Gastronomía Local"];
    if (Array.isArray(raw.tags)) {
      parsedTags = raw.tags;
    } else if (typeof raw.tags === 'string' && raw.tags.trim() !== '') {
      try { parsedTags = JSON.parse(raw.tags); } catch (e) {}
    }

    const restId = raw.id || `rest-${Date.now()}`;
    const restName = raw.name || "Restaurante";

    return {
      id: restId,
      name: restName,
      status: raw.status || "Abierto",
      phone: raw.phone || raw.whatsapp || "",
      email: raw.email || `${restId}@bulafood.com`,
      username: raw.username || raw.alias || restId,
      alias: raw.alias || raw.username || restId,
      password: raw.password || `${restId}123`,
      rating: raw.rating ? String(raw.rating) : "5.0",
      reviewsCount: raw.reviewsCount !== undefined ? Number(raw.reviewsCount) : (raw.reviews_count !== undefined ? Number(raw.reviews_count) : 1),
      deliveryFee: raw.deliveryFee !== undefined ? Number(raw.deliveryFee) : (raw.delivery_fee !== undefined ? Number(raw.delivery_fee) : 3000),
      deliveryTime: raw.deliveryTime || raw.delivery_time || "25-35 min",
      minOrder: raw.minOrder !== undefined ? Number(raw.minOrder) : (raw.min_order !== undefined ? Number(raw.min_order) : 10000),
      address: raw.address || "Montería",
      coverImage: raw.coverImage || raw.cover_image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      logo: raw.logo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
      tags: parsedTags,
      description: raw.description || "¡Bienvenido a nuestra Vitrina Digital en BulaFood!",
      categories: parsedCategories,
      menu: parsedMenu
    };
  }

  async function fetchRestaurants() {
    try {
      console.log("Consultando /api/restaurants en Neon PostgreSQL...");
      const resApi = await fetch('/api/restaurants');
      if (resApi.ok) {
        const data = await resApi.json();
        if (Array.isArray(data) && data.length > 0) {
          const remoteRestaurants = data.map(normalizeRestaurant).filter(Boolean);

          const map = new Map();
          defaultRestaurants.forEach(r => map.set(r.id, r));
          restaurants.forEach(r => map.set(r.id, r));
          remoteRestaurants.forEach(r => map.set(r.id, r));

          restaurants = Array.from(map.values());
          saveData();
          console.log(`¡${remoteRestaurants.length} restaurantes sincronizados desde Neon PostgreSQL!`);
        }
      } else {
        console.warn("Respuesta /api/restaurants HTTP status:", resApi.status);
      }
    } catch (e) {
      console.warn("Excepción al consultar /api/restaurants:", e.message);
    }
    return restaurants;
  }

  function loadData() {
    try {
      const saved = localStorage.getItem('bula_food_restaurants');
      if (saved) {
        restaurants = JSON.parse(saved);
        restaurants.forEach(r => {
          if (!r.alias) r.alias = r.username || r.id;
          if (!r.username) r.username = r.alias || r.id;
          if (!r.email) r.email = `${r.id}@bulafood.com`;
          if (!r.password) r.password = `${r.id}123`;
        });
      } else {
        restaurants = defaultRestaurants;
        saveData();
      }
    } catch (e) {
      console.warn("Error cargando restaurantes de localStorage", e);
      restaurants = defaultRestaurants;
    }
    fetchRestaurants();
  }

  function saveData() {
    try {
      localStorage.setItem('bula_food_restaurants', JSON.stringify(restaurants));
    } catch (e) {
      console.warn("Error guardando restaurantes en localStorage", e);
    }
  }

  function getRestaurant(id) {
    return restaurants.find(r => r.id === id);
  }

  async function authenticateRestaurant(id, inputUser, inputPassword) {
    const cleanUser = (inputUser || '').toLowerCase().trim();
    const cleanPass = (inputPassword || '').trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, message: "Por favor ingresa usuario y contraseña." };
    }

    const matchedRest = restaurants.find(r => 
      ((r.username && r.username.toLowerCase().trim() === cleanUser) ||
       (r.alias && r.alias.toLowerCase().trim() === cleanUser) ||
       (r.email && r.email.toLowerCase().trim() === cleanUser) ||
       (r.id && r.id.toLowerCase() === cleanUser))
    ) || getRestaurant(id);

    if (matchedRest) {
      const restUser = (matchedRest.username || matchedRest.alias || matchedRest.email || `${matchedRest.id}@bulafood.com`).toLowerCase().trim();
      const restPass = (matchedRest.password || `${matchedRest.id}123`).trim();

      if ((cleanUser === restUser || cleanUser === (matchedRest.email || '').toLowerCase().trim()) && cleanPass === restPass) {
        sessionStorage.setItem(`bula_auth_${matchedRest.id}`, 'true');
        sessionStorage.setItem('bula_auth_user', JSON.stringify(matchedRest));
        return { success: true, restaurant: matchedRest };
      }
    }

    return { success: false, message: "Usuario o contraseña de administración incorrectos." };
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async function registerRestaurant(newRestData) {
    const name = newRestData.name.trim();
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = generateUUID();
    
    const email = (newRestData.email || newRestData.username || '').trim();
    const alias = (newRestData.alias || newRestData.username || cleanSlug).trim();

    const newRestaurant = {
      id: id,
      name: name,
      status: "Abierto",
      phone: newRestData.phone.trim(),
      email: email,
      username: alias,
      alias: alias,
      password: newRestData.password.trim(),
      rating: "5.0",
      reviewsCount: 1,
      deliveryFee: Number(newRestData.deliveryFee) || 3000,
      deliveryTime: "25-35 min",
      minOrder: 10000,
      address: newRestData.address ? newRestData.address.trim() : "Montería",
      coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80",
      tags: ["Nuevo Local", "Gastronomía Local"],
      description: "¡Bienvenido a nuestro menú digital en BulaFood!",
      categories: ["Popular", "Platos Fuertes", "Bebidas"],
      menu: [
        {
          id: `${id}-1`,
          name: "Plato Especial de la Casa",
          category: "Platos Fuertes",
          price: 22000,
          description: "Nuestra especialidad insigne recién preparada.",
          image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
          popular: true,
          badge: "Nuevo"
        }
      ]
    };

    const existingIndex = restaurants.findIndex(r => r.id === newRestaurant.id);
    if (existingIndex >= 0) {
      restaurants[existingIndex] = newRestaurant;
    } else {
      restaurants.push(newRestaurant);
    }
    saveData();

    try {
      console.log("Enviando vitrina a /api/restaurants (Neon PostgreSQL)...");
      const resApi = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRestaurant)
      });

      if (resApi.ok) {
        const json = await resApi.json();
        console.log("¡Vitrina guardada exitosamente en Neon PostgreSQL via /api/restaurants!:", json);
        if (json && json.id) {
          newRestaurant.id = json.id;
          saveData();
        }
      }
    } catch (e) {
      console.warn("Excepción al guardar en /api/restaurants:", e.message);
    }

    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: newRestaurant }));
    return newRestaurant;
  }

  async function updateRestaurantProfile(id, updatedData) {
    const rest = getRestaurant(id);
    if (!rest) return false;

    if (updatedData.username) {
      rest.username = updatedData.username.trim();
      rest.alias = updatedData.username.trim();
    }
    if (updatedData.email) rest.email = updatedData.email.trim();
    if (updatedData.password) rest.password = updatedData.password.trim();
    if (updatedData.name) rest.name = updatedData.name.trim();
    if (updatedData.phone) rest.phone = updatedData.phone.trim();
    if (updatedData.status) rest.status = updatedData.status;
    if (updatedData.address) rest.address = updatedData.address.trim();
    if (updatedData.deliveryFee !== undefined) rest.deliveryFee = Number(updatedData.deliveryFee);
    if (updatedData.deliveryTime) rest.deliveryTime = updatedData.deliveryTime.trim();
    if (updatedData.description) rest.description = updatedData.description.trim();

    saveData();

    try {
      await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest)
      });
      console.log("Perfil de restaurante sincronizado con Neon PostgreSQL via /api/restaurants.");
    } catch (e) {
      console.warn("Error al sincronizar perfil con /api/restaurants:", e);
    }

    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    return true;
  }

  function syncMenuToBackend(rest) {
    if (!rest) return;
    fetch('/api/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest)
    }).then(res => {
      if (res.ok) console.log("Menú sincronizado exitosamente con Neon PostgreSQL via /api/restaurants.");
    }).catch(e => console.warn("Error al sincronizar menú:", e));
  }

  function addCategory(restaurantId, categoryName) {
    const rest = getRestaurant(restaurantId);
    if (!rest) return false;

    const cleanCat = categoryName.trim();
    if (!cleanCat) return false;

    if (!rest.categories) rest.categories = ["Popular", "Platos Fuertes", "Bebidas"];
    if (!rest.categories.includes(cleanCat)) {
      rest.categories.push(cleanCat);
      saveData();
      syncMenuToBackend(rest);
      window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    }
    return true;
  }

  function addDish(restaurantId, dishData) {
    const rest = getRestaurant(restaurantId);
    if (!rest) return null;

    if (!rest.menu) rest.menu = [];

    const newId = `${rest.id}-${Date.now()}`;
    const newDish = {
      id: newId,
      name: dishData.name.trim(),
      category: dishData.category || "Platos Fuertes",
      price: Number(dishData.price) || 0,
      deliveryFee: dishData.deliveryFee ? Number(dishData.deliveryFee) : null,
      description: dishData.description ? dishData.description.trim() : "",
      image: dishData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
      video: dishData.video || null,
      variants: Array.isArray(dishData.variants) ? dishData.variants : (dishData.variants ? String(dishData.variants).split(',').map(v => v.trim()).filter(Boolean) : []),
      popular: Boolean(dishData.popular),
      badge: dishData.badge || null
    };

    rest.menu.push(newDish);
    saveData();
    syncMenuToBackend(rest);
    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    return newDish;
  }

  function updateDish(restaurantId, dishId, dishData) {
    const rest = getRestaurant(restaurantId);
    if (!rest || !rest.menu) return false;

    const index = rest.menu.findIndex(d => d.id === dishId);
    if (index === -1) return false;

    const existing = rest.menu[index];
    rest.menu[index] = {
      ...existing,
      name: dishData.name ? dishData.name.trim() : existing.name,
      category: dishData.category || existing.category,
      price: dishData.price !== undefined ? Number(dishData.price) : existing.price,
      deliveryFee: dishData.deliveryFee !== undefined ? (dishData.deliveryFee ? Number(dishData.deliveryFee) : null) : existing.deliveryFee,
      description: dishData.description !== undefined ? dishData.description.trim() : existing.description,
      image: dishData.image || existing.image,
      video: dishData.video !== undefined ? dishData.video : existing.video,
      variants: dishData.variants !== undefined ? (Array.isArray(dishData.variants) ? dishData.variants : String(dishData.variants).split(',').map(v => v.trim()).filter(Boolean)) : existing.variants
    };

    saveData();
    syncMenuToBackend(rest);
    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    return true;
  }

  function deleteDish(restaurantId, dishId) {
    const rest = getRestaurant(restaurantId);
    if (!rest || !rest.menu) return false;

    rest.menu = rest.menu.filter(d => d.id !== dishId);
    saveData();
    syncMenuToBackend(rest);
    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    return true;
  }

  loadData();

  return {
    get restaurants() { return restaurants; },
    fetchRestaurants,
    getRestaurant,
    authenticateRestaurant,
    registerRestaurant,
    updateRestaurantProfile,
    addCategory,
    addDish,
    updateDish,
    deleteDish
  };
})();
