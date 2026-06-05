import express, { Express, Request, Response } from 'express';
import { getConnectionPool, connectDatabase } from './database';

const app: Express = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API levantada correctamente',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', async (req: Request, res: Response) => {
  try {
    const connectionPool = getConnectionPool();
    const result = await connectionPool.request().query('SELECT @@VERSION AS version');
    res.json({
      success: true,
      data: result.recordset,
      message: 'Conexión a base de datos exitosa'
    });
  } catch (error) {
    console.error('Error en consulta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar la base de datos'
    });
  }
});

app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Puerto: ${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n⏹ Cerrando servidor...');
  process.exit(0);
});

startServer();
