import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../src/models/Order.js';

dotenv.config();

const cleanupDuplicateOrders = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    // Buscar todos los pedidos
    const orders = await Order.find({});
    console.log(`Total de pedidos encontrados: ${orders.length}`);

    // Mostrar todos los pedidos para identificar el problema
    console.log('Pedidos encontrados:');
    orders.forEach(order => {
      console.log(`ID: ${order._id}, Mesa: ${order.table}, Total: ${order.total}, Estado: ${order.status}`);
    });

    // Eliminar todos los pedidos para limpiar la base de datos
    const deleteResult = await Order.deleteMany({});
    console.log(`Eliminados ${deleteResult.deletedCount} pedidos de la base de datos`);

    console.log('Limpieza completada - base de datos de pedidos vaciada');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error durante la limpieza:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

cleanupDuplicateOrders();
