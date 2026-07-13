// Script para poblar MongoDB Atlas con datos de prueba
// Ejecutar:
// mongosh "TU_MONGODB_ATLAS_URI/gepardo_restaurant" --file seed-database.js

print("🚀 Iniciando seed de MongoDB Atlas...");

// Limpiar colecciones existentes
db.roles.deleteMany({});
db.users.deleteMany({});
db.restaurants.deleteMany({});
db.tables.deleteMany({});
db.menuitems.deleteMany({});
db.orders.deleteMany({});
db.reservations.deleteMany({});
db.reviews.deleteMany({});
db.notifications.deleteMany({});

print("✅ Colecciones limpiadas");

// Insertar roles
const roles = [
  { name: "admin", description: "Administrador del sistema", permissions: ["all"] },
  { name: "manager", description: "Gerente de restaurante", permissions: ["manage_restaurant", "manage_orders", "manage_menu"] },
  { name: "waiter", description: "Mesero", permissions: ["view_orders", "create_orders"] },
  { name: "customer", description: "Cliente", permissions: ["view_menu", "create_reservations", "create_reviews"] }
];
db.roles.insertMany(roles);
print("✅ Roles insertados: " + roles.length);

// Insertar usuarios
const users = [
  {
    username: "admin",
    email: "admin@gepardo.com",
    password: "$2b$10$zjLecxVWnLpHPi5zPEeVTO.wNBxJdlJSTfPmqIQxnkRehIZB8uDve",
    role_id: db.roles.findOne({ name: "admin" })._id,
    name: "Administrador",
    phone: "+1234567890",
    createdAt: new Date()
  },
  {
    username: "manager",
    email: "manager@gepardo.com",
    password: "$2b$10$/p04E4XL6rSz92qFzh.jNutRJXjhOqDkz.6WFeuZaMvUpBgesUD92",
    role_id: db.roles.findOne({ name: "manager" })._id,
    name: "Gerente Restaurante",
    phone: "+1234567891",
    createdAt: new Date()
  },
  {
    username: "customer",
    email: "customer@example.com",
    password: "$2b$10$rGv/z7Bi0m7Ahu0zlY.jae7Sj.lf8846Y/DmogBi2CcNkJIe2hMK.",
    role_id: db.roles.findOne({ name: "customer" })._id,
    name: "Cliente Ejemplo",
    phone: "+1234567892",
    createdAt: new Date()
  }
];

db.users.insertMany(users);
print("✅ Usuarios insertados: " + users.length);

// Insertar restaurante
const restaurant = {
  name: "Hamburguesas y Mixología El Gepardo",
  address: "Av. Principal 123, Ciudad",
  phone: "+1234567890",
  email: "contacto@gepardo.com",
  capacity: 50,
  openingHours: "Lun-Dom: 11:00-23:00",
  imageUrl: "https://example.com/restaurant.jpg",
  createdAt: new Date()
};
const restaurantResult = db.restaurants.insertOne(restaurant);
print("✅ Restaurante insertado: " + restaurant.name);

// Insertar mesas
const tables = [];
for (let i = 1; i <= 10; i++) {
  tables.push({
    restaurant: restaurantResult.insertedId,
    number: i,
    capacity: i <= 5 ? 4 : 6,
    status: "disponible",
    createdAt: new Date()
  });
}
db.tables.insertMany(tables);
print("✅ Mesas insertadas: " + tables.length);

// Insertar items del menú
const menuItems = [
  {
    restaurant: restaurantResult.insertedId,
    name: "Hamburguesa Gepardo",
    description: "Hamburguesa artesanal con carne angus, queso cheddar, bacon, cebolla caramelizada y salsa especial",
    category: "Hamburguesas",
    price: 18.99,
    imageUrl: "https://example.com/hamburguesa_gepardo.jpg",
    createdAt: new Date()
  },
  {
    restaurant: restaurantResult.insertedId,
    name: "Hamburguesa Picante",
    description: "Hamburguesa con jalapeños, salsa picante, queso pepper jack y guacamole",
    category: "Hamburguesas",
    price: 16.99,
    imageUrl: "https://example.com/hamburguesa_picante.jpg",
    createdAt: new Date()
  },
  {
    restaurant: restaurantResult.insertedId,
    name: "Mojito Clásico",
    description: "Mojito tradicional con ron blanco, menta fresca, lima, azúcar y soda",
    category: "Cócteles",
    price: 12.99,
    imageUrl: "https://example.com/mojito_clasico.jpg",
    createdAt: new Date()
  },
  {
    restaurant: restaurantResult.insertedId,
    name: "Margarita",
    description: "Cóctel clásico con tequila, triple sec, jugo de lima y sal en el borde",
    category: "Cócteles",
    price: 11.99,
    imageUrl: "https://example.com/margarita.jpg",
    createdAt: new Date()
  },
  {
    restaurant: restaurantResult.insertedId,
    name: "Papas Fritas",
    description: "Papas fritas crujientes con sal y opcionalmente con salsa de la casa",
    category: "Acompañamientos",
    price: 5.99,
    imageUrl: "https://example.com/papas_fritas.jpg",
    createdAt: new Date()
  },
  {
    restaurant: restaurantResult.insertedId,
    name: "Onion Rings",
    description: "Aros de cebolla empanizados y fritos, servidos con salsa ranch",
    category: "Acompañamientos",
    price: 6.99,
    imageUrl: "https://example.com/onion_rings.jpg",
    createdAt: new Date()
  }
];
db.menuitems.insertMany(menuItems);
print("✅ Items del menú insertados: " + menuItems.length);

