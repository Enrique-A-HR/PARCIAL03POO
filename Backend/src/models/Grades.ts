import { Schema, model, Document } from 'mongoose';

export interface IGrade extends Document {
  userId: string;
  topic: string;
  score: number;
  createdAt: Date;
}

const GradeSchema = new Schema<IGrade>({
  userId: { 
    type: String, 
    required: [true, 'El ID del usuario random es obligatorio'] 
  },
  topic: { 
    type: String, 
    required: [true, 'El nombre del tema es obligatorio'] 
  },
  score: { 
    type: Number, 
    required: [true, 'La calificación es obligatoria'],
    min: 0,
    max: 10
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 1800
  }
});
export const GradeModel = model<IGrade>('Grade', GradeSchema);