import { Router } from "express";
import * as ctrl from "../controllers/actividadController.js";

const router = Router();

router.get("/meta", ctrl.meta);
router.get("/", ctrl.listar);
router.get("/:id", ctrl.obtener);
router.post("/", ctrl.crear);
router.put("/:id", ctrl.actualizar);
router.patch("/:id/estado", ctrl.cambiarEstado);
router.post("/:id/recordar", ctrl.recordar);
router.delete("/:id", ctrl.eliminar);

export default router;
