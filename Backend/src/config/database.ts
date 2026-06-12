import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
  private static uri: string = process.env.MONGO_URI || '';
  public static async connect(): Promise<void> {
    if (!this.uri) {
      console.error('❌ Error: La variable MONGO_URI no está definida en el archivo .env');
      process.exit(1);
    }
    try {
      // Asegurar que `globalThis.crypto` exista para compatibilidad
      // con el driver de MongoDB en entornos Node donde no está expuesto.
      if (typeof (globalThis as any).crypto === 'undefined') {
        // Usamos require para mantener compatibilidad con ts-node
        // y asignamos el módulo `crypto` a `globalThis.crypto`.
        // El driver de Mongo usa `crypto.randomBytes`.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        (globalThis as any).crypto = require('crypto');
      }
      mongoose.set('strictQuery', true);
      await mongoose.connect(this.uri);
      console.log('🔌 [MongoDB Atlas] ¡Conexión establecida con éxito de forma local!');
    } catch (error) {
      console.error('❌ Error crítico al conectar con MongoDB Atlas:', error);
      process.exit(1);
    }
  }
}