// Insertar reservaciones
const reservations = [
  {
    restaurant: restaurantResult.insertedId,
    customerName: "Cliente Ejemplo",
    customerPhone: "+1234567892",
    customerEmail: "customer@example.com",
    reservationDate: new Date(Date.now() + 86400000), // mañana
    numberOfGuests: 4,
    createdAt: new Date()
  },
  {
    restaurant: restaurantResult.insertedId,
    customerName: "Cliente Ejemplo 2",
    customerPhone: "+1234567893",
    customerEmail: "customer2@example.com",
    reservationDate: new Date(Date.now() + 172800000), // pasado mañana
    numberOfGuests: 2,
    createdAt: new Date()
  }
];
db.reservations.insertMany(reservations);
print("✅ Reservaciones insertadas: " + reservations.length);

// Insertar órdenes
const orders = [
  {
    table: db.tables.findOne({ number: 3 })._id,
    items: [
      { menuItem: db.menuitems.findOne({ name: "Hamburguesa Gepardo" })._id, name: "Hamburguesa Gepardo", quantity: 2, price: 18.99 },
      { menuItem: db.menuitems.findOne({ name: "Mojito Clásico" })._id, name: "Mojito Clásico", quantity: 2, price: 12.99 }
    ],
    total: 63.96,
    status: "entregado",
    createdAt: new Date(Date.now() - 3600000) // hace 1 hora
  },
  {
    table: db.tables.findOne({ number: 4 })._id,
    items: [
      { menuItem: db.menuitems.findOne({ name: "Hamburguesa Picante" })._id, name: "Hamburguesa Picante", quantity: 1, price: 16.99 },
      { menuItem: db.menuitems.findOne({ name: "Papas Fritas" })._id, name: "Papas Fritas", quantity: 1, price: 5.99 }
    ],
    total: 22.98,
    status: "preparacion",
    createdAt: new Date()
  }
];
db.orders.insertMany(orders);
print("✅ Órdenes insertadas: " + orders.length);

// Insertar reseñas (simplificado - modelo Review no está disponible)
const reviews = [
  {
    rating: 5,
    comment: "Excelente servicio y las hamburguesas son increíbles. Volveré seguro.",
    createdAt: new Date(Date.now() - 7200000) // hace 2 horas
  },
  {
    rating: 4,
    comment: "Muy buena experiencia, los cócteles están bien preparados.",
    createdAt: new Date(Date.now() - 86400000) // hace 1 día
  }
];
db.reviews.insertMany(reviews);
print("✅ Reseñas insertadas: " + reviews.length);

// Insertar notificaciones (simplificado - modelo Notification no está disponible)
const notifications = [
  {
    message: "Se ha recibido una nueva orden en la mesa 4",
    createdAt: new Date()
  },
  {
    message: "Nueva reservación para el " + new Date(Date.now() + 86400000).toLocaleDateString(),
    createdAt: new Date()
  },
  {
    message: "Tu reservación para mañana ha sido confirmada",
    createdAt: new Date(Date.now() - 3600000)
  }
];
db.notifications.insertMany(notifications);
print("✅ Notificaciones insertadas: " + notifications.length);

print("\n🎉 Base de datos poblada exitosamente!");
print("\n📊 Resumen:");
print("Roles: " + db.roles.countDocuments());
print("Usuarios: " + db.users.countDocuments());
print("Restaurantes: " + db.restaurants.countDocuments());
print("Mesas: " + db.tables.countDocuments());
print("Items del menú: " + db.menuitems.countDocuments());
print("Reservaciones: " + db.reservations.countDocuments());
print("Órdenes: " + db.orders.countDocuments());
print("Reseñas: " + db.reviews.countDocuments());
print("Notificaciones: " + db.notifications.countDocuments());

print("\n🔑 Credenciales de prueba:");
print("Admin: admin / admin123");
print("Manager: manager / manager123");
print("Customer: customer / customer123");
