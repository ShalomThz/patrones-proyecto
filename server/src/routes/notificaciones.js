import { Router } from "express";
import * as ctrl from "../controllers/notificacionController.js";

const router = Router();

router.get("/canales", ctrl.canales);
router.get("/", ctrl.listar);
router.post("/", ctrl.crear);
router.patch("/:id/leida", ctrl.marcarLeida);

export default router;
