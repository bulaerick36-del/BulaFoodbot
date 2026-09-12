/* BulaFoodboT - Data Store & Supabase Connection */
window.BulaData = (function() {

  // 1. Configuración e Inicialización de Supabase
  const SUPABASE_URL = window.SUPABASE_URL || "https://vxvyiklzyfmfbrgwqgxv.supabase.co";
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "sb_publishable_mnfzndBWigcp3yGRUMH9ng_x0rDN...";

  
  let supabaseClient = null;

  function initClient(url, key) {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      try {
        const cleanUrl = url || SUPABASE_URL;
        const cleanKey = key || SUPABASE_ANON_KEY;
        supabaseClient = window.supabase.createClient(cleanUrl, cleanKey);
        console.log("Supabase Client inicializado correctamente con URL:", cleanUrl);
      } catch (err) {
        console.warn("Error al inicializar cliente de Supabase:", err);
      }
    } else {
      console.warn("Supabase SDK no cargado en window. Usando datos locales de demostración.");
    }
  }

  initClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Carga de credenciales dinámicas en Vercel si existen variables de entorno
  if (typeof fetch === 'function') {
    fetch('/api/config')
      .then(res => res.ok ? res.json() : null)
      .then(cfg => {
        if (cfg && cfg.supabaseUrl && cfg.supabaseAnonKey) {
          initClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
          if (typeof fetchRestaurants === 'function') {
            fetchRestaurants();
          }
        }
      })
      .catch(() => {});
  }



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
        },
        {
          id: "mr-3",
          name: "Mocharra Frita con Arroz de Coco",
          category: "Platos Fuertes",
          price: 32000,
          description: "Mojarra dorada y crujiente (500g), acompañada de arroz de coco artesanal, patacón gigante y ensalada agridulce.",
          image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80",
          popular: false
        },
        {
          id: "mr-4",
          name: "Empanaditas de Carne y Papa (6 uds)",
          category: "Entradas",
          price: 10500,
          description: "Empanaditas de masa de maíz crujiente rellenas de carne desmechada y papa, servidas con suero costeño y pico de gallo.",
          image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80",
          popular: false
        },
        {
          id: "mr-5",
          name: "Jugo Natural de Corozo Helado",
          category: "Bebidas",
          price: 6500,
          description: "Refrescante y tradicional jugo de corozo costeño recién preparado, bien helado.",
          image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80",
          popular: true,
          badge: "Refrescante"
        },
        {
          id: "mr-6",
          name: "Limonada de Coco Artesanal",
          category: "Bebidas",
          price: 7500,
          description: "Crema de coco natural batida con jugo de limón fresco y hielo frappé.",
          image: "https://images.unsplash.com/photo-1546171753-97d7676e4174?auto=format&fit=crop&w=500&q=80",
          popular: false
        },
        {
          id: "mr-7",
          name: "Cocada de Arequipe y Queso",
          category: "Postres",
          price: 5500,
          description: "Cocada artesanal horneada servida tibia con topping de arequipe y queso costeño rallado.",
          image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80",
          popular: false
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
      menu: [
        {
          id: "sc-1",
          name: "Arroz de Mariscos del Caribe",
          category: "Platos Fuertes",
          price: 34000,
          description: "Arroz con trozos de camarón, calamar y pulpo salteados al ajillo con vino blanco.",
          image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80",
          popular: true
        }
      ]
    },
    {
      id: "asados-rancho",
      name: "Asados El Rancho",
      status: "Cerrado",
      phone: "+573025554433",
      username: "rancho_asados",
      alias: "rancho_asados",
      email: "rancho@bulafood.com",
      password: "rancho123",
      rating: "4.8",
      reviewsCount: 210,
      deliveryFee: 3000,
      deliveryTime: "20-30 min",
      minOrder: 10000,
      address: "Av. Principal # 45-12, Montería",
      coverImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80",
      tags: ["Parrilla", "Carnes", "Mazorcadas"],
      categories: ["Carnes", "Acompañamientos"],
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
    if (!supabaseClient) {
      console.warn("Supabase SDK no disponible. Usando catálogo local.");
      return restaurants;
    }
    try {
      console.log("Cargando restaurantes desde la tabla 'restaurants' de Supabase...");
      const { data, error } = await supabaseClient
        .from('restaurants')
        .select('*');

      if (error) {
        console.warn("Error consultando tabla 'restaurants' en Supabase:", error.message);
        return restaurants;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        const remoteRestaurants = data.map(normalizeRestaurant).filter(Boolean);

        const map = new Map();
        defaultRestaurants.forEach(r => map.set(r.id, r));
        restaurants.forEach(r => map.set(r.id, r));
        remoteRestaurants.forEach(r => map.set(r.id, r));

        restaurants = Array.from(map.values());
        saveData();
        console.log(`¡${remoteRestaurants.length} restaurantes oficiales sincronizados desde Supabase!`);
      }
      return restaurants;
    } catch (err) {
      console.error("Excepción en fetchRestaurants:", err);
      return restaurants;
    }
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

  // 2. Autenticación Asíncrona (Supabase + Respaldo Local)
  async function authenticateRestaurant(id, inputUser, inputPassword) {
    const cleanUser = (inputUser || '').toLowerCase().trim();
    const cleanPass = (inputPassword || '').trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, message: "Por favor ingresa usuario y contraseña." };
    }

    if (supabaseClient) {
      try {
        console.log("Consultando Supabase para validar credenciales de:", cleanUser);
        const { data, error } = await supabaseClient
          .from('restaurants')
          .select('*')
          .or(`username.eq.${cleanUser},email.eq.${cleanUser}`)
          .eq('password', cleanPass)
          .maybeSingle();

        if (!error && data) {
          const normData = normalizeRestaurant(data);
          console.log("Autenticación exitosa en Supabase:", normData);
          sessionStorage.setItem(`bula_auth_${normData.id}`, 'true');
          sessionStorage.setItem('bula_auth_user', JSON.stringify(normData));
          return { success: true, restaurant: normData };
        }
      } catch (err) {
        console.warn("Excepción consultando Supabase:", err);
      }
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

  // 3. Inserción Real en Supabase al Crear una Vitrina (Compatibilidad con 'id uuid')
  async function registerRestaurant(newRestData) {
    const name = newRestData.name.trim();
    const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const uuid = generateUUID();
    const id = uuid; // Usar un UUID válido (36 caracteres) para coincidir con la columna 'id uuid' de Supabase
    
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

    // 1. Guardar de forma inmediata e indestructible en memoria y localStorage
    const existingIndex = restaurants.findIndex(r => r.id === newRestaurant.id);
    if (existingIndex >= 0) {
      restaurants[existingIndex] = newRestaurant;
    } else {
      restaurants.push(newRestaurant);
    }
    saveData();

    // 2. Inserción Real en la tabla 'restaurants' de Supabase
    if (supabaseClient) {
      try {
        console.log("Iniciando inserción real con UUID en Supabase para:", newRestaurant.name, "ID UUID:", newRestaurant.id);
        
        // Payload 1: Campos con UUID explícito e identificadores PostgreSQL
        const payloadUUID1 = {
          id: newRestaurant.id,
          name: newRestaurant.name,
          phone: newRestaurant.phone,
          email: newRestaurant.email,
          username: newRestaurant.username,
          alias: newRestaurant.alias,
          password: newRestaurant.password,
          status: newRestaurant.status,
          delivery_fee: newRestaurant.deliveryFee,
          delivery_time: newRestaurant.deliveryTime,
          address: newRestaurant.address,
          description: newRestaurant.description,
          rating: newRestaurant.rating,
          reviews_count: newRestaurant.reviewsCount,
          cover_image: newRestaurant.coverImage,
          logo: newRestaurant.logo,
          tags: newRestaurant.tags,
          categories: newRestaurant.categories,
          menu: newRestaurant.menu
        };

        let { data, error } = await supabaseClient
          .from('restaurants')
          .insert([ payloadUUID1 ])
          .select('*');

        if (error) {
          console.warn("Intento 1 con UUID falló:", error.message);
          
          // Payload 2: Solo columnas básicas visibles en el panel de Supabase
          const payloadUUID2 = {
            id: newRestaurant.id,
            name: newRestaurant.name,
            email: newRestaurant.email,
            password: newRestaurant.password,
            phone: newRestaurant.phone,
            username: newRestaurant.username,
            alias: newRestaurant.alias,
            status: newRestaurant.status,
            address: newRestaurant.address
          };

          const res2 = await supabaseClient
            .from('restaurants')
            .insert([ payloadUUID2 ])
            .select('*');

          if (res2.error) {
            console.warn("Intento 2 con UUID explícito falló:", res2.error.message);

            // Payload 3: Omitir 'id' para que la base de datos de Supabase genere el UUID automáticamente si gen_random_uuid está activo
            const payloadNoID = {
              name: newRestaurant.name,
              email: newRestaurant.email,
              password: newRestaurant.password,
              phone: newRestaurant.phone,
              username: newRestaurant.username,
              alias: newRestaurant.alias,
              status: newRestaurant.status,
              address: newRestaurant.address
            };

            const res3 = await supabaseClient
              .from('restaurants')
              .insert([ payloadNoID ])
              .select('*');

            if (res3.error) {
              console.error("Error definitivo al guardar en Supabase (Posible bloqueo RLS en tabla restaurants):", res3.error.message);
            } else {
              console.log("¡Vitrina guardada exitosamente en Supabase (UUID generado por Postgres)!:", res3.data);
              if (res3.data && res3.data[0] && res3.data[0].id) {
                newRestaurant.id = res3.data[0].id;
                saveData();
              }
            }
          } else {
            console.log("¡Vitrina insertada exitosamente en Supabase (UUID explícito)!:", res2.data);
          }
        } else {
          console.log("¡Inserción exitosa de nueva vitrina en Supabase con UUID!", data);
        }
      } catch (err) {
        console.error("Excepción en inserción Supabase:", err);
      }
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
    if (updatedData.email) {
      rest.email = updatedData.email.trim();
    }
    if (updatedData.password) rest.password = updatedData.password.trim();
    if (updatedData.name) rest.name = updatedData.name.trim();
    if (updatedData.phone) rest.phone = updatedData.phone.trim();
    if (updatedData.status) rest.status = updatedData.status;
    if (updatedData.address) rest.address = updatedData.address.trim();
    if (updatedData.deliveryFee !== undefined) rest.deliveryFee = Number(updatedData.deliveryFee);
    if (updatedData.deliveryTime) rest.deliveryTime = updatedData.deliveryTime.trim();
    if (updatedData.description) rest.description = updatedData.description.trim();

    saveData();

    if (supabaseClient) {
      try {
        await supabaseClient
          .from('restaurants')
          .upsert({
            id: rest.id,
            name: rest.name,
            phone: rest.phone,
            username: rest.username,
            alias: rest.alias,
            email: rest.email,
            password: rest.password,
            status: rest.status,
            deliveryFee: rest.deliveryFee,
            delivery_fee: rest.deliveryFee,
            deliveryTime: rest.deliveryTime,
            delivery_time: rest.deliveryTime,
            address: rest.address,
            description: rest.description,
            coverImage: rest.coverImage,
            cover_image: rest.coverImage,
            logo: rest.logo,
            tags: rest.tags,
            categories: rest.categories,
            menu: rest.menu
          });
        console.log("Restaurante sincronizado con Supabase.");
      } catch (err) {
        console.warn("Upsert Supabase error:", err);
      }
    }

    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    return true;
  }

  // 4. Gestión de Categorías y Platos/Bebidas en Menú
  function syncMenuToSupabase(rest) {
    if (!supabaseClient || !rest) return;
    supabaseClient
      .from('restaurants')
      .upsert([{
        id: rest.id,
        categories: rest.categories,
        menu: rest.menu
      }])
      .then(({ error }) => {
        if (error) console.warn("Error actualizando menú en Supabase:", error.message);
        else console.log("Menú sincronizado exitosamente con Supabase.");
      })
      .catch(e => console.warn("Excepción al sincronizar menú con Supabase:", e));
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
      syncMenuToSupabase(rest);
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
    syncMenuToSupabase(rest);
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
    syncMenuToSupabase(rest);
    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    return true;
  }

  function deleteDish(restaurantId, dishId) {
    const rest = getRestaurant(restaurantId);
    if (!rest || !rest.menu) return false;

    rest.menu = rest.menu.filter(d => d.id !== dishId);
    saveData();
    syncMenuToSupabase(rest);
    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    return true;
  }

  loadData();

  return {
    get restaurants() { return restaurants; },
    get supabaseClient() { return supabaseClient; },
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
