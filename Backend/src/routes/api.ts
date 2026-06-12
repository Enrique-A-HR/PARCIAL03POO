import { Router } from 'express';
import { GradeController } from '../controllers/GradeController';

const router = Router();
const gradeController = new GradeController();

router.post('/grades', (req, res, next) => gradeController.saveGrade(req, res, next));
router.get('/grades/global/:userId', (req, res, next) => gradeController.getGlobalGrade(req, res, next));
export default router;