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
      mongoose.set('strictQuery', true);
      await mongoose.connect(this.uri);
      console.log('🔌 [MongoDB Atlas] ¡Conexión establecida con éxito de forma local!');
    } catch (error) {
      console.error('❌ Error crítico al conectar con MongoDB Atlas:', error);
      process.exit(1);
    }
  }
}