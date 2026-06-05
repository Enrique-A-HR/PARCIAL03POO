import sql from 'mssql';
import { sqlConfig } from './database.config';

let connectionPool: sql.ConnectionPool;

export async function connectDatabase(): Promise<void> {
  try {
    connectionPool = new sql.ConnectionPool(sqlConfig);
    await connectionPool.connect();
    console.log('✓ Conexión a SQL Server establecida correctamente');
    console.log(`📊 Base de datos: ${sqlConfig.database}`);
    console.log(`🔌 Servidor SQL: ${sqlConfig.server}`);
  } catch (error) {
    console.error('✗ Error conectando a SQL Server:', error);
    process.exit(1);
  }
}

export function getConnectionPool(): sql.ConnectionPool {
  if (!connectionPool) {
    throw new Error('Pool de conexiones no inicializado. Asegúrate de llamar a connectDatabase() primero.');
  }
  return connectionPool;
}

export async function closeDatabase(): Promise<void> {
  if (connectionPool) {
    await connectionPool.close();
    console.log('✓ Conexión a SQL Server cerrada');
  }
}
