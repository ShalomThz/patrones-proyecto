import { Router } from "express";
import * as ctrl from "../controllers/reporteController.js";

const router = Router();

router.get("/pendientes", ctrl.pendientes);
router.get("/finalizadas", ctrl.finalizadas);
router.get("/prioridad", ctrl.porPrioridad);
router.get("/resumen", ctrl.resumen);

export default router;
