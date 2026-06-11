import { Request, Response, NextFunction } from 'express';
import { GradeModel } from '../models/Grades';

export class GradeController {
  public async saveGrade(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, topic, score } = req.body;

      if (!userId || !topic || score === undefined) {
        res.status(400).json({ message: 'Faltan campos obligatorios (userId, topic, score).' });
        return;
      }

      const updatedGrade = await GradeModel.findOneAndUpdate(
        { userId, topic },
        { score, createdAt: new Date() },
        { new: true, upsert: true }
      );

      res.status(200).json({
        message: 'Calificación procesada con éxito de forma local.',
        data: updatedGrade
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al guardar la calificación.', error });
    }
  }
  public async getGlobalGrade(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;

      const grades = await GradeModel.find({ userId });

      if (grades.length === 0) {
        res.status(200).json({ 
          userId, 
          globalGrade: 0, 
          message: 'El usuario no tiene calificaciones registradas o ya expiraron.' 
        });
        return;
      }
      const sum = grades.reduce((acc, item) => acc + item.score, 0);
      const globalGrade = parseFloat((sum / grades.length).toFixed(2));

      res.status(200).json({
        userId,
        totalTests: grades.length,
        globalGrade
      });
    } catch (error) {
  next(error); 
}
  }
}