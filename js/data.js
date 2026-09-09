/* BulaFoodboT - Data Store */
window.BulaData = (function() {
  const defaultRestaurants = [
    {
      id: "mi-rey",
      name: "Restaurante Mi Rey",
      status: "Abierto",
      phone: "+573001234567", // WhatsApp Business
      username: "mirey@bulafood.com", // Credencial de Acceso
      password: "mirey123",           // Contraseña de Acceso
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
      username: "sabor@bulafood.com",
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
      username: "rancho@bulafood.com",
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

  function loadData() {
    try {
      const saved = localStorage.getItem('bula_food_restaurants');
      if (saved) {
        restaurants = JSON.parse(saved);
        // Garantizar que todos tengan credenciales por defecto si faltaran
        restaurants.forEach(r => {
          if (!r.username) r.username = `${r.id}@bulafood.com`;
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

  function authenticateRestaurant(id, inputUser, inputPassword) {
    const rest = getRestaurant(id);
    if (!rest) return { success: false, message: "Restaurante no encontrado" };

    const cleanUser = inputUser.toLowerCase().trim();
    const restUser = (rest.username || '').toLowerCase().trim();

    if (cleanUser === restUser && inputPassword === rest.password) {
      return { success: true, restaurant: rest };
    }
    return { success: false, message: "Usuario o contraseña de administración incorrectos." };
  }

  function updateRestaurantProfile(id, updatedData) {
    const rest = getRestaurant(id);
    if (!rest) return false;

    // Actualizar campos de perfil y credenciales
    if (updatedData.username) rest.username = updatedData.username.trim();
    if (updatedData.password) rest.password = updatedData.password.trim();
    if (updatedData.name) rest.name = updatedData.name.trim();
    if (updatedData.phone) rest.phone = updatedData.phone.trim();
    if (updatedData.status) rest.status = updatedData.status;
    if (updatedData.address) rest.address = updatedData.address.trim();
    if (updatedData.deliveryFee !== undefined) rest.deliveryFee = Number(updatedData.deliveryFee);
    if (updatedData.deliveryTime) rest.deliveryTime = updatedData.deliveryTime.trim();
    if (updatedData.description) rest.description = updatedData.description.trim();

    saveData();
    window.dispatchEvent(new CustomEvent('restaurantUpdated', { detail: rest }));
    return true;
  }

  loadData();

  return {
    get restaurants() { return restaurants; },
    getRestaurant,
    authenticateRestaurant,
    updateRestaurantProfile
  };
})();
