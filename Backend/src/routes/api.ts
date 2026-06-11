import { Router } from 'express';
import { GradeController } from '../controllers/GradeController';

const router = Router();
const gradeController = new GradeController();

router.post('/grades', (req, res) => gradeController.saveGrade(req, res));
router.get('/grades/global/:userId', (req, res) => gradeController.getGlobalGrade(req, res));
export default router